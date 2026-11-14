/* Integrity checks for the phrase deck, and for the audio that covers both
 * decks. The phrase contract is the same as the concept contract:
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const D = require("../src/data.js");
const P = require("../src/phrases.js");

const root = path.join(__dirname, "..");

test("every phrase has the fields the drill reads", () => {
  for (const p of P.phrases) {
    assert.ok(p.id, "missing id");
    assert.ok(p.emoji, `${p.id} missing emoji`);
    assert.ok(p.text && p.text.length > 2, `${p.id} missing text`);
    assert.ok(/[.!?]$/.test(p.text), `${p.id} should end a sentence`);
  }
});

test("phrase ids are prefixed and unique", () => {
  const ids = P.phrases.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate phrase id");
  for (const id of ids) assert.match(id, /^ph-[a-z0-9-]+$/, `bad id: ${id}`);
});

test("scene emoji are unique within the deck", () => {
  const emoji = P.phrases.map((p) => p.emoji);
  const dupes = emoji.filter((e, i) => emoji.indexOf(e) !== i);
  assert.deepEqual(dupes, [], `duplicate emoji: ${dupes.join(", ")}`);
});

test("phrase ids never collide with concept ids", () => {
  const concepts = new Set(D.concepts.map((c) => c.id));
  for (const p of P.phrases) assert.equal(concepts.has(p.id), false, `collision: ${p.id}`);
});

test("the audio manifest covers every concept and every phrase", () => {
  const manifestPath = path.join(root, "assets", "audio", "manifest.js");
  const src = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(src.slice(src.indexOf("=") + 1).trim().replace(/;$/, ""));

  const ids = [...D.concepts.map((c) => c.id), ...P.phrases.map((p) => p.id)];
  const missing = ids.filter((id) => !manifest[id]);
  assert.deepEqual(missing, [], `no audio for: ${missing.join(", ")}`);
});

test("phrase audio is longer than a single word", () => {
  // A phrase file that is the same size as a word file means the generator
  // picked up the wrong field.
  const src = fs.readFileSync(path.join(root, "assets", "audio", "manifest.js"), "utf8");
  const manifest = JSON.parse(src.slice(src.indexOf("=") + 1).trim().replace(/;$/, ""));
  const sizes = P.phrases.map((p) => fs.statSync(path.join(root, manifest[p.id])).size);
  const smallest = Math.min(...sizes);
  assert.ok(smallest > 15000, `shortest phrase audio is only ${smallest} bytes`);
});
