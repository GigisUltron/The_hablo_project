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
const X = require(path.join(root, "src", "ui-extra.js"));

function node(id) {
  return {
    id, style: {}, value: "", disabled: false, hidden: false, textContent: "", _html: "", _l: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    _attrs: {},
    addEventListener(t, f) { this._l[t] = f; }, removeEventListener() {},
    setAttribute(k, v) { this._attrs[k] = String(v); }, getAttribute(k) { return this._attrs[k] == null ? null : this._attrs[k]; }, removeAttribute(k) { delete this._attrs[k]; },
    appendChild(c) { return c; }, insertAdjacentHTML() {},
    querySelectorAll(selector) {
      if (String(selector).includes("data-accent-theme")) {
        if (this._accentCache && this._accentCache.html === this._html && this._accentCache.selector === selector) {
          return this._accentCache.nodes;
        }
        const out = [];
        String(this._html || "").replace(/<button([^>]*)>([\s\S]*?)<\/button>/g, (all, attrs, inner) => {
          if (!/data-accent-theme/.test(attrs)) return all;
          const child = node("accent-" + out.length);
          const parsed = {};
          attrs.replace(/([\w-]+)="([^"]*)"/g, (m, key, value) => { parsed[key] = value; return m; });
          child._attrs = parsed;
          child.textContent = inner.replace(/<[^>]*>/g, "");
          out.push(child);
          return all;
        });
        this._accentCache = { html: this._html, selector, nodes: out };
        return out;
      }
      const sel = String(selector);
      if (!/option|token|match-btn|data-target|data-meaning/.test(sel)) return [];
      if (this._optionCache && this._optionCache.html === this._html && this._optionCache.selector === selector) {
        return this._optionCache.nodes;
      }
      const out = [];
      String(this._html || "").replace(/<button([^>]*)>([\s\S]*?)<\/button>/g, (all, attrs, inner) => {
        const parsed = {};
        attrs.replace(/([\w-]+)="([^"]*)"/g, (m, key, value) => { parsed[key] = value; return m; });
        const cls = parsed.class || "";
        if (sel.includes("match-btn") && !/\bmatch-btn\b/.test(cls)) return all;
        if (sel.includes("data-target") && parsed["data-target"] == null) return all;
        if (sel.includes("data-meaning") && parsed["data-meaning"] == null) return all;
        if (sel.includes("token") && !/\btoken\b/.test(cls)) return all;
        if (sel.includes("option") && !/\boption/.test(cls)) return all;
        const child = node("option-" + out.length);
        child._attrs = parsed;
        child.textContent = inner.replace(/<[^>]*>/g, "");
        out.push(child);
        return all;
      });
      this._optionCache = { html: this._html, selector, nodes: out };
      return out;
    },
    querySelector() { return null; }, closest() { return null; },
    focus() {}, click() { if (this._l.click) this._l.click.call(this); },
    set innerHTML(v) { this._html = String(v); }, get innerHTML() { return this._html; }
  };
}

function boot(save, hash = "", options = {}) {
  const registry = new Map();
  const themeMeta = node("theme-meta");
  themeMeta._attrs.name = "theme-color";
  registry.set("theme-meta", themeMeta);
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
  const scheme = { dark: false, listeners: [] };
  const darkQuery = {
    get matches() { return scheme.dark; },
    addEventListener(type, fn) { if (type === "change") scheme.listeners.push(fn); },
    addListener(fn) { scheme.listeners.push(fn); }
  };
  const accents = {
    ember: ["#c8410c", "#ff8a5c"],
    plum: ["#7a2e57", "#e07aa8"],
    moss: ["#3f6b3a", "#8fc98a"]
  };
  const timers = { pending: new Map(), next: 0 };
  function schedule(fn, ms) {
    timers.next += 1;
    timers.pending.set(timers.next, { id: timers.next, fn, ms: Number(ms) || 0 });
    return timers.next;
  }
  timers.run = function (ms) {
    [...timers.pending.values()].filter((t) => t.ms === ms).forEach((t) => {
      timers.pending.delete(t.id);
      t.fn();
    });
  };
  const document = {
    getElementById(id) { if (!registry.has(id)) registry.set(id, node(id)); return registry.get(id); },
    querySelectorAll(selector) {
      if (selector === "[data-why]") return why;
      if (selector === ".tab") return tabs;
      return [];
    },
    querySelector(selector) {
      if (selector === 'meta[name="theme-color"]') return themeMeta;
      return selector === "#view-setup .setup-q" ? registry.get("setup-q") || null : null;
    },
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
    AbortController,
    setTimeout: schedule, clearTimeout(id) { timers.pending.delete(id); },
    setInterval: () => 0, clearInterval: () => {},
    requestAnimationFrame: () => 0, confirm: () => true, scrollTo: () => {},
    getComputedStyle(el) {
      const id = (el && el.getAttribute && el.getAttribute("data-accent")) || "ember";
      const pair = accents[id] || accents.ember;
      return { getPropertyValue(name) { return name === "--accent" ? pair[scheme.dark ? 1 : 0] : ""; } };
    },
    matchMedia(query) {
      if (query === "(prefers-color-scheme: dark)") return darkQuery;
      return { matches: false, addEventListener() {}, addListener() {} };
    },
    fetch: options.fetch || (() => Promise.reject(new Error("offline")))
  };
  win.window = win; win.self = win; win.globalThis = win;
  const ctx = vm.createContext(win);
  for (const rel of scripts) {
    vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), ctx, { filename: rel });
  }
  registry.timers = timers;
  registry.setScheme = function (dark) {
    scheme.dark = !!dark;
    scheme.listeners.forEach(function (fn) { fn({ matches: scheme.dark }); });
  };
  return registry;
}

function pending(registry, ms) {
  return [...registry.timers.pending.values()].filter((t) => t.ms === ms);
}

function sessionSave(extra) {
  return Object.assign({
    version: 1,
    profile: {
      level: "A2", levelByLang: { es: "A2" }, lang: "es", uiLang: "en",
      byLang: {}, languages: ["es"], why: "travel"
    },
    settings: { size: 5, length: "short", translations: "on", audio: "off", autoSpeak: "off" },
    cards: {}, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 0,
    memory: { sentences: [] }, daily: { date: "2026-11-15", cards: 0 }
  }, extra || {});
}

function dueSave() {
  return sessionSave({
    cards: {
      "ph-hola": { id: "ph-hola", ef: 2.5, interval: 1, reps: 2, lapses: 0, due: Date.now() - 86400000, last: 2 }
    }
  });
}

/* A stub local model: it answers discovery, the vision probe, and one streamed
 * Ollama reply in two content chunks. No socket, no model, no dependency. */
function modelFetch() {
  return function (url) {
    if (/\/api\/tags$/.test(url)) {
      return Promise.resolve({
        ok: true, status: 200,
        json: () => Promise.resolve({ models: [{ name: "stub-model" }] })
      });
    }
    if (/\/api\/show$/.test(url)) {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ capabilities: [] }) });
    }
    if (/\/api\/chat$/.test(url)) {
      const chunks = [
        JSON.stringify({ message: { content: "Hola" }, done: false }) + "\n",
        JSON.stringify({ message: { content: ", ¿qué tal?" }, done: false }) + "\n",
        JSON.stringify({ done: true }) + "\n"
      ];
      let i = 0;
      return Promise.resolve({
        ok: true, status: 200,
        body: {
          getReader() {
            return {
              read() {
                return Promise.resolve(i < chunks.length ? { done: false, value: chunks[i++] } : { done: true });
              },
              cancel() { return Promise.resolve(); }
            };
          }
        }
      });
    }
    return Promise.reject(new Error("unexpected request " + url));
  };
}

/* The same stub, but the reply stalls after its first chunk so the browser
 * path can exercise Stop. */
function hangingModelFetch() {
  return function (url) {
    if (/\/api\/tags$/.test(url)) {
      return Promise.resolve({
        ok: true, status: 200,
        json: () => Promise.resolve({ models: [{ name: "stub-model" }] })
      });
    }
    if (/\/api\/show$/.test(url)) {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ capabilities: [] }) });
    }
    if (/\/api\/chat$/.test(url)) {
      let sent = false;
      return Promise.resolve({
        ok: true, status: 200,
        body: {
          getReader() {
            return {
              read() {
                if (!sent) {
                  sent = true;
                  return Promise.resolve({
                    done: false,
                    value: JSON.stringify({ message: { content: "Hola" }, done: false }) + "\n"
                  });
                }
                return new Promise(() => {});
              },
              cancel() { return Promise.resolve(); }
            };
          }
        }
      });
    }
    return Promise.reject(new Error("unexpected request " + url));
  };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

function firstSessionCard(registry) {
  registry.get("start-btn")._l.click();
  return registry.get("stage").querySelectorAll(".option-word");
}

function clickAnswer(registry, id) {
  const stage = registry.get("stage");
  if (/id="build-pool"/.test(stage.innerHTML)) {
    /* The pool's data-token index is the correct word position: 0,1,2 are
     * the target sentence, later indexes are decoys. */
    const order = id ? [0, 1, 2] : [2, 1, 0];
    const pool = registry.get("build-pool");
    for (const i of order) {
      const token = pool.querySelectorAll(".token").find((b) => b.getAttribute("data-token") === String(i));
      assert.ok(token, "build token " + i + " is missing");
      token._l.click();
    }
    const buildCheck = registry.get("build-check");
    assert.ok(buildCheck && buildCheck._l.click, "the build card has no Check control");
    buildCheck._l.click();
    return;
  }
  const options = registry.get("stage").querySelectorAll(".option-word");
  const choice = id
    ? options.find((b) => b.getAttribute("data-id") === id)
    : options.find((b) => b.getAttribute("data-id") !== "ph-hola");
  assert.ok(choice, "no answer option to click");
  choice._l.click();
  const check = registry.get("check");
  assert.ok(check && check._l.click, "the answer has no Check control");
  check._l.click();
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
  const quizOptions = stage.querySelectorAll("[data-quiz-option]");
  assert.ok(quizOptions.length === 3, "quiz options did not parse");
  quizOptions[0]._l.click();
  assert.ok(registry.get("alphabet-feedback").textContent.length > 0, "quiz did not grade an answer");
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
  const readerOptions = registry.get("reader-stage").querySelectorAll(".option-word");
  assert.ok(readerOptions.length >= 3, "reader options did not parse");
  readerOptions[0]._l.click();
  const readerCheck = registry.get("reader-check");
  assert.ok(readerCheck && readerCheck._l.click, "reader has no Check control");
  assert.equal(readerCheck.disabled, false, "reader Check did not enable after a selection");
  readerCheck._l.click();
  assert.ok(registry.get("reader-feedback").textContent.length > 0, "reader did not grade an answer");
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


test("a model reply streams into the conversation and then settles", async () => {
  const registry = boot(sessionSave(), "", { fetch: modelFetch() });
  registry.get("home-conv")._l.click();
  await settle();
  await settle();
  assert.equal(registry.get("chat-status").getAttribute("data-state"), "ready",
    "the stubbed local model was not discovered");

  const input = registry.get("chat-input");
  input.value = "Hola";
  registry.get("chat-form")._l.submit({ preventDefault() {} });
  await settle();
  await settle();

  const log = registry.get("chat").innerHTML;
  assert.match(log, /Hola, ¿qué tal\?/, "the streamed reply never reached the log");
  assert.equal(registry.get("chat-send").textContent, X.en.send,
    "the send control did not return from its stop state");
});

test("Stop aborts a streamed reply, keeps the partial text, and restores Send", async () => {
  const registry = boot(sessionSave(), "", { fetch: hangingModelFetch() });
  registry.get("home-conv")._l.click();
  await settle();
  await settle();

  const input = registry.get("chat-input");
  input.value = "Hola";
  registry.get("chat-form")._l.submit({ preventDefault() {} });
  assert.equal(registry.get("chat-send").textContent, X.en.stop,
    "the send control did not become Stop while the reply was in flight");

  registry.get("chat-form")._l.submit({ preventDefault() {} });
  await settle();
  await settle();
  await settle();

  assert.equal(registry.get("chat-send").textContent, X.en.send,
    "aborting left the send control stuck on Stop");
  assert.equal(registry.get("conv-feedback").textContent, X.en.stopped,
    "the stop was not reported");
  assert.match(registry.get("chat").innerHTML, /Hola/,
    "the partial reply was dropped instead of kept");
});

test("the browser chrome follows the active look and the system scheme", () => {
  const registry = boot(sessionSave({
    settings: {
      size: 5, translations: "on", audio: "off", autoSpeak: "off",
      accent: "ember", unlockedAccents: ["ember", "plum", "moss"]
    },
    coins: 500
  }));
  const meta = registry.get("theme-meta");
  assert.equal(meta.getAttribute("content"), "#c8410c", "boot did not paint the chrome with the accent");
  registry.setScheme(true);
  assert.equal(meta.getAttribute("content"), "#ff8a5c", "the dark-scheme accent did not reach the chrome");
  registry.setScheme(false);
  registry.get("tab-settings")._l.click();
  const plum = registry.get("accent-list").querySelectorAll("[data-accent-theme]")
    .find((b) => b.getAttribute("data-accent-theme") === "plum");
  assert.ok(plum && plum._l.click, "the plum look is not wired");
  plum._l.click();
  assert.equal(meta.getAttribute("content"), "#7a2e57", "choosing a look did not repaint the chrome");
});

test("a session card says why it asks, and never gives the answer away", () => {
  const fresh = boot(sessionSave());
  firstSessionCard(fresh);
  assert.equal(fresh.get("why-line").textContent, X.en.new, "a never-graded card is not labelled new");
  const labels = fresh.get("why-line").textContent + " " + fresh.get("stage").innerHTML;
  assert.equal((labels.match(new RegExp("\\b" + X.en.new + "\\b", "g")) || []).length, 1,
    "the new label is printed twice on a teach card");
  assert.notEqual(fresh.get("why-line").textContent, "Hola", "the why line leaked the answer");

  const due = boot(dueSave());
  firstSessionCard(due);
  assert.equal(due.get("why-line").textContent, X.en.toReview, "a due card is not labelled for review");

  clickAnswer(due); // deliberately the wrong choice: ph-hola is missing
  assert.match(due.get("feedback").innerHTML, new RegExp(X.en.comesBack), "a miss is not reported");
  due.get("back-btn")._l.click();
  assert.equal(due.get("why-line").textContent, "", "a past task still claims to be the current one");
  due.get("return-task")._l.click();
  assert.equal(due.get("why-line").textContent, X.en.comesBack, "a requeued miss is not labelled as coming back");
  assert.notEqual(due.get("why-line").textContent, "Hola", "the why line leaked the answer");
});

test("translations off falls back to a meaning-free task instead of looping", () => {
  const save = dueSave();
  save.settings = Object.assign({}, save.settings, { translations: "off", audio: "on" });
  const registry = boot(save);
  assert.doesNotThrow(() => firstSessionCard(registry), "a due card recursed with translations off");
  const stage = registry.get("stage");
  assert.ok(stage.innerHTML.length > 20, "nothing rendered with translations off");
  assert.doesNotMatch(stage.innerHTML, /translateInto|Translate into/, "a translation prompt was shown while translations are off");
  assert.match(stage.innerHTML, /build-line|msg-thread|listen-line|listenType|listenPick/, "no meaning-free task fell back in");
});

test("translations off teaches every new card instead of quizzing without a prompt", () => {
  const save = sessionSave({
    settings: { size: 5, length: "short", translations: "off", audio: "off", autoSpeak: "off" }
  });
  const registry = boot(save);
  firstSessionCard(registry);
  /* The fourth new card used to reach pick-word with no prompt and overflow. */
  for (let i = 0; i < 4; i += 1) {
    const got = registry.get("gotit");
    assert.ok(got && got._l.click, `teach card ${i + 1} has no Got it control`);
    assert.doesNotThrow(() => got._l.click(), `teach card ${i + 1} recursed`);
  }
  assert.ok(registry.get("stage").innerHTML.length > 20, "the session stopped rendering after the taught cards");
  assert.equal(registry.get("why-line").textContent, X.en.new, "a new card stopped being labelled new");
});

test("Progress shows accuracy with its sample and a coach line that is not a stat dump", () => {
  const save = sessionSave({ reviews: { good: 8, again: 2 } });
  const registry = boot(save);
  registry.get("tab-stats")._l.click();
  const summary = registry.get("progress-summary").textContent;
  assert.match(summary, /80% accuracy/, "Progress dropped the real accuracy");
  assert.match(summary, /10 recalled/, "accuracy is shown without its sample size");
  assert.equal(registry.get("coach-read-text").textContent, X.en.coachProgressFirst,
    "an empty Progress screen does not say what to do first");
  assert.doesNotMatch(registry.get("coach-read-text").textContent, /80%|can produce/,
    "the coach read repeats the header stats");
  assert.equal(registry.get("produce-practice").hidden, true,
    "the producing action is shown when there are no cards to produce");
});

test("production practice with translations off dictates instead of writing from nothing", () => {
  const save = dueSave();
  save.settings = Object.assign({}, save.settings, { translations: "off", audio: "off" });
  const registry = boot(save);
  registry.get("tab-stats")._l.click();
  const start = registry.get("produce-practice");
  assert.ok(start && start._l.click, "Practice producing is not wired");
  start._l.click();
  const stage = registry.get("stage");
  assert.ok(stage.innerHTML.length > 20, "production practice rendered nothing");
  assert.match(stage.innerHTML, new RegExp(X.en.audioUnavailable),
    "the no-prompt production card did not fall back to dictation");
  assert.doesNotMatch(stage.innerHTML, new RegExp(X.en.writeIt),
    "production practice still asked for a write with no prompt to write from");
});

test("a correct answer's advance is cancelled on leave", () => {
  const registry = boot(dueSave());
  firstSessionCard(registry);
  clickAnswer(registry, "ph-hola");
  assert.equal(pending(registry, 900).length, 1, "a correct answer did not schedule its advance");

  registry.get("quit-btn")._l.click();
  assert.equal(registry.get("confirm-modal").hidden, false, "quitting did not ask first");
  registry.get("confirm-ok")._l.click();
  assert.equal(pending(registry, 900).length, 0, "leaving kept the pending advance");

  registry.get("start-btn")._l.click();
  assert.equal(registry.get("counter").textContent, "1/5", "the next session did not start on its first card");
  registry.timers.run(900);
  assert.equal(registry.get("counter").textContent, "1/5", "a stale advance moved the next session");
});

test("going back over an answered card cancels its auto-advance", () => {
  const registry = boot(dueSave());
  firstSessionCard(registry);
  clickAnswer(registry, "ph-hola");
  assert.equal(pending(registry, 900).length, 1, "a correct answer did not schedule its advance");
  registry.get("back-btn")._l.click();
  assert.equal(pending(registry, 900).length, 0, "going back kept the pending advance");
  registry.timers.run(900);
  assert.equal(registry.get("why-line").textContent, "", "a cancelled advance moved the task");
  registry.get("return-task")._l.click();
  assert.equal(registry.get("why-line").textContent, "", "a reviewed, not-due card invents a reason");
});

test("starting another session cannot inherit the previous advance", () => {
  const registry = boot(dueSave());
  firstSessionCard(registry);
  clickAnswer(registry, "ph-hola");
  assert.equal(pending(registry, 900).length, 1, "a correct answer did not schedule its advance");
  registry.get("start-btn")._l.click();
  assert.equal(pending(registry, 900).length, 0, "the replaced session left its advance running");
  assert.equal(registry.get("counter").textContent, "1/5", "the new session did not start on its first card");
  registry.timers.run(900);
  assert.equal(registry.get("counter").textContent, "1/5", "the old advance moved the new session");
});

test("the quit dialog pauses the advance instead of moving the card behind it", () => {
  const registry = boot(dueSave());
  firstSessionCard(registry);
  clickAnswer(registry, "ph-hola");
  registry.get("quit-btn")._l.click();
  registry.timers.run(900);
  assert.equal(registry.get("counter").textContent, "1/5", "the card advanced behind the dialog");
  assert.equal(pending(registry, 200).length, 1, "the paused advance was dropped");
  registry.get("confirm-cancel")._l.click();
  registry.timers.run(200);
  assert.equal(registry.get("counter").textContent, "2/5", "cancelling the dialog did not resume the advance");
});

test("the progressbar reports the step it is on", () => {
  const registry = boot(dueSave());
  firstSessionCard(registry);
  const bar = registry.get("session-progress");
  assert.equal(bar.getAttribute("aria-valuemax"), "5", "the progressbar has no session size");
  assert.equal(bar.getAttribute("aria-valuenow"), "0", "the progressbar starts partway through");
  clickAnswer(registry, "ph-hola");
  registry.timers.run(900);
  assert.equal(bar.getAttribute("aria-valuenow"), "1", "the progressbar did not move with the session");
});
