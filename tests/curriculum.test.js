const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../src/track.js");
const C = require("../src/curriculum.js");
const L = require("../src/lang/index.js");

const FULL = new Set(["es", "fr", "en", "it"]);
const FIRST_FIVE = ["c1", "c2", "c3", "c4", "c5"];

function phrases(code) {
  return L.load(code).phrases.phrases || [];
}

test("full courses have real phrases for every tutor lesson", () => {
  for (const code of FULL) {
    for (const unit of T.unitList(false)) {
      if (unit.mode === "read" || unit.mode === "script") continue;
      const n = C.count(unit, phrases(code));
      assert.ok(n >= 4, `${code}/${unit.id} has only ${n} situation phrases`);
    }
  }
});

test("starter courses show the first five and hide lessons they cannot teach", () => {
  for (const code of ["ar", "de", "hi", "ja", "nl", "pt", "ru", "tr", "zh"]) {
    const available = C.available(T.unitList(false), phrases(code)).map((u) => u.id);
    const base = FIRST_FIVE.concat(["c12"]);
    for (const id of base) assert.ok(available.includes(id), `${code} is missing ${id}`);
    for (const id of available.filter((x) => !base.includes(x))) {
      const unit = T.unitList(false).find((u) => u.id === id);
      assert.ok(C.count(unit, phrases(code)) >= 2, `${code}/${id} is exposed without material`);
    }
    for (const unit of T.unitList(false).filter((u) => FIRST_FIVE.includes(u.id))) {
      const n = C.count(unit, phrases(code));
      const min = unit.id === "c4" || unit.id === "c5" ? 2 : 1;
      assert.ok(n >= min, `${code}/${unit.id} has only ${n} real phrase(s)`);
    }
  }
});

test("every lesson carries a can-do goal and focus", () => {
  for (const unit of T.unitList(false)) {
    assert.ok(unit.goal && unit.goal.length > 20, `${unit.id} has no can-do goal`);
    assert.ok(unit.focus && unit.focus.length > 3, `${unit.id} has no language focus`);
  }
});

test("the first five have topics and the café lesson is not a greeting lesson", () => {
  const first = T.unitList(false).slice(0, 5);
  assert.deepEqual(first.map((u) => u.id), FIRST_FIVE);
  assert.ok(first[0].openers, "first contact does not open on greetings");
  assert.ok(!first[1].openers, "café opens on greetings again");
  assert.ok(first[1].topics.includes("café"));
});
