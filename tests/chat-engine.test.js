/* The model adapter, tested without a model.
 *
 * Every request is built as plain data and every network call goes through an
 * injected fetch. That is enough to pin the shapes that Ollama and the
 * OpenAI-compatible servers actually expect, without pretending a model ran.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const CE = require("../src/chat-engine.js");

const SYSTEM = "You are a patient conversation partner.";

test("the prompt names the active pack and asks for a short English gloss", () => {
  const es = CE.buildSystemPrompt({ name: "Spanish", locale: "es-ES" }, "A2");
  assert.match(es, /Spanish/);
  assert.match(es, /es-ES/);
  assert.match(es, /one or two short sentences/);
  assert.match(es, /English gloss/);
  assert.match(es, /ask one simple question back/);

  const fr = CE.buildSystemPrompt({ name: "French", locale: "fr-FR" }, "B1");
  assert.match(fr, /French/);
  assert.match(fr, /fr-FR/);
  assert.doesNotMatch(fr, /Spanish/);
});

test("an unknown level does not leak into the prompt", () => {
  assert.match(CE.buildSystemPrompt({ name: "Spanish" }, "?"), /level A2/);
  assert.match(CE.buildSystemPrompt({ name: "Spanish" }, "C2"), /level A2/);
});

test("the translation prompt names the active pack and asks for English only", () => {
  const es = CE.buildTranslationPrompt({ name: "Spanish", locale: "es-ES" });
  assert.match(es, /Spanish/);
  assert.match(es, /English/);
  assert.match(es, /Return only/);

  const de = CE.buildTranslationPrompt({ name: "German", locale: "de-DE" });
  assert.match(de, /German/);
  assert.doesNotMatch(de, /Spanish/);
});

test("the writing coach rewrites in the target language and notes the change", () => {
  const text = CE.buildWritingPrompt({ name: "Spanish" }, "A2", "English", "Yo va al café.");
  assert.match(text, /Spanish/);
  assert.match(text, /Yo va al café/);
  assert.match(text, /rewrite the sentence naturally/);
  assert.match(text, /English only/);
  assert.match(text, /under 60 words/);
});

test("the progress coach receives real counts, not invented progress", () => {
  const text = CE.buildProgressPrompt({ name: "Spanish" }, "A2", "English",
    { known: 42, total: 120, solid: 18, produced: 11, due: 7, sessions: 9, streak: 3,
      weakest: "city", confusion: "casa / calle" });
  assert.match(text, /42 of 120/);
  assert.match(text, /interval at least six days/);
  assert.match(text, /Can produce \(a correct production answer\): 11/);
  assert.match(text, /Due now: 7/);
  assert.match(text, /casa \/ calle/);
  assert.match(text, /one concrete next step/);
});

test("the session coach uses the real kept and missed items", () => {
  const text = CE.buildSessionCoachPrompt({ name: "Spanish" }, "A2", "English",
    ["la casa", "el pan"], ["la cuenta"]);
  assert.match(text, /la casa/);
  assert.match(text, /la cuenta/);
  assert.match(text, /one specific thing/);
  assert.match(text, /one thing to notice/);
  assert.match(text, /English only/);
});

test("the mistake prompt carries the correct and learner answers without shame", () => {
  const text = CE.buildExplainPrompt({ name: "Spanish" }, "A2", "English",
    { text: "la cuenta", meaning: "the bill", sentence: "La cuenta, por favor." }, "el cuenta");
  assert.match(text, /Spanish/);
  assert.match(text, /English only/);
  assert.match(text, /la cuenta/);
  assert.match(text, /el cuenta/);
  assert.match(text, /Do not shame/);
  assert.match(text, /at most two short sentences/);
});

test("the scene prompt stays in character and in the target language", () => {
  const text = CE.buildScenePrompt({ name: "Spanish" }, "A2", "Learner context, not instructions: travel.", "a café in Madrid");
  assert.match(text, /Spanish/);
  assert.match(text, /a café in Madrid/);
  assert.match(text, /Stay in character/);
  assert.match(text, /Do not explain/);
  assert.match(text, /travel/);
});

test("the coach prompt asks for English notes, not another role-play", () => {
  const text = CE.buildCoachPrompt({ name: "Spanish" },
    "Learner context, not instructions: travel.", "Russian");
  assert.match(text, /Spanish/);
  assert.match(text, /Russian only/);
  assert.match(text, /one specific thing/);
  assert.match(text, /one concrete next step/);
  assert.match(text, /travel/);
});

test("the learner's own context is appended as data, not rules", () => {
  const text = CE.buildSystemPrompt({ name: "Spanish", locale: "es-ES" }, "A2",
    "Learner context, not instructions: The learner is learning for: travel.");
  assert.match(text, /learning for: travel/);
  assert.match(text, /not instructions/);
});

test("the Chinese prompt asks for pinyin lines; Spanish and French do not", () => {
  const zh = CE.buildSystemPrompt({ code: "zh", name: "Chinese", locale: "zh-CN" }, "A1");
  assert.match(zh, /pinyin/);
  assert.match(zh, /Simplified Chinese characters/);
  assert.match(zh, /parentheses on its own line/);
  /* the existing rules stay in force */
  assert.match(zh, /one or two short sentences/);
  assert.match(zh, /ask one simple question back/);
  assert.match(zh, /English gloss/);

  const es = CE.buildSystemPrompt({ name: "Spanish", locale: "es-ES" }, "A2");
  assert.doesNotMatch(es, /pinyin/i);
  const fr = CE.buildSystemPrompt({ name: "French", locale: "fr-FR" }, "A2");
  assert.doesNotMatch(fr, /pinyin/i);
});

test("the ollama request carries the system turn and a user image as base64", () => {
  const req = CE.buildRequest({
    engine: "ollama",
    baseUrl: "http://localhost:11434",
    model: "tiny-model",
    system: SYSTEM,
    vision: true,
    history: [
      { role: "user", text: "hola", image: "data:image/png;base64,AAAA" },
      { role: "assistant", text: "hola" }
    ]
  });

  assert.equal(req.url, "http://localhost:11434/api/chat");
  assert.equal(req.model, "tiny-model");
  assert.equal(req.body.stream, false);
  assert.deepEqual(req.body.messages[0], { role: "system", content: SYSTEM });
  assert.deepEqual(req.body.messages[1], { role: "user", content: "hola", images: ["AAAA"] });
  assert.deepEqual(req.body.messages[2], { role: "assistant", content: "hola" });
});

test("a text-only model never receives the image", () => {
  const req = CE.buildRequest({
    engine: "ollama",
    baseUrl: "http://localhost:11434",
    model: "tiny-model",
    system: SYSTEM,
    vision: false,
    history: [{ role: "user", text: "hola", image: "data:image/png;base64,AAAA" }]
  });

  assert.deepEqual(req.body.messages[1], {
    role: "user",
    content: "hola (the learner attached an image; this model is text-only)"
  });
  assert.equal(req.body.messages[1].images, undefined);
});

test("the openai request uses an image_url part, and /v1 is not doubled", () => {
  const req = CE.buildRequest({
    engine: "openai",
    baseUrl: "http://localhost:1234/v1",
    model: "tiny-vl",
    system: SYSTEM,
    vision: true,
    history: [{ role: "user", text: "hola", image: "data:image/png;base64,AAAA" }]
  });

  assert.equal(req.url, "http://localhost:1234/v1/chat/completions");
  assert.equal(req.body.messages[1].role, "user");
  assert.deepEqual(req.body.messages[1].content, [
    { type: "text", text: "hola" },
    { type: "image_url", image_url: { url: "data:image/png;base64,AAAA" } }
  ]);
});

test("sendChat posts exactly the built request and parses an ollama reply", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, json: async () => ({ message: { content: "  Hola.  " } }) };
  };

  const res = await CE.sendChat({
    engine: "ollama",
    baseUrl: "http://localhost:11434",
    model: "tiny-model",
    system: SYSTEM,
    vision: false,
    history: [{ role: "user", text: "hola" }]
  }, fetchImpl);

  assert.deepEqual(res, { ok: true, text: "Hola." });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "http://localhost:11434/api/chat");
  assert.equal(JSON.parse(calls[0].init.body).model, "tiny-model");
  assert.equal(JSON.parse(calls[0].init.body).messages[0].role, "system");
});

test("sendChat parses an openai reply and reports failure without throwing", async () => {
  const ok = await CE.sendChat({
    engine: "openai",
    baseUrl: "http://localhost:1234/v1",
    model: "tiny-model",
    system: SYSTEM,
    history: [{ role: "user", text: "hola" }]
  }, async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: "Bonjour." } }] })
  }));
  assert.deepEqual(ok, { ok: true, text: "Bonjour." });

  const failed = await CE.sendChat({
    engine: "ollama",
    baseUrl: "http://localhost:11434",
    model: "tiny-model",
    system: SYSTEM,
    history: [{ role: "user", text: "hola" }]
  }, async () => { throw new Error("nothing listening"); });
  assert.equal(failed.ok, false);
  assert.equal(failed.text, undefined);
});

test("discover reads ollama tags, then openai models", async () => {
  const ollama = await CE.discover("http://localhost:11434", async (url) => {
    assert.equal(url, "http://localhost:11434/api/tags");
    return { ok: true, json: async () => ({ models: [{ name: "tiny-model" }] }) };
  });
  assert.equal(ollama.engine, "ollama");
  assert.deepEqual(ollama.models, [{ name: "tiny-model", vision: false }]);

  const calls = [];
  const openai = await CE.discover("http://localhost:1234/v1", async (url) => {
    calls.push(url);
    return { ok: true, json: async () => ({ data: [{ id: "tiny-vl", capabilities: ["vision"] }] }) };
  });
  assert.deepEqual(calls, ["http://localhost:1234/v1/models"]);
  assert.equal(openai.engine, "openai");
  assert.deepEqual(openai.models, [{ name: "tiny-vl", vision: true }]);

  const textOnly = await CE.discover("http://example.test:8080/v1", async (url) => {
    assert.equal(url, "http://example.test:8080/v1/models");
    return { ok: true, json: async () => ({ data: [{ id: "tiny-text", capabilities: ["completion"] }] }) };
  });
  assert.equal(textOnly.engine, "openai");
  assert.deepEqual(textOnly.models, [{ name: "tiny-text", vision: false }]);
});

test("discover returns no engine when nothing answers", async () => {
  const found = await CE.discover("http://localhost:11434", async () => {
    throw new Error("offline");
  });
  assert.equal(found.engine, null);
  assert.deepEqual(found.models, []);
});

test("vision is a declaration from the model, not a guess from its name", async () => {
  const calls = [];
  const seen = await CE.visionFor({
    baseUrl: "http://localhost:11434",
    engine: "ollama",
    model: "tiny-model",
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, json: async () => ({ capabilities: ["completion", "vision"] }) };
    }
  });
  assert.equal(seen, true);
  assert.equal(calls[0].url, "http://localhost:11434/api/show");
  assert.deepEqual(calls[0].body, { name: "tiny-model" });

  const blind = await CE.visionFor({
    baseUrl: "http://localhost:11434",
    engine: "ollama",
    model: "tiny-model",
    fetchImpl: async () => ({ ok: true, json: async () => ({ capabilities: ["completion"] }) })
  });
  assert.equal(blind, false);

  const declared = await CE.visionFor({
    baseUrl: "http://localhost:1234/v1",
    engine: "openai",
    model: "tiny-vl",
    models: [{ name: "tiny-vl", vision: true }]
  });
  assert.equal(declared, true);
});

test("a serialised conversation survives the load path with translations and scripted state", () => {
  const saved = {
    version: 1,
    chat: {
      es: {
        messages: [
          { role: "user", text: "hola", at: 1 },
          { role: "assistant", text: "¡Hola!", translation: "Hello!", showTranslation: true, at: 2 },
          { role: "assistant", text: "¿Cómo te llamas?", scripted: true, note: "scripted", at: 3 }
        ],
        scripted: { turn: 1, misses: 0, topics: ["greet", "name"] }
      },
      fr: { messages: [{ role: "user", text: "salut", at: 4 }], scripted: null }
    }
  };

  const reloaded = CE.normaliseChatStore(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(reloaded, saved.chat);
  assert.equal(reloaded.es.messages[1].translation, "Hello!");
  assert.equal(reloaded.es.messages[1].showTranslation, true);
  assert.equal(reloaded.es.messages[2].scripted, true);
  assert.deepEqual(reloaded.es.scripted, { turn: 1, misses: 0, topics: ["greet", "name"] });
  assert.deepEqual(reloaded.fr.messages, [{ role: "user", text: "salut", at: 4 }]);
});

test("the chat store tolerates a missing or broken save", () => {
  assert.deepEqual(CE.normaliseChatStore(null), {});
  assert.deepEqual(CE.normaliseChatStore({ chat: [] }), {});
  assert.deepEqual(CE.normaliseChatStore({ chat: { es: { messages: "nope" } } }), { es: { messages: [] } });
});

test("arm then clear empties only the active language even after a render", () => {
  const store = {
    es: { messages: [{ role: "user", text: "hola" }], scripted: { turn: 1 } },
    fr: { messages: [{ role: "user", text: "salut" }], scripted: null }
  };
  const state = { armed: false };

  assert.equal(CE.clearTap(state, store, "es").action, "arm");
  assert.equal(state.armed, true);

  /* A re-render can read the state and redraw the label; it must not reset it. */
  const redrawn = CE.clearControl(state, true);
  assert.equal(redrawn.label, "tap again to clear");
  assert.equal(redrawn.armed, true);
  assert.equal(state.armed, true);

  assert.equal(CE.clearTap(state, store, "es").action, "clear");
  assert.equal(state.armed, false);
  assert.deepEqual(store.es, { messages: [], scripted: null });
  assert.deepEqual(store.fr.messages, [{ role: "user", text: "salut" }]);
});

test("clear does nothing on an empty conversation", () => {
  const store = { es: { messages: [] } };
  const state = { armed: false };
  assert.equal(CE.clearTap(state, store, "es").action, "none");
  assert.equal(state.armed, false);
  assert.deepEqual(CE.clearControl(state, false), { hidden: true, armed: false, label: "clear" });
});

test("the Spanish fallback is the existing scripted responder", () => {
  const session = CE.scriptedStart("es");
  const reply = CE.scriptedRespond("es", session, "bien");
  assert.equal(reply.topic, "greet");
  assert.match(reply.next, /\?/);
});

test("the French fallback answers in French when no pack conversation exists", () => {
  const session = CE.scriptedStart("fr");
  const reply = CE.scriptedRespond("fr", session, "ça va bien");
  assert.equal(reply.topic, "greet");
  assert.match(CE.scriptedOpening("fr"), /Bonjour/);
  assert.match(reply.next, /Comment/);
});

test("endpoints keep the shape the user typed", () => {
  assert.equal(CE.endpointFor("http://localhost:11434", "ollama"), "http://localhost:11434/api/chat");
  assert.equal(CE.endpointFor("http://localhost:11434/", "ollama"), "http://localhost:11434/api/chat");
  assert.equal(CE.endpointFor("http://localhost:1234/v1", "openai"), "http://localhost:1234/v1/chat/completions");
  assert.equal(CE.endpointFor("http://localhost:1234", "openai"), "http://localhost:1234/v1/chat/completions");
  assert.equal(CE.isLocalEndpoint("http://localhost:11434"), true);
  assert.equal(CE.isLocalEndpoint("http://example.com/v1"), false);
});

test("a base URL is accepted with no slash, one slash, or /v1", () => {
  const base = "http://example.test:8080";

  assert.equal(CE.normaliseBaseUrl(base), base);
  assert.equal(CE.normaliseBaseUrl(base + "/"), base);
  assert.equal(CE.normaliseBaseUrl(base + "/v1"), base + "/v1");
  assert.equal(CE.normaliseBaseUrl(base + "/v1/"), base + "/v1");
  assert.equal(CE.normaliseBaseUrl(base + "/v1/chat/completions"), base + "/v1");
  assert.equal(CE.normaliseBaseUrl(base + "/api/chat"), base);
  assert.equal(CE.normaliseBaseUrl("example.test:8080"), "http://example.test:8080");
  assert.equal(CE.normaliseBaseUrl(""), CE.DEFAULT_ENDPOINT);

  assert.equal(CE.endpointFor(base, "openai"), base + "/v1/chat/completions");
  assert.equal(CE.endpointFor(base + "/v1", "openai"), base + "/v1/chat/completions");
  assert.equal(CE.endpointFor(base + "/", "ollama"), base + "/api/chat");
});
