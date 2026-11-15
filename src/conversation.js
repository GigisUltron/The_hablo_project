/* sema — data-derived feedback for a conversation, not model prose. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaConversation = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function words(text) {
    return (String(text == null ? "" : text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  }

  function normalize(text) {
    return String(text == null ? "" : text).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function stats(messages, targets) {
    var user = (messages || []).filter(function (m) { return m && m.role === "user"; });
    var turns = user.length;
    var count = user.reduce(function (n, m) { return n + words(m.text); }, 0);
    var questions = user.filter(function (m) { return /[?¿]/.test(String(m.text || "")); }).length;
    var hay = normalize(user.map(function (m) { return m.text || ""; }).join(" "));
    var used = (targets || []).filter(function (item) {
      var phrase = normalize(item && item.text);
      return phrase.length > 0 && hay.indexOf(phrase) !== -1;
    });
    return {
      turns: turns,
      words: count,
      questions: questions,
      used: used.length,
      targets: (targets || []).length
    };
  }

  return { stats: stats };
});
