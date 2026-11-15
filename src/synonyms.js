/* sema — synonym questions for vocabulary expansion.
 *
 * A synonym is authored per item; nothing is generated. The module only picks
 * the correct answer and three distractors, deterministically testable with an
 * injected random source.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaSynonyms = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function forItem(item) {
    var seen = {};
    return (item && Array.isArray(item.synonyms) ? item.synonyms : []).filter(function (word) {
      var value = String(word || "").trim();
      if (!value || seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }

  function shuffle(list, rand) {
    var r = rand || Math.random;
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i -= 1) {
      var j = Math.floor(r() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function options(correct, pool, count, rand) {
    var limit = Math.max(2, Math.min(Number(count) || 4, 6));
    var seen = {};
    var out = [];
    function add(word) {
      var value = String(word || "").trim();
      if (!value || seen[value]) return;
      seen[value] = true;
      out.push(value);
    }
    add(correct);
    shuffle((pool || []).filter(function (w) { return String(w || "").trim() !== String(correct); }), rand)
      .forEach(function (word) { if (out.length < limit) add(word); });
    return shuffle(out, rand);
  }

  return { forItem: forItem, options: options, shuffle: shuffle };
});
