/* Adaptive difficulty: the session gets harder, not longer.
 *
 * As cards become solid the mix shifts from meeting new items to retrieving old
 * ones, and from recognition toward production. Deliberately simple and pure so
 * it can be tested exhaustively - the schedule is the product, not the maths.
 */
(function (root) {
  var LEVELS = {
    1: { fresh: 5, review: 1, production: 0 },
    2: { fresh: 3, review: 3, production: 1 },
    3: { fresh: 1, review: 5, production: 2 }
  };

  function level(solid) {
    var n = Number(solid) || 0;
    if (n >= 14) return 3;
    if (n >= 6) return 2;
    return 1;
  }

  function plan(solid) {
    var l = level(solid);
    var base = LEVELS[l];
    return {
      level: l,
      fresh: base.fresh,
      review: base.review,
      production: base.production,
      size: base.fresh + base.review
    };
  }

  var api = { LEVELS: LEVELS, level: level, plan: plan };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaAdaptive = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
