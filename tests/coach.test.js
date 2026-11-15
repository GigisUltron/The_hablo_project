const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/coach.js");

test("the model guard rejects meta chatter and long essays", () => {
  assert.equal(C.valid("You kept la casa and el pan."), true);
  assert.equal(C.valid("I can provide detailed explanations and examples."), false);
  assert.equal(C.valid("As an AI, I cannot answer."), false);
  assert.equal(C.valid("x".repeat(321)), false);
  assert.equal(C.valid("One. Two. Three. Four."), false);
});

test("the model guard can require real lesson data", () => {
  assert.equal(C.valid("You kept la casa.", ["la casa"]), true);
  assert.equal(C.valid("Good work today.", ["la casa"]), false);
});
