/* Integrity checks on the concept dataset. Catches the kind of typo that would
 * otherwise only show up as a blank tile in the browser.
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/data.js");

test("every concept has the fields the UI reads", () => {
  for (const c of D.concepts) {
    assert.ok(c.id, "missing id");
    assert.ok(c.emoji, `${c.id} missing emoji`);
    assert.ok(c.word, `${c.id} missing word`);
    assert.ok(typeof c.article === "string", `${c.id} article must be a string`);
    assert.ok(["el", "la", ""].includes(c.article), `${c.id} has article "${c.article}"`);
    assert.ok(D.categories[c.cat], `${c.id} has unknown category "${c.cat}"`);
    assert.ok(c.sentence && c.sentence.length > 3, `${c.id} sentence too short`);
    assert.ok(/[.!?]$/.test(c.sentence), `${c.id} sentence should end in punctuation`);
  }
});

test("ids are unique", () => {
  const ids = D.concepts.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("emoji anchors are unique (a picture must mean one thing)", () => {
  const emoji = D.concepts.map((c) => c.emoji);
  const dupes = emoji.filter((e, i) => emoji.indexOf(e) !== i);
  assert.deepEqual(dupes, [], `duplicate emoji: ${dupes.join(", ")}`);
});

test("every edge points at a real concept", () => {
  const ids = new Set(D.concepts.map((c) => c.id));
  for (const e of D.edges) {
    assert.ok(ids.has(e.a), `edge endpoint "${e.a}" is not a concept`);
    assert.ok(ids.has(e.b), `edge endpoint "${e.b}" is not a concept`);
    assert.ok(D.relationTypes[e.type], `unknown relation type "${e.type}"`);
    assert.notEqual(e.a, e.b, "self-edge");
  }
});

test("no duplicate edges (either direction)", () => {
  const seen = new Set();
  for (const e of D.edges) {
    const key = [e.a, e.b].sort().join("|");
    assert.ok(!seen.has(key), `duplicate edge ${key}`);
    seen.add(key);
  }
});

test("every concept has at least one relation", () => {
  const linked = new Set();
  for (const e of D.edges) {
    linked.add(e.a);
    linked.add(e.b);
  }
  const orphans = D.concepts.filter((c) => !linked.has(c.id)).map((c) => c.id);
  assert.deepEqual(orphans, [], `unlinked concepts: ${orphans.join(", ")}`);
});

test("the dataset is large enough for four-option drills", () => {
  assert.ok(D.concepts.length >= 8);
  assert.ok(D.categories);
});
