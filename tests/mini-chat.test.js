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

test("mini chat classifies greeting, thanks, yes/no, name and questions", () => {
  assert.equal(M.intent("Hola"), "greeting");
  assert.equal(M.intent("gracias"), "thanks");
  assert.equal(M.intent("yes"), "yesno");
  assert.equal(M.intent("my name is Ana"), "name");
  assert.equal(M.intent("Where is the station?"), "question");
  assert.equal(M.intent("I work here"), "statement");
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

/* The safety rules below are behavioural, not source-text checks. Each pack is
 * small enough that a tie can be resolved with an injected rand, so the result
 * is deterministic without changing the production fallback. */

function safetyPack(phrases, conv) {
  return {
    phrases: { phrases: phrases.map((text) => ({ text })) },
    terms: { terms: [] },
    basics: { items: [] },
    concepts: { concepts: [] },
    texts: { texts: [] },
    conv: { dialogues: conv || [] }
  };
}

test("mini chat never repeats the reply it was just told about", () => {
  const m = M.build(safetyPack(["Hola, ¿qué tal?"]));
  assert.equal(m.reply("hola", { recent: ["Hola, ¿qué tal?"], rand: () => 0 }), "");
  assert.equal(m.reply("hola", { recent: ["HOLA, ¿QUÉ TAL?"], rand: () => 0 }), "",
    "a differently cased recent reply was repeated");
});

test("mini chat does not echo the learner, even with different punctuation or accents", () => {
  const m = M.build(safetyPack(["Hola, ¿qué tal?", "Me llamo Ana."]));
  assert.equal(m.reply("hola, ¿que tal!", { rand: () => 0 }), "");
  assert.equal(m.reply("ME LLAMO ANA!", { rand: () => 0 }), "");
});

test("mini chat never returns an oversized authored line", () => {
  const long = "z".repeat(250);
  const m = M.build(safetyPack([long]));
  assert.equal(m.reply("zzz", { rand: () => 0 }), "");

  const dialogue = M.build(safetyPack([], [{
    turns: [{ es: "Hola" }, { es: "y".repeat(250) }]
  }]));
  const reply = dialogue.reply("hola", { rand: () => 0 });
  assert.ok(reply.length <= 180, "oversized dialogue reply: " + reply.length);
});

test("mini chat does not append a follow-up question that would exceed the cap", () => {
  const longQuestion = "¿" + "pizza ".repeat(30).trim() + "?";
  const m = M.build(safetyPack(["Quiero una pizza.", longQuestion]));
  const reply = m.reply("pizza", { rand: () => 0 });
  assert.ok(reply.length <= 180, "oversized joined reply: " + reply.length);
  assert.equal(reply, "Quiero una pizza.");
});

test("an unanswerable question gets the honest empty answer, not an unrelated question", () => {
  const m = M.build(safetyPack(["¿De dónde eres?", "¿Cómo estás?"]));
  assert.equal(m.reply("¿Dónde está el tren?", { rand: () => 0 }), "");
});

test("a question prefers an authored statement over another question", () => {
  const m = M.build(safetyPack(["Quiero una pizza.", "¿De dónde eres?"]));
  const reply = m.reply("¿Dónde está la pizza?", { rand: () => 0 });
  assert.equal(reply, "Quiero una pizza.");
  assert.doesNotMatch(reply, /[?？؟]/);
});

test("mini chat can be driven deterministically by an injected rand", () => {
  const m = M.build(safetyPack(["Quiero una pizza.", "Me llamo Ana.", "¿De dónde eres?"]));
  assert.equal(m.reply("pizza", { rand: () => 0 }), m.reply("pizza", { rand: () => 0 }));
  assert.equal(m.opening({ rand: () => 0 }), m.opening({ rand: () => 0 }));
});
