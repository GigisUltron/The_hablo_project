const test = require("node:test");
const assert = require("node:assert/strict");
const A = require("../src/ai-tools.js");

test("model output is parsed from lines, commas, bullets and numbers", () => {
  assert.deepEqual(A.parseList("la cocina\n- la receta\n3. el horno, la nevera"), [
    "la cocina", "la receta", "el horno", "la nevera"
  ]);
  assert.deepEqual(A.parseList("«la sal»\n“el aceite”"), ["la sal", "el aceite"]);
  assert.deepEqual(A.parseList("  item  "), ["item"]);
  assert.deepEqual(A.parseList(""), []);
});

test("reading parsing removes markdown and splits title from body", () => {
  const r = A.parseReading("# El café\n\n**Hoy** fui al café. Pedí un café con leche.\n\nFue un buen día.");
  assert.equal(r.title, "El café");
  assert.match(r.body, /Hoy fui al café/);
  assert.equal(A.parseReading("Hola"), null);
  assert.equal(A.parseReading("Title\nshort"), null);
  assert.equal(A.parseReading(""), null);
});

test("model output is deduped and capped", () => {
  assert.deepEqual(A.parseList("casa\nCasa\ncasa"), ["casa"]);
  const many = new Array(40).fill(0).map((_, i) => "w" + i).join("\n");
  assert.equal(A.parseList(many, 5).length, 5);
  assert.equal(A.parseList(many).length, 12);
});

test("prompts name the area and demand plain lines", () => {
  assert.match(A.wordsPrompt("French", "cooking"), /cooking/);
  assert.match(A.wordsPrompt("French", "cooking"), /one per line/i);
  assert.match(A.systemWords("French"), /French/);
  assert.match(A.keywordsPrompt("dinner out, I want pizza"), /pizza/);
  assert.match(A.systemKeywords(), /keywords/i);
});
