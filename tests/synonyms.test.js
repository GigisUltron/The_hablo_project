const test = require("node:test");
const assert = require("node:assert/strict");
const S = require("../src/synonyms.js");

test("synonyms come from the item and are deduped", () => {
  assert.deepEqual(S.forItem({ synonyms: ["hogar", " hogar ", "", "casa"] }), ["hogar", "casa"]);
  assert.deepEqual(S.forItem({}), []);
  assert.deepEqual(S.forItem({ synonyms: "hogar" }), []);
});

test("the synonym question contains the correct word and three distractors", () => {
  const options = S.options("hogar", ["casa", "perro", "gato", "sol", "hogar"], 4, () => 0.4);
  assert.equal(options.length, 4);
  assert.ok(options.includes("hogar"));
  assert.equal(new Set(options).size, 4);
  assert.equal(options.filter((x) => x === "hogar").length, 1);
});

test("the authored packs only ship non-empty, non-self synonyms", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const root = path.join(__dirname, "..", "src", "lang");
  const codes = fs.readdirSync(root).filter((code) => fs.statSync(path.join(root, code)).isDirectory());
  for (const code of codes) {
    const D = require(`../src/lang/${code}/concepts.js`);
    for (const c of D.concepts) {
      const list = S.forItem(c);
      assert.equal(new Set(list).size, list.length, `${code}/${c.id} duplicate synonym`);
      for (const word of list) {
        assert.ok(word.trim().length > 0, `${code}/${c.id} empty synonym`);
        assert.notEqual(word.trim().toLowerCase(), c.word.toLowerCase(), `${code}/${c.id} synonym is the word`);
      }
    }
  }
});
