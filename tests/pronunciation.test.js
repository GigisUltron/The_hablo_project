const test = require("node:test");
const assert = require("node:assert/strict");
const P = require("../src/pronunciation.js");

test("speech feedback names words the recogniser missed", () => {
  assert.deepEqual(P.missing("La cuenta, por favor.", "la cuenta por favor"), []);
  assert.deepEqual(P.missing("La cuenta, por favor.", "la por favor"), ["cuenta"]);
  assert.deepEqual(P.missing("El café con leche.", "el cafe con leche"), []);
});

test("single-word and empty targets do not invent feedback", () => {
  assert.deepEqual(P.missing("casa", ""), []);
  assert.deepEqual(P.missing("", ""), []);
});
