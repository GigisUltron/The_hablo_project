const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "src", "lang");
const codes = fs.readdirSync(root).filter((f) => fs.statSync(path.join(root, f)).isDirectory());
const REQUIRED = ["concepts.js", "phrases.js", "terms.js", "basics.js", "glosses.js", "levels.js", "audio.js"];

test("every pack has the parts the app reads", () => {
  assert.ok(codes.length >= 2, "expected at least two packs");
  for (const code of codes) {
    const have = fs.readdirSync(path.join(root, code));
    const missing = REQUIRED.filter((f) => !have.includes(f));
    assert.deepEqual(missing, [], `${code} is missing: ${missing.join(", ")}`);
  }
});

test("every pack grades every item it ships", () => {
  for (const code of codes) {
    const dir = path.join(root, code);
    const levels = require(path.join(dir, "levels.js"));
    for (const f of ["concepts.js", "phrases.js", "terms.js", "basics.js"]) {
      const part = require(path.join(dir, f));
      const items = part.items || part.concepts || part.phrases || part.terms || [];
      const ungraded = items.filter((i) => !levels[i.id]).map((i) => i.id);
      assert.deepEqual(ungraded, [], `${code}/${f} ungraded: ${ungraded.slice(0, 5).join(", ")}`);
    }
  }
});

test("a pack has enough material to be a course, not a sample", () => {
  const floors = { concepts: 40, phrases: 60, terms: 20, basics: 16, texts: 1 };
  for (const code of codes) {
    const dir = path.join(root, code);
    const counts = {
      concepts: (require(path.join(dir, "concepts.js")).concepts || []).length,
      phrases: (require(path.join(dir, "phrases.js")).phrases || []).length,
      terms: (require(path.join(dir, "terms.js")).terms || []).length,
      basics: (require(path.join(dir, "basics.js")).items || []).length,
      texts: (require(path.join(dir, "texts.js")).texts || []).length
    };
    for (const [part, floor] of Object.entries(floors)) {
      assert.ok(counts[part] >= floor, `${code}: ${part} has ${counts[part]}, floor ${floor}`);
    }
  }
});
