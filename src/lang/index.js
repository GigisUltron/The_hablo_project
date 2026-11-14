/* sema — language pack registry.
 *
 * A pack is data, not a code path. Each file in src/lang/<code>/ registers one
 * part with SemaLangs.define(); the app only ever talks to SemaLangs.load(code),
 * which returns every part in the same shape regardless of which pack is live.
 *
 * Load order matters: this file must be the first <script> of the language
 * block, and audio captures (src/lang/<code>/audio.js) must run immediately
 * after their generated manifest.
 *
 * Under Node the same API reads the pack folders from disk, so tests can load a
 * pack without a browser.
 */
(function (root) {
  "use strict";

  var packs = {};       // code -> { code, parts, meta }
  var order = [];       // registration order, which is also the picker order

  /* A missing part is a valid pack: French has no texts yet, and a learner
   * should see an empty deck rather than a crash. */
  function emptyConv() {
    return {
      dialogues: [],
      start: function () { return null; },
      fits: function () { return true; },
      fold: function (s) { return String(s || "").toLowerCase().trim(); }
    };
  }

  function normaliseConv(conv) {
    if (conv && Array.isArray(conv.dialogues) && typeof conv.fits === "function") return conv;
    return emptyConv();
  }

  function define(code, part, value, meta) {
    if (!code || !part) return;
    var p = packs[code];
    if (!p) {
      p = packs[code] = { code: code, parts: {}, meta: {} };
      order.push(code);
    }
    p.parts[part] = value;
    if (meta) {
      if (meta.name) p.meta.name = meta.name;
      if (meta.locale) p.meta.locale = meta.locale;
    }
    /* concepts carries the language header; every pack has one */
    if (part === "concepts" && value && value.language) {
      if (value.language.name) p.meta.name = value.language.name;
      if (value.language.locale) p.meta.locale = value.language.locale;
    }
  }

  /* Node-only fallback: read the same files the browser loads as scripts. */
  function audioFromDisk(code) {
    if (typeof require !== "function") return {};
    try {
      var fs = require("fs");
      var path = require("path");
      var file = code === "es"
        ? path.join(__dirname, "..", "..", "assets", "audio", "manifest.js")
        : path.join(__dirname, "..", "..", "assets", "audio", code, "manifest.js");
      var source = fs.readFileSync(file, "utf8");
      var match = source.match(/window\.SEMA_AUDIO\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
      return match ? JSON.parse(match[1]) : {};
    } catch (err) {
      return {};
    }
  }

  function partsFromDisk(code) {
    if (typeof require !== "function" || !/^[a-z]{2}(-[a-z]+)?$/i.test(code)) return null;
    var names = ["concepts", "phrases", "terms", "basics", "glosses", "levels", "alphabet", "texts", "conv"];
    var parts = {};
    var found = false;
    names.forEach(function (part) {
      try {
        parts[part] = require("./" + code + "/" + part + ".js");
        found = true;
      } catch (err) {
        if (err && err.code !== "MODULE_NOT_FOUND") throw err;
      }
    });
    parts.audio = audioFromDisk(code);
    if (Object.keys(parts.audio).length) found = true;
    return found ? parts : null;
  }

  function codesOnDisk() {
    if (typeof require !== "function") return [];
    try {
      var fs = require("fs");
      var path = require("path");
      return fs.readdirSync(__dirname, { withFileTypes: true })
        .filter(function (entry) { return entry.isDirectory(); })
        .map(function (entry) { return entry.name; });
    } catch (err) {
      return [];
    }
  }

  function load(code) {
    code = String(code || "es");
    var p = packs[code];
    var parts = p ? p.parts : partsFromDisk(code);
    if (!parts) return null;

    var concepts = parts.concepts && Array.isArray(parts.concepts.concepts)
      ? parts.concepts
      : { language: null, categories: {}, relationTypes: {}, concepts: [], edges: [] };
    var lang = concepts.language || {};
    var meta = p ? p.meta : {};

    return {
      code: code,
      name: meta.name || lang.name || code,
      locale: meta.locale || lang.locale || code,
      concepts: concepts,
      phrases: parts.phrases && Array.isArray(parts.phrases.phrases) ? parts.phrases : { phrases: [] },
      terms: parts.terms && Array.isArray(parts.terms.terms) ? parts.terms : { terms: [] },
      basics: parts.basics && Array.isArray(parts.basics.items) ? parts.basics : { items: [], rows: [] },
      glosses: parts.glosses || {},
      levels: parts.levels || {},
      alphabet: parts.alphabet && Array.isArray(parts.alphabet.letters) ? parts.alphabet : { letters: [] },
      texts: parts.texts && Array.isArray(parts.texts.texts) ? parts.texts : { texts: [] },
      conv: normaliseConv(parts.conv),
      audio: parts.audio || {}
    };
  }

  function has(code) {
    return !!packs[code] || !!partsFromDisk(code);
  }

  /* The picker lists registered packs, in the order they were registered.
   * Under Node, fall back to the pack folders on disk. */
  function list() {
    var codes = order.length ? order.slice() : codesOnDisk();
    return codes.map(function (code) {
      var pack = load(code);
      return pack ? { code: pack.code, name: pack.name, locale: pack.locale } : null;
    }).filter(Boolean);
  }

  var api = {
    define: define,
    load: load,
    list: list,
    has: has,
    /* Keep the legacy globals pointing at the live pack. Some renderers read
     * them directly (texts, glosses), and older tools expect the Spanish
     * globals to exist under their original names. */
    bind: function (pack) {
      if (!pack) return;
      root.SEMA_DATA = pack.concepts;
      root.SEMA_PHRASES = pack.phrases;
      root.SEMA_TERMS = pack.terms;
      root.SEMA_BASICS = pack.basics;
      root.SEMA_GLOSSES = pack.glosses;
      root.SEMA_LEVELS = pack.levels;
      root.SEMA_ALPHABET = pack.alphabet;
      root.SEMA_TEXTS = pack.texts;
      root.SemaConv = pack.conv;
      root.SEMA_AUDIO = pack.audio;
    },
    defaultCode: "es",
    packs: packs
  };

  root.SemaLangs = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
