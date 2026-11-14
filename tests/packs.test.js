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
  en: { concepts: 40, phrases: 120, terms: 27, basics: 16, texts: 1 },
  starter: { concepts: 20, phrases: 30, terms: 8, basics: 8, texts: 1 }
};
const FLAGSHIP = new Set(["es", "fr", "it", "en"]);

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
  assert.ok(codes.length >= 13, `expected at least thirteen packs, found ${codes.length}`);
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
      assert.ok(text.questions.length >= 3, `${code}/${text.id}: only ${text.questions.length} questions`);
      const length = ["ja", "zh"].includes(code)
        ? text.body.replace(/\s+/g, "").length
        : text.body.trim().split(/\s+/).length;
      assert.ok(length >= 60 && length <= 200, `${code}/${text.id}: ${length} units, expected 60-200`);
      for (const q of text.questions) {
        assert.match(q.q, /[?？؟。]\s*$/, `${code}/${text.id}: question must end with a question mark`);
        assert.ok(q.options.length >= 2, `${code}/${text.id}: too few options`);
        assert.equal(new Set(q.options).size, q.options.length, `${code}/${text.id}: duplicate options`);
        assert.ok(q.answer >= 0 && q.answer < q.options.length, `${code}/${text.id}: answer out of range`);
        assert.equal(q.why.length, q.options.length, `${code}/${text.id}: one why per option`);
        for (let i = 0; i < q.options.length; i += 1) {
          if (i !== q.answer) assert.ok(q.why[i], `${code}/${text.id}: no why for wrong option ${i}`);
        }
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

test("the registry returns the whole pack, not just its words", () => {
  const LANGS = require("../src/lang/index.js");
  for (const code of codes) {
    const pack = LANGS.load(code);
    assert.ok(pack, `${code}: the registry cannot load it`);
    const items = packItems(path.join(root, code));
    assert.ok(pack.concepts.concepts.length >= 20, `${code}: concepts missing from registry`);
    assert.ok(pack.phrases.phrases.length >= 30, `${code}: phrases missing from registry`);
    assert.ok(pack.basics.items.length >= 8, `${code}: grammar missing from registry`);
    const unread = items.filter((item) => !pack.levels[item.id]).map((item) => item.id);
    assert.deepEqual(unread, [], `${code}: registry lost the level of ${unread.slice(0, 5).join(", ")}`);
    assert.ok(pack.texts.texts.length >= 1, `${code}: texts missing from registry`);
    assert.ok(pack.conv.dialogues.length >= 1, `${code}: conversation missing from registry`);
  }
});


test("chinese carries tone-marked pinyin, not just characters", () => {
  const dir = path.join(root, "zh");
  const items = []
    .concat(require(path.join(dir, "concepts.js")).concepts || [])
    .concat(require(path.join(dir, "phrases.js")).phrases || []);
  const pinyin = /^[A-Za-z\u00C0-\u024F ]+$/;
  for (const item of items) {
    assert.ok(item.sub && item.sub.trim(), `${item.id} has no pinyin`);
    assert.equal(/[\u3400-\u9fff]/.test(item.sub), false, `${item.id} pinyin contains Han characters`);
    assert.match(item.sub, pinyin, `${item.id} pinyin has punctuation: ${item.sub}`);
    assert.match(item.sub, /[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/, `${item.id} pinyin has no vowel: ${item.sub}`);
  }
});

test("every non-Latin pack teaches its own script", () => {
  const corpusFor = (code) => {
    const dir = path.join(root, code);
    return JSON.stringify([
      require(path.join(dir, "concepts.js")),
      require(path.join(dir, "phrases.js")),
      require(path.join(dir, "terms.js")),
      require(path.join(dir, "basics.js")),
      require(path.join(dir, "texts.js")),
      require(path.join(dir, "conv.js"))
    ]);
  };
  for (const code of ["ru", "ar", "hi", "ja", "zh"]) {
    const file = path.join(root, code, "alphabet.js");
    assert.ok(fs.existsSync(file), `${code} has no alphabet.js`);
    const A = require(file);
    assert.ok(A.note && A.note.length > 20, `${code} should say what its writing system is`);
    assert.ok(A.letters.length >= 20, `${code} has only ${A.letters.length} entries`);
    const seen = new Set();
    const corpus = corpusFor(code);
    for (const entry of A.letters) {
      assert.ok(entry.letter && !seen.has(entry.letter), `${code} duplicate letter ${entry.letter}`);
      seen.add(entry.letter);
      assert.ok(entry.name && entry.name.length >= 1, `${code}/${entry.letter} has no name`);
      assert.ok(entry.hint && entry.hint.length > 8, `${code}/${entry.letter} hint too thin`);
      const minLength = code === "zh" ? 1 : 2;
      assert.ok(entry.example && entry.example.length >= minLength, `${code}/${entry.letter} needs an example`);
      assert.ok(corpus.includes(entry.example), `${code}/${entry.letter} example "${entry.example}" is not in the pack`);
    }
  }
  assert.match(require(path.join(root, "ja", "alphabet.js")).note, /kanji/i);
  assert.match(require(path.join(root, "zh", "alphabet.js")).note, /Han characters/i);
});

test("english teaches idioms, not a translation of itself", () => {
  const dir = path.join(root, "en");
  const phrases = require(path.join(dir, "phrases.js")).phrases;
  const glosses = require(path.join(dir, "glosses.js"));
  assert.ok(phrases.length >= 120, `english has ${phrases.length} phrases`);
  assert.ok(new Set(phrases.map((p) => p.topic)).size >= 30, "english has fewer than thirty situations");
  const circular = phrases.filter((p) => glosses[p.id].toLowerCase() === p.text.toLowerCase());
  assert.deepEqual(circular.map((p) => p.id), [], "an english gloss repeats its phrase");
  const levels = require(path.join(dir, "levels.js"));
  assert.ok(phrases.some((p) => levels[p.id] === "C1"), "english has no C1 phrase");
});

test("every pack names four opening phrases that exist", () => {
  const seen = new Map();
  for (const code of codes) {
    const phrases = require(path.join(root, code, "phrases.js"));
    const ids = new Set((phrases.phrases || []).map((p) => p.id));
    assert.ok(Array.isArray(phrases.openers), `${code}: no openers array`);
    assert.equal(phrases.openers.length, 4, `${code}: expected four openers`);
    assert.equal(new Set(phrases.openers).size, 4, `${code}: duplicate opener`);
    for (const id of phrases.openers) {
      assert.ok(ids.has(id), `${code}: opener "${id}" is not a phrase in the pack`);
      assert.equal(seen.has(id), false, `opener "${id}" is also used by ${seen.get(id)}`);
      seen.set(id, code);
    }
  }
});

test("chinese pinyin aligns one syllable to each Han character", () => {
  const dir = path.join(root, "zh");
  const concepts = (require(path.join(dir, "concepts.js")).concepts || [])
    .map((c) => ({ id: c.id, text: c.word, sub: c.sub }));
  const phrases = (require(path.join(dir, "phrases.js")).phrases || [])
    .map((p) => ({ id: p.id, text: p.text, sub: p.sub }));
  const han = /[\u3400-\u9fff]/g;
  for (const item of concepts.concat(phrases)) {
    assert.ok(item.sub, `${item.id} has no pinyin`);
    const characters = (item.text.match(han) || []).length;
    const tokens = item.sub.trim().split(/\s+/).filter(Boolean).length;
    assert.equal(tokens, characters, `${item.id}: ${characters} characters, ${tokens} pinyin tokens (${item.sub})`);
    assert.equal(/\s{2,}/.test(item.sub), false, `${item.id} pinyin has more than one space between tokens`);
    assert.equal(item.sub, item.sub.trim(), `${item.id} pinyin has an outer space`);
  }
});
