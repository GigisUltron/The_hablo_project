/* The chat view's HTML, and the one escape helper it is allowed to use.
 *
 * The bubble builder is pure: it takes the app's own `esc` function and returns
 * a string. These tests walk every dynamic value through a spy, so a later
 * refactor that starts interpolating model text directly fails here.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const CE = require("../src/chat-engine.js");

function spyEsc() {
  const calls = [];
  const esc = (value) => {
    calls.push(String(value));
    return String(value).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  };
  return { esc, calls };
}

test("every dynamic value in a bubble goes through the app escape helper", () => {
  const { esc, calls } = spyEsc();
  const html = CE.messageHTML({
    role: "user",
    text: '<img src=x onerror="y">',
    image: "data:image/png;base64,AAAA",
    note: "<b>note</b>"
  }, esc, { canSpeak: false });

  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /&lt;img src=x/);
  assert.doesNotMatch(html, /<b>note/);
  assert.match(html, /&lt;b&gt;note/);
  assert.ok(calls.some((c) => c.includes("onerror")), "message text was not escaped");
  assert.ok(calls.includes("data:image/png;base64,AAAA"), "image URL was not escaped");
  assert.ok(calls.includes("attached image"), "alt text was not escaped");
  assert.ok(calls.includes("<b>note</b>"), "note was not escaped");
});

test("an assistant bubble offers a hear button and still escapes its note", () => {
  const { esc, calls } = spyEsc();
  const html = CE.messageHTML({
    role: "assistant",
    text: "hola",
    note: "scripted"
  }, esc, { canSpeak: true, index: 3 });

  assert.match(html, /data-hear="3"/);
  assert.match(html, /bubble-note/);
  assert.ok(calls.includes("scripted"));
  assert.ok(calls.includes("hear this reply"));
});

test("a non-image URL never becomes an image element", () => {
  const { esc } = spyEsc();
  const html = CE.messageHTML({
    role: "user",
    text: "x",
    image: "javascript:alert(1)"
  }, esc);
  assert.doesNotMatch(html, /javascript:/);
  assert.doesNotMatch(html, /bubble-img/);
});

test("the attachment preview also routes its URL and label through escape", () => {
  const { esc, calls } = spyEsc();
  const html = CE.attachmentHTML({ dataUrl: "data:image/png;base64,AAAA" }, esc);
  assert.match(html, /attach-thumb/);
  assert.match(html, /data-attach-clear/);
  assert.ok(calls.includes("data:image/png;base64,AAAA"));
  assert.ok(calls.includes("attached image"));
  assert.ok(calls.includes("remove image"));
});

test("an assistant bubble offers a per-message translation control", () => {
  const { esc, calls } = spyEsc();
  const hidden = CE.messageHTML(
    { role: "assistant", text: "hola" },
    esc,
    { canTranslate: true, index: 4 }
  );
  assert.match(hidden, /data-translate="4"/);
  assert.match(hidden, /show translation/);
  assert.doesNotMatch(hidden, /bubble-translation"/);

  const shown = CE.messageHTML(
    { role: "assistant", text: "hola", translation: "hello", showTranslation: true },
    esc,
    { canTranslate: true, index: 4 }
  );
  assert.match(shown, /hide translation/);
  assert.match(shown, /class="bubble-translation"/);
  assert.ok(calls.includes("hello"));
});

test("the translation control is absent when no model is connected", () => {
  const { esc } = spyEsc();
  const html = CE.messageHTML(
    { role: "assistant", text: "hola" },
    esc,
    { canTranslate: false, canSpeak: false }
  );
  assert.doesNotMatch(html, /data-translate/);
  assert.doesNotMatch(html, /show translation/);
});

test("translation text and its failure note are escaped", () => {
  const { esc, calls } = spyEsc();
  const shown = CE.messageHTML(
    { role: "assistant", text: "hola", translation: '<b>hello</b>', showTranslation: true },
    esc,
    { canTranslate: true, index: 1 }
  );
  assert.doesNotMatch(shown, /<b>hello/);
  assert.match(shown, /&lt;b&gt;hello/);
  assert.ok(calls.includes("<b>hello</b>"));

  const failed = CE.messageHTML(
    { role: "assistant", text: "hola", translationError: true },
    esc,
    { canTranslate: true, index: 1 }
  );
  assert.match(failed, /translation unavailable/);
});

test("the chat view passes the app's escape helper into both builders", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /CE\.messageHTML\(m, esc,/, "bubbles do not use esc");
  assert.match(app, /CE\.attachmentHTML\(pendingImage, esc\)/, "the attachment preview does not use esc");
  assert.equal(/innerHTML\s*=\s*[^;]*\+\s*m\.(text|note|image)\s*\+/.test(app), false,
    "chat text is interpolated into innerHTML without esc");
});

test("conversation state is per language and the prompt comes from the live pack", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /state\.chat\[code\]/, "the chat is not keyed by the active language");
  assert.match(app, /s\.chat = s\.chat/, "older saves do not get a chat store");
  assert.match(app, /CE\.buildSystemPrompt\(ACTIVE/, "the prompt does not read the active pack");
  assert.match(app, /history: chat\.messages\.slice\(-CE\.MAX_HISTORY\)/,
    "the request does not send a bounded recent history");
});

test("the view says when no local model answered", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /no local model found — run ollama serve/);
  assert.match(app, /scripted/, "fallback replies are not labelled");
  assert.match(app, /text-only model · image not sent/, "images are not marked text-only");
});

test("per-message translation is model-backed, pack-aware and cached", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const start = app.indexOf("function translateMessage");
  const end = app.indexOf("function startConversation");
  const block = app.slice(start, end);

  assert.match(block, /CE\.buildTranslationPrompt\(ACTIVE\)/);
  assert.match(block, /CE\.sendChat\(/);
  assert.match(block, /target\.translation = String\(res\.text\)\.trim\(\)/);
  assert.match(block, /history: \[\{ role: "user", text: msg\.text \}\]/);
  assert.doesNotMatch(block, /SEMA_GLOSSES|glosses/, "translation must not come from the gloss map");
  assert.match(app, /canTranslate: chatMeta\.status === "ready"/,
    "translation controls must disappear when no model is ready");
});

test("clearing the chat touches only the active language conversation", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const start = app.indexOf("function clearChat");
  const end = app.indexOf("function translateMessage");
  const block = app.slice(start, end);

  assert.match(block, /chat\.messages = \[\]/);
  assert.match(block, /chat\.scripted = null/);
  assert.match(block, /chatEpoch \+= 1/);
  assert.doesNotMatch(block, /state\.memory|state\.cards|byLang/);
  assert.match(app, /tap again/);
  assert.match(block, /renderChat\(\)/, "the empty state is not rendered after clearing");
});
