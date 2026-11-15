const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../src/exercises.js");

test("production types are separated from recognition types", () => {
  for (const type of ["write", "type-translation", "translate-out", "listen-type", "say", "build", "message", "gap"]) {
    assert.equal(E.isProduction(type), true, type);
  }
  for (const type of ["pick-word", "pick-picture", "match", "translate", "listen"]) {
    assert.equal(E.isProduction(type), false, type);
  }
  assert.equal(E.isProduction(undefined), false);
});
