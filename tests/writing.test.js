const test = require("node:test");
const assert = require("node:assert/strict");
const W = require("../src/writing.js");

test("script writing ignores case, punctuation and spacing", () => {
  assert.equal(W.grade("ВОДУ, ПОЖАЛУЙСТА.", "Воду, пожалуйста.").ok, true);
  assert.equal(W.grade("Воду пожалуйста", "Воду, пожалуйста.").ok, true);
  assert.equal(W.grade("你好！", "你好").ok, true);
  assert.equal(W.grade("こんにちは。", "こんにちは").ok, true);
});

test("script writing accepts a list of valid answers", () => {
  assert.equal(W.grade("Воду", ["Воду, пожалуйста.", "Воду"]).ok, true);
  assert.equal(W.grade("Воды", ["Воду, пожалуйста.", "Воду"]).ok, false);
});

test("a Latin-only answer is named, not marked as a spelling miss", () => {
  assert.equal(W.grade("Vodu", "Воду").reason, "latin-only");
  assert.equal(W.grade("", "Воду").reason, "empty");
});

test("normalise removes punctuation but keeps letters", () => {
  assert.equal(W.normalise("你好！"), "你好");
  assert.equal(W.normalise("Воду, пожалуйста."), "водупожалуйста");
});
