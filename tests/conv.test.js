const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/conv.js");

test("a dialogue starts at the first turn", () => {
  const s = C.start("cv-first-meeting");
  assert.equal(s.turn, 0);
  assert.equal(s.misses, 0);
  assert.ok(s.dialogue.turns.length >= 4);
});

test("any fitting reply passes, not just the model one", () => {
  const turn = C.start().dialogue.turns[1]; // ¿Cómo te llamas?
  assert.equal(C.fits("Me llamo Ana", turn), true);
  assert.equal(C.fits("me llamo pedro", turn), true);
  assert.equal(C.fits("Tengo veinte años", turn), false);
});

test("accents and case do not decide the answer", () => {
  const turn = C.start().dialogue.turns[0];
  assert.equal(C.fits("MUY BIEN", turn), true);
  assert.equal(C.fits("así así", turn), true);
});

test("an empty reply never fits, except where nothing is expected", () => {
  const s = C.start().dialogue;
  assert.equal(C.fits("", s.turns[0]), false);
  assert.equal(C.fits("", s.turns[s.turns.length - 1]), true);
});

test("every turn has a spanish line", () => {
  for (const t of C.start().dialogue.turns) {
    assert.ok(t.es && t.es.length > 4, t.es);
  }
});
