/* sema — turn a pasted list of words into a focused lesson.
 *
 * The planned lesson asks for a situation ("dinner out, I want pizza"). This
 * module answers a narrower question: "I need these words." It is pure: the
 * app supplies the live pack's items, this returns the matching ids and the
 * words the pack does not have yet. No DOM, no storage, no clock.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaWordSet = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MAX_QUERIES = 30;
  var LIMIT = 12;

  function fold(text) {
    var value = String(text == null ? "" : text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    try {
      value = value.replace(/[^\p{L}\p{N}\s]/gu, " ");
    } catch (err) {
      value = value.replace(/[!-\/:-@\[-`{-~\u3000-\u303f\uff00-\uffef]+/g, " ");
    }
    return value.replace(/\s+/g, " ").trim();
  }

  /* One item per line is the common shape, but people paste CSV, bullets and
   * numbered lists too. Only the words matter; the scaffolding is noise. */
  function parseList(text) {
    var seen = {};
    var out = [];
    String(text || "").split(/[\n,;，、]+/).forEach(function (raw) {
      var value = String(raw || "")
        .replace(/^\s*(?:[-*•·]|\d+[.)])\s*/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!value) return;
      var key = fold(value);
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(value);
    });
    return out.slice(0, MAX_QUERIES);
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1);
    var cur = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j += 1) prev[j] = j;
    for (var i = 1; i <= a.length; i += 1) {
      cur[0] = i;
      for (j = 1; j <= b.length; j += 1) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      var swap = prev; prev = cur; cur = swap;
    }
    return prev[b.length];
  }

  function similarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1;
    return Math.max(0, 1 - levenshtein(a, b) / Math.max(a.length, b.length));
  }

  var KIND_RANK = { word: 0, phrase: 1, term: 2, basic: 3 };

  function rank(kind) {
    return Object.prototype.hasOwnProperty.call(KIND_RANK, kind) ? KIND_RANK[kind] : 9;
  }

  /* 10 is an exact word or gloss; 8 is a whole word inside the text. A phrase
   * can carry the query in its gloss, which is why the gloss is scored too. */
  function score(query, item) {
    var q = fold(query);
    if (!q) return 0;
    if (q.length < 2 && !/[^\x00-\x7f]/.test(q)) return 0;
    var text = fold(item && item.text);
    var gloss = fold(item && item.gloss);
    var sub = fold(item && item.sub);
    if (!text && !gloss) return 0;
    if (text === q || gloss === q) return 10;
    if (new RegExp("(^|\\s)" + escapeRegExp(q) + "(\\s|$)").test(text) ||
        new RegExp("(^|\\s)" + escapeRegExp(q) + "(\\s|$)").test(gloss)) return 8;
    if (text.indexOf(q) === 0 || gloss.indexOf(q) === 0) return 7;
    if (text.indexOf(q) !== -1) return 5;
    if (gloss.indexOf(q) !== -1) return 4;
    if (sub.indexOf(q) !== -1) return 3;
    /* A small typo should not lose a word the pack actually teaches. */
    if (q.length >= 4) {
      var best = 0;
      [text, gloss].forEach(function (hay) {
        hay.split(/\s+/).forEach(function (word) {
          if (word.length >= 3) best = Math.max(best, similarity(q, word));
        });
      });
      if (best >= 0.8) return 3;
    }
    return 0;
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function match(queries, items) {
    var used = {};
    var picks = [];
    var matched = [];
    var missing = [];
    (queries || []).forEach(function (query) {
      var best = null;
      var bestScore = 0;
      (items || []).forEach(function (item) {
        if (!item || !item.id || used[item.id]) return;
        var s = score(query, item);
        if (s > bestScore ||
            (s === bestScore && s > 0 && best && rank(item.kind) < rank(best.kind))) {
          best = item;
          bestScore = s;
        }
      });
      if (best && bestScore >= 3) {
        used[best.id] = true;
        picks.push(best.id);
        matched.push({ query: query, id: best.id, score: bestScore });
      } else {
        missing.push(query);
      }
    });
    return { picks: picks, matched: matched, missing: missing };
  }

  /* Matched words come first. Due review fills the rest, but never outranks a
   * word the learner explicitly asked for. */
  function build(queries, items, revisionIds, opts) {
    var o = opts || {};
    var limit = Math.max(1, Math.min(o.limit || LIMIT, 30));
    var m = match(queries, items);
    var ids = m.picks.slice(0, limit);
    (revisionIds || []).forEach(function (id) {
      if (ids.length >= limit) return;
      if (id && ids.indexOf(id) === -1) ids.push(id);
    });
    return { ids: ids, matched: m.matched, missing: m.missing };
  }

  return {
    MAX_QUERIES: MAX_QUERIES,
    LIMIT: LIMIT,
    fold: fold,
    parseList: parseList,
    similarity: similarity,
    score: score,
    match: match,
    build: build
  };
});
