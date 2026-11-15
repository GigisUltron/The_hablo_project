const test = require("node:test");
const assert = require("node:assert/strict");
const B = require("../src/backup.js");

const state = { profile: { lang: "es", level: "A2", byLang: {} }, cards: { casa: { reps: 2 } }, xp: 10 };

test("a backup wraps the local state with a format and version", () => {
  const out = B.exportState(state, Date.UTC(2026, 10, 15));
  assert.equal(out.format, "hablo-backup");
  assert.equal(out.version, 1);
  assert.equal(out.exportedAt, "2026-11-15T00:00:00.000Z");
  assert.deepEqual(out.state, state);
  assert.equal(B.filename(Date.UTC(2026, 10, 15)), "hablo-backup-2026-11-15.json");
});

test("a backup cannot be imported without the required structure", () => {
  assert.equal(B.parse("{").ok, false);
  assert.equal(B.parse("{}").ok, false);
  assert.equal(B.parse(JSON.stringify({ format: "hablo-backup", version: 2, state })).ok, false);
  assert.equal(B.parse(JSON.stringify({ format: "hablo-backup", version: 1, state: {} })).ok, false);
  assert.equal(B.parse(JSON.stringify({ format: "hablo-backup", version: 1,
    state: { profile: {}, cards: [] } })).ok, false);
});

test("a valid backup round-trips", () => {
  const text = JSON.stringify(B.exportState(state));
  const parsed = B.parse(text);
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.state, state);
});
