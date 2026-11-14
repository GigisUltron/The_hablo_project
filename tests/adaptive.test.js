const test = require("node:test");
const assert = require("node:assert/strict");
const A = require("../src/adaptive.js");

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
