const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../src/texts.js");

test("every text has an id, title, level and body", () => {
  for (const t of T.texts) {
    assert.match(t.id, /^tx-[a-z-]+$/);
    assert.ok(t.title.length > 2);
    assert.ok([1, 2, 3].includes(t.level), `${t.id} bad level`);
    const words = t.body.split(/\s+/).length;
    assert.ok(words >= 50 && words <= 140, `${t.id} is ${words} words`);
  }
});

test("texts are Spanish, not english", () => {
  // \b counts "é" as a boundary, so "andén" would match /\band\b/
  const english = /(^|[\s,.;:!?¡¿])(the|and|with|your|this|there)([\s,.;:!?¡¿]|$)/i;
  for (const t of T.texts) assert.equal(english.test(t.body), false, `${t.id} has english`);
});

test("each text has three questions with three options and a valid answer", () => {
  for (const t of T.texts) {
    assert.equal(t.questions.length, 3, `${t.id} question count`);
    for (const q of t.questions) {
      assert.ok(q.q.endsWith("?"), `${t.id} question must end with ?`);
      assert.equal(q.options.length, 3);
      assert.ok(q.answer >= 0 && q.answer < 3, `${t.id} answer out of range`);
      assert.equal(new Set(q.options).size, 3, `${t.id} duplicate options`);
    }
  }
});

test("levels are ordered and ids unique", () => {
  const levels = T.texts.map((t) => t.level);
  assert.deepEqual(levels, [...levels].sort());
  assert.equal(new Set(T.texts.map((t) => t.id)).size, T.texts.length);
});

test("no names or personal data in the texts", () => {
  for (const t of T.texts) {
    assert.equal(/@|\bwww\.|https?:/i.test(t.body), false, `${t.id} contains a link`);
  }
});
