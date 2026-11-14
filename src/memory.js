/* Persistent learner memory.
 *
 * The app already forgets nothing about scheduling, but it forgets everything
 * about *you*: what you wrote, how fast you answered, which pairs you keep
 * trading. This module owns the part of that which is worth keeping forever:
 * the sentences you produce yourself, and a small profile derived from them.
 *
 * Pure functions over plain objects. No DOM, no storage, no clock of its own —
 * `now` is always passed in, so the tests can be deterministic.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaMemory = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DAY_MS = 86400000;
  var MAX_SENTENCES = 40;

  function empty() {
    return { version: 1, sentences: [], attempts: 0, correct: 0, ms: 0 };
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* Store what the learner wrote. Their own words are the best review
   * material there is, so this is capped by count rather than deduplicated. */
  function addSentence(mem, text, itemIds, now) {
    var t = String(text || "").replace(/\s+/g, " ").trim();
    if (t.length < 4) return null;
    if (t.length > 160) t = t.slice(0, 160);

    var stamp = now || Date.now();
    var sentence = {
      id: "s-" + stamp.toString(36) + "-" + Math.floor(Math.random() * 1e6).toString(36),
      text: t,
      items: (itemIds || []).slice(0, 6),
      created: stamp,
      reviewed: null,
      reviews: 0
    };

    mem.sentences.push(sentence);
    while (mem.sentences.length > MAX_SENTENCES) mem.sentences.shift();
    return sentence;
  }

  /* At most one per session, and never one you wrote minutes ago. */
  function nextToReview(mem, now, minAgeMs) {
    var t = now || Date.now();
    var min = minAgeMs === undefined ? DAY_MS / 2 : minAgeMs;
    var ready = mem.sentences.filter(function (s) {
      var last = s.reviewed || s.created;
      return t - last >= min;
    });
    if (!ready.length) return null;
    ready.sort(function (a, b) {
      return (a.reviewed || a.created) - (b.reviewed || b.created);
    });
    return ready[0];
  }

  function markReviewed(mem, id, now) {
    var t = now || Date.now();
    mem.sentences.forEach(function (s) {
      if (s.id === id) { s.reviewed = t; s.reviews += 1; }
    });
  }

  /* Blank one known word out of the learner's own sentence, so the prompt is
   * theirs and the answer is retrieval rather than recognition. Longest match
   * wins, which avoids blanking "pan" inside "panadería". */
  function cloze(sentence, words) {
    var text = String(sentence || "");
    var target = null;

    (words || []).slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (w) {
      if (target || !w || w.length < 2) return;
      var re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (re.test(text)) target = w;
    });

    if (!target) return null;
    var pattern = new RegExp("\\b" + target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    return {
      blanked: text.replace(pattern, "____"),
      answer: target
    };
  }

  /* Everything the app remembers about this learner, in one object. */
  function profile(mem, now) {
    var t = now || Date.now();
    var total = mem.attempts || 0;
    return {
      sentences: mem.sentences.length,
      written: mem.sentences.length ? mem.sentences[mem.sentences.length - 1].created : null,
      attempts: total,
      accuracy: total ? mem.correct / total : null,
      avgMs: total ? Math.round(mem.ms / total) : null,
      days: distinctDays(mem, t)
    };
  }

  function distinctDays(mem, now) {
    var seen = {};
    mem.sentences.forEach(function (s) {
      var d = new Date(s.created);
      seen[d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()] = true;
    });
    return Object.keys(seen).length;
  }

  /* Items the learner keeps getting wrong, worst first. Reads the scheduling
   * state (read-only) so the next lesson can be biased toward them. */
  function weakItems(state, limit) {
    var scores = {};
    var cards = state.cards || {};

    Object.keys(cards).forEach(function (id) {
      var c = cards[id];
      if (c && c.lapses) scores[id] = (scores[id] || 0) + c.lapses * 2;
    });

    var conf = state.confusions || {};
    Object.keys(conf).forEach(function (key) {
      var target = key.split(">")[0];
      scores[target] = (scores[target] || 0) + conf[key];
    });

    return Object.keys(scores)
      .sort(function (a, b) { return scores[b] - scores[a]; })
      .slice(0, limit || 6);
  }

  function recordAttempt(mem, ok, ms) {
    mem.attempts = (mem.attempts || 0) + 1;
    if (ok) mem.correct = (mem.correct || 0) + 1;
    if (ms > 0) mem.ms = (mem.ms || 0) + ms;
  }

  return {
    DAY_MS: DAY_MS,
    MAX_SENTENCES: MAX_SENTENCES,
    empty: empty,
    addSentence: addSentence,
    nextToReview: nextToReview,
    markReviewed: markReviewed,
    cloze: cloze,
    profile: profile,
    weakItems: weakItems,
    recordAttempt: recordAttempt,
    normalize: normalize
  };
});
