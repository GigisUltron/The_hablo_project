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

  /* End on a high: enough cards to have learned something, and accuracy high
   * enough that stopping feels like momentum rather than escape. */
  function shouldStop(answered, correct, minimum) {
    var min = minimum === undefined ? 6 : minimum;
    if (answered < min) return false;
    return correct / Math.max(1, answered) >= 0.85;
  }

  /* CEFR gating: an A1 learner should never be shown B1 material. Ordered
   * easiest first; C1 is the top band the decks are graded against. */
  var CEFR = ["A1", "A2", "B1", "B2", "C1"];

  /* Reading shelves: five, one per band, so B2 and C1 do not share a shelf.
   * An unknown band sits on the first shelf. */
  function shelf(band) {
    var at = CEFR.indexOf(band);
    return at === -1 ? 1 : at + 1;
  }

  function within(itemLevel, profileLevel) {
    var i = CEFR.indexOf(itemLevel);
    var p = CEFR.indexOf(profileLevel);
    if (i === -1 || p === -1) return true;   // ungraded items stay available
    return i <= p;
  }

  /* One kind of lesson. It opens on the phrases a person actually needs first,
   * in the order they would meet them, and at least half of it is phrases; the
   * rest mixes the grammar that holds a sentence up, the words it is made of and
   * the connectors that join two sentences.
   *
   * `ordered` holds each layer's ids in the order they should be met - the app
   * passes what is due first, then what is new. Pure: no schedule state is read
   * here, so the composition can be tested on its own. */
  /* The four phrases a session opens on, in teaching order: hello, how are you,
   * favourite colour, where are you from. Other decks resolve their own ids from
   * the same meanings (see the app's openersFor). */
  var OPENERS = ["ph-hola", "ph-como-estas", "ph-color", "ph-de-donde"];
  /* after the opening run: a word, then a phrase, then grammar, and a connector
   * only when the app has decided the learner is ready for one */
  var LAYERS = ["words", "phrases", "grammar", "terms"];
  var LEAD = 4;   // the opening run is phrases, not a shuffle

  function sessionMix(ordered, size, openers) {
    var o = ordered || {};
    var q = {};
    LAYERS.forEach(function (kind) { q[kind] = (o[kind] || []).slice(); });

    var n = Math.max(0, Math.round(Number(size) || 0));
    var list = (openers || OPENERS).slice();
    var out = [];

    /* Every session opens on phrases. A deck that has not named its openers yet
     * still may not open on a word: take the first phrases it has. */
    if (!list.length) list = q.phrases.slice(0, LEAD);

    /* the opening run: the first phrases, in teaching order */
    list.slice(0, LEAD).forEach(function (id) {
      var at = q.phrases.indexOf(id);
      if (at === -1 || out.indexOf(id) !== -1) return;
      q.phrases.splice(at, 1);
      out.push(id);
    });

    /* every opener still belongs in the session, even a short one, and at
     * least half of it must be phrases */
    var stillDue = list.filter(function (id) { return q.phrases.indexOf(id) !== -1; }).length;
    var target = Math.max(Math.ceil(n / 2), Math.min(n, out.length + stillDue));
    target = Math.min(target, out.length + q.phrases.length);

    var have = out.length;
    var turn = 0;
    while (out.length < n) {
      /* a session this short can only stay half phrases if the gap is filled
       * with them now */
      if (target - have >= n - out.length && q.phrases.length) {
        out.push(q.phrases.shift());
        have += 1;
        continue;
      }
      var pick = null;
      for (var tries = 0; tries < LAYERS.length && !pick; tries += 1) {
        var kind = LAYERS[(turn + tries) % LAYERS.length];
        if (q[kind].length) pick = kind;
      }
      turn += 1;
      if (!pick) break;
      out.push(q[pick].shift());
      if (pick === "phrases") have += 1;
    }
    return out;
  }

  /* The pair you mix up most, if it is in scope for this session. A drill that
   * opens on your own confusion is worth more than one that opens on alphabetical
   * order. Confusions are "id|id" -> count. */
  function confusionSeed(confusions, pool, minimum) {
    if (!confusions || !pool || !pool.length) return null;
    var min = minimum === undefined ? 2 : minimum;
    var best = null, bestN = 0;
    Object.keys(confusions).forEach(function (k) {
      var n = confusions[k];
      if (typeof n !== "number" || n < min || n <= bestN) return;
      best = k; bestN = n;
    });
    if (!best) return null;
    var ids = String(best).split("|");
    for (var i = 0; i < ids.length; i++) {
      if (pool.indexOf(ids[i]) !== -1) return ids[i];
    }
    return null;
  }

  /* How much today should be, learned from what you actually finish.
   * Recent completed sessions, clamped so a bad week cannot shrink it to two
   * cards and a good one cannot set an impossible target. */
  function dailyGoal(history, floor, ceiling) {
    var lo = floor === undefined ? 4 : floor;
    var hi = ceiling === undefined ? 15 : ceiling;
    var done = (history || []).filter(function (n) { return typeof n === "number" && n > 0; });
    if (!done.length) return 8;
    var recent = done.slice(-7);
    var total = recent.reduce(function (a, b) { return a + b; }, 0);
    var avg = total / recent.length;
    return Math.max(lo, Math.min(hi, Math.round(avg)));
  }

  /* A goal that cannot run away: three short sessions in a row lower it,
   * three long ones raise it, one session never moves it. */
  function nextGoal(goal, recent, floor, ceiling) {
    var lo = floor === undefined ? 4 : floor;
    var hi = ceiling === undefined ? 15 : ceiling;
    var g = goal || 8;
    var last = (recent || []).slice(-3);
    if (last.length < 3) return g;
    var short = last.filter(function (n) { return n < g * 0.6; }).length;
    var long = last.filter(function (n) { return n > g * 1.2; }).length;
    if (short === 3) g -= 1;
    else if (long === 3) g += 1;
    return Math.max(lo, Math.min(hi, g));
  }

  var api = { LEVELS: LEVELS, level: level, plan: plan, shouldStop: shouldStop,
              CEFR: CEFR, shelf: shelf, within: within, OPENERS: OPENERS, sessionMix: sessionMix,
              confusionSeed: confusionSeed, dailyGoal: dailyGoal, nextGoal: nextGoal };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaAdaptive = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
