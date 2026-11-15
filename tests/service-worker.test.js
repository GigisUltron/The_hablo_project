/* Execute the real service worker in a VM and exercise install + fetch.
 * This is not a browser; it checks the cache policy that the browser runs. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const workerSource = fs.readFileSync(path.join(root, "sw.js"), "utf8");

class FakeResponse {
  constructor(body, opts = {}) {
    this.body = String(body);
    this.ok = opts.ok !== false;
    this.status = opts.status || (this.ok ? 200 : 503);
  }
  clone() { return new FakeResponse(this.body, { ok: this.ok, status: this.status }); }
  text() { return Promise.resolve(this.body); }
}

function key(request) { return typeof request === "string" ? request : String(request.url); }

test("the service worker installs the shell, answers online and falls back offline", async () => {
  const store = new Map();
  const cache = {
    put: async (request, response) => { store.set(key(request), response); },
    match: async (request) => store.get(key(request)) || null
  };
  let online = true;
  const fetched = [];
  const fetch = async (request) => {
    const url = typeof request === "string" ? request : request.url;
    fetched.push(url);
    if (!online) throw new Error("offline");
    if (url.endsWith("index.html")) {
      return new FakeResponse('<!doctype html><script src="src/app.js"></script><script src="src/coach.js"></script>');
    }
    return new FakeResponse("asset:" + url);
  };
  const handlers = {};
  const self = {
    location: { origin: "https://app.example" },
    clients: { claim: async () => {} },
    skipWaiting: async () => {},
    addEventListener(type, fn) { handlers[type] = fn; }
  };
  const caches = {
    open: async () => cache,
    keys: async () => ["old-shell", "hablo-shell-v1"],
    delete: async () => true,
    match: async (request) => store.get(key(request)) || null
  };
  const ctx = vm.createContext({
    self, caches, fetch, Response: FakeResponse, URL, Promise, console,
    cachesOpen: caches.open
  });
  vm.runInContext(workerSource, ctx, { filename: "sw.js" });

  const waits = [];
  handlers.install({ waitUntil: (p) => waits.push(p) });
  await Promise.all(waits);
  assert.ok(store.has("./index.html"), "index was not cached");
  assert.ok(store.has("./src/app.js"), "app script was not cached");
  assert.ok(store.has("./src/coach.js"), "coach script was not cached");
  assert.ok(store.has("./assets/styles.css"), "stylesheet was not cached");

  const onlineResponse = [];
  handlers.fetch({
    request: { method: "GET", url: "https://app.example/src/app.js", mode: "cors" },
    respondWith: (p) => onlineResponse.push(p)
  });
  const response = await onlineResponse[0];
  assert.equal(await response.text(), "asset:https://app.example/src/app.js");

  online = false;
  const offlineResponse = [];
  handlers.fetch({
    request: { method: "GET", url: "https://app.example/src/app.js", mode: "cors" },
    respondWith: (p) => offlineResponse.push(p)
  });
  const cached = await offlineResponse[0];
  assert.equal(await cached.text(), "asset:https://app.example/src/app.js");

  const nav = [];
  handlers.fetch({
    request: { method: "GET", url: "https://app.example/deep/link", mode: "navigate" },
    respondWith: (p) => nav.push(p)
  });
  const shell = await nav[0];
  assert.ok((await shell.text()).includes('<script src="src/app.js">'), "navigation did not fall back to the shell");
});
