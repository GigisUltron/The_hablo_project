const test = require("node:test");
const assert = require("node:assert/strict");
const W = require("../src/wordset.js");

const items = [
  { id: "casa", text: "casa", gloss: "house", sub: "Mi casa está cerca del mar.", kind: "word" },
  { id: "ph-mi-casa", text: "Mi casa", gloss: "my house", sub: "", kind: "phrase" },
  { id: "factura", text: "la factura", gloss: "invoice", sub: "", kind: "word" },
  { id: "t-aunque", text: "aunque", gloss: "although", sub: "", kind: "term" },
  { id: "b-soy", text: "soy", gloss: "I am", sub: "", kind: "basic" }
];

test("parseList accepts lines, commas, bullets and dedupes", () => {
  assert.deepEqual(W.parseList("invoice\n- deadline\n2. colleague, invoice"), [
    "invoice", "deadline", "colleague"
  ]);
  assert.deepEqual(W.parseList("factura，recibo、casa"), ["factura", "recibo", "casa"]);
  assert.deepEqual(W.parseList("  "), []);
  assert.equal(W.parseList(new Array(40).fill("word").join("\n")).length, 1);
  const many = new Array(40).fill(0).map((_, i) => "word" + i).join("\n");
  assert.equal(W.parseList(many).length, W.MAX_QUERIES);
});

test("fold is accent- and punctuation-insensitive without breaking other scripts", () => {
  assert.equal(W.fold("  Café! "), "cafe");
  assert.equal(W.fold("¿Dónde está?"), "donde esta");
  assert.equal(W.fold("你好，世界"), "你好 世界");
});

test("score prefers exact text and gloss, then whole words", () => {
  assert.equal(W.score("house", items[0]), 10);
  assert.equal(W.score("factura", items[2]), 8);
  assert.equal(W.score("factura", items[2]), 8);
  assert.equal(W.score("la factura", items[2]), 10);
  assert.ok(W.score("invoice", items[2]) >= 10);
  assert.ok(W.score("hous", items[0]) >= 3);
  assert.equal(W.score("spaceship", items[0]), 0);
  assert.ok(W.score("aunque", items[3]) >= 8);
});

test("match picks one item per query, never reusing an item", () => {
  const r = W.match(["house", "casa", "spaceship"], items);
  assert.equal(r.matched.length, 2);
  assert.deepEqual(r.missing, ["spaceship"]);
  assert.equal(r.matched[0].id, "casa");
  assert.equal(r.picks.length, 2);
  assert.equal(new Set(r.picks).size, 2);
  assert.notEqual(r.matched[1].id, "casa");
});

test("match prefers a concept over a phrase on an equal score", () => {
  const r = W.match(["house"], [
    { id: "ph-house", text: "la casa", gloss: "house", kind: "phrase" },
    { id: "house", text: "casa", gloss: "house", kind: "word" }
  ]);
  assert.deepEqual(r.picks, ["house"]);
});

test("build puts the requested words before due revision and respects the limit", () => {
  const r = W.build(["invoice", "although"], items, ["casa", "ph-mi-casa", "b-soy"], { limit: 4 });
  assert.deepEqual(r.ids, ["factura", "t-aunque", "casa", "ph-mi-casa"]);
  assert.equal(r.ids.length, 4);
  assert.equal(r.missing.length, 0);
});

test("build does not duplicate a matched item in the revision fill", () => {
  const r = W.build(["house"], items, ["casa", "b-soy"], { limit: 3 });
  assert.deepEqual(r.ids, ["casa", "b-soy"]);
});

test("a single latin letter is not a match, a single CJK character is", () => {
  assert.equal(W.score("a", items[0]), 0);
  assert.ok(W.score("你", { id: "zh-ni", text: "你好", gloss: "hello", kind: "word" }) > 0);
});
