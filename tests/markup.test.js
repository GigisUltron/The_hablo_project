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

  // ids the script looks up — these must be static, or it will query null
  const looked = new Set();
  const lookup = /\$\("([^"]+)"\)/g;
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
    "src/lang/fr/glosses.js",
    "src/lang/fr/alphabet.js",
    "assets/audio/fr/manifest.js",
    "src/lang/fr/audio.js",
    "src/ui-strings.js",
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

test("the session summary offers exactly one filled control", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const summary = app.slice(app.indexOf("function finishSession"), app.indexOf("function feedback"));
  const filled = (summary.match(/btn btn-primary/g) || []).length;
  assert.equal(filled, 1, `summary has ${filled} filled buttons`);
  assert.match(summary, /foot-link/);
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
  assert.match(app, /ADAPT\.OPENERS/, "the session has no teaching order for its opening phrases");
  assert.match(app, /newSession\("mixed"/, "a lesson is not the mixed kind");
});

test("every track unit has a mode the app can start", () => {
  const T = require("../src/track.js");
  const modes = new Set(T.units.map((u) => u.mode));
  for (const m of modes) assert.ok(["words", "phrases", "terms", "read"].includes(m), "unknown mode " + m);
});

test("every data-i18n key in the markup exists in every locale", () => {
  const U = require("../src/ui-strings.js");
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 5, "no strings wired yet");
  for (const k of keys) {
    for (const lang of ["en", "es"]) assert.ok(U[lang][k], `${lang} missing ${k}`);
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

test("translations are rendered and can be switched off", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /function glossHTML/, "no gloss renderer");
  assert.match(app, /glossHTML\(id\)/, "the gloss is never called from the card");
  assert.match(app, /gloss-toggle/, "no settings toggle");
  assert.match(app, /wireGloss\(\)/, "the control is never wired");
});

test("gloss text is not double-escaped into the attribute", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const block = app.slice(app.indexOf("function glossHTML"), app.indexOf("function explainHTML"));
  assert.equal(/data-gloss="'\s*\+\s*esc\(/.test(block), false,
    "esc() turns apostrophes into &#39;, which renders literally when read back");
});
