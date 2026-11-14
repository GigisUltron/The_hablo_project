const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../src/lang/es/levels.js");
const B = require("../src/lang/es/basics.js").items;
const C = require("../src/lang/es/concepts.js").concepts;
const P = require("../src/lang/es/phrases.js").phrases;
const T = require("../src/lang/es/terms.js").terms;

test("every item in the spanish deck has a level", () => {
  const all = [].concat(B, C, P, T).map((x) => x.id);
  const missing = all.filter((id) => !L[id]);
  assert.deepEqual(missing, [], "no level for: " + missing.join(", "));
});

test("levels are valid CEFR bands", () => {
  for (const [id, lv] of Object.entries(L)) assert.ok(["A1", "A2", "B1", "B2"].includes(lv), id);
});

test("grammar and concrete nouns come before phrases", () => {
  for (const b of B) assert.equal(L[b.id], "A1", b.id);
  assert.ok(P.slice(10).every((p) => L[p.id] === "A2"));
  assert.ok(T.every((t) => L[t.id] === "B1"));
});
