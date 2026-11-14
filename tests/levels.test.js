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

test("every band a learner can reach has enough material to be a lesson", () => {
  const counts = {};
  for (const lv of Object.values(L)) counts[lv] = (counts[lv] || 0) + 1;
  assert.ok(counts.A1 >= 60, `A1 has ${counts.A1} items, a lesson needs 60+`);
  assert.ok(counts.A2 >= 40, `A2 has ${counts.A2} items`);
  assert.ok(counts.B1 >= 12, `B1 has ${counts.B1} items`);
});

test("every graded item is voiced", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const file = path.join(__dirname, "..", "assets", "audio", "manifest.js");
  const src = fs.readFileSync(file, "utf8");
  const audio = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  const silent = Object.keys(L).filter((id) => !audio[id]);
  assert.deepEqual(silent, [], "no audio for: " + silent.join(", "));
});
