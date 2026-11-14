const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "src", "lang");
const codes = fs.readdirSync(root).filter((f) => fs.statSync(path.join(root, f)).isDirectory());
const REQUIRED = ["concepts.js", "phrases.js", "terms.js", "basics.js", "glosses.js", "levels.js", "audio.js", "conv.js", "texts.js"];
const BANDS = ["A1", "A2", "B1", "B2", "C1"];

/* Spanish and French are the original full courses; Italian is the third
 * flagship. Every other pack must clear the starter floor: enough to be a
 * short course, not a sample. */
const FLOORS = {
  es: { concepts: 40, phrases: 120, terms: 20, basics: 16, texts: 1 },
  fr: { concepts: 40, phrases: 120, terms: 20, basics: 16, texts: 1 },
  it: { concepts: 20, phrases: 120, terms: 20, basics: 16, texts: 1 },
  starter: { concepts: 20, phrases: 30, terms: 8, basics: 8, texts: 1 }
};
const FLAGSHIP = new Set(["es", "fr", "it"]);

/* eSpeak-ng has no voice named "zh"; its Mandarin voice is "cmn", which this
 * pack's ids do not use. A silent pack is honest; a missing manifest is not. */
const NO_AUDIO = new Set(["zh"]);

function packItems(dir) {
  const concepts = require(path.join(dir, "concepts.js")).concepts || [];
  const phrases = require(path.join(dir, "phrases.js")).phrases || [];
  const terms = require(path.join(dir, "terms.js")).terms || [];
  const basics = require(path.join(dir, "basics.js")).items || [];
  return [].concat(concepts, phrases, terms, basics);
}

function manifestFor(code) {
  const file = code === "es"
    ? path.join(__dirname, "..", "assets", "audio", "manifest.js")
    : path.join(__dirname, "..", "assets", "audio", code, "manifest.js");
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf8");
  return JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
}

test("every pack has the parts the app reads", () => {
  assert.ok(codes.length >= 12, `expected at least twelve packs, found ${codes.length}`);
  for (const code of codes) {
    const have = fs.readdirSync(path.join(root, code));
    const missing = REQUIRED.filter((f) => !have.includes(f));
    assert.deepEqual(missing, [], `${code} is missing: ${missing.join(", ")}`);
  }
});

test("every pack grades every item it ships", () => {
  for (const code of codes) {
    const dir = path.join(root, code);
    const levels = require(path.join(dir, "levels.js"));
    for (const item of packItems(dir)) {
      assert.ok(item.id, `${code}: item without id`);
      assert.ok(BANDS.includes(levels[item.id]), `${code}: ${item.id} has level ${levels[item.id]}`);
    }
  }
});

test("every item has an English gloss", () => {
  for (const code of codes) {
    const dir = path.join(root, code);
    const glosses = require(path.join(dir, "glosses.js"));
    for (const item of packItems(dir)) {
      assert.equal(typeof glosses[item.id], "string", `${code}: ${item.id} has no gloss`);
      assert.ok(glosses[item.id].trim().length >= 1, `${code}: ${item.id} gloss too short`);
    }
  }
});

test("a pack has enough material to be a course, not a sample", () => {
  for (const code of codes) {
    const dir = path.join(root, code);
    const counts = {
      concepts: (require(path.join(dir, "concepts.js")).concepts || []).length,
      phrases: (require(path.join(dir, "phrases.js")).phrases || []).length,
      terms: (require(path.join(dir, "terms.js")).terms || []).length,
      basics: (require(path.join(dir, "basics.js")).items || []).length,
      texts: (require(path.join(dir, "texts.js")).texts || []).length
    };
    const floor = FLOORS[code] || FLOORS.starter;
    for (const [part, min] of Object.entries(floor)) {
      assert.ok(counts[part] >= min, `${code}: ${part} has ${counts[part]}, floor ${min}`);
    }
  }
});

test("the flagship decks reach thirty situations, not a list", () => {
  for (const code of FLAGSHIP) {
    const phrases = require(path.join(root, code, "phrases.js")).phrases || [];
    assert.ok(phrases.length >= 120, `${code}: only ${phrases.length} phrases`);
    const topics = new Set(phrases.map((p) => p.topic));
    assert.ok(topics.size >= 30, `${code}: only ${topics.size} situations`);
    const ungrouped = phrases.filter((p) => !p.topic).map((p) => p.id);
    assert.deepEqual(ungrouped, [], `${code}: phrases without a situation: ${ungrouped.slice(0, 5).join(", ")}`);
    const levels = require(path.join(root, code, "levels.js"));
    assert.ok(phrases.some((p) => levels[p.id] === "C1"), `${code}: no C1 phrase`);
  }
});

test("every pack reads a text and can answer two questions about it", () => {
  for (const code of codes) {
    const texts = require(path.join(root, code, "texts.js")).texts || [];
    assert.ok(texts.length >= 1, `${code} has no text`);
    for (const text of texts) {
      assert.ok(text.id && text.title && text.body, `${code}: incomplete text`);
      assert.ok(text.questions.length >= 2, `${code}/${text.id}: only ${text.questions.length} questions`);
      for (const q of text.questions) {
        assert.match(q.q, /[?？؟。]\s*$/, `${code}/${text.id}: question must end with a question mark`);
        assert.ok(q.options.length >= 2, `${code}/${text.id}: too few options`);
        assert.equal(new Set(q.options).size, q.options.length, `${code}/${text.id}: duplicate options`);
        assert.ok(q.answer >= 0 && q.answer < q.options.length, `${code}/${text.id}: answer out of range`);
      }
    }
  }
});

test("every pack can hold a conversation", () => {
  for (const code of codes) {
    const conv = require(path.join(root, code, "conv.js"));
    assert.ok(Array.isArray(conv.dialogues), `${code}: no dialogues array`);
    assert.equal(typeof conv.start, "function", `${code}: no start()`);
    assert.equal(typeof conv.fits, "function", `${code}: no fits()`);
    assert.ok(conv.dialogues.length >= 1, `${code}: no dialogue`);
    for (const dialogue of conv.dialogues) {
      assert.ok(dialogue.turns.length >= 3, `${code}/${dialogue.id}: too few turns`);
      for (const turn of dialogue.turns) assert.ok(turn.es && turn.es.length > 2, `${code}/${dialogue.id}: empty line`);
    }
  }
});

test("every pack is voiced, or explicitly excused", () => {
  for (const code of codes) {
    const manifest = manifestFor(code);
    const source = fs.readFileSync(path.join(root, code, "audio.js"), "utf8");
    if (NO_AUDIO.has(code)) {
      assert.equal(manifest, null, `${code} is on the silence list but ships a manifest`);
      assert.match(source, new RegExp(`define\\("${code}", "audio", \\{\\}\\)`), `${code} should define empty audio`);
      continue;
    }
    assert.ok(manifest, `${code} has no audio manifest and is not on the silence list`);
    const missing = packItems(path.join(root, code)).filter((item) => !manifest[item.id]);
    assert.deepEqual(missing.map((item) => item.id), [], `${code} has no audio for: ${missing.map((item) => item.id).join(", ")}`);
    for (const [item, rel] of Object.entries(manifest)) {
      const file = path.join(__dirname, "..", rel);
      assert.ok(fs.existsSync(file), `${code}: missing audio ${rel} for ${item}`);
      assert.ok(fs.statSync(file).size > 2000, `${code}: audio too small for ${item}`);
    }
  }
});
