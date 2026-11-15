const test = require("node:test");
const assert = require("node:assert/strict");
const A = require("../src/adaptive.js");

/* synthetic layers: the composition rules are tested without the real deck */
function sessionPools(over) {
  const o = over || {};
  const base = {
    phrases: ["ph-hola", "ph-como-estas", "ph-de-donde", "ph-color"]
      .concat(Array.from({ length: 12 }, (_, i) => "ph-x" + i)),
    words: Array.from({ length: 24 }, (_, i) => "w-" + i),
    grammar: Array.from({ length: 8 }, (_, i) => "g-" + i),
    terms: Array.from({ length: 6 }, (_, i) => "t-" + i)
  };
  for (const k of Object.keys(o)) base[k] = o[k];
  return base;
}

test("level rises with solid cards", () => {
  assert.equal(A.level(0), 1);
  assert.equal(A.level(5), 1);
  assert.equal(A.level(6), 2);
  assert.equal(A.level(13), 2);
  assert.equal(A.level(14), 3);
  assert.equal(A.level(999), 3);
});

test("new items fall and reviews rise as you learn", () => {
  const a = A.plan(0), b = A.plan(10), c = A.plan(40);
  assert.ok(a.fresh > b.fresh && b.fresh > c.fresh, "fresh must decrease");
  assert.ok(a.review < b.review && b.review < c.review, "review must increase");
});

test("production only appears once there is something to produce", () => {
  assert.equal(A.plan(0).production, 0);
  assert.ok(A.plan(6).production >= 1);
  assert.ok(A.plan(14).production >= 2);
});

test("sessions stay short at every level", () => {
  for (const solid of [0, 6, 14]) {
    const size = A.plan(solid).size;
    assert.ok(size >= 6 && size <= 8, `size ${size} at solid ${solid}`);
  }
});

test("plan is deterministic", () => {
  assert.deepEqual(A.plan(9), A.plan(9));
});

test("a good session stops early, a poor one does not", () => {
  assert.equal(A.shouldStop(6, 6), true);
  assert.equal(A.shouldStop(6, 5), false);   // 83%
  assert.equal(A.shouldStop(5, 5), false);   // too short to count
  assert.equal(A.shouldStop(8, 7), true);
  assert.equal(A.shouldStop(6, 0), false);
});

test("cefr gating keeps harder items out of an easier session", () => {
  assert.equal(A.within("A1", "A1"), true);
  assert.equal(A.within("B1", "A1"), false);
  assert.equal(A.within("A2", "B1"), true);
  assert.equal(A.within("B2", "B1"), false);
  assert.equal(A.within(undefined, "A1"), true);   // ungraded is allowed
});

test("the bands run A1 to C1, easiest first", () => {
  assert.deepEqual(A.CEFR, ["A1", "A2", "B1", "B2", "C1"]);
  assert.equal(A.within("C1", "C1"), true);
  assert.equal(A.within("C1", "B2"), false);       // C1 is above B2
  assert.equal(A.within("B2", "C1"), true);
  assert.equal(A.within("A1", "C1"), true);
});

test("a session opens on phrases, in teaching order", () => {
  const pools = sessionPools();
  const ids = A.sessionMix(pools, 8);
  assert.deepEqual(ids.slice(0, 3), A.OPENERS.slice(0, 3));
  assert.deepEqual(A.OPENERS, ["ph-hola", "ph-como-estas", "ph-color", "ph-de-donde"]);
});

test("at least half of a session is phrases, at every length", () => {
  const pools = sessionPools();
  for (const size of [5, 8, 12]) {
    const ids = A.sessionMix(pools, size);
    const phrases = ids.filter((id) => pools.phrases.includes(id)).length;
    assert.equal(ids.length, size, `size ${size} came back as ${ids.length}`);
    assert.ok(phrases * 2 >= size, `size ${size} has ${phrases} phrases`);
    assert.equal(new Set(ids).size, ids.length, `size ${size} repeats a card`);
  }
});

test("a session mixes words, grammar and connectors", () => {
  const pools = sessionPools();
  const ids = A.sessionMix(pools, 8);
  for (const layer of ["words", "grammar", "terms"]) {
    assert.ok(ids.some((id) => pools[layer].includes(id)), `no ${layer} in ${ids.join(", ")}`);
  }
});

test("the four conversation anchors fit in a short session too", () => {
  const pools = sessionPools();
  const ids = A.sessionMix(pools, 5);
  const firstFour = ids.filter((id) => id.startsWith("ph-")).slice(0, 4);
  assert.deepEqual(firstFour, ["ph-hola", "ph-como-estas", "ph-color", "ph-de-donde"]);
});

test("a mix never invents ids and never runs past the pool", () => {
  const pools = sessionPools({
    phrases: ["ph-hola", "ph-como-estas", "ph-de-donde", "ph-color"],
    words: ["casa"], grammar: [], terms: []
  });
  const ids = A.sessionMix(pools, 8);
  const known = [].concat(pools.phrases, pools.words, pools.grammar, pools.terms);
  for (const id of ids) assert.ok(known.includes(id), "invented " + id);
  assert.equal(ids.length, 5, "only four phrases and one word exist");
});

test("the session can open on the pair you actually confuse", () => {
  const conf = { "ph-a|ph-b": 5, "ph-c|ph-d": 9 };
  const pool = ["ph-a", "ph-b", "ph-c"];
  assert.equal(A.confusionSeed(conf, pool), "ph-c");   // strongest, and in scope
  assert.equal(A.confusionSeed({ "x|y": 1 }, pool), null);   // below the threshold
  assert.equal(A.confusionSeed({ "q|r": 9 }, pool), null);   // strongest, but out of scope
  assert.equal(A.confusionSeed(null, pool), null);
});

test("the daily goal follows what you finish, within reason", () => {
  assert.equal(A.dailyGoal([]), 8);                       // no history: a sane start
  assert.equal(A.dailyGoal([6, 8, 10]), 8);               // average of recent
  assert.equal(A.dailyGoal([2, 2, 2]), 4);                // floored, never 2
  assert.equal(A.dailyGoal([40, 40]), 15);                // capped, never 40
  assert.equal(A.dailyGoal([0, 0]), 8);                   // zeroes are not a pace
  assert.equal(A.dailyGoal([6, 6, 6, 6, 6, 6, 6, 20, 20]), 10);  // only the last seven
});

test("the goal drifts with three consistent sessions, never one", () => {
  assert.equal(A.nextGoal(8, [2, 2, 2]), 7);         // consistently short
  assert.equal(A.nextGoal(8, [2, 8, 2]), 8);         // one slow session is not a trend
  assert.equal(A.nextGoal(8, [12, 12, 12]), 9);      // consistently long
  assert.equal(A.nextGoal(4, [1, 1, 1]), 4);         // floored
  assert.equal(A.nextGoal(15, [20, 20, 20]), 15);    // capped
  assert.equal(A.nextGoal(8, [2, 2]), 8);            // needs three
});

test("reading has five shelves, one per band", () => {
  assert.equal(A.shelf("A1"), 1);
  assert.equal(A.shelf("A2"), 2);
  assert.equal(A.shelf("B1"), 3);
  assert.equal(A.shelf("B2"), 4);
  assert.equal(A.shelf("C1"), 5);
  assert.equal(A.shelf("?"), 1, "an unknown band reads from shelf one");
  assert.equal(A.shelf(undefined), 1);
});

test("a learner earns the next band by meeting cards", () => {
  assert.equal(A.earnedLevel(0), "A1");
  assert.equal(A.earnedLevel(35), "A1");
  assert.equal(A.earnedLevel(36), "A2");
  assert.equal(A.earnedLevel(72), "B1");
  assert.equal(A.earnedLevel(120), "B2");
  assert.equal(A.earnedLevel(180), "C1");
  assert.equal(A.higherLevel("A2", "B1"), "B1");
  assert.equal(A.higherLevel("C1", "A1"), "C1");
});

test("a level belongs to a language, not to the whole profile", () => {
  const profile = { level: "B1", levelByLang: { es: "B1", fr: "A1" } };
  assert.equal(A.levelFor(profile, "es"), "B1");
  assert.equal(A.levelFor(profile, "fr"), "A1");
  assert.equal(A.levelFor({ level: "A2" }, "de"), "A2", "old single-level profiles still migrate");
  assert.equal(A.levelFor({}, "es"), "A1", "no profile yet is a beginner, not B1");
  assert.equal(A.levelFor({ levelByLang: { es: "?" } }, "es"), "A1", "an abandoned placement is A1");
});

test("placement gets harder after two easy correct answers", () => {
  const p = { band: 0, streak: 0, correct: 0 };
  A.placementStep(p, true);
  assert.equal(p.band, 0, "one correct answer is not a level");
  A.placementStep(p, true);
  assert.equal(p.band, 0, "two easy items are not enough");
  A.placementStep(p, true);
  assert.equal(p.band, 1, "three correct answers move the test up a band");
  A.placementStep(p, true);
  assert.equal(p.band, 1);
  A.placementStep(p, true);
  assert.equal(p.band, 1);
  A.placementStep(p, true);
  assert.equal(p.band, 2);
});

test("a miss steps placement back one band, never below A1", () => {
  const p = { band: 2, streak: 0, correct: 0 };
  A.placementStep(p, false);
  assert.equal(p.band, 1);
  A.placementStep(p, false);
  assert.equal(p.band, 0);
  A.placementStep(p, false);
  assert.equal(p.band, 0, "the test cannot fall below A1");
});

test("eight correct answers reach B1, not B2 or C1", () => {
  const p = { band: 0, streak: 0, correct: 0 };
  for (let i = 0; i < 8; i += 1) A.placementStep(p, true);
  assert.equal(A.CEFR[p.band], "B1");
  assert.equal(p.peak, 2, "placement cannot infer B2/C1 from eight taps");
});

test("a perfect twelve-question run can reach C1", () => {
  const p = { band: 0, streak: 0, correct: 0 };
  for (let i = 0; i < 12; i += 1) A.placementStep(p, true);
  assert.equal(A.CEFR[p.band], "C1");
});

test("the daily count is once per card and resets on a new day", () => {
  const dayOne = new Date(2026, 0, 1, 9, 0, 0).getTime();
  const dayTwo = new Date(2026, 0, 2, 9, 0, 0).getTime();
  let daily = A.bumpDaily(null, dayOne);
  assert.deepEqual(daily, { date: "2026-01-01", cards: 1 });
  daily = A.bumpDaily(daily, dayOne);
  assert.equal(daily.cards, 2);
  daily = A.bumpDaily(daily, dayTwo);
  assert.deepEqual(daily, { date: "2026-01-02", cards: 1 });
});
