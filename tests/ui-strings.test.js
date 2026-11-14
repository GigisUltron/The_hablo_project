const test = require("node:test");
const assert = require("node:assert/strict");
const U = require("../src/ui-strings.js");

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
  assert.equal(U.t("de", "start"), U.en.start);
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
