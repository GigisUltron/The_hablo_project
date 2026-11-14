const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../src/track.js");

test("nothing unlocked at zero except the first unit", () => {
  const rows = T.map(0);
  assert.equal(rows[0].unlocked, true);
  assert.equal(rows[0].current, true);
  assert.equal(rows.filter((r) => r.unlocked).length, 1);
});

test("unlocks step by step with solid cards", () => {
  assert.equal(T.map(6).filter((r) => r.unlocked).length, 2);
  assert.equal(T.map(14).filter((r) => r.unlocked).length, 3);
  assert.equal(T.map(30).filter((r) => r.unlocked).length, 5);
});

test("the current unit is the furthest unlocked one", () => {
  assert.equal(T.currentUnit(0).id, "u1");
  assert.equal(T.currentUnit(7).id, "u2");
  assert.equal(T.currentUnit(99).id, "u5");
});

test("remaining counts down to the next unlock", () => {
  assert.equal(T.map(0)[1].remaining, 6);
  assert.equal(T.map(5)[1].remaining, 1);
  assert.equal(T.map(6)[1].remaining, 0);
});

test("thresholds are ordered and ids unique", () => {
  const needs = T.units.map((u) => u.need);
  assert.deepEqual(needs, [...needs].sort((a, b) => a - b));
  assert.equal(new Set(T.units.map((u) => u.id)).size, T.units.length);
});
