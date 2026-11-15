const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/correct.js");

test("exact and accent-only answers", () => {
  assert.equal(C.classify("café", "café"), "ok");
  assert.equal(C.classify("cafe", "café"), "accents");
});

test("article mistakes are named", () => {
  assert.equal(C.classify("la color", "el color"), "article");
  assert.equal(C.classify("casa", "la casa"), "missing-article");
  assert.equal(C.classify("la casa", "casa"), "extra-article");
});

test("article mistakes are named in every deck that has articles", () => {
  assert.equal(C.classify("le maison", "la maison", "fr"), "article");
  assert.equal(C.classify("Das Haus", "das Haus", "de"), "accents");
  assert.equal(C.classify("der Haus", "das Haus", "de"), "article");
  assert.equal(C.classify("il gatto", "la gatto", "it"), "article");
  assert.equal(C.classify("the house", "a house", "en"), "article");
});

test("everything else is spelling", () => {
  assert.equal(C.classify("cassa", "casa"), "spelling");
  assert.equal(C.classify("", "casa"), "empty");
});

test("every kind has a message that names the fix", () => {
  for (const k of ["ok", "accents", "article", "extra-article", "missing-article", "empty", "spelling"]) {
    assert.ok(C.message(k, "la casa").length > 4, k);
  }
  assert.match(C.message("article", "la casa"), /la casa/);
  assert.match(C.message("accents", "casa"), /accent/);
  assert.match(C.message("missing-article", "la casa"), /la casa/);
});
