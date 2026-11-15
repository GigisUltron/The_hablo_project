/* Static consistency checks for a no-build front end.
 *
 * Nothing bundles this app, so a renamed id or a moved file fails only at
 * runtime — in the browser, where there is no test runner. These checks catch
 * that class of breakage in CI instead:
 *   - every $("id") the script looks up exists in the markup
 *   - every asset referenced by the markup exists on disk
 *   - the script bundles are loaded in dependency order
 *
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");

function idsIn(markup) {
  const out = new Set();
  const re = /\sid="([^"]+)"/g;
  let m;
  while ((m = re.exec(markup))) out.add(m[1]);
  return out;
}

test("every element id the script queries exists in the markup", () => {
  const markupIds = idsIn(html);

  // ids the script creates itself, in template strings
  const generated = new Set();
  let m;
  const templated = /id="([a-z0-9-]+)"/g;
  while ((m = templated.exec(app))) generated.add(m[1]);

  // ids the script looks up and uses straight away. A lookup assigned to a
  // variable may be optional (the chat controls are capability-gated); a lookup
  // that immediately calls a method was the boot crash this test exists for.
  const looked = new Set();
  const lookup = /\$\("([^"]+)"\)\s*\./g;
  while ((m = lookup.exec(app))) looked.add(m[1]);

  const missing = [...looked].filter((id) => !markupIds.has(id) && !generated.has(id));
  assert.deepEqual(missing, [], `script looks up ids that do not exist: ${missing.join(", ")}`);
});

test("markup only references assets that exist", () => {
  const refs = [];
  let m;
  const re = /(?:href|src)="([^"]+)"/g;
  while ((m = re.exec(html))) refs.push(m[1]);
  const local = refs.filter((r) => !/^(https?:|data:|#)/.test(r));

  assert.ok(local.length >= 4, "expected stylesheet and three scripts");
  for (const rel of local) {
    const p = path.join(root, rel);
    assert.ok(fs.existsSync(p), `missing asset: ${rel}`);
  }
});

test("scripts load in dependency order (registry, pack, audio manifest, srs, app)", () => {
  const order = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((x) => x[1]);
  assert.deepEqual(order, [
    "src/lang/index.js",
    "src/lang/es/concepts.js",
    "src/lang/es/phrases.js",
    "src/lang/es/terms.js",
    "src/lang/es/basics.js",
    "src/lang/es/levels.js",
    "src/track.js",
    "src/curriculum.js",
    "src/lang/es/texts.js",
    "src/adaptive.js",
    "src/correct.js",
    "src/lang/es/conv.js",
    "src/lang/es/glosses.js",
    "src/lang/es/alphabet.js",
    "assets/audio/manifest.js",
    "src/lang/es/audio.js",
    "src/lang/fr/concepts.js",
    "src/lang/fr/phrases.js",
    "src/lang/fr/basics.js",
    "src/lang/fr/texts.js",
    "src/lang/fr/levels.js",
    "src/lang/fr/terms.js",
    "src/lang/fr/conv.js",
    "src/lang/fr/glosses.js",
    "src/lang/fr/alphabet.js",
    "assets/audio/fr/manifest.js",
    "src/lang/fr/audio.js",
    "src/lang/pt/concepts.js",
    "src/lang/pt/phrases.js",
    "src/lang/pt/terms.js",
    "src/lang/pt/basics.js",
    "src/lang/pt/texts.js",
    "src/lang/pt/levels.js",
    "src/lang/pt/glosses.js",
    "src/lang/pt/conv.js",
    "assets/audio/pt/manifest.js",
    "src/lang/pt/audio.js",
    "src/lang/it/concepts.js",
    "src/lang/it/phrases.js",
    "src/lang/it/terms.js",
    "src/lang/it/basics.js",
    "src/lang/it/texts.js",
    "src/lang/it/levels.js",
    "src/lang/it/glosses.js",
    "src/lang/it/conv.js",
    "assets/audio/it/manifest.js",
    "src/lang/it/audio.js",
    "src/lang/de/concepts.js",
    "src/lang/de/phrases.js",
    "src/lang/de/terms.js",
    "src/lang/de/basics.js",
    "src/lang/de/texts.js",
    "src/lang/de/levels.js",
    "src/lang/de/glosses.js",
    "src/lang/de/conv.js",
    "assets/audio/de/manifest.js",
    "src/lang/de/audio.js",
    "src/lang/nl/concepts.js",
    "src/lang/nl/phrases.js",
    "src/lang/nl/terms.js",
    "src/lang/nl/basics.js",
    "src/lang/nl/texts.js",
    "src/lang/nl/levels.js",
    "src/lang/nl/glosses.js",
    "src/lang/nl/conv.js",
    "assets/audio/nl/manifest.js",
    "src/lang/nl/audio.js",
    "src/lang/ru/concepts.js",
    "src/lang/ru/phrases.js",
    "src/lang/ru/terms.js",
    "src/lang/ru/basics.js",
    "src/lang/ru/texts.js",
    "src/lang/ru/levels.js",
    "src/lang/ru/glosses.js",
    "src/lang/ru/alphabet.js",
    "src/lang/ru/conv.js",
    "assets/audio/ru/manifest.js",
    "src/lang/ru/audio.js",
    "src/lang/tr/concepts.js",
    "src/lang/tr/phrases.js",
    "src/lang/tr/terms.js",
    "src/lang/tr/basics.js",
    "src/lang/tr/texts.js",
    "src/lang/tr/levels.js",
    "src/lang/tr/glosses.js",
    "src/lang/tr/conv.js",
    "assets/audio/tr/manifest.js",
    "src/lang/tr/audio.js",
    "src/lang/ar/concepts.js",
    "src/lang/ar/phrases.js",
    "src/lang/ar/terms.js",
    "src/lang/ar/basics.js",
    "src/lang/ar/texts.js",
    "src/lang/ar/levels.js",
    "src/lang/ar/glosses.js",
    "src/lang/ar/alphabet.js",
    "src/lang/ar/conv.js",
    "assets/audio/ar/manifest.js",
    "src/lang/ar/audio.js",
    "src/lang/hi/concepts.js",
    "src/lang/hi/phrases.js",
    "src/lang/hi/terms.js",
    "src/lang/hi/basics.js",
    "src/lang/hi/texts.js",
    "src/lang/hi/levels.js",
    "src/lang/hi/glosses.js",
    "src/lang/hi/alphabet.js",
    "src/lang/hi/conv.js",
    "assets/audio/hi/manifest.js",
    "src/lang/hi/audio.js",
    "src/lang/ja/concepts.js",
    "src/lang/ja/phrases.js",
    "src/lang/ja/terms.js",
    "src/lang/ja/basics.js",
    "src/lang/ja/texts.js",
    "src/lang/ja/levels.js",
    "src/lang/ja/glosses.js",
    "src/lang/ja/alphabet.js",
    "src/lang/ja/conv.js",
    "assets/audio/ja/manifest.js",
    "src/lang/ja/audio.js",
    "src/lang/zh/concepts.js",
    "src/lang/zh/phrases.js",
    "src/lang/zh/terms.js",
    "src/lang/zh/basics.js",
    "src/lang/zh/texts.js",
    "src/lang/zh/levels.js",
    "src/lang/zh/glosses.js",
    "src/lang/zh/alphabet.js",
    "src/lang/zh/conv.js",
    "src/lang/zh/audio.js",
    "src/lang/en/concepts.js",
    "src/lang/en/phrases.js",
    "src/lang/en/terms.js",
    "src/lang/en/basics.js",
    "src/lang/en/texts.js",
    "src/lang/en/levels.js",
    "src/lang/en/glosses.js",
    "src/lang/en/conv.js",
    "assets/audio/en/manifest.js",
    "src/lang/en/audio.js",
    "src/ui-langs.js",
    "src/ruby.js",
    "src/writing.js",
    "src/exercises.js",
    "src/ui-strings.js",
    "src/ui-extra.js",
    "src/srs.js",
    "src/memory.js",
    "src/chat.js",
    "src/chat-engine.js",
    "src/app.js"
  ]);
});

test("every bundled audio file exists and matches the manifest", () => {
  const manifestPath = path.join(root, "assets", "audio", "manifest.js");
  assert.ok(fs.existsSync(manifestPath), "missing generated audio manifest");
  const src = fs.readFileSync(manifestPath, "utf8");
  const json = JSON.parse(src.slice(src.indexOf("=") + 1).trim().replace(/;$/, ""));
  const ids = Object.keys(json);
  assert.ok(ids.length >= 40, `only ${ids.length} audio files`);
  for (const [id, rel] of Object.entries(json)) {
    const file = path.join(root, rel);
    assert.ok(fs.existsSync(file), `audio missing for ${id}: ${rel}`);
    assert.ok(fs.statSync(file).size > 2000, `audio too small for ${id}`);
  }
});

test("every data-view tab has a matching section", () => {
  const views = [...html.matchAll(/data-view="([^"]+)"/g)].map((x) => x[1]);
  const ids = idsIn(html);
  assert.ok(views.length >= 3);
  for (const v of new Set(views)) {
    assert.ok(ids.has(`view-${v}`), `no #view-${v} section for tab "${v}"`);
  }
});

test("no concept carries a translation field", () => {
  // The app's promise is that it never renders an English gloss, so the dataset
  // must not contain one. Check the actual keys, not the word "english" in a
  // comment.
  const D = require("../src/data.js");
  const forbidden = /^(en|eng|english|gloss|glossary|translation|translate|meaning_en)$/i;
  for (const c of D.concepts) {
    for (const key of Object.keys(c)) {
      assert.equal(forbidden.test(key), false, `${c.id} has a translation field "${key}"`);
    }
  }
});

test("the brand mark is a path of three steps, the top one solid", () => {
  assert.match(html, /<svg class="brand-mark"/, "no inline mark");
  assert.equal(/brand-badge/.test(html), false, "the letter badge is gone");
  assert.equal(/<img\b/.test(html), false, "the mark must not be an image");
  assert.equal((html.match(/class="mark-step"/g) || []).length, 2, "two open steps");
  assert.match(html, /class="mark-solid"/, "the filled step is missing");
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.brand-mark\s*\{/, "no .brand-mark rule");
  assert.match(css, /\.brand-mark[^}]*stroke:\s*currentColor/s, "the mark does not follow the text");
});

test("a locked unit is refused by the session code, not only by the click", () => {
  assert.match(app, /function unitUnlocked\(/, "no single unlock rule");
  assert.match(app, /if \(o\.unit && !unitUnlocked\(o\.unit\)\)/, "startSession does not refuse a locked unit");
  assert.match(app, /aria-disabled="true"/, "locked nodes are not marked for assistive tech");
  assert.match(app, /ICON\.lock/, "locked nodes have no cue beyond colour");
  assert.match(app, /\.step\.done|step.* done/, "no completed state");
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.step\.locked[^}]*cursor:\s*not-allowed/s, "locked nodes do not say they are not allowed");
  assert.match(css, /\.step\.done \.step-n/, "no completed state in the stylesheet");
});

test("a concept card carries its reading aid, not only its sentence", () => {
  assert.match(app, /sub:\s*c\.sub\s*\|\|\s*""/, "concept sub is dropped");
  assert.match(app, /sentence:\s*c\.sentence/, "the sentence field is dropped");
  assert.match(app, /class="roman"/, "the reading aid is never rendered");
  assert.match(app, /boldFirst\(/, "the target word is not marked in its sentence");
});

test("the session summary offers exactly one filled control", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const summary = app.slice(app.indexOf("function finishSession"), app.indexOf("function feedback"));
  const filled = (summary.match(/btn btn-primary/g) || []).length;
  assert.equal(filled, 1, `summary has ${filled} filled buttons`);
  assert.match(summary, /btn-ghost/, "the exit is a secondary button");
});

test("the path's read unit is actually routed", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /unit\.mode === "read"/, "no read route in startSession");
  assert.match(app, /startReader\(\)/, "route does not open the reader");
});

test("settings offer no deck mode chooser", () => {
  assert.equal(/data-mode="/.test(html), false, "settings still render mode buttons");
  assert.equal(/settings\.mode\s*=/.test(app), false, "a session mode is still written");
  assert.equal(/sessionMode/.test(app), false, "a session mode is still read");
  assert.match(app, /delete s\.settings\.mode/, "old saves keep the retired setting");
});

test("there is one kind of lesson, mixed and phrase first", () => {
  assert.match(app, /ADAPT\.sessionMix\(/, "the session is not composed from its layers");
  assert.match(app, /function openersFor\(/, "the session has no per-deck opening phrases");
  assert.match(app, /newSession\("mixed"/, "a lesson is not the mixed kind");
  assert.match(app, /connectorsUnlocked\(/, "connectors are not held back by stage");
});

test("the reader turns a wrong answer into a why and a way on", () => {
  const start = app.indexOf("function startReader");
  const end = app.indexOf("/* --------------------------------------------------------- conversation");
  assert.ok(start !== -1 && end > start, "reader section not found");
  const reader = app.slice(start, end);
  assert.match(reader, /q\.why/, "the why the text ships with is never read");
  assert.match(reader, /reader-why/, "missed questions are not explained after the text");
  assert.match(reader, /id="reader-again"/, "the reader ends without a next step");
  assert.match(reader, /id="reader-done"/, "the reader cannot be left");
});

test("the reader is graded by the learner's band", () => {
  const start = app.indexOf("function readerLevel");
  const end = app.indexOf("function finishReader");
  assert.ok(start !== -1 && end > start, "reader level gate not found");
  const gate = app.slice(start, end);
  assert.match(gate, /ADAPT\.shelf\(learnerLevel\(\)\)/, "text level is not derived from the band");
  assert.match(gate, /t\.level <= max/, "texts above the band are still offered");
});

test("the read unit on the path opens the reader as a lesson", () => {
  const start = app.indexOf("function startSession");
  const end = app.indexOf("function startQuizOnly");
  assert.ok(start !== -1 && end > start, "startSession not found");
  const startSession = app.slice(start, end);
  assert.match(startSession, /p\.read/, "the read unit is not routed");
  assert.match(startSession, /startReader\(\)/, "the read unit does not open the reader");
});

test("every member the app calls on a shared module exists", () => {
  // A rename or a half-landed commit can leave the app calling a function that
  // is not there any more; that throws at boot and kills every listener with it.
  const mods = {
    TRACK: require("../src/track.js"),
    ADAPT: require("../src/adaptive.js")
  };
  const problems = [];
  for (const [name, mod] of Object.entries(mods)) {
    const used = [...new Set([...app.matchAll(new RegExp("\\b" + name + "\\.([A-Za-z_$][\\w$]*)", "g"))].map((m) => m[1]))];
    for (const member of used) {
      if (typeof mod[member] === "undefined") problems.push(name + "." + member);
    }
  }
  assert.deepEqual(problems, [], "the app calls missing members: " + problems.join(", "));
});

test("every track unit has a mode the app can start", () => {
  const T = require("../src/track.js");
  const modes = new Set(T.units.map((u) => u.mode));
  for (const m of modes) assert.ok(["words", "phrases", "terms", "read", "script"].includes(m), "unknown mode " + m);
});

test("every data-i18n key in the markup exists in every locale", () => {
  const U = require("../src/ui-strings.js");
  const X = require("../src/ui-extra.js");
  const keys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]))];
  assert.ok(keys.length >= 5, "no strings wired yet");
  for (const k of keys) {
    for (const lang of Object.keys(X)) assert.ok((U[lang] && U[lang][k]) || X[lang][k], `${lang} missing ${k}`);
  }
});

test("no card prints null for an item's picture", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.equal(/row-pic[^+]*\+\s*it\.emoji\s*\+/.test(app), false,
    "row-pic concatenates it.emoji directly; terms have no emoji");
  assert.match(app, /it\.schema/, "the card should fall back to the schema glyph");
});

test("no item is ever built with a null emoji", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.equal(app.includes("emoji: null"), false,
    "itemOf must give an empty string, not null - every renderer concatenates it");
});

test("the person drill gets its pronouns from the live pack", () => {
  assert.equal(app.includes("PRONOUN"), false, "a fixed pronoun table survived");
  assert.equal(app.includes("¿Quién?"), false, "the prompt is hardcoded Spanish");
  assert.match(app, /function pronounsFor/, "no pack-driven pronoun helper");
  assert.match(app, /pronounsFor\(it\.person\)/, "the drill never reads the pack's pronouns");
});

test("the audio chip tests the active pack, not a Spanish word", () => {
  assert.equal(app.includes('itemOf("noche")'), false, "the chip still plays a fixed Spanish word");
  assert.match(app, /function audioTestItem/, "no active-pack sample picker");
});

test("switching decks keeps the cards finished today", () => {
  const reset = app.slice(app.indexOf("function resetLive"), app.indexOf("function bucketOf"));
  assert.equal(/state\.daily/.test(reset), false, "a deck switch wipes the daily count");
});

test("setup cannot be skipped through the tabs or a lesson", () => {
  assert.match(app, /function needsSetup\(\)/, "no onboarding gate");
  assert.match(app, /if \(needsSetup\(\) && view !== "setup"\) view = "setup"/,
    "show() can leave setup");
  assert.match(app, /if \(needsSetup\(\)\) \{ show\("setup"\); return; \}/,
    "a lesson can start before setup");
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /#view-setup\.is-active\) \.tabs/, "the tabs stay visible on setup");
});

test("switching decks clears every in-flight lesson surface", () => {
  const block = app.slice(app.indexOf("function switchLang"), app.indexOf("function beginProfile"));
  for (const name of ["session", "reader", "writing", "alphabet", "placement"]) {
    assert.match(block, new RegExp(name + " = null"), "switchLang leaves " + name + " alive");
  }
  assert.match(block, /currentView !== "setup" && currentView !== "settings"\) show\("today"\)/,
    "a switch can leave a lesson from the old deck on screen");
});

test("first run can change interface language before choosing a level", () => {
  assert.match(app, /state\.profile\.byLang = state\.profile\.byLang \|\| \{\}/,
    "switchLang assumes byLang exists before onboarding finishes");
  assert.match(app, /if \(state\.profile\.lang\) state\.profile\.byLang/,
    "switchLang archives an undefined language");
});

test("the scripted chat does not fall back to a Spanish goodbye", () => {
  assert.equal(app.includes("¡Hasta pronto!"), false, "a Spanish closing survives for every deck");
  assert.equal(app.includes("À bientôt"), false, "a French closing survives for every deck");
});

test("today shows a real daily goal and a per-language level", () => {
  assert.match(html, /id="stat-daily"/);
  assert.match(html, /id="goal-meter"/);
  assert.match(app, /ADAPT\.bumpDaily/, "the daily counter never advances");
  assert.match(app, /levelByLang/, "the profile has no per-language level");
  assert.match(app, /ADAPT\.levelFor/, "the app never reads the per-language level");
});

test("the path unlocks on every deck card, not only on concepts", () => {
  assert.match(app, /TRACK\.map\(seenDeckCount\(\)/, "the track still counts concepts only");
  assert.match(app, /function seenDeckCount/, "no all-deck cards-met count");
  assert.match(app, /seenDeckCount\(\) >= 46/, "connectors do not unlock with their path node");
});

test("translations are hidden by default and revealed on press", () => {
  assert.match(app, /function glossFor/, "no gloss lookup");
  assert.match(app, /function translationFor/, "no UI-language translation");
  assert.match(app, /function translationIndex/, "no interface-language translation index");
  assert.match(app, /LANGS && LANGS\.load\(code\)/, "translations do not consult the UI pack");
  assert.match(app, /function glossHTML/, "no reveal control");
  assert.match(app, /glossHTML\(id\)/, "the reveal control is not on the card");
  assert.match(app, /wireGloss\(\)/, "the reveal control is not wired");
  assert.equal(app.includes("glossLine(it.id)"), false, "a gloss is still painted automatically");
  assert.match(app, /gloss-toggle/, "no settings toggle");
  assert.match(app, /function renderTranslate/, "no translation exercise");
  assert.match(app, /return "translate"/, "the mix never asks for the meaning");
  assert.match(app, /function glossDistractors/, "translation options have no distractor pool");
});

test("the revealed gloss is escaped, not injected", () => {
  const block = app.slice(app.indexOf("function glossHTML"), app.indexOf("function itemOf"));
  assert.match(block, /esc\(g\)/, "the UI translation is not escaped");
});

test("every card surface offers a translation toggle", () => {
  const count = (app.match(/glossHTML\(/g) || []).length;
  assert.ok(count >= 10, `only ${count} translation controls are wired`);
  assert.match(app, /chooseThenCheck\(cls, id, noGloss\)/, "choice cards cannot opt out");
  assert.match(app, /data-fallback="en"/, "no honest fallback marker");
});

test("Progress and pinyin controls are translated", () => {
  assert.match(html, /id="stats-title" data-i18n="tabProgress"/);
  assert.match(html, /data-ruby="on" type="button" data-i18n="on"/);
  assert.match(html, /data-ruby="off" type="button" data-i18n="off"/);
});

test("a beginner's first session opens on phrases, with nothing above A2", () => {
  // Boots the real scripts in a small DOM shim and reads the queue the app
  // actually builds. A shim is enough here: the bug was in the planner, not the
  // rendering, and the planner is reached by clicking Start.
  const vm = require("node:vm");
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

  function node(id) {
    return {
      id, style: {}, value: "", disabled: false, hidden: false, textContent: "", _html: "", _l: {},
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      addEventListener(t, f) { this._l[t] = f; }, removeEventListener() {},
      setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
      appendChild(c) { return c; }, insertAdjacentHTML() {},
      querySelectorAll() { return []; }, querySelector() { return null; }, closest() { return null; },
      focus() {}, click() {},
      set innerHTML(v) { this._html = String(v); }, get innerHTML() { return this._html; }
    };
  }

  function firstQueue(deck, level, seen) {
    const registry = new Map();
    const document = {
      getElementById(id) { if (!registry.has(id)) registry.set(id, node(id)); return registry.get(id); },
      querySelectorAll() { return []; }, querySelector() { return null; },
      createElement() { return node(); }, createElementNS() { return node(); },
      addEventListener() {}, body: node("body")
    };
    const cards = {};
    (seen || []).forEach(function (id) {
      cards[id] = { last: Date.now(), due: Date.now() + 86400000, interval: 6, reps: 3, lapses: 0 };
    });
    const save = {
      version: 1, profile: { level, lang: deck, uiLang: "en", byLang: {} },
      settings: { size: 8, translations: "on" },
      cards, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 3,
      memory: { sentences: [] }
    };
    const localStorage = {
      getItem(k) { return k === "sema.v1" ? JSON.stringify(save) : null; },
      setItem() {}, removeItem() {}
    };
    const win = {
      document, localStorage, location: { hash: "" }, history: { replaceState() {} },
      navigator: {}, console, setTimeout: () => 0, clearTimeout: () => {},
      setInterval: () => 0, clearInterval: () => {},
      confirm: () => true, scrollTo: () => {}
    };
    win.window = win; win.self = win; win.globalThis = win;
    const ctx = vm.createContext(win);
    for (const rel of scripts) {
      vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), ctx, { filename: rel });
    }
    const A = win.SemaAdaptive;
    let captured = null;
    const orig = A.sessionMix;
    A.sessionMix = function (ordered, size, openers) {
      const out = orig(ordered, size, openers);
      captured = { out, openers };
      return out;
    };
    registry.get("start-btn")._l.click();
    return { queue: captured && captured.out, A };
  }

  for (const deck of ["es", "fr", "it", "ja", "zh"]) {
    const C0 = require("../src/lang/" + deck + "/concepts.js").concepts;
    /* a script deck opens on its alphabet first; six cards met move the
     * path on to the mixed lesson this test is about */
    const seen = ["ja", "zh"].includes(deck) ? C0.slice(0, 6).map((c) => c.id) : [];
    const { queue, A } = firstQueue(deck, "A1", seen);
    const q = Array.from(queue || []);   // the queue is built in another realm
    const P = require("../src/lang/" + deck + "/phrases.js").phrases.map((p) => p.id);
    const T = require("../src/lang/" + deck + "/terms.js").terms.map((t) => t.id);
    const L = require("../src/lang/" + deck + "/levels.js");

    assert.ok(q.length >= 4, deck + ": no queue");
    assert.ok(P.includes(q[0]), deck + " opens on " + q[0] + ", not a phrase");
    assert.equal(q.filter((id) => T.includes(id)).length, 0, deck + " puts a connector in a first session");
    assert.deepEqual(q.filter((id) => !A.within(L[id], "A2")), [], deck + " queues above A2");
    /* the opening run is however many openers the deck has (at least the
     * greeting and how-are-you), and it is all phrases */
    const firstNonPhrase = q.findIndex((id) => !P.includes(id));
    assert.ok(firstNonPhrase >= 2, deck + " opens with fewer than two phrases");
    assert.deepEqual(q.slice(0, firstNonPhrase), q.slice(0, firstNonPhrase).filter((id) => P.includes(id)),
      deck + " opens with something that is not a phrase");
    const grammar = require("../src/lang/" + deck + "/basics.js").items.map((b) => b.id);
    assert.ok(q.filter((id) => grammar.includes(id)).length * 2 <= q.length,
      deck + " is more grammar than language");
  }

  const es = firstQueue("es", "A1");
  assert.deepEqual(Array.from(es.queue || []).slice(0, 4),
    ["ph-hola", "ph-como-estas", "ph-color", "ph-de-donde"],
    "Spanish must open hola, how are you, colour, where from");
});

test("the reveal control is present and the why button is gone", () => {
  assert.match(app, /data-gloss/, "the reveal control has no gloss payload");
  assert.equal(app.includes("explain-btn"), false, "the why button survived");
  assert.equal(app.includes("wireExplain"), false, "the why handler survived");
});

test("pinyin sits under the character only when the syllables line up", () => {
  const R = require("../src/ruby.js");

  assert.equal(R.html("你好！", "nǐ hǎo"),
    "<ruby>你<rt>nǐ</rt></ruby><ruby>好<rt>hǎo</rt></ruby>！", "aligned characters get ruby");

  // one token for two characters: the split is unknown, so do not guess
  assert.equal(R.html("房子", "fángzi"), "房子", "a word-spaced reading falls back to plain text");
  assert.equal(R.html("早上好。", "zǎoshang hǎo"), "早上好。", "mismatched counts fall back");

  assert.equal(R.html("casa", "ka-sa"), "casa", "Latin text never gets ruby");
  assert.equal(R.html("你好", ""), "你好", "no reading, no ruby");

  assert.equal(R.html("<你&>", "nǐ"), "&lt;<ruby>你<rt>nǐ</rt></ruby>&amp;&gt;",
    "text around the ruby is escaped");
  assert.equal(R.html("你", "<x>"), "<ruby>你<rt>&lt;x&gt;</rt></ruby>", "the reading is escaped too");

  // the renderers use the helper and fall back to plain text
  assert.match(app, /RUBY\.html\(it\.text, it\.sub\)/, "the reader aid is never built");
  assert.match(app, /function textHTML\(it\)/, "no shared text renderer");
});

test("writing grades the characters, not the drawing", () => {
  const W = require("../src/writing.js");

  assert.equal(W.grade("你好", "你好").ok, true, "exact characters pass");
  assert.equal(W.grade("  你 好 ！ ", "你好").ok, true, "spacing and punctuation are not the answer");
  assert.equal(W.grade("你好。", "你好").ok, true, "a full stop is not the answer either");
  assert.equal(W.grade("你号", "你好").ok, false, "a different character fails");
  assert.equal(W.grade("ni hao", "你好").reason, "latin-only", "letters are not the characters");
  assert.equal(W.grade("", "你好").reason, "empty");
  assert.equal(W.grade("nǐ hǎo", "你好").reason, "latin-only", "pinyin is not the characters");

  assert.match(app, /function startWriting\(/, "no writing lesson");
  assert.match(app, /function startScriptLesson\(/, "the script unit does not lead to writing");
  assert.match(app, /S\.review\(state, it\.id, ok \? 2 : 0/, "writing never reaches the SRS");
  assert.equal(/<canvas/i.test(app + html), false, "no undrawable trace practice");
});

test("writing practice only reaches a deck whose script is not Latin", () => {
  const W = require("../src/writing.js");

  function count(code) {
    const C = require("../src/lang/" + code + "/concepts.js").concepts.map((c) => ({ text: c.word, sub: c.sub }));
    const P = require("../src/lang/" + code + "/phrases.js").phrases.map((p) => ({ text: p.text, sub: p.sub }));
    return W.candidates(C.concat(P)).length;
  }

  assert.equal(count("es"), 0, "a Latin deck has nothing to recall here");
  assert.equal(count("fr"), 0, "a Latin deck has nothing to recall here");
  for (const code of ["zh", "ja", "ru", "ar", "hi"]) {
    assert.ok(count(code) > 0, code + " should have writing material");
  }
});

test("progress is a topic roadmap, not a semantic map", () => {
  assert.equal(/id="view-map"|semantic web|Semantic map/.test(html), false,
    "the semantic map is still in the markup");
  assert.match(html, /id="progress-roadmap"/, "no roadmap container");
  assert.match(app, /progress-roadmap/, "the roadmap is never painted");
  assert.match(app, /topic-ring/, "no topic progress rings");
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.roadmap/, "no roadmap layout");
  assert.match(css, /conic-gradient/, "the topic rings do not show a fraction");
});

test("the harder exercises exist only where the data supports them", () => {
  const X = require("../src/exercises.js");

  assert.equal(X.canBuild("Hola, ¿qué tal?"), true, "three words can be built");
  assert.equal(X.canBuild("Buenos días."), false, "two words is not a sentence build");
  assert.equal(X.canBuild("Hola."), false);

  assert.equal(X.canListen({ clip: "a.wav" }, "clip", false), true, "a bundled clip is enough");
  assert.equal(X.canListen({}, "clip", false), false, "no clip and no voice: no exercise");
  assert.equal(X.canListen({}, "clip", true), true, "a device voice is the fallback");

  assert.equal(X.sameOrder("Hola, qué tal?", "Hola,  qué   tal?"), true, "spacing is not the answer");
  assert.equal(X.sameOrder("qué tal? Hola,", "Hola, qué tal?"), false, "order matters");

  const all = { listen: true, build: true, gap: true };
  const kinds = Array.from({ length: 8 }, (_, i) => X.extraKind(i, all)).filter(Boolean);
  assert.deepEqual(kinds, ["listen", "build"], "two hard cards in eight");
  const longer = Array.from({ length: 12 }, (_, i) => X.extraKind(i, all)).filter(Boolean);
  assert.deepEqual(longer, ["listen", "build", "gap"], "a longer session rotates all three");
  assert.equal(Array.from({ length: 8 }, (_, i) => X.extraKind(i, {})).filter(Boolean).length, 0,
    "nothing hard when the data is missing");

  assert.match(app, /function renderBuild\(/, "no sentence build");
  assert.match(app, /function renderListen\(/, "no listen and pick");
  assert.match(app, /EX\.extraKind/, "the mix ignores the exercise rule");
  assert.match(app, /S\.review\(state, id, ok \? 2 : 0/, "the new exercises bypass the SRS");
});

test("interface language cannot equal the language being learned", () => {
  assert.match(app, /function uiChoices\(except\)/, "uiChoices has no exclusion");
  assert.match(app, /uiChoices\(ACTIVE && ACTIVE\.code\)/, "the deck language is not excluded");
  assert.match(app, /function defaultUiFor/, "no fallback interface language");
});

test("a chosen interface language is not silently reset by the deck", () => {
  assert.match(app, /s\.profile\.uiLang !== code/, "same UI/deck is reset on boot");
  assert.match(app, /choices = choices\.concat\(\[current\]\)/, "the current UI language disappears from the picker");
  assert.match(app, /toLocaleDateString\(uiLocale\(\)/, "dates do not follow the UI locale");
  assert.match(app, /renderStats\(\);\n  }/, "placement does not repaint Progress");
});

test("specialized lessons cycle varied exercises", () => {
  assert.match(app, /if \(o\.customId\) \{/, "custom lessons do not set their own type mix");
  assert.match(app, /type-translation/, "typed translation is missing from the mix");
  assert.match(app, /buildable\(id\)\) phrases\.push\("build"\)/, "sentence building is missing");
  assert.match(app, /gapFor\(id\)\) phrases\.push\("message"\)/, "message completion is missing");
});

test("saved lessons can be deleted only after confirmation", () => {
  assert.match(app, /data-delete-custom/, "no delete control on saved lessons");
  assert.match(app, /deleteLessonConfirm/, "delete has no confirmation copy");
  assert.match(app, /window\.confirm\(tr\("deleteLessonConfirm"/, "delete is not confirmed");
});

test("the lesson card has one consistent type and action scale", () => {
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.card \.prompt \{/, "lesson prompt has no consistency rule");
  assert.match(css, /\.card \.word \{/, "lesson word has no consistency rule");
  assert.match(css, /\.card \.card-actions \.btn,[\s\S]*text-transform: none;/, "lesson buttons still use display caps");
  assert.match(css, /\.card, \.card button, \.card input, \.card textarea \{/, "lesson controls can inherit another font");
});

test("the plan-a-lesson field is styled as a real input", () => {
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.wish-row input \{/, "the request input has no styling");
  assert.match(css, /box-shadow: 0 0 0 3px var\(--accent-soft\)/, "the request input has no focus ring");
});

test("specialized lessons encode two chunks before retrieval", () => {
  assert.match(app, /var warm = o\.customId && queue\.length > 2 \? queue\.slice\(0, 2\) : \[\];/, "no custom encoding step");
  assert.match(app, /newSession\("mixed", warm, quizQueue\)/, "the warmup is not part of the session");
});

test("specialized lessons are saved and can be reopened", () => {
  assert.match(app, /function saveCustomLesson/, "no saved lesson store");
  assert.match(app, /function renderCustomLessons/, "no saved lesson list");
  assert.match(app, /data-custom/, "saved lessons have no controls");
  assert.match(app, /customId/, "custom lesson review is not tracked");
  assert.match(app, /wedding|family/, "planner ignores family/wedding requests");
});

test("the lesson progress bar advances in a normal quiz", () => {
  assert.match(app, /session\.phase = "quiz";\n    setProgress\(\);/, "the quiz never enters the quiz phase");
  assert.match(app, /if \(session\.phase === "study"\) return extra \+ session\.si;/, "doneSteps ignores quiz cards");
});

test("typed translation is a real routed exercise", () => {
  assert.match(app, /function renderTypeTranslation/, "no typed translation renderer");
  assert.match(app, /type === "type-translation"/, "typed translation is not routed");
  assert.match(app, /i % 7 === 5\) return "type-translation"/, "typed translation is unreachable");
});

test("Today can build a lesson from a described situation", () => {
  assert.match(html, /id="wish-form"/, "no request form on Today");
  assert.match(app, /function wishLesson/, "no situation planner");
  assert.match(app, /o\.ids && o\.ids\.length/, "custom lessons cannot pass item ids");
  assert.match(app, /wishDialect/, "the planner does not admit missing dialect data");
});

test("only concrete first words get a picture, and the translation stays toggleable", () => {
  assert.match(app, /var EMOJI_BASIC =/, "no basic emoji allowlist");
  assert.match(app, /function basicEmoji/, "no emoji gate");
  assert.match(app, /emoji-basic/, "basic pictures are not rendered");
  assert.match(app, /emoji \? glossHTML\(id\)/, "basic pictures have no translation toggle");
});

test("the authored dialogue is the offline conversation", () => {
  assert.match(app, /CONV && CONV\.dialogues/, "the authored dialogue is not used");
  assert.match(app, /chat\.scripted\.dialogue/, "the offline dialogue has no turn state");
  assert.match(app, /d\.turns\[chat\.scripted\.turn\]/, "the offline dialogue never advances");
});

test("placement cannot infer B2 from a short easy test", () => {
  assert.match(app, /Math\.min\(placement\.band, maxBand, 2\)/, "placement is not capped at B1");
});

test("immersion does not turn a translation into the answer", () => {
  assert.match(app, /if \(ui === ACTIVE\.code\) return "";/, "same-language UI can still self-answer");
  assert.match(app, /if \(itemOf\(link\)\.kind === "phrase"\) \{\s*if \(buildable\(link\)\) return "build";/, "phrases can still fall back to emoji pictures");
});

test("the meaning is the teaching cue for connectors and abstract words", () => {
  assert.match(app, /function meaningHTML/, "teach cards have no visible meaning line");
  assert.match(app, /meaningHTML\(id\)/, "the meaning is not painted on a teach card");
  assert.match(app, /function renderTermMeaning/, "connectors still use a schema-only card");
  assert.match(app, /\["abstract", "emotion", "time"\]/, "abstract words can still be emoji-only");
  assert.match(app, /function renderTranslateToTarget/, "no UI-to-target translation task");
});

test("pronouns are meaning tasks, not self-answering person cards", () => {
  assert.match(app, /function renderPronoun/, "no pronoun renderer");
  assert.match(app, /if \(basic\.of && basic\.person\) renderPerson\(id\);/, "verbs and pronouns share a card");
  assert.match(app, /it\.kind === "basic" && !it\.of/, "pronoun feedback still injects a gloss");
});

test("message completion is a real task, not a relabeled gap", () => {
  assert.match(app, /function renderMessage/, "no message renderer");
  assert.match(app, /type === "message"/, "message task is not routed");
  assert.match(app, /msg-thread/, "no message layout");
  const css = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(css, /\.msg-bubble/, "message bubbles are unstyled");
});

test("the next lesson names the lesson and Progress mirrors the path", () => {
  assert.match(html, /class="lesson-kicker" data-i18n="nextLesson"/, "no Next lesson label");
  assert.match(html, /<h2 id="lesson-name"><\/h2>/, "the lesson name is still static");
  assert.match(html, /id="progress-path"/, "Progress has no path");
  assert.match(app, /highestUnlocked/, "Start does not use the highest unlocked lesson");
  assert.match(app, /function renderTranslateToTarget/, "no UI-to-target task");
  assert.match(app, /translate-out/, "the reverse task is not in the mix");
});

test("the level is placed by the adaptive test, not by a settings control", () => {
  assert.equal(/data-level/.test(html), false, "a manual level control came back");
  assert.match(app, /PLACEMENT_TOTAL = 8/, "placement is not bounded");
  assert.match(app, /ADAPT\.placementStep/, "placement is not a staircase");
  assert.match(app, /state\.profile\.levelByLang\[ACTIVE\.code\] = band/,
    "the placement result is not stored for the live language");
});

test("every settings option is read, applied now, and remembered", () => {
  // session length
  assert.match(app, /function lessonSize\(\)/, "no session-length rule");
  assert.match(app, /mode === "short"\) return 5/, "short is not short");
  assert.match(app, /mode === "long"\) return 12/, "long is not long");
  assert.match(app, /data-length/, "the length control is not wired");
  // audio
  assert.match(app, /function audioEnabled\(\)/, "no audio setting");
  assert.match(app, /function audioAvailable\(\)/, "no playback-availability check");
  assert.match(app, /if \(!audioEnabled\(\)\) return false;/, "audio still plays when it is off");
  const cssSettings = fs.readFileSync(path.join(root, "assets", "styles.css"), "utf8");
  assert.match(cssSettings, /\.audio-off \.speak-btn/, "speaker buttons survive audio off");
  assert.match(app, /data-audio/, "the audio control is not wired");
  // ruby
  assert.match(app, /function rubyOn\(\)/, "no ruby setting");
  assert.match(app, /rubyOn\(\) && it\.sub/, "ruby ignores its setting");
  assert.match(app, /data-ruby/, "the pinyin control is not wired");
  assert.match(app, /group\.hidden = !hasScriptLesson\(\)/, "pinyin is offered on Latin decks");
  // translations
  assert.match(app, /gloss-toggle/, "the translation control is missing");
  // all of them persist and repaint immediately
  assert.match(app, /function renderSettingsOptions\(\)/, "options are not painted from state");
  assert.match(app, /function applyAudioSetting\(\)/, "audio is not applied at boot");
  assert.match(app, /function redraw\(\)/, "a change does not repaint the screen");
  assert.equal(/data-size=/.test(html), false, "the numeric length picker is still in the markup");
  assert.equal(/data-mode=/.test(html), false, "a deck-mode chooser came back");
});

test("no settings link goes nowhere", () => {
  const gotos = [...html.matchAll(/data-goto="([^"]+)"/g)].map((m) => m[1]);
  const ids = idsIn(html);
  for (const g of gotos) assert.ok(ids.has("view-" + g), "no view for goto " + g);
  assert.equal(/class="foot-link"[^>]*href="#/.test(html), false,
    "a foot link points at a hash no view handles");
});

test("fill the gap is offered only where a sentence holds a word, and graded exactly", () => {
  const X = require("../src/exercises.js");

  const gap = X.gapPhrase("Buenos días, señor", "a greeting");
  assert.ok(gap && gap.answer, "a phrase of three words is material");
  assert.ok(gap.sentence.indexOf("___") !== -1, "the answer is removed from the sentence");
  assert.equal(X.gapPhrase("Buenos días", "two words"), null, "two words is not material");
  assert.equal(X.gapPhrase("Buenos días, señor", ""), null, "no context, no gap");

  const fromText = X.gapWord("Mi casa está cerca del mar.", "casa");
  assert.deepEqual(fromText, { answer: "casa", sentence: "Mi ___ está cerca del mar." },
    "a text sentence blanks the word it holds");
  assert.equal(X.gapWord("Mi casa está cerca del mar.", "perro"), null, "a word the sentence lacks is no gap");

  assert.equal(X.gradeGap("casa", "casa"), true, "the missing word is exact");
  assert.equal(X.gradeGap(" casas ", "casa"), false, "a different word fails");
  assert.equal(X.gradeGap("Casa", "casa"), false, "case is part of the word");

  assert.match(app, /function renderGap\(/, "no gap card");
  assert.match(app, /EX\.gradeGap\(/, "the gap card does not use the grader");
  assert.match(app, /gap\.sentence\.replace\("___", gap\.answer\)/, "a wrong answer never shows the completed sentence");

  assert.match(app, /ADAPT\.shelf\(learnerLevel\(\)\)/, "reading does not use the five shelves");
  assert.equal(/Math\.min\(4, /g.test(app), false, "the reader still collapses its shelves at four");
});
