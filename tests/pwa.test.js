const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

test("the web app manifest is installable and points at real icons", () => {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.ok(manifest.icons.length >= 2);
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(root, icon.src)), `${icon.src} missing`);
  }
  const png = fs.readFileSync(path.join(root, "assets", "icon-192.png"));
  assert.equal(png.slice(0, 8).toString("hex"), "89504e470d0a1a0a");
});

test("the shell registers a service worker only on http(s)", () => {
  const registration = read("src/pwa.js");
  assert.match(registration, /serviceWorker/);
  assert.match(registration, /https\?/);
  assert.ok(registration.includes('register("./sw.js"'), "service worker is not registered");
  assert.ok(read("index.html").includes('src="src/pwa.js"'), "pwa script is not linked");
});

test("the service worker caches the app shell and falls back offline", () => {
  const worker = read("sw.js");
  assert.match(worker, /install/);
  assert.match(worker, /activate/);
  assert.match(worker, /fetch/);
  assert.match(worker, /cacheShell/);
  assert.ok(worker.includes("index.html"), "worker does not cache the shell");
  assert.ok(worker.includes('request.mode === "navigate"'), "worker has no navigation fallback");
  assert.match(worker, /url\.origin !== self\.location\.origin/);
});
