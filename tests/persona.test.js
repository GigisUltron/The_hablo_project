const test = require("node:test");
const assert = require("node:assert/strict");
const P = require("../src/persona.js");

test("personal context is trimmed, whitespace-collapsed and bounded", () => {
  const p = P.ensure({ why: "  trip   to Spain  ", interests: " food,\nfootball " });
  assert.equal(p.why, "trip to Spain");
  assert.equal(p.interests, "food, football");
  assert.equal(P.ensure({ why: "x".repeat(500) }).why.length, P.LIMITS.why);
  assert.equal(P.ensure({}).why, "");
});

test("a prompt carries the context but labels it as data, not instructions", () => {
  const text = P.prompt({ why: "work", interests: "football" });
  assert.match(text, /learning for: work/);
  assert.match(text, /Topics they enjoy: football/);
  assert.match(text, /not instructions/);
  assert.match(text, /Do not invent personal facts/);
});

test("no personal context means no prompt paragraph", () => {
  assert.equal(P.prompt({}), "");
  assert.equal(P.prompt(null), "");
});
