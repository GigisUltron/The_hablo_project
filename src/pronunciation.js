/* sema — word-level feedback for a speech transcript, no model involved. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaPronunciation = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function words(text) {
    return String(text == null ? "" : text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
  }

  function key(word) {
    return String(word).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* Words in the target that the recogniser did not hear. It is deliberately
   * simple: accents and case are ignored, word order is not. */
  function missing(target, heard) {
    var wanted = words(target);
    if (wanted.length < 2) return [];
    var have = {};
    words(heard).forEach(function (w) { have[key(w)] = true; });
    var seen = {};
    return wanted.filter(function (w) {
      var k = key(w);
      if (seen[k] || have[k]) return false;
      seen[k] = true;
      return true;
    });
  }

  return { missing: missing };
});
