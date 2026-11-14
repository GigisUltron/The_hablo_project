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

test("hardcoded colours and radii only decrease", () => {
  const body = css.replace(/:root\s*\{[^}]*\}/, "");
  const hex = new Set([...body.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()));
  const radii = new Set([...body.matchAll(/border-radius:\s*([^;]+)/g)].map((m) => m[1].trim()));
  // ceilings measured today; they may fall, never rise
  assert.ok(hex.size <= 21, `raw hex colours: ${hex.size} (ceiling 21)`);
  assert.ok(radii.size <= 9, `distinct radii: ${radii.size} (ceiling 9)`);
});
