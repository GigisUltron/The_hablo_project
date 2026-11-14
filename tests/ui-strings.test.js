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
