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
    systemWords: systemWords,
    wordsPrompt: wordsPrompt,
    systemKeywords: systemKeywords,
    keywordsPrompt: keywordsPrompt
  };
});
