const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "assets", "styles.css"), "utf8");
const rootBlock = css.slice(css.indexOf(":root"), css.indexOf("}", css.indexOf(":root")));
const defined = new Set([...rootBlock.matchAll(/--([a-z0-9-]+)\s*:/g)].map((m) => m[1]));

test("every custom property used is defined in :root", () => {
  const used = new Set([...css.matchAll(/var\(--([a-z0-9-]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((v) => !defined.has(v));
  assert.deepEqual(missing, [], "undefined tokens: " + missing.join(", "));
});

test("no styles reference the retired poster skin", () => {
  const legacy = ["--paper", "--ink", "--chili", "--paprika", "--saffron", "--plum",
                  "--ink-faint", "--ink-soft"];
  const hits = legacy.filter((t) => css.includes("var(" + t + ")"));
  assert.deepEqual(hits, [], "legacy tokens still used: " + hits.join(", "));
});

test("the dark theme never derives its palette from itself", () => {
  const start = css.indexOf("@media (prefers-color-scheme: dark)");
  assert.notEqual(start, -1, "no dark theme");
  const end = css.indexOf("color-scheme: dark", start);
  const dark = css.slice(start, end);
  assert.equal(/var\(--/.test(dark), false,
    "dark tokens must be literal values; a var() reference can form a cycle");
});

test("hardcoded colours and radii only decrease", () => {
  const body = css.replace(/:root\s*\{[^}]*\}/g, "");
  const hex = new Set([...body.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()));
  const radii = new Set([...body.matchAll(/border-radius:\s*([^;]+)/g)].map((m) => m[1].trim()));
  // ceilings measured today; they may fall, never rise
  assert.equal(hex.size, 0, `raw hex colours: ${hex.size} - use a token`);
  assert.ok(radii.size <= 9, `distinct radii: ${radii.size} (ceiling 9)`);
});
