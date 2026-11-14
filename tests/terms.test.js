/* Terms are the vocabulary a picture cannot carry. The integrity that matters
 * is that each one is anchored *somehow* — a schema, a frame with a slot, and
 * ideally an opposite to trade against.
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../src/terms.js");
const G = require("../src/glosses.js");

const SCHEMAS = ["clock", "repeat", "left", "right", "fork", "balance", "parallel", "question", "plus", "chain"];

test("every term has text, a gloss and a known schema", () => {
  for (const t of T.terms) {
    assert.ok(t.id && /^t-[a-z-]+$/.test(t.id), `bad id: ${t.id}`);
    assert.ok(t.text && t.text.length > 1, `${t.id} missing text`);
    assert.ok(G[t.id], `${t.id} missing gloss`);
    assert.ok(SCHEMAS.includes(t.schema), `${t.id} uses unknown schema "${t.schema}"`);
  }
});

test("every frame contains exactly one slot", () => {
  for (const t of T.terms) {
    const slots = (t.frame.match(/____/g) || []).length;
    assert.equal(slots, 1, `${t.id} has ${slots} slots`);
  }
});

test("the frame reads as Spanish without the term", () => {
  for (const t of T.terms) {
    const filled = t.frame.replace("____", t.text);
    assert.ok(filled.length > 12, `${t.id} frame too short`);
    assert.match(filled, /[.?!]$/, `${t.id} frame should end a sentence`);
  }
});

test("contrasts are symmetric where they exist", () => {
  const byId = Object.fromEntries(T.terms.map((t) => [t.id, t]));
  for (const t of T.terms) {
    if (!t.contrast) continue;
    const other = byId[t.contrast];
    assert.ok(other, `${t.id} points at unknown contrast ${t.contrast}`);
    assert.notEqual(other.id, t.id, `${t.id} contrasts with itself`);
  }
});

test("ids are unique and do not collide with other decks", () => {
  const ids = T.terms.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
  const D = require("../src/data.js");
  const P = require("../src/phrases.js");
  const others = new Set([...D.concepts.map((c) => c.id), ...P.phrases.map((p) => p.id)]);
  for (const id of ids) assert.equal(others.has(id), false, `collision: ${id}`);
});
