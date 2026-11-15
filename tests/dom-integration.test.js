/* Boot the real app scripts in a small DOM shim and click a real control.
 * This is not a browser; it is an integration test of boot + event wiring. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

function node(id) {
  return {
    id, style: {}, value: "", disabled: false, hidden: false, textContent: "", _html: "", _l: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    _attrs: {},
    addEventListener(t, f) { this._l[t] = f; }, removeEventListener() {},
    setAttribute(k, v) { this._attrs[k] = String(v); }, getAttribute(k) { return this._attrs[k] == null ? null : this._attrs[k]; }, removeAttribute(k) { delete this._attrs[k]; },
    appendChild(c) { return c; }, insertAdjacentHTML() {},
    querySelectorAll() { return []; }, querySelector() { return null; }, closest() { return null; },
    focus() {}, click() { if (this._l.click) this._l.click.call(this); },
    set innerHTML(v) { this._html = String(v); }, get innerHTML() { return this._html; }
  };
}

function boot(save, hash = "") {
  const registry = new Map();
  const why = ["travel", "work", "family", "culture"].map((value) => {
    const chip = node("why-" + value);
    chip._attrs["data-why"] = value;
    registry.set(chip.id, chip);
    return chip;
  });
  const tabs = ["today", "stats", "settings"].map((view) => {
    const tab = node("tab-" + view);
    tab._attrs["data-view"] = view;
    registry.set(tab.id, tab);
    return tab;
  });
  const document = {
    getElementById(id) { if (!registry.has(id)) registry.set(id, node(id)); return registry.get(id); },
    querySelectorAll(selector) {
      if (selector === "[data-why]") return why;
      if (selector === ".tab") return tabs;
      return [];
    },
    querySelector(selector) { return selector === "#view-setup .setup-q" ? registry.get("setup-q") || null : null; },
    createElement() { return node(); }, createElementNS() { return node(); },
    addEventListener() {}, body: node("body"),
    documentElement: node("html"), activeElement: null
  };
  const store = {
    getItem(k) { return k === "sema.v1" && save ? JSON.stringify(save) : null; },
    setItem() {}, removeItem() {}
  };
  const win = {
    document, localStorage: store, location: { hash, reload() {} },
    history: { replaceState() {} }, navigator: {}, console,
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    requestAnimationFrame: () => 0, confirm: () => true, scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    fetch: () => Promise.reject(new Error("offline"))
  };
  win.window = win; win.self = win; win.globalThis = win;
  const ctx = vm.createContext(win);
  for (const rel of scripts) {
    vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), ctx, { filename: rel });
  }
  return registry;
}

test("the real app boots with a profile and opens a roleplay from the Practice row", () => {
  const save = {
    version: 1,
    profile: {
      level: "A2", levelByLang: { es: "A2" }, lang: "es", uiLang: "en",
      byLang: {}, languages: ["es"], why: "travel"
    },
    settings: { size: 8, translations: "on", audio: "off", autoSpeak: "off" },
    cards: {}, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 0,
    memory: { sentences: [] }, daily: { date: "2026-11-15", cards: 0 }
  };
  const registry = boot(save);
  const row = registry.get("home-roleplay");
  assert.ok(row, "roleplay row is missing");
  assert.ok(row._l.click, "roleplay row is not wired");
  row._l.click();
  const scene = registry.get("chat-scene");
  const text = registry.get("chat-scene-text");
  assert.equal(scene.hidden, false, "roleplay did not open the scene strip");
  assert.equal(text.textContent, "travel", "roleplay did not use the personal why");
});

test("the alphabet screen reveals a flashcard and opens the all-letters grid", () => {
  const save = {
    version: 1,
    profile: {
      level: "A1", levelByLang: { ar: "A1" }, lang: "ar", uiLang: "en",
      byLang: {}, languages: ["ar"], why: "travel"
    },
    settings: { size: 8, translations: "on", audio: "off", autoSpeak: "off" },
    cards: {}, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 0,
    alphabet: {}, memory: { sentences: [] }, daily: { date: "2026-11-15", cards: 0 }
  };
  const registry = boot(save, "#writing");
  const stage = registry.get("alphabet-stage");
  assert.match(stage.innerHTML, /letter-card/);
  assert.match(stage.innerHTML, /letter-big/);
  assert.doesNotMatch(stage.innerHTML, /letter-detail/, "front side already gives the answer");
  const reveal = registry.get("letter-reveal");
  assert.ok(reveal && reveal._l.click, "reveal is not wired");
  reveal._l.click();
  assert.match(stage.innerHTML, /letter-detail/);
  assert.match(stage.innerHTML, /letter-example-text/);
  const all = registry.get("letter-all");
  assert.ok(all && all._l.click, "all-letters control is not wired");
  all._l.click();
  assert.match(stage.innerHTML, /letter-grid/);
  assert.match(stage.innerHTML, /letter-tile/);
  const quiz = registry.get("alphabet-quiz");
  assert.ok(quiz && quiz._l.click, "quiz control is not wired");
  quiz._l.click();
  assert.match(stage.innerHTML, /letter-quiz-options/);
  assert.match(stage.innerHTML, /option-word/);
});

test("a brand-new learner can pick a why, start fresh and reach a card", () => {
  const registry = boot(null);
  const whyChip = registry.get("why-travel");
  assert.ok(whyChip && whyChip._l.click, "why chip is not wired");
  whyChip._l.click();
  const fresh = registry.get("setup-new");
  assert.ok(fresh && fresh._l.click, "I'm new is not wired");
  fresh._l.click();
  const reason = registry.get("personal-line");
  assert.equal(reason.hidden, false, "the selected why is not shown on Today");
  assert.match(reason.textContent, /Travel/);
  const start = registry.get("start-btn");
  assert.ok(start && start._l.click, "Start is not wired");
  start._l.click();
  const stage = registry.get("stage");
  assert.ok(stage.innerHTML.length > 20, "Start did not render a card");
});

test("Progress, Settings and Reader can be opened from the real controls", () => {
  const save = {
    version: 1,
    profile: {
      level: "A2", levelByLang: { es: "A2" }, lang: "es", uiLang: "en",
      byLang: {}, languages: ["es"], why: "travel"
    },
    settings: { size: 8, translations: "on", audio: "off", autoSpeak: "off" },
    cards: {}, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 0,
    memory: { sentences: [] }, daily: { date: "2026-11-15", cards: 0 }
  };
  const registry = boot(save);
  const stats = registry.get("tab-stats");
  assert.ok(stats._l.click, "Progress tab is not wired");
  stats._l.click();
  assert.ok(registry.get("progress-summary").textContent.length > 0, "Progress did not render its summary");
  const settings = registry.get("tab-settings");
  settings._l.click();
  assert.ok(registry.get("view-settings").hidden === false, "Settings view is not active");
  const read = registry.get("read-btn");
  assert.ok(read && read._l.click, "Read is not wired");
  read._l.click();
  assert.match(registry.get("reader-stage").innerHTML, /reader-body/);
  assert.ok(registry.get("reader-go")._l.click, "Reader questions are not wired");
  registry.get("reader-go")._l.click();
  assert.match(registry.get("reader-stage").innerHTML, /option-word/);
});

test("a conversation opens with an honest empty state and accepts a message", () => {
  const save = {
    version: 1,
    profile: {
      level: "A2", levelByLang: { es: "A2" }, lang: "es", uiLang: "en",
      byLang: {}, languages: ["es"], why: "travel"
    },
    settings: { size: 8, translations: "on", audio: "off", autoSpeak: "off" },
    cards: {}, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 0,
    memory: { sentences: [] }, daily: { date: "2026-11-15", cards: 0 }
  };
  const registry = boot(save);
  const open = registry.get("home-conv");
  assert.ok(open && open._l.click, "conversation entry is not wired");
  open._l.click();
  const log = registry.get("chat");
  assert.match(log.innerHTML, /Say something in /);
  assert.doesNotMatch(log.innerHTML, /attach a picture/i);
  const input = registry.get("chat-input");
  input.value = "Hola, me llamo Ana.";
  const form = registry.get("chat-form");
  assert.ok(form && form._l.submit, "chat form is not wired");
  form._l.submit({ preventDefault() {} });
  assert.match(log.innerHTML, /Hola, me llamo Ana/);
});
