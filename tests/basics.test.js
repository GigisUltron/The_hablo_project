const test = require("node:test");
const assert = require("node:assert/strict");
const B = require("../src/lang/es/basics.js");

test("every item is complete and typed", () => {
  for (const b of B.items) {
    assert.match(b.id, /^b-[a-z]+$/);
    assert.ok(b.text && b.text.length > 1, b.id);
    assert.ok(b.gloss && b.gloss.length > 0, b.id);
    assert.ok(["pronoun", "verb"].includes(b.kind), b.id);
    assert.ok(["1s", "2s", "3s", "1p", "3p"].includes(b.person), b.id);
  }
});

test("ids and texts are unique", () => {
  assert.equal(new Set(B.items.map((i) => i.id)).size, B.items.length);
  assert.equal(new Set(B.items.map((i) => i.text)).size, B.items.length);
});

test("ser and estar are complete for the persons taught", () => {
  for (const row of B.rows) {
    assert.equal(row.forms.length, 5, row.verb);
    const verbs = B.items.filter((i) => i.of === row.verb).map((i) => i.text);
    assert.deepEqual(verbs.sort(), row.forms.slice().sort(), row.verb);
  }
});

test("no pronouns or forms collide with the phrase deck", () => {
  const P = require("../src/lang/es/phrases.js").phrases.map((p) => p.text.toLowerCase());
  for (const b of B.items) assert.equal(P.includes(b.text.toLowerCase()), false, b.text);
});

test("every pack's grammar layer is shaped like a usable lesson", () => {
  const L = require("../src/lang/index.js");
  for (const meta of L.list()) {
    const items = L.load(meta.code).basics.items || [];
    assert.ok(items.length > 0, meta.code + " has no grammar items");
    for (const b of items) {
      assert.ok(b.id && b.text && b.kind, meta.code + ": incomplete basic " + b.id);
      if (b.kind === "pronoun") assert.ok(b.person, meta.code + ": pronoun without person " + b.id);
      if (b.kind === "verb") assert.ok(b.of, meta.code + ": verb without lemma " + b.id);
    }
  }
});

test("french has the same grammar layer as spanish", () => {
  const F = require("../src/lang/fr/basics.js");
  const S = require("../src/lang/es/basics.js");
  assert.equal(F.items.length, S.items.length);
  for (const f of F.items) {
    assert.ok(f.id && f.text && f.gloss && f.kind && f.person, f.id);
    if (f.kind === "verb") assert.ok(["être", "avoir"].includes(f.of), f.id);
  }
  for (const row of F.rows) assert.equal(F.items.filter((i) => i.of === row.verb).length, 5, row.verb);
});
