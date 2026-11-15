const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../src/track.js");

test("nothing unlocked at zero except the first unit", () => {
  const rows = T.map(0);
  assert.equal(rows[0].unlocked, true);
  assert.equal(rows[0].current, true);
  assert.equal(rows.filter((r) => r.unlocked).length, 1);
});

test("unlocks step by step with cards met", () => {
  assert.equal(T.map(6).filter((r) => r.unlocked).length, 2);
  assert.equal(T.map(14).filter((r) => r.unlocked).length, 3);
  assert.equal(T.map(30).filter((r) => r.unlocked).length, 5);
});

test("the current unit is the furthest unlocked one", () => {
  assert.equal(T.currentUnit(0).id, "c1");
  assert.equal(T.currentUnit(7).id, "c2");
  assert.equal(T.currentUnit(99).id, "c12");
});

test("the first five lessons are a tutor's first five conversations", () => {
  const first = T.unitList(false).slice(0, 5);
  assert.deepEqual(first.map((u) => u.id), ["c1", "c2", "c3", "c4", "c5"]);
  for (const u of first) {
    assert.ok(u.goal && u.goal.length > 20, `${u.id} has no can-do goal`);
    assert.ok(Array.isArray(u.topics) && u.topics.length, `${u.id} has no situation topics`);
  }
  assert.ok(first[0].openers, "the first lesson does not open on greetings");
  assert.equal(first[1].openers, undefined, "the café lesson still opens on greetings");
});

test("the path has an A2 block and a B1 bridge", () => {
  const units = T.unitList(false);
  const a2 = units.filter((u) => ["c6", "c7", "c8", "c9", "c10"].includes(u.id));
  assert.equal(a2.length, 5);
  assert.equal(units.find((u) => u.id === "c11").mode, "terms");
  assert.equal(units.find((u) => u.id === "c12").mode, "read");
});

test("the default lesson is the highest unlocked one", () => {
  assert.equal(T.highestUnlocked(T.map(0)).id, "c1");
  assert.equal(T.highestUnlocked(T.map(6)).id, "c2");
  assert.equal(T.highestUnlocked(T.map(76)).id, "c12");
});

test("the path covers every field a pack can teach", () => {
  const covered = new Set();
  T.units.forEach((u) => (u.fields || []).forEach((f) => covered.add(f)));
  for (const field of ["home", "food", "nature", "animals", "body", "city", "time", "emotion", "action", "abstract"]) {
    assert.ok(covered.has(field), "no lesson teaches " + field);
  }
});

test("every unit is reachable in the smallest starter deck", () => {
  // A starter pack ships 24 concepts + 32 phrases + 8 terms + 16 basics.
  const starterCards = 24 + 32 + 8 + 16;
  const last = T.units[T.units.length - 1];
  assert.ok(last.need < starterCards,
    `last unit needs ${last.need} cards met; a starter deck only has ${starterCards}`);
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
