const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const ADDED = {
  es: ["decisión", "propósito", "desafío", "logro", "riesgo"],
  fr: ["décision", "but", "défi", "réussite", "risque"],
  en: ["en-decision", "en-purpose", "en-challenge", "en-achievement", "en-risk"],
  it: ["it-decisione", "it-scopo", "it-sfida", "it-risultato", "it-rischio"],
  ru: ["ru-reshenie", "ru-tsel", "ru-vyzov", "ru-dostizhenie", "ru-risk"]
};
const BANDS = ["B1", "B2", "C1"];

test("every pack carries an advanced abstract vocabulary layer", () => {
  for (const code of Object.keys(ADDED)) {
    const dir = path.join(__dirname, "..", "src", "lang", code);
    const D = require(path.join(dir, "concepts.js"));
    const levels = require(path.join(dir, "levels.js"));
    const glosses = require(path.join(dir, "glosses.js"));
    const byId = new Map(D.concepts.map((c) => [c.id, c]));
    for (const id of ADDED[code]) {
      const c = byId.get(id);
      assert.ok(c, `${code}/${id}: missing`);
      assert.ok(BANDS.includes(levels[id]), `${code}/${id}: not advanced`);
      assert.ok(c.sentence && c.sentence.length > 8, `${code}/${id}: no sentence`);
      assert.ok(glosses[id], `${code}/${id}: no English gloss`);
      assert.ok(c.synonyms && c.synonyms.length, `${code}/${id}: no synonym task`);
      assert.ok(!/[A-Za-z]/.test(c.word) || ["en", "fr", "it", "es", "pt", "de", "nl", "tr"].includes(code),
        `${code}/${id}: Latin word in a non-Latin pack`);
    }
  }
});
