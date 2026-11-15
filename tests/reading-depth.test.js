const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const starters = ["pt", "de", "nl", "tr", "ar", "hi", "ja", "zh", "ru"];

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

test("the starter packs also carry a B2 text with a real answer key", () => {
  for (const code of starters) {
    const texts = require(path.join(__dirname, "..", "src", "lang", code, "texts.js")).texts;
    const b2 = texts.filter((t) => t.level === 4);
    assert.ok(b2.length >= 1, `${code} has no B2 text`);
    for (const text of b2) {
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

test("every pack meets the reading contract, including one B1 and one B2 text", () => {
  const root = path.join(__dirname, "..", "src", "lang");
  const codes = fs.readdirSync(root).filter((name) => fs.statSync(path.join(root, name)).isDirectory());
  assert.ok(codes.length >= 13, `expected thirteen packs, found ${codes.length}`);
  for (const code of codes) {
    const texts = require(path.join(root, code, "texts.js")).texts;
    assert.ok(texts.length > 0, `${code} has no texts`);
    const ids = new Set();
    for (const text of texts) {
      assert.ok([1, 2, 3, 4].includes(text.level), `${code}/${text.id}: level ${text.level} is out of range`);
      assert.equal(ids.has(text.id), false, `${code}/${text.id}: duplicate id`);
      ids.add(text.id);
      assert.equal(text.questions.length, 3, `${code}/${text.id}: expected three questions`);
      for (const q of text.questions) {
        assert.equal(q.options.length, 3, `${code}/${text.id}: expected three options`);
        assert.equal(new Set(q.options).size, 3, `${code}/${text.id}: duplicate options`);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 3, `${code}/${text.id}: bad answer index`);
        assert.equal(q.why.length, 3, `${code}/${text.id}: why does not cover every option`);
        assert.equal(q.why[q.answer], "", `${code}/${text.id}: correct option has a why`);
        for (let i = 0; i < 3; i += 1) {
          if (i !== q.answer) assert.ok(q.why[i], `${code}/${text.id}: no why for wrong option ${i}`);
        }
      }
    }
    assert.ok(texts.some((t) => t.band === "B1"), `${code} has no B1 text`);
    assert.ok(texts.some((t) => t.band === "B2"), `${code} has no B2 text`);
  }
});
