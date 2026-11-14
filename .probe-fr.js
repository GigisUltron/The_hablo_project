const fs = require("fs");
const vm = require("vm");
const html = fs.readFileSync("index.html", "utf8");
const staticIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

const registry = new Map();
function el(id) {
  const n = {
    id: id || "", _html: "", style: {}, dataset: {}, value: "", disabled: false, hidden: false,
    textContent: "", scrollTop: 0, scrollHeight: 0, listeners: {}, _attrs: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    removeEventListener() {},
    setAttribute(k, v) { this._attrs[k] = String(v); },
    getAttribute(k) { return k in this._attrs ? this._attrs[k] : null; },
    removeAttribute(k) { delete this._attrs[k]; },
    appendChild(c) { return c; }, insertAdjacentHTML() {},
    querySelectorAll() { return []; }, querySelector() { return null; }, closest() { return null; },
    focus() {}, click() {},
    set innerHTML(v) { this._html = String(v); }, get innerHTML() { return this._html; }
  };
  return n;
}
const document = {
  getElementById(id) {
    if (!registry.has(id)) registry.set(id, el(id));
    return registry.get(id);
  },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  createElement() { return el(); }, createElementNS() { return el(); },
  addEventListener() {}, body: el("body")
};
const seen = {};
for (const id of ["ph-hola","ph-como-estas","ph-de-donde","ph-color"]) seen[id] = { last: Date.now()-86400000, due: Date.now()+86400000, interval: 2, reps: 2, lapses: 0 };
const localStorage = {
  _s: { "sema.v1": JSON.stringify({ version: 1, profile: { level: "A2", lang: "es", uiLang: "en", byLang: {} }, settings: { size: 8, translations: "on" }, cards: seen, confusions: {}, reviews: { good: 0, again: 0 }, sessions: 2, history: [8,8], memory: { sentences: [] } }) },
  getItem(k) { return this._s[k] || null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; }
};
const windowObj = {
  document, localStorage,
  location: { hash: "", href: "http://example.test/" },
  history: { replaceState() {} }, navigator: {}, console,
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  alert: () => {}, confirm: () => true, scrollTo: () => {}, requestAnimationFrame: () => 0
};
windowObj.window = windowObj; windowObj.self = windowObj; windowObj.globalThis = windowObj;
const ctx = vm.createContext(windowObj);
for (const rel of scripts) vm.runInContext(fs.readFileSync(rel, "utf8"), ctx, { filename: rel });

const start = registry.get("start-btn");
console.log("start listeners:", start && start.listeners.click ? start.listeners.click.length : 0);
if (start && start.listeners.click) start.listeners.click[0]();
const stage = registry.get("stage");
console.log("STAGE:", (stage ? stage.innerHTML : "(none)").slice(0, 500));
const counter = registry.get("counter");
console.log("COUNTER:", counter && counter.textContent);
