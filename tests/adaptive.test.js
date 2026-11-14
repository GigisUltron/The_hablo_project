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

test("the session can open on the pair you actually confuse", () => {
  const conf = { "ph-a|ph-b": 5, "ph-c|ph-d": 9 };
  const pool = ["ph-a", "ph-b", "ph-c"];
  assert.equal(A.confusionSeed(conf, pool), "ph-c");   // strongest, and in scope
  assert.equal(A.confusionSeed({ "x|y": 1 }, pool), null);   // below the threshold
  assert.equal(A.confusionSeed({ "q|r": 9 }, pool), null);   // strongest, but out of scope
  assert.equal(A.confusionSeed(null, pool), null);
});
