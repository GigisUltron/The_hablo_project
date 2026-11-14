/* sema — the chat engine.
 *
 * The conversation view can talk to a model running on the learner's own
 * machine. This module owns everything that can be tested without a browser:
 * the system prompt, the request the model receives, reply parsing, discovery,
 * and a clearly-labelled scripted fallback for when no model is answering.
 *
 * No DOM, no storage, no clock. The network is only reached through a fetch
 * passed in by the caller (or the global one), so tests can stand in for it.
 *
 * Two request shapes are supported:
 *   ollama — POST /api/chat, images as base64 in `images`
 *   openai — POST /v1/chat/completions, images as `image_url` content parts
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(root);
  else root.SemaChatEngine = factory(root);
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var DEFAULT_ENDPOINT = "http://localhost:11434";
  var DEFAULT_MODEL = "llama3.2";
  var DEFAULT_LEVEL = "A2";
  var MAX_HISTORY = 12;

  /* ------------------------------------------------------------- endpoints */

  function trimSlash(url) {
    return String(url == null ? "" : url).trim().replace(/\/+$/, "");
  }

  /* One canonical base URL for the settings field. It accepts what a person
   * is likely to paste: no scheme, a trailing slash, a /v1 base, or a full
   * chat endpoint. The engine adds the path it needs afterwards. */
  function normaliseBaseUrl(value) {
    var v = String(value == null ? "" : value).trim();
    if (!v) return DEFAULT_ENDPOINT;
    if (!/^https?:\/\//i.test(v)) v = "http://" + v;
    v = v.replace(/\/+$/, "");
    v = v.replace(/\/chat\/completions$/i, "").replace(/\/api\/chat$/i, "");
    return v || DEFAULT_ENDPOINT;
  }

  function ollamaRoot(baseUrl) {
    return trimSlash(baseUrl || DEFAULT_ENDPOINT).replace(/\/api(\/chat)?$/i, "");
  }

  function openaiBase(baseUrl) {
    var u = trimSlash(baseUrl || DEFAULT_ENDPOINT).replace(/\/chat\/completions$/i, "");
    if (/\/v1$/i.test(u)) return u;
    return u + "/v1";
  }

  function endpointFor(baseUrl, engine) {
    if (engine === "ollama") return ollamaRoot(baseUrl) + "/api/chat";
    return openaiBase(baseUrl) + "/chat/completions";
  }

  function isLocalEndpoint(url) {
    return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i.test(String(url || ""));
  }

  /* --------------------------------------------------------------- the prompt */

  /* Built only from the live pack: its display name and locale. The learner's
   * level is optional, and anything unrecognised is treated as the default. */
  function buildSystemPrompt(pack, level) {
    var p = pack || {};
    var name = String(p.name || "the target language");
    var locale = String(p.locale || p.code || "");
    var lvl = /^(A1|A2|B1|B2)$/.test(String(level || "")) ? String(level) : DEFAULT_LEVEL;

    return [
      "You are a patient conversation partner helping someone learn " + name +
        (locale ? " (" + locale + ")" : "") + ".",
      "Reply in " + name + " only, in one or two short sentences, at level " + lvl + ".",
      "Use everyday words and ask one simple question back so the learner keeps talking.",
      "If a word is hard, add a short English gloss in parentheses.",
      "Never switch the whole reply to English. Correct a mistake gently by using the right form in your reply.",
      "Do not invent facts about the learner, and do not ask for personal details."
    ].join(" ");
  }

  /* A translation is a separate, one-message request. It must not reuse the
   * conversation system prompt, and it must name the pack that is live now. */
  function buildTranslationPrompt(pack) {
    var p = pack || {};
    var name = String(p.name || "the message");
    return "Translate the following " + name + " message into natural English. " +
      "Return only the English translation, without notes, quotation marks, or the original text.";
  }

  /* --------------------------------------------------------------- messages */

  function isImage(dataUrl) {
    return /^data:image\//i.test(String(dataUrl || ""));
  }

  function stripDataUrl(dataUrl) {
    var s = String(dataUrl || "");
    var i = s.indexOf(",");
    return i === -1 ? s : s.slice(i + 1);
  }

  function cleanHistory(history, max) {
    return (history || []).filter(function (m) {
      if (!m || (m.role !== "user" && m.role !== "assistant")) return false;
      return !!(m.text || m.image);
    }).slice(-(max || MAX_HISTORY));
  }

  /* A neutral turn shape: the engine-specific conversion happens once, in
   * buildRequest. `image` is only carried when the model can see it. */
  function buildMessages(system, history, opts) {
    var o = opts || {};
    var out = [{ role: "system", text: String(system || ""), image: null }];

    cleanHistory(history, o.maxHistory).forEach(function (m) {
      var text = String(m.text == null ? "" : m.text);
      var image = m.role === "user" && o.vision && isImage(m.image) ? m.image : null;
      if (m.role === "user" && m.image && !o.vision) {
        text = text
          ? text + " (the learner attached an image; this model is text-only)"
          : "(the learner attached an image; this model is text-only)";
      }
      out.push({ role: m.role, text: text, image: image });
    });
    return out;
  }

  function toOllamaMessage(m) {
    var msg = { role: m.role, content: m.text || "" };
    if (m.image) msg.images = [stripDataUrl(m.image)];
    return msg;
  }

  function toOpenAIMessage(m) {
    if (!m.image) return { role: m.role, content: m.text || "" };
    var parts = [];
    if (m.text) parts.push({ type: "text", text: m.text });
    parts.push({ type: "image_url", image_url: { url: m.image } });
    return { role: m.role, content: parts };
  }

  function buildRequest(opts) {
    var o = opts || {};
    var engine = o.engine === "openai" ? "openai" : "ollama";
    var model = String(o.model || DEFAULT_MODEL);
    var messages = buildMessages(o.system, o.history, {
      vision: !!o.vision,
      maxHistory: o.maxHistory
    });

    return {
      engine: engine,
      model: model,
      url: endpointFor(o.baseUrl, engine),
      body: {
        model: model,
        messages: messages.map(engine === "ollama" ? toOllamaMessage : toOpenAIMessage),
        stream: false
      }
    };
  }

  function replyText(engine, json) {
    if (!json) return "";
    if (engine === "ollama") {
      if (json.message && typeof json.message.content === "string") return json.message.content.trim();
      if (typeof json.response === "string") return json.response.trim();
      return "";
    }
    var choice = json.choices && json.choices[0];
    var content = choice && choice.message && choice.message.content;
    if (typeof content === "string") return content.trim();
    if (Array.isArray(content)) {
      return content.map(function (part) { return part && part.text ? part.text : ""; }).join("").trim();
    }
    if (choice && typeof choice.text === "string") return choice.text.trim();
    return "";
  }

  /* ---------------------------------------------------------------- network */

  function fetchJSON(url, init, fetchImpl, timeoutMs) {
    var f = fetchImpl || (root && root.fetch);
    if (typeof f !== "function") return Promise.resolve(null);

    var controller = null;
    var timer = null;
    var opts = {
      method: init.method || "GET",
      headers: init.headers || {}
    };
    if (init.body !== undefined) {
      opts.body = JSON.stringify(init.body);
      opts.headers["Content-Type"] = "application/json";
    }
    if (timeoutMs && typeof AbortController === "function") {
      controller = new AbortController();
      opts.signal = controller.signal;
      timer = setTimeout(function () {
        try { controller.abort(); } catch (err) { /* already finished */ }
      }, timeoutMs);
    }

    function done(value) {
      if (timer) clearTimeout(timer);
      return value;
    }

    return Promise.resolve().then(function () {
      return f(url, opts);
    }).then(function (res) {
      if (!res || !res.ok) return null;
      return res.json().catch(function () { return null; });
    }).catch(function () {
      return null;
    }).then(done);
  }

  function getJSON(url, fetchImpl, timeoutMs) {
    return fetchJSON(url, { method: "GET", headers: { Accept: "application/json" } }, fetchImpl, timeoutMs);
  }

  function postJSON(url, body, fetchImpl, timeoutMs) {
    return fetchJSON(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: body
    }, fetchImpl, timeoutMs);
  }

  function modelInfo(m) {
    if (!m) return null;
    var name = typeof m === "string" ? m : (m.name || m.id || m.model);
    if (!name) return null;
    var caps = Array.isArray(m.capabilities) ? m.capabilities : [];
    return {
      name: String(name),
      vision: m.vision === true || caps.indexOf("vision") !== -1
    };
  }

  /* Find an engine and its models without assuming one is running. The default
   * Ollama endpoint is tried first; a base URL ending in /v1 is already the
   * OpenAI-compatible shape, so it skips straight to /models. */
  function discover(baseUrl, fetchImpl, timeoutMs) {
    var base = trimSlash(baseUrl || DEFAULT_ENDPOINT);
    var first = /\/v1$/i.test(base)
      ? Promise.resolve(null)
      : getJSON(ollamaRoot(base) + "/api/tags", fetchImpl, timeoutMs);

    return first.then(function (tags) {
      if (tags && Array.isArray(tags.models)) {
        return {
          engine: "ollama",
          baseUrl: base,
          models: tags.models.map(modelInfo).filter(Boolean)
        };
      }
      return getJSON(openaiBase(base) + "/models", fetchImpl, timeoutMs).then(function (list) {
        if (list && Array.isArray(list.data)) {
          return {
            engine: "openai",
            baseUrl: base,
            models: list.data.map(modelInfo).filter(Boolean)
          };
        }
        return { engine: null, baseUrl: base, models: [] };
      });
    });
  }

  /* A model declares vision support; a guess from its name is not a declaration.
   * If the server cannot say, the answer is "no", and the UI marks the image as
   * stored but not sent. */
  function visionFor(opts) {
    var o = opts || {};
    if (!o.engine || !o.model) return Promise.resolve(false);

    if (o.engine === "openai") {
      var known = (o.models || []).filter(function (m) { return m.name === o.model; })[0];
      return Promise.resolve(!!(known && known.vision));
    }

    return postJSON(
      ollamaRoot(o.baseUrl) + "/api/show",
      { name: o.model },
      o.fetchImpl,
      o.timeoutMs
    ).then(function (info) {
      if (!info || !Array.isArray(info.capabilities)) return false;
      return info.capabilities.indexOf("vision") !== -1;
    });
  }

  function sendChat(opts, fetchImpl) {
    var o = opts || {};
    var req = buildRequest(o);
    return postJSON(req.url, req.body, fetchImpl || o.fetchImpl, o.timeoutMs).then(function (json) {
      if (!json) return { ok: false, error: "no reply" };
      if (json.error) return { ok: false, error: "model error" };
      var text = replyText(req.engine, json);
      if (!text) return { ok: false, error: "empty reply" };
      return { ok: true, text: text };
    });
  }

  /* ------------------------------------------------------- scripted fallback
   *
   * The app must stay usable with no model. Spanish reuses src/chat.js, the
   * responder that already exists. French has no conversation file of its own,
   * so this module carries the same small scripted shape in French. Neither is
   * a language model, and the UI labels every fallback reply as scripted.
   */

  var FR_TOPICS = [
    { id: "greet", ask: "Bonjour ! Ça va ?", accept: ["bien", "mal", "ca va", "comme ci"], after: "Content." },
    { id: "name", ask: "Comment tu t'appelles ?", accept: ["je m'appelle", "moi c'est"], after: "Enchanté." },
    { id: "origin", ask: "Tu viens d'où ?", accept: ["je viens de", "j'habite", "je suis de"], after: "Super." },
    { id: "color", ask: "Quelle est ta couleur préférée ?", accept: ["couleur", "bleu", "rouge", "vert", "noir", "blanc"], after: "Bon goût." },
    { id: "work", ask: "Qu'est-ce que tu fais ?", accept: ["je travaille", "j'étudie", "je suis"], after: "Intéressant." },
    { id: "bye", ask: "À bientôt !", accept: [], after: "" }
  ];

  function spanishModule() {
    if (root && root.SemaChat) return root.SemaChat;
    if (typeof require === "function") {
      try { return require("./chat.js"); } catch (err) { /* not present */ }
    }
    return null;
  }

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").trim();
  }

  function topicsFor(code) {
    return code === "fr" ? FR_TOPICS : null;
  }

  function scriptedStart(code) {
    if (topicsFor(code)) return { turn: 0, misses: 0 };
    var C = spanishModule();
    return C ? C.start() : { turn: 0, misses: 0, topics: [] };
  }

  function scriptedOpening(code) {
    if (topicsFor(code)) return FR_TOPICS[0].ask;
    var C = spanishModule();
    return C && C.topics && C.topics[0] ? C.topics[0].ask : "";
  }

  function respondTopics(code, chat, text) {
    var topics = topicsFor(code);
    var topic = topics[chat.turn];
    var sorry = code === "fr" ? "Je n'ai pas compris. " : "No he entendido. ";
    if (!topic) return { reply: code === "fr" ? "À bientôt !" : "¡Hasta pronto!", done: true };

    var said = fold(text);
    if (!said) {
      chat.misses += 1;
      return { reply: sorry + topic.ask, done: false, retry: true };
    }

    var fits = !topic.accept.length || topic.accept.some(function (a) {
      return said.indexOf(fold(a)) !== -1;
    });
    if (!fits) {
      chat.misses += 1;
      return { reply: sorry + topic.ask, done: false, retry: true };
    }

    chat.turn += 1;
    var next = topics[chat.turn];
    return { reply: topic.after, next: next ? next.ask : null, done: !next, topic: topic.id };
  }

  function scriptedRespond(code, chat, text) {
    if (topicsFor(code)) return respondTopics(code, chat, text);
    var C = spanishModule();
    if (C) return C.respond(chat, text);
    return { reply: "No local model found.", done: true };
  }

  /* ----------------------------------------------------------- view strings
   *
   * Pure HTML for a bubble. Every dynamic value goes through the app's own
   * escape helper, which is passed in, so there is one escaping rule in the
   * project rather than a second copy here.
   */

  function escValue(esc, value) {
    return typeof esc === "function" ? esc(value == null ? "" : value) : "";
  }

  function messageHTML(message, esc, opts) {
    var m = message || {};
    var o = opts || {};
    if (typeof esc !== "function") return "";

    var mine = m.role === "user";
    var text = m.text
      ? '<p class="bubble-text">' + escValue(esc, m.text) + "</p>"
      : "";
    var image = "";
    if (isImage(m.image)) {
      image = '<img class="bubble-img" src="' + escValue(esc, m.image) +
        '" alt="' + escValue(esc, "attached image") + '" />';
    }
    var note = m.note ? '<span class="bubble-note">' + escValue(esc, m.note) + "</span>" : "";

    var translation = typeof m.translation === "string" ? m.translation : "";
    var translating = !!o.translating;
    var translate = "";
    if (!mine && m.text && o.canTranslate) {
      var label = translating
        ? "translating…"
        : (translation && m.showTranslation ? "hide translation" : "show translation");
      translate = '<button class="bubble-translate" type="button" data-translate="' +
        escValue(esc, String(o.index || 0)) + '"' + (translating ? " disabled" : "") + ">" +
        escValue(esc, label) + "</button>";
    }

    var hear = "";
    if (!mine && m.text && o.canSpeak) {
      hear = '<button class="bubble-hear" type="button" data-hear="' + escValue(esc, String(o.index || 0)) +
        '" aria-label="' + escValue(esc, "hear this reply") + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/>' +
        '<path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/></svg></button>';
    }

    var actions = translate || hear
      ? '<div class="bubble-actions">' + translate + hear + "</div>"
      : "";
    var translationText = translation && m.showTranslation
      ? '<p class="bubble-translation">' + escValue(esc, translation) + "</p>"
      : "";
    var translationNote = m.translationError && !translation
      ? '<span class="bubble-translation-note">' + escValue(esc, "translation unavailable") + "</span>"
      : "";

    return '<div class="bubble' + (mine ? " mine" : "") + '">' + image + text + note +
      actions + translationText + translationNote + "</div>";
  }

  function attachmentHTML(pending, esc) {
    if (!pending || !isImage(pending.dataUrl) || typeof esc !== "function") return "";
    return '<div class="chat-attachment">' +
      '<img class="attach-thumb" src="' + esc(pending.dataUrl) + '" alt="' + esc("attached image") + '" />' +
      '<button class="btn btn-ghost" type="button" data-attach-clear="1">' + esc("remove image") + "</button>" +
      "</div>";
  }

  return {
    DEFAULT_ENDPOINT: DEFAULT_ENDPOINT,
    DEFAULT_MODEL: DEFAULT_MODEL,
    MAX_HISTORY: MAX_HISTORY,
    buildSystemPrompt: buildSystemPrompt,
    buildTranslationPrompt: buildTranslationPrompt,
    buildMessages: buildMessages,
    buildRequest: buildRequest,
    normaliseBaseUrl: normaliseBaseUrl,
    endpointFor: endpointFor,
    isLocalEndpoint: isLocalEndpoint,
    replyText: replyText,
    discover: discover,
    visionFor: visionFor,
    sendChat: sendChat,
    scriptedStart: scriptedStart,
    scriptedOpening: scriptedOpening,
    scriptedRespond: scriptedRespond,
    messageHTML: messageHTML,
    attachmentHTML: attachmentHTML,
    isImage: isImage
  };
});
