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

test("scripts load in dependency order (data, audio manifest, srs, app)", () => {
  const order = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((x) => x[1]);
  assert.deepEqual(order, [
    "src/data.js",
    "src/phrases.js",
    "assets/audio/manifest.js",
    "src/srs.js",
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
