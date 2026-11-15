/* Writing practice for scripts that are not Latin.
 *
 * No handwriting recognition and no stroke data, so nothing here grades how a
 * character is drawn. What it can honestly do is grade whether the learner
 * produced the character: the card gives the reading and the meaning, the
 * learner types or pastes the characters, and this compares them after
 * normalising punctuation and whitespace.
 *
 * Pure and dependency-free so it can be tested without a DOM.
 */
(function (root) {
  "use strict";

  function isLetter(ch) {
    try { return /\p{L}/u.test(String(ch)); }
    catch (err) { return /[A-Za-z\u00c0-\u024f\u0400-\u04ff\u0600-\u06ff\u0900-\u097f]/.test(String(ch)); }
  }

  function isLatin(ch) {
    try { return /\p{Script=Latin}/u.test(String(ch)); }
    catch (err) { return /[A-Za-z\u00c0-\u024f]/.test(String(ch)); }
  }

  /* Punctuation and spacing carry no answer: 你好！ and 你好 are the same. */
  function normalise(text) {
    var value = String(text == null ? "" : text).toLowerCase();
    try { value = value.normalize("NFKC"); } catch (err) { /* older engines */ }
    try { return value.replace(/[\p{P}\p{Z}\s]+/gu, ""); }
    catch (err) {
      return value.replace(/[\s!-\/:-@\[-`{-~\u3000-\u303f\uff00-\uffef]+/g, "");
    }
  }

  /* Does this text use a script that is not Latin? Drives the exercise: a
   * Latin deck has nothing to recall here, whatever its language code. */
  function hasScript(text) {
    return Array.from(String(text == null ? "" : text)).some(function (ch) {
      return isLetter(ch) && !isLatin(ch);
    });
  }

  /* The learner's answer against the item. Latin-only input is refused with a
   * reason of its own: a Latin keyboard cannot produce these characters, so the
   * honest instruction is to paste them, not to mark the answer wrong. */
  function grade(answer, expected) {
    if (!normalise(answer)) return { ok: false, reason: "empty" };
    if (!hasScript(answer)) return { ok: false, reason: "latin-only" };
    var targets = Array.isArray(expected) ? expected : [expected];
    var ok = targets.some(function (target) {
      return normalise(answer) === normalise(target);
    });
    return { ok: ok, reason: "" };
  }

  function canRecall(item) {
    return !!(item && item.sub && item.gloss && hasScript(item.text));
  }

  function candidates(items) {
    return (items || []).filter(function (item) {
      return item && item.sub && hasScript(item.text);
    });
  }

  var api = { normalise: normalise, hasScript: hasScript, grade: grade, canRecall: canRecall, candidates: candidates };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaWriting = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
