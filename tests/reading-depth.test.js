const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const starters = ["pt", "de", "nl", "tr", "ar", "hi", "ja", "zh"];

test("the starter packs carry a B1 text with a real answer key", () => {
  for (const code of starters) {
    const texts = require(path.join(__dirname, "..", "src", "lang", code, "texts.js")).texts;
    const b1 = texts.filter((t) => t.level === 3);
    assert.ok(b1.length >= 1, `${code} has no B1 text`);
    for (const text of b1) {
      assert.equal(text.questions.length, 3, `${code}/${text.id}: expected three questions`);
      for (const q of text.questions) {
        assert.equal(q.options.length, 3, `${code}/${text.id}: expected three options`);
        assert.ok(q.answer >= 0 && q.answer < 3, `${code}/${text.id}: bad answer index`);
        assert.equal(q.why.length, 3, `${code}/${text.id}: why does not cover every option`);
        assert.equal(q.why[q.answer], "", `${code}/${text.id}: correct option has a why`);
      }
    }
  }
});
