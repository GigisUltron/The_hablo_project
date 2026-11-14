/* sema — scheduling and matching logic.
 *
 * Deliberately free of DOM and of the dataset: everything here is pure, so it
 * can be exercised with `node tests/srs.test.js` in a workspace with no
 * dependencies at all.
 *
 * Scheduling is SM-2, with one deviation that matters for a *production-first*
 * app: a lapse resets the card to a same-session retry (10 minutes) instead of
 * a full day, because the point is to fix the sound-image link while the
 * confusion is still warm.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaSRS = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DAY_MS = 86400000;
  var LAPSE_MS = 600000; // 10 minutes
  var MIN_EF = 1.3;

  function newCard(id, now) {
    return {
      id: id,
      ef: 2.5,
      interval: 0,
      reps: 0,
      lapses: 0,
      due: now || Date.now(),
      last: null
    };
  }

  function newState(ids, now) {
    var state = {
      version: 1,
      cards: {},
      confusions: {},
      reviews: { good: 0, again: 0 },
      sessions: 0,
      lastSession: null
    };
    (ids || []).forEach(function (id) {
      state.cards[id] = newCard(id, now);
    });
    return state;
  }

  /* grade: 0 = again, 1 = hard, 2 = good, 3 = easy */
  function review(state, id, grade, now) {
    var t = now || Date.now();
    var card = state.cards[id] || (state.cards[id] = newCard(id, t));

    if (grade < 2) {
      card.lapses += 1;
      card.reps = 0;
      card.interval = LAPSE_MS / DAY_MS;
      card.ef = Math.max(MIN_EF, card.ef - 0.2);
      card.due = t + LAPSE_MS;
      state.reviews.again += 1;
    } else {
      card.reps += 1;
      if (card.reps === 1) card.interval = 1;
      else if (card.reps === 2) card.interval = 6;
      else card.interval = Math.round(card.interval * card.ef);

      var delta = 0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02);
      card.ef = Math.max(MIN_EF, card.ef + delta);
      card.due = t + card.interval * DAY_MS;
      state.reviews.good += 1;
    }

    card.last = grade;
    return card;
  }

  function isDue(card, now) {
    return (now || Date.now()) >= card.due;
  }

  function dueList(state, now) {
    var t = now || Date.now();
    var out = [];
    for (var id in state.cards) {
      if (Object.prototype.hasOwnProperty.call(state.cards, id) && isDue(state.cards[id], t)) {
        out.push(id);
      }
    }
    out.sort(function (a, b) {
      return state.cards[a].due - state.cards[b].due;
    });
    return out;
  }

  function learnedCount(state) {
    var n = 0;
    for (var id in state.cards) {
      if (Object.prototype.hasOwnProperty.call(state.cards, id) && state.cards[id].reps > 0) n += 1;
    }
    return n;
  }

  /* Share of graded answers that were not a lapse. Null until there is data —
   * we never show a fabricated 100% to a brand-new learner. */
  function retention(state) {
    var total = state.reviews.good + state.reviews.again;
    if (!total) return null;
    return state.reviews.good / total;
  }

  function recordConfusion(state, targetId, chosenId) {
    if (!targetId || !chosenId || targetId === chosenId) return;
    var key = targetId + ">" + chosenId;
    state.confusions[key] = (state.confusions[key] || 0) + 1;
  }

  function topConfusions(state, limit) {
    var rows = [];
    for (var key in state.confusions) {
      if (!Object.prototype.hasOwnProperty.call(state.confusions, key)) continue;
      var parts = key.split(">");
      rows.push({ target: parts[0], chosen: parts[1], count: state.confusions[key] });
    }
    rows.sort(function (a, b) { return b.count - a.count; });
    return rows.slice(0, limit || 5);
  }

  /* Build a session: due cards first (oldest due wins), then a capped number of
   * new ones. `rand` is injectable so tests are deterministic. */
  function buildQueue(state, now, opts) {
    var o = opts || {};
    var t = now || Date.now();
    var newLimit = o.newLimit === undefined ? 4 : o.newLimit;
    var maxItems = o.maxItems === undefined ? 8 : o.maxItems;
    var rand = o.rand || Math.random;

    var due = dueList(state, t).filter(function (id) { return state.cards[id].reps > 0; });
    var fresh = [];
    for (var id in state.cards) {
      if (!Object.prototype.hasOwnProperty.call(state.cards, id)) continue;
      if (state.cards[id].reps === 0 && state.cards[id].due <= t) fresh.push(id);
    }
    fresh = shuffle(fresh, rand).slice(0, newLimit);

    return due.concat(fresh).slice(0, maxItems);
  }

  function shuffle(list, rand) {
    var r = rand || Math.random;
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(r() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* Nearest-neighbour distractors: wrong answers that are *meaningfully* close
   * are the ones that teach. Falls back to random fill. */
  function pickDistractors(targetId, candidates, neighbourIds, count, rand) {
    var r = rand || Math.random;
    var chosen = [];
    var pool = [];

    (neighbourIds || []).forEach(function (id) {
      if (id !== targetId && candidates.indexOf(id) !== -1) pool.push(id);
    });

    shuffle(pool, r).forEach(function (id) {
      if (chosen.length < count) chosen.push(id);
    });

    var rest = candidates.filter(function (id) {
      return id !== targetId && chosen.indexOf(id) === -1;
    });
    shuffle(rest, r).forEach(function (id) {
      if (chosen.length < count) chosen.push(id);
    });

    return chosen;
  }

  /* ---- comparing what the learner said with what the card expects ------ */

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // ignore accents: "cafe" ≈ "café"
      .replace(/[^a-zñ\s]/g, " ")
      .replace(/\b(el|la|los|las|un|una)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1);
    var cur = new Array(b.length + 1);
    var i, j;
    for (j = 0; j <= b.length; j += 1) prev[j] = j;
    for (i = 1; i <= a.length; i += 1) {
      cur[0] = i;
      for (j = 1; j <= b.length; j += 1) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      var swap = prev; prev = cur; cur = swap;
    }
    return prev[b.length];
  }

  function similarity(said, expected) {
    var a = normalize(said);
    var b = normalize(expected);
    if (!a || !b) return 0;
    if (a === b) return 1;
    var d = levenshtein(a, b);
    return Math.max(0, 1 - d / Math.max(a.length, b.length));
  }

  return {
    DAY_MS: DAY_MS,
    LAPSE_MS: LAPSE_MS,
    newCard: newCard,
    newState: newState,
    review: review,
    isDue: isDue,
    dueList: dueList,
    learnedCount: learnedCount,
    retention: retention,
    recordConfusion: recordConfusion,
    topConfusions: topConfusions,
    buildQueue: buildQueue,
    shuffle: shuffle,
    pickDistractors: pickDistractors,
    normalize: normalize,
    levenshtein: levenshtein,
    similarity: similarity
  };
});
