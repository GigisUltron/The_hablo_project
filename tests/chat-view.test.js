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

test("pinyin parentheticals render quietly, and empty parentheses disappear", () => {
  const { esc } = spyEsc();
  const html = CE.renderChatText("你好！\n(nǐ hǎo!)", esc);
  assert.match(html, /bubble-pinyin/);
  assert.match(html, /\(nǐ hǎo!\)/);
  assert.doesNotMatch(html, /\(\)/);

  assert.equal(CE.renderChatText("你好()", esc), "你好");
  assert.equal(CE.renderChatText("你好！", esc), "你好！");
});

test("pinyin text is escaped and an inline gloss still reads", () => {
  const { esc } = spyEsc();
  const html = CE.renderChatText("你好！(nǐ <b>hǎo</b>!)", esc);
  assert.doesNotMatch(html, /<b>hǎo/);
  assert.match(html, /&lt;b&gt;hǎo/);
  assert.match(html, /bubble-pinyin/);
});

test("the replay button speaks the first message after a third reply arrives", () => {
  const { esc } = spyEsc();
  const first = { id: "m1", role: "assistant", text: "first reply" };
  const second = { id: "m2", role: "assistant", text: "second reply" };

  const html = CE.messageHTML(first, esc, { canSpeak: true, index: 0 });
  const id = /data-hear="([^"]+)"/.exec(html)[1];
  assert.equal(id, "m1");

  const messages = [first, second];
  messages.push({ id: "m3", role: "assistant", text: "third reply" });
  assert.equal(CE.messageTextById(messages, id), "first reply");
});

test("translation controls carry the same stable id, not the array position", () => {
  const { esc } = spyEsc();
  const html = CE.messageHTML(
    { id: "m7", role: "assistant", text: "hola" },
    esc,
    { canTranslate: true, index: 0 }
  );
  assert.match(html, /data-translate="m7"/);
  assert.doesNotMatch(html, /data-translate="0"/);
});

test("a failed replay lookup is visible, not silent", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /that reply is no longer available\./);
  assert.doesNotMatch(app, /chat\.messages\[Number\(btn\.getAttribute\("data-hear"\)\)\]/);
  assert.match(app, /id: newChatId\(\)/, "new messages do not get an id");
  assert.match(app, /m\.id = newChatId\(\)/, "older saved messages do not get an id");
});

test("the conversation view no longer offers image attachment", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.doesNotMatch(html, /id="chat-image"|id="chat-attach"|chat-attachment/);
  assert.doesNotMatch(app, /chatImageChange|downscaleImage|pendingImage|attachmentHTML/);
});

test("the chat view passes the app's escape helper into the bubble builder", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /CE\.messageHTML\(m, esc,/, "bubbles do not use esc");
  assert.equal(/innerHTML\s*=\s*[^;]*\+\s*m\.(text|note|image)\s*\+/.test(app), false,
    "chat text is interpolated into innerHTML without esc");
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

test("conversation state is per language and the prompt comes from the live pack", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /state\.chat\[code\]/, "the chat is not keyed by the active language");
  assert.match(app, /CE\.normaliseChatStore\(s\)/, "boot does not load the chat store");
  assert.match(app, /CE\.buildSystemPrompt\(ACTIVE/, "the prompt does not read the active pack");
  assert.match(app, /history: chat\.messages\.slice\(-CE\.MAX_HISTORY\)/,
    "the request does not send a bounded recent history");
});

test("the conversation view opens its saved chat on a refresh", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /initial === "chat" \|\| initial === "conv"/,
    "#conv must call startConversation, not just show the view");
  assert.match(app, /CE\.normaliseChatStore\(s\)/,
    "boot does not run the conversation store through the load path");
});

test("the view says when no local model answered", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /no local model found — run ollama serve/);
  assert.match(app, /scripted/, "fallback replies are not labelled");
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
  assert.match(app, /askConfirm\(/);
  assert.match(block, /renderChat\(\)/, "the empty state is not rendered after clearing");
});

test("opening the chat lands at the newest message", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.match(app, /renderChat\(true\)/, "entry does not force the bottom");
  assert.match(app, /requestAnimationFrame/, "entry does not settle the scroll after layout");
});

test("a reply streams, can be stopped, and a cancel never falls back", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const start = app.indexOf("function sendChatTurn");
  const end = app.indexOf("function assignMission");
  const block = app.slice(start, end);

  assert.match(block, /CE\.streamChat\(/);
  assert.match(block, /onChunk: function \(delta\)/);
  assert.match(block, /abortFactory/);
  assert.match(block, /if \(chatPending\) \{ abortChatStream\(\); return; \}/,
    "a second press while streaming is not a stop control");
  assert.match(block, /res\.error === "aborted"/);
  assert.match(block, /setChatFeedback\(tr\("stopped"/,
    "a cancel is not reported in the interface language");
  assert.match(block, /Text already reached the screen: finishing beats double-sending/,
    "text already on screen has no path that skips the fallback");
  assert.match(block, /if \(pending\) \{[\s\S]{0,260}return;\n      \}\n      chatMeta = \{ status: "failed"/,
    "a failed stream with text on screen still falls back");
  assert.match(block, /CE\.pickContext\(P\.phrases, text, 3\)/,
    "the prompt is not grounded in authored phrases");
  assert.match(block, /grounding: grounded/);
  assert.match(app, /function setChatBusy[\s\S]{0,320}tr\("stop"/,
    "the send control never becomes a stop control");
  assert.match(app, /if \(view !== "conv"\) abortChatStream\(\)/,
    "leaving the conversation does not stop the stream");
  assert.match(app, /function clearChat[\s\S]{0,160}abortChatStream\(\)/,
    "clearing the conversation does not stop the stream");
});

test("a deck switch and a roleplay start both reset the chat stream state", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const start = app.indexOf("function switchLang");
  const switchBlock = app.slice(start, start + 1200);
  assert.match(switchBlock, /abortChatStream\(\);\s*setChatBusy\(false\);/,
    "switching deck can leave the chat controls stuck on Stop");

  const roleStart = app.indexOf("function startRoleplay");
  const roleBlock = app.slice(roleStart, roleStart + 2200);
  assert.match(roleBlock, /abortChatStream\(\);\s*setChatBusy\(false\);/,
    "opening a roleplay can inherit the previous conversation's busy state");
});
