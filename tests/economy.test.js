const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../src/economy.js");

test("themes are one free default and two earned looks", () => {
  assert.equal(E.THEMES[0].id, "ember");
  assert.equal(E.THEMES[0].cost, 0);
  assert.equal(E.theme("plum").cost, 60);
  assert.equal(E.theme("moss").cost, 120);
  assert.equal(E.theme("nope").id, "ember");
});

test("coins cannot buy the free theme or what it cannot afford", () => {
  assert.equal(E.canBuy(0, "ember"), false);
  assert.equal(E.canBuy(59, "plum"), false);
  assert.equal(E.canBuy(60, "plum"), true);
  assert.equal(E.canBuy(119, "moss"), false);
  assert.equal(E.canBuy(120, "moss"), true);
  assert.equal(E.canBuy(999, "missing"), false);
});

test("a session pays for first-try answers and a clean sheet", () => {
  assert.equal(E.sessionCoins(0, false), 2);
  assert.equal(E.sessionCoins(8, false), 10);
  assert.equal(E.sessionCoins(10, true), 15);
  assert.equal(E.sessionCoins(-4, false), 2);
  assert.equal(E.sessionCoins("7", true), 12);
});

test("vocabulary expansion pays less than a full lesson", () => {
  assert.equal(E.vocabCoins(0), 1);
  assert.equal(E.vocabCoins(6), 7);
  assert.equal(E.vocabCoins(-1), 1);
});

test("the daily goal has a fixed, small award", () => {
  assert.equal(E.dailyGoalCoins(), 5);
});
