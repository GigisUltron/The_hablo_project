/* sema — guardrails for optional model-written coaching.
 *
 * The coach is rules-first. A small local model may add wording, but it may
 * never replace the data-derived note with generic self-talk or a long essay.
 * This validator is intentionally conservative.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaCoach = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var META = /\b(?:as an ai|language model|i am an ai|i'm an ai|i can provide|i cannot|i can't|i will provide|i'll provide|i am here to|i'm here to)\b/i;

  function valid(text, required) {
    var value = String(text == null ? "" : text).replace(/\s+/g, " ").trim();
    if (!value) return false;
    if (value.length > 320) return false;
    if (value.split(/\s+/).length > 60) return false;
    if ((value.match(/[.!?。！？]/g) || []).length > 3) return false;
    if (META.test(value)) return false;
    if (Array.isArray(required) && required.length) {
      var hay = value.toLowerCase();
      if (!required.some(function (word) { return hay.indexOf(String(word || "").toLowerCase()) !== -1; })) {
        return false;
      }
    }
    return true;
  }

  return { valid: valid };
});
