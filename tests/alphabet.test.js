const test = require("node:test");
const assert = require("node:assert/strict");
const A = require("../src/alphabet.js");

test("all 27 spanish letters are present, in order", () => {
  const expected = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","rr","s","t","u","v","w","x","y","z"];
  assert.deepEqual(A.letters.map((l) => l.letter), expected);
});

test("every letter teaches by name, hint and example", () => {
  for (const l of A.letters) {
    assert.ok(l.name && l.name.length >= 1, `${l.letter} has no name`);
    assert.ok(l.hint && l.hint.length > 8, `${l.letter} hint too thin`);
    assert.ok(l.example && l.example.length > 1, `${l.letter} needs an example`);
  }
});

test("examples are spanish and contain the letter (except silent h and digraphs)", () => {
  for (const l of A.letters) {
    if (l.letter === "h" || l.letter === "rr") continue;
    assert.ok(l.example.includes(l.letter), `${l.letter} example "${l.example}" misses it`);
  }
});

test("the tricky ones are actually tricky", () => {
  const hint = (letter) => A.letters.find((l) => l.letter === letter).hint.toLowerCase();
  assert.match(hint("h"), /silent/);
  assert.match(hint("ñ"), /ny/);
  assert.match(hint("v"), /like b/);
  assert.match(hint("g"), /throaty/);
});
