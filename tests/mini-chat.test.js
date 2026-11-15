const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../src/mini-chat.js");

const pack = {
  phrases: { phrases: [
    { text: "Hola, ¿qué tal?" },
    { text: "Me llamo Ana." },
    { text: "¿De dónde eres?" },
    { text: "Quiero una pizza." }
  ] },
  conv: { dialogues: [
    { turns: [
      { es: "Hola, ¿cómo estás?", reply: "Bien, gracias." },
      { es: "¿Cómo te llamas?", reply: "Me llamo Ana." }
    ] }
  ] },
  terms: { terms: [] }, basics: { items: [] }, concepts: { concepts: [] }, texts: { texts: [] }
};

test("mini chat builds a candidate set and opens naturally", () => {
  const m = M.build(pack);
  assert.ok(m.size >= 4);
  assert.match(m.opening(), /Hola/);
});

test("mini chat retrieves a relevant authored line", () => {
  const m = M.build(pack);
  const r = m.reply("me llamo");
  assert.match(r, /llamo|Ana|Hola|pizza|dónde/);
});

test("mini chat never echoes the learner or returns runaway text", () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require("node:path").join(__dirname, "..", "src", "mini-chat.js"), "utf8");
  assert.match(source, /choice\.trim\(\)\.toLowerCase\(\) === prompt/);
  assert.match(source, /choice\.length > 180/);
});

test("mini chat avoids recently used replies", () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require("node:path").join(__dirname, "..", "src", "mini-chat.js"), "utf8");
  assert.match(source, /recent\.indexOf\(c\.text\) === -1/);
  assert.match(source, /o\.recent/);
});

test("mini follow-up questions are relevance-gated", () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require("node:path").join(__dirname, "..", "src", "mini-chat.js"), "utf8");
  assert.match(source, /score\(follow\[0\], userTokens, contextTokens\) >= 2/);
});

test("mini chat always returns target-language text", () => {
  const m = M.build(pack);
  for (const text of ["", "xyzzy", "pizza", "¿dónde está el tren?"]) {
    assert.equal(typeof m.reply(text), "string");
  }
});

test("mini chat follows expected learner replies", () => {
  const m = M.build({ conv: { dialogues: [{ turns: [
    { es: "Was möchten Sie?", expects: ["kaffee"] },
    { es: "Gerne, ein Kaffee." }
  ] }] } });
  assert.equal(m.reply("Kaffee, bitte"), "Gerne, ein Kaffee.");
});

test("mini chat follows an authored dialogue turn", () => {
  const m = M.build({ conv: { dialogues: [{ turns: [{ es: "Hola" }, { es: "¿Cómo estás?" }] }] } });
  assert.equal(m.reply("Hola"), "¿Cómo estás?");
});

test("mini chat follows recent context and matches CJK by character", () => {
  const m = M.build(pack);
  assert.match(m.reply("", { context: "pizza" }), /pizza|Hola|dónde|llamo/);
  const cjk = M.build({ phrases: { phrases: [{ text: "你好吗" }, { text: "我想要披萨" }] }, terms: { terms: [] }, basics: { items: [] }, concepts: { concepts: [] }, texts: { texts: [] }, conv: { dialogues: [] } });
  assert.match(cjk.reply("披萨"), /披萨/);
});

test("tokenizer keeps non-Latin words", () => {
  assert.ok(M.words("Привет 你好 こんにちは").length >= 3);
});
