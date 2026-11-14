/* Every teachable item must have an English gloss, or the "show translation"
 * control silently disappears for that card.
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const D = require("../src/data.js");
const P = require("../src/phrases.js");
const G = require("../src/glosses.js");

test("every concept has a gloss", () => {
  const missing = D.concepts.filter((c) => !G[c.id]).map((c) => c.id);
  assert.deepEqual(missing, [], `no gloss for: ${missing.join(", ")}`);
});

test("every phrase has a gloss", () => {
  const missing = P.phrases.filter((p) => !G[p.id]).map((p) => p.id);
  assert.deepEqual(missing, [], `no gloss for: ${missing.join(", ")}`);
});

test("glosses are non-empty english-ish text", () => {
  for (const [id, value] of Object.entries(G)) {
    assert.equal(typeof value, "string", `${id} is not a string`);
    assert.ok(value.trim().length >= 2, `${id} gloss too short`);
  }
});

test("no gloss is identical to its source text", () => {
  // A copy-paste that leaves Spanish in the gloss field would make the reveal
  // button useless.
  const byId = {};
  D.concepts.forEach((c) => { byId[c.id] = (c.article ? c.article + " " : "") + c.word; });
  P.phrases.forEach((p) => { byId[p.id] = p.text; });
  for (const id of Object.keys(byId)) {
    assert.notEqual(G[id], byId[id], `${id} gloss is the Spanish text`);
  }
});

test("the gloss file is not loaded by the drill data path", () => {
  // The drill must never read glosses implicitly; only the reveal button does.
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const uses = (app.match(/SEMA_GLOSSES/g) || []).length;
  // The interface may show no translation at all; it must never read more than a reveal control would.
  assert.ok(uses <= 2, "SEMA_GLOSSES should appear at most in a reveal control");
});
