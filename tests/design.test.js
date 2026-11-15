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

function ruleBody(selector) {
  const at = css.indexOf(selector + " {");
  assert.notEqual(at, -1, "missing rule: " + selector);
  return css.slice(at, css.indexOf("}", at));
}

test("keyboard focus is visible on the session's text field", () => {
  assert.match(css, /:focus-visible \{[^}]*outline: 2px solid var\(--accent\)/,
    "the global keyboard ring disappeared");
  const input = ruleBody(".type-input:focus, .type-input:focus-visible");
  assert.doesNotMatch(input, /outline:\s*none/, "the text field suppresses its focus ring");
  assert.match(input, /border-color: var\(--accent\)/, "the text field has no focus state");
});

test("session controls keep 44px thumb targets", () => {
  const icon = ruleBody(".icon-btn");
  assert.match(icon, /width: 44px;/, "the back/quit buttons are too narrow");
  assert.match(icon, /height: 44px;/, "the back/quit buttons are too short");
  assert.match(ruleBody(".card .option-word"), /min-height: 52px;/, "answer rows are too short");
  assert.match(ruleBody(".token"), /min-height: 44px;/, "sentence tokens are too short");
  assert.match(ruleBody(".match-btn"), /min-height: 54px;/, "match buttons are too short");
  assert.match(ruleBody(".speak-btn, .mic"), /min-height: 44px;/, "the audio control is under 44px");
});

test("reduced motion removes every session animation", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?animation-duration: 0\.001ms !important;/,
    "there is no global reduced-motion cut");
  assert.match(css, /\.pick-correct, \.pick-wrong, \.feedback\.good, \.feedback\.bad \{ animation: none; \}/,
    "answer feedback still animates under reduced motion");
});

test("the Progress path uses a grid on a wide screen", () => {
  assert.match(css, /@media \(min-width: 760px\) \{[\s\S]{0,220}\.progress-path \{[\s\S]{0,120}display: grid/,
    "the path still scrolls sideways on a desktop");
});
