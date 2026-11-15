/* sema — small helpers for the optional local model.
 *
 * The model is asked for plain lines; parsing it is data work, not UI work, so
 * it is pure and tested. Everything here degrades to an empty list rather than
 * throwing, because a model is an assistant, never a dependency.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaAiTools = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function cleanLine(raw) {
    return String(raw == null ? "" : raw)
      .replace(/^\s*(?:[-*•·]|\d+[.)])\s*/, "")
      .replace(/^["'“”«»]+|["'“”«»]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* The model may return one per line, a comma list, or bullets. Keep the
   * words, drop the scaffolding, cap the result. */
  function parseList(text, max) {
    var limit = Math.max(1, Math.min(Number(max) || 12, 30));
    var seen = {};
    var out = [];
    String(text == null ? "" : text).split(/[\n,;，、]+/).forEach(function (raw) {
      var value = cleanLine(raw);
      if (!value || value.length > 80) return;
      var key = value.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push(value);
    });
    return out.slice(0, limit);
  }

  /* Reader output is one title line plus the body. Models add markdown,
   * numbering or an English preface; strip that rather than showing it. */
  function parseReading(text) {
    var lines = String(text == null ? "" : text)
      .replace(/\r\n?/g, "\n").split(/\n+/)
      .map(function (line) {
        return line.replace(/^\s*(?:#{1,6}|[-*•]|\d+[.)])\s*/, "")
          .replace(/\*\*/g, "").replace(/^["'“”«»]+|["'“”«»]+$/g, "").trim();
      }).filter(Boolean);
    if (!lines.length) return null;
    var title = lines[0].slice(0, 90);
    var body = lines.slice(1).join(" ").replace(/\s+/g, " ").trim().slice(0, 1200);
    if (!body || body.length < 20 || title.length < 2) return null;
    return { title: title, body: body };
  }

  /* Turn a generated reader text into a small comprehension check without a
   * second model call. Sentence context stays; the answer is a word from the
   * text, and distractors are other words in the same text. */
  function readingQuestions(text, rand) {
    var r = rand || Math.random;
    var body = String(text == null ? "" : text);
    var sentences = body.match(/[^.!?。！？]+[.!?。！？]?/g) || [];
    var all = [];
    var seen = {};
    sentences.forEach(function (sentence) {
      (sentence.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).forEach(function (w) {
        var key = w.toLowerCase();
        if (w.length >= 3 && !seen[key]) { seen[key] = true; all.push(w); }
      });
    });
    var out = [];
    sentences.forEach(function (sentence) {
      if (out.length >= 2) return;
      var tokens = (sentence.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []);
      if (tokens.length < 4) return;
      var candidates = tokens.filter(function (w) { return w.length >= 4; });
      if (!candidates.length) candidates = tokens.slice();
      var answer = candidates.sort(function (a, b) { return b.length - a.length; })[0];
      var at = sentence.indexOf(answer);
      if (at === -1) return;
      var blanked = sentence.slice(0, at) + "_____" + sentence.slice(at + answer.length);
      var options = [answer];
      var pool = all.filter(function (w) { return w.toLowerCase() !== answer.toLowerCase(); });
      for (var i = pool.length - 1; i > 0; i -= 1) {
        var j = Math.floor(r() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      pool.forEach(function (w) { if (options.length < 4 && options.indexOf(w) === -1) options.push(w); });
      if (options.length < 4) return;
      for (var k = options.length - 1; k > 0; k -= 1) {
        var m = Math.floor(r() * (k + 1));
        var z = options[k]; options[k] = options[m]; options[m] = z;
      }
      out.push({ q: blanked.trim(), options: options, answer: options.indexOf(answer) });
    });
    return out;
  }

  function systemWords(language) {
    return "You are a careful " + String(language || "target-language") +
      " tutor. Answer only with target-language words or phrases, one per line. " +
      "No numbering, no quotes, no translations, no explanations, no dialect that is not standard.";
  }

  function wordsPrompt(language, area) {
    return "The learner wants to improve this area: " + String(area || "").trim() +
      ". Return up to 12 short, common words or phrases in " + String(language || "the target language") +
      " that belong to that area. One per line. No translations, no numbering, no explanation.";
  }

  function systemKeywords() {
    return "You turn a language-learning request into a short lesson plan. " +
      "Answer only with English keywords and situations, one per line. No explanation.";
  }

  function keywordsPrompt(situation) {
    return "Request: " + String(situation || "").trim() +
      ". Return up to 8 English keywords, objects, places, actions and social situations " +
      "that a lesson for this request should cover. One per line.";
  }

  return {
    cleanLine: cleanLine,
    parseList: parseList,
    parseReading: parseReading,
    readingQuestions: readingQuestions,
    systemWords: systemWords,
    wordsPrompt: wordsPrompt,
    systemKeywords: systemKeywords,
    keywordsPrompt: keywordsPrompt
  };
});
