const test = require("node:test");
const assert = require("node:assert/strict");
const U = require("../src/ui-strings.js");
const X = require("../src/ui-extra.js");

test("every locale has every key", () => {
  const keys = Object.keys(U.en).filter((k) => k !== "t");
  for (const lang of Object.keys(U).filter((k) => k !== "t")) {
    const missing = keys.filter((k) => !U[lang][k]);
    assert.deepEqual(missing, [], `${lang} missing: ${missing.join(", ")}`);
  }
});

test("no string is left in english inside the spanish table", () => {
  for (const k of Object.keys(U.es)) {
    assert.notEqual(U.es[k], U.en[k], k);
  }
});

test("an unknown language falls back to english, not to a blank", () => {
  assert.equal(U.t("xx", "start"), U.en.start);
  assert.equal(U.t("es", "start"), U.es.start);
  assert.equal(U.t("es", "nonexistent"), "nonexistent");
});

test("the session prompt and correction use the table, not literals", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.equal(app.includes('<p class="prompt">Which one is this?</p>'), false,
    "the prompt is still a literal");
  assert.match(app, /tr\("whichOne"/);
  assert.match(app, /tr\("notQuite"/);
});

test("the extra interface table has every key in every locale", () => {
  const keys = Object.keys(X.en);
  assert.ok(keys.length >= 30, "the extra table is too thin");
  for (const lang of Object.keys(X)) {
    const missing = keys.filter((k) => !X[lang][k]);
    assert.deepEqual(missing, [], `${lang} missing extra: ${missing.join(", ")}`);
  }
});

test("translation only moves forward", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const calls = (app.match(/\btr\(/g) || []).length;
  assert.ok(calls >= 3, `app.js makes ${calls} tr() calls; it once made 3 - did one revert?`);
});
