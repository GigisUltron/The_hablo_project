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
 *
 * Streaming is additive: streamChat(opts) sends the same request with
 * `stream: true` and reads Ollama NDJSON or OpenAI-compatible SSE. It calls
 * opts.onChunk(deltaText) as text arrives and resolves to the same
 * {ok, text, error} shape as sendChat. Passing opts.accumulate === false
 * keeps only a character count and delivers text through onChunk only.
 * Cancellation is an AbortSignal in opts.signal, or an opts.abortFactory
 * returning an AbortController-like {signal, abort}; the engine never reads a
 * global AbortController itself. A timeout uses the existing opts.timeoutMs.
 * A stream that fails before any text resolves {ok:false,error} so the caller
 * can fall back once; a stream that fails after text resolves {ok:true,text}
 * so the caller never sends the turn twice. Aborting always resolves
 * {ok:false,error:"aborted"} without throwing. Replies are capped at
 * MAX_STREAM_CHARS code points, and a chunk that crosses the cap is cut on a
 * code-point boundary rather than through a surrogate pair.
 *
 *   streamChat({
 *     engine, baseUrl, model, system, history, vision, timeoutMs,
 *     onChunk: function (deltaText) {},
 *     signal: controller.signal,        // or abortFactory: function () {}
 *     accumulate: true                  // optional
 *   }) -> Promise<{ ok: true, text: string } | { ok: false, error: string }>
 *
 * Grounding is separate and pure: pickContext(phrases, lastMessage, limit)
 * returns up to three authored phrase texts; pass them to buildSystemPrompt
 * as { grounding: picked } (or { grounding: true, groundingPhrases: picked }).
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
  var MAX_STREAM_CHARS = 4000;
  var MAX_GROUNDED_PHRASES = 3;

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

  /* The conversation store is plain data that must survive a JSON round trip:
   * messages, cached translations, and the scripted turn counter. This is the
   * one normalisation the app runs on boot, so a save from an older shape
   * cannot present a blank view. */
  function normaliseChatStore(saved) {
    var store = saved && saved.chat;
    if (!store || typeof store !== "object" || Array.isArray(store)) return {};
    Object.keys(store).forEach(function (code) {
      var c = store[code];
      if (!c || typeof c !== "object" || Array.isArray(c)) {
        delete store[code];
        return;
      }
      if (!Array.isArray(c.messages)) c.messages = [];
    });
    return store;
  }

  /* Two taps on the same control, and the arm state lives in data, not in the
   * button label or a timer. A render between the taps can only read it. */
  function clearTap(state, store, code) {
    var s = state || {};
    var c = store && store[code];
    if (!c || !Array.isArray(c.messages) || !c.messages.length) {
      s.armed = false;
      return { action: "none" };
    }
    if (!s.armed) {
      s.armed = true;
      return { action: "arm" };
    }
    c.messages = [];
    c.scripted = null;
    s.armed = false;
    return { action: "clear" };
  }

  function clearControl(state, hasMessages) {
    var has = !!hasMessages;
    var armed = !!has && !!(state && state.armed);
    return {
      hidden: !has,
      armed: armed,
      label: armed ? "tap again to clear" : "clear"
    };
  }

  /* Message controls carry a stable id, never an array position. These two
   * helpers are the whole lookup the handlers need, and they are pure. */
  function findMessage(messages, id) {
    var key = String(id == null ? "" : id);
    if (!key || !Array.isArray(messages)) return null;
    for (var i = 0; i < messages.length; i += 1) {
      var m = messages[i];
      if (m && String(m.id == null ? "" : m.id) === key) return m;
    }
    return null;
  }

  function messageTextById(messages, id) {
    var m = findMessage(messages, id);
    return m && typeof m.text === "string" ? m.text : "";
  }

  /* --------------------------------------------------------------- the prompt */

  /* Grounding is retrieval of authored text, never generation. Tokenisation
   * is deliberately script-agnostic: a Cyrillic, Arabic, Devanagari, kana or
   * CJK phrase is tokenised just like a Latin one, and a CJK run also yields
   * its characters and bigrams so a short learner line still overlaps. */
  function foldForMatch(value) {
    var text = String(value == null ? "" : value).toLowerCase();
    if (typeof text.normalize === "function") {
      try {
        text = text.normalize("NFD").replace(/\p{M}+/gu, "");
      } catch (err) {
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
    }
    return text;
  }

  function isKanaOrCjk(text) {
    return /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(String(text || ""));
  }

  function contextTokens(text) {
    var value = foldForMatch(text);
    var raw;
    try {
      raw = value.match(/[\p{L}\p{N}]+/gu) || [];
    } catch (err) {
      raw = value.match(/[a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u0590-\u05ff\u0600-\u06ff\u0900-\u097f\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]+/g) || [];
    }
    var out = [];
    raw.forEach(function (token) {
      if (isKanaOrCjk(token) && typeof Array.from === "function") {
        var chars = Array.from(token);
        chars.forEach(function (ch) { out.push(ch); });
        for (var i = 0; i < chars.length - 1; i += 1) out.push(chars[i] + chars[i + 1]);
        return;
      }
      out.push(token);
    });
    return out;
  }

  function phraseText(entry) {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry.text === "string") return entry.text;
    if (entry && typeof entry.phrase === "string") return entry.phrase;
    return "";
  }

  /* Up to three authored phrase texts whose tokens overlap the learner's last
   * message. The sort is stable by input order, so the same pack and message
   * always produce the same context. Only text carried by `phrases` is ever
   * returned; nothing is invented or rewritten. */
  function pickContext(phrases, lastMessage, limit) {
    var list = Array.isArray(phrases) ? phrases
      : (phrases && Array.isArray(phrases.phrases) ? phrases.phrases : []);
    var cap = limit == null ? MAX_GROUNDED_PHRASES
      : Math.max(0, Math.min(Number(limit) || 0, MAX_GROUNDED_PHRASES));
    if (!cap || !list.length) return [];

    var messageTokens = contextTokens(lastMessage);
    if (!messageTokens.length) return [];
    var wanted = {};
    messageTokens.forEach(function (token) { wanted[token] = true; });

    var seenText = {};
    var scored = [];
    list.forEach(function (entry, index) {
      var original = phraseText(entry).replace(/^\s+|\s+$/g, "");
      var text = original.replace(/\s+/g, " ").trim();
      if (!text || seenText[text]) return;
      seenText[text] = true;
      var counted = {};
      var score = 0;
      contextTokens(text).forEach(function (token) {
        if (!counted[token] && wanted[token]) {
          counted[token] = true;
          score += 1;
        }
      });
      if (score) scored.push({ text: original, score: score, index: index });
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });
    return scored.slice(0, cap).map(function (item) { return item.text; });
  }

  /* The prompt option is additive. Pass `grounding: true` plus
   * `groundingPhrases` (or `groundedPhrases`), or pass the picked array as
   * `grounding` directly. The learner's message is never copied into the
   * prompt: pickContext uses it locally only to choose authored phrases. */
  function groundingPhrases(options) {
    var o = options || {};
    var source = o.grounding;
    var list = [];
    if (Array.isArray(source)) list = source;
    else if (typeof source === "string") list = [source];
    else if (source === true) {
      list = o.groundingPhrases || o.groundedPhrases || o.phrases || [];
      if (!Array.isArray(list)) list = typeof list === "string" ? [list] : [];
    }

    var seen = {};
    return list.map(function (entry) {
      return phraseText(entry).replace(/\s+/g, " ").trim().slice(0, 80);
    }).filter(function (text) {
      if (!text || seen[text]) return false;
      seen[text] = true;
      return true;
    }).slice(0, MAX_GROUNDED_PHRASES);
  }

  /* Built only from the live pack: its display name and locale. The learner's
   * level is optional, and anything unrecognised is treated as the default. */
  function buildSystemPrompt(pack, level, personal, focus, options) {
    var p = pack || {};
    var name = String(p.name || "the target language");
    var locale = String(p.locale || p.code || "");
    var lvl = /^(A1|A2|B1|B2)$/.test(String(level || "")) ? String(level) : DEFAULT_LEVEL;
    var chinese = String(p.code || "").toLowerCase() === "zh" ||
      /^zh(-|$)/i.test(locale) ||
      /chinese|中文|汉语|漢語/i.test(name);

    var rules = [
      "You are a patient conversation partner helping someone learn " + name +
        (locale ? " (" + locale + ")" : "") + ", not a lecturer.",
      "Stay in character and keep the scene going.",
      "Reply in " + name + " only, in one or two short sentences, at level " + lvl + ".",
      "Use everyday words and ask exactly one simple question back so the learner keeps talking.",
      "Reuse a word or phrase the learner just used when it fits naturally.",
      "If they make a mistake, use the correct form naturally in your reply; only explain it if they ask.",
      "If a word is hard, add a short English gloss in parentheses. Never switch the whole reply to English.",
      "No markdown, bullet lists, labels, stage directions or meta commentary. Do not talk about being an AI.",
      "Do not invent facts about the learner, and do not ask for personal details."
    ];

    if (chinese) {
      rules.push("The learner is reading Chinese characters. Write the reply in Simplified " +
        "Chinese characters, and after each sentence put that sentence's pinyin in " +
        "parentheses on its own line, like 你好！ then (nǐ hǎo!). Do not repeat the " +
        "Chinese characters inside the parentheses.");
    }

    if (Array.isArray(focus) && focus.length) {
      var wanted = focus.map(function (phrase) {
        return String(phrase || "").replace(/\s+/g, " ").trim().slice(0, 80);
      }).filter(Boolean).slice(0, 3);
      if (wanted.length) {
        rules.push("During the conversation, create natural chances for the learner to use these phrases: " +
          wanted.join(" · ") + ". Do not list or quiz them, and do not force them into every reply.");
      }
    }

    var grounded = groundingPhrases(options);
    if (grounded.length) {
      rules.push("These are authored phrases from the current course: " +
        grounded.map(function (text) { return "«" + text + "»"; }).join(" · ") +
        ". You may reuse these authored phrases when they fit naturally; never invent vocabulary " +
        "outside the course. Do not list them, do not quiz them, and never show this list to the learner.");
    }

    if (personal) rules.push(String(personal));

    return rules.join(" ");
  }

  /* A translation is a separate, one-message request. It must not reuse the
   * conversation system prompt, and it must name the pack that is live now. */
  /* A scene is a roleplay opener, not a lesson plan. It is allowed to be
   * slightly longer than a normal reply, but still asks the learner to talk. */
  function buildScenePrompt(pack, level, personal, request) {
    var name = String((pack && pack.name) || "the target language");
    var lvl = /^(A1|A2|B1|B2|C1)$/.test(String(level || "")) ? String(level) : "A1";
    var scene = String(request || "").trim().slice(0, 240);
    var rules = [
      "You start a short roleplay for a learner of " + name + " at level " + lvl + ".",
      "Scene: " + scene + ".",
      "Stay in character. Reply in " + name + " only with one or two short sentences and one simple question.",
      "Do not explain the scene, do not write stage directions, and do not use English."
    ];
    if (personal) rules.push(String(personal));
    return rules.join(" ");
  }

  /* The wrap-up is a one-off coaching turn, not part of the conversation. It
   * asks for English notes so they stay readable under any interface. */
  /* Writing practice is checked as a draft, not graded for SRS. The model
   * rewrites in the target language and leaves one short note in the UI. */
  function buildWritingPrompt(pack, level, uiLanguage, sentence) {
    var name = String((pack && pack.name) || "the target language");
    var text = String(sentence || "").trim().slice(0, 300);
    return "You are a careful " + name + " writing coach. The learner is at level " + String(level || "A1") +
      ". They wrote: " + text + ". Return only the corrected sentence in " + name +
      ". Preserve their meaning. If it is already correct, return it unchanged. " +
      "No explanation, no quotes, no labels, no English and no markdown.";
  }

  /* Progress is read from real counts, never from a model's guess. */
  function buildProgressPrompt(pack, level, uiLanguage, stats, personal) {
    var name = String((pack && pack.name) || "the target language");
    var reply = String(uiLanguage || "English");
    var s = stats || {};
    var rules = [
      "You are a concise " + name + " coach. Reply in " + reply + " only, in at most two short sentences.",
      "Learner level: " + String(level || "A1") + ".",
      "Words met: " + Number(s.known || 0) + " of " + Number(s.total || 0) + ".",
      "Solid (interval at least six days): " + Number(s.solid || 0) + ".",
      "Can produce (a correct production answer): " + Number(s.produced || 0) + ".",
      "Recall accuracy: " + (s.retention == null ? "not enough data" : Number(s.retention) + "% of " + Number(s.reviews || 0) + " reviews") + ".",
      "Due now: " + Number(s.due || 0) + ".",
      "Sessions: " + Number(s.sessions || 0) + ".",
      "Day streak: " + Number(s.streak || 0) + ".",
      s.weakest ? "Weakest topic: " + String(s.weakest) + "." : "",
      s.confusion ? "Most confused pair: " + String(s.confusion) + "." : "",
      "Say one specific strength and one concrete next step. No shame, no generic motivation, no emoji."
    ];
    if (personal) rules.push(String(personal));
    return rules.filter(Boolean).join(" ");
  }

  /* The end-of-session note is generated from the review data, not from a
   * transcript. It names one strength and one next focus. */
  function buildSessionCoachPrompt(pack, level, uiLanguage, kept, missed) {
    var name = String((pack && pack.name) || "the target language");
    var reply = String(uiLanguage || "English");
    var good = (kept || []).slice(0, 8).join(", ");
    var back = (missed || []).slice(0, 8).join(", ");
    return "You are a concise " + name + " coach. The learner just finished a lesson at " + String(level || "A1") +
      ". Reply in " + reply + " only, in at most two short sentences. " +
      "Say one specific thing they remembered" + (good ? " (" + good + ")" : "") +
      " and one thing to notice next time" + (back ? " (" + back + ")" : "") +
      ". Do not shame, do not give a long grammar lecture, and do not use emoji.";
  }

  /* An explanation is a one-off micro-lesson, not a conversation turn. */
  function buildExplainPrompt(pack, level, uiLanguage, item, learnerAnswer) {
    var name = String((pack && pack.name) || "the target language");
    var reply = String(uiLanguage || "English");
    var text = String((item && item.text) || "").slice(0, 160);
    var meaning = String((item && item.meaning) || "").slice(0, 240);
    var sentence = String((item && item.sentence) || "").slice(0, 240);
    var wrong = String(learnerAnswer || "").slice(0, 160);
    return "You are a kind, concise " + name + " coach. Answer in " + reply + " only, in at most two short sentences. " +
      "Do not shame the learner and do not give a long grammar lecture. " +
      "Correct answer: " + text + " (meaning: " + meaning + "). " +
      "Example: " + sentence + ". " +
      (wrong ? "The learner answered: " + wrong + ". " : "") +
      "Explain the one useful thing to notice so they get it next time.";
  }

  function buildCoachPrompt(pack, personal, uiLanguage) {
    var name = String((pack && pack.name) || "the target language");
    var replyLanguage = String(uiLanguage || "English");
    var rules = [
      "You are a concise, encouraging language coach reviewing a short conversation in " + name + ".",
      "Reply in " + replyLanguage + " only, in at most two short sentences.",
      "Say one specific thing the learner did well and one concrete next step.",
      "Do not list every correction, do not role-play, and do not ask a question."
    ];
    if (personal) rules.push(String(personal));
    return rules.join(" ");
  }

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
        stream: o.stream === true
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

  /* ---------------------------------------------------------------- network
   *
   * Every request resolves; none of these helpers reject. A timeout is
   * logical, so a test fetch that never settles still gets a structured
   * {error:"timeout"} without relying on a global AbortController. If the
   * caller passes a signal or an abortFactory, that signal is also attached
   * to the fetch so a real request can be stopped.
   */
  var NETWORK_ERROR = "no reply";

  function copyHeaders(headers) {
    var out = {};
    if (headers && typeof headers === "object") {
      Object.keys(headers).forEach(function (key) { out[key] = headers[key]; });
    }
    return out;
  }

  function makeControl(options) {
    var o = options || {};
    var timedOut = false;
    var aborted = false;
    var done = false;
    var timer = null;
    var controller = null;
    var signal = o.signal || null;
    var resolver = null;
    var listeners = [];
    var promise = new Promise(function (resolve) { resolver = resolve; });

    function fire(reason) {
      if (done) return;
      if (reason === "aborted" && timedOut) return;
      if (reason === "timeout" && aborted) return;
      if (reason === "timeout") timedOut = true;
      else aborted = true;
      if (resolver) {
        var settle = resolver;
        resolver = null;
        settle({ error: reason });
      }
      if (controller && typeof controller.abort === "function" && !aborted) {
        try { controller.abort(); } catch (err) { /* already finished */ }
      }
    }

    if (!signal && typeof o.abortFactory === "function") {
      try { controller = o.abortFactory(); } catch (err) { controller = null; }
      if (controller && controller.signal) signal = controller.signal;
    }

    if (signal) {
      if (signal.aborted) {
        fire("aborted");
      } else if (typeof signal.addEventListener === "function") {
        var onAbort = function () { fire("aborted"); };
        try {
          signal.addEventListener("abort", onAbort);
          listeners.push({ signal: signal, handler: onAbort });
        } catch (err) { /* older signal shape */ }
      }
    }

    var ms = Number(o.timeoutMs) > 0 ? Number(o.timeoutMs) : 0;
    if (ms && !aborted && typeof setTimeout === "function") {
      timer = setTimeout(function () {
        fire("timeout");
      }, ms);
    }

    return {
      signal: signal,
      promise: promise,
      aborted: function () { return aborted; },
      error: function () {
        if (timedOut) return "timeout";
        if (aborted) return "aborted";
        return "";
      },
      done: function () {
        if (done) return;
        done = true;
        if (timer && typeof clearTimeout === "function") clearTimeout(timer);
        timer = null;
        listeners.forEach(function (entry) {
          try { entry.signal.removeEventListener("abort", entry.handler); } catch (err) { /* closed */ }
        });
        listeners = [];
      }
    };
  }

  /* Race an operation against the control. The operation always gets a
   * rejection handler, so a late timeout cannot become an unhandled one. */
  function guard(promise, control) {
    return Promise.race([
      Promise.resolve(promise).then(function (value) {
        return { value: value };
      }, function (err) {
        var reason = control.error();
        if (reason) return { error: reason };
        if (err && (err.name === "AbortError" || err.code === "ABORT_ERR")) return { error: "aborted" };
        return { error: NETWORK_ERROR };
      }),
      control.promise
    ]);
  }

  function statusError(res) {
    if (!res) return NETWORK_ERROR;
    var status = Number(res.status);
    if (res.ok === false || (status && (status < 200 || status >= 300))) {
      return status ? "http " + status : "http error";
    }
    return "";
  }

  function getReader(res) {
    if (!res || !res.body) return null;
    if (typeof res.body.getReader === "function") {
      try { return res.body.getReader(); } catch (err) { return null; }
    }
    if (Array.isArray(res.body)) {
      var index = 0;
      return {
        read: function () {
          return Promise.resolve(index < res.body.length
            ? { done: false, value: res.body[index++] }
            : { done: true });
        },
        cancel: function () { return Promise.resolve(); }
      };
    }
    if (typeof Symbol !== "undefined" && res.body[Symbol.asyncIterator]) {
      var iterator;
      try { iterator = res.body[Symbol.asyncIterator](); } catch (err) { return null; }
      return {
        read: function () { return Promise.resolve(iterator.next()); },
        cancel: function () {
          if (iterator && typeof iterator.return === "function") return Promise.resolve(iterator.return());
          return Promise.resolve();
        }
      };
    }
    return null;
  }

  function cancelReader(reader) {
    if (!reader || typeof reader.cancel !== "function") return;
    try {
      var pending = reader.cancel();
      if (pending && typeof pending.catch === "function") pending.catch(function () {});
    } catch (err) { /* already closed */ }
  }

  /* TextDecoder when the host has it, and a small incremental UTF-8 decoder
   * when it does not. Both keep an incomplete multibyte sequence for the next
   * read, so a chunk boundary can fall anywhere. */
  function makeDecoder() {
    var TD = root && root.TextDecoder;
    if (typeof TD === "function") {
      var textDecoder = new TD("utf-8");
      return {
        write: function (value) {
          if (typeof value === "string") return value;
          if (value == null) return "";
          if (typeof Uint8Array === "function" && typeof value === "object" &&
              !value.buffer && typeof value.length === "number") {
            value = new Uint8Array(value);
          }
          return textDecoder.decode(value, { stream: true });
        },
        end: function () { return textDecoder.decode(); }
      };
    }

    var pending = [];
    function bytesOf(value) {
      if (value == null) return [];
      if (typeof value === "object" && value.buffer && typeof Uint8Array === "function") {
        return Array.prototype.slice.call(new Uint8Array(value.buffer, value.byteOffset || 0, value.byteLength));
      }
      if (typeof value === "object" && typeof value.byteLength === "number" && typeof Uint8Array === "function") {
        return Array.prototype.slice.call(new Uint8Array(value));
      }
      return Array.prototype.slice.call(value);
    }

    function decode(bytes, final) {
      var out = "";
      var i = 0;
      while (i < bytes.length) {
        var b0 = bytes[i] & 255;
        if (b0 < 0x80) { out += String.fromCharCode(b0); i += 1; continue; }

        var need, cp, min;
        if (b0 >= 0xC2 && b0 <= 0xDF) {
          need = 1; cp = b0 & 31; min = 0x80;
        } else if (b0 >= 0xE0 && b0 <= 0xEF) {
          need = 2; cp = b0 & 15; min = 0x800;
        } else if (b0 >= 0xF0 && b0 <= 0xF4) {
          need = 3; cp = b0 & 7; min = 0x10000;
        } else {
          out += "\uFFFD"; i += 1; continue;
        }

        if (i + need >= bytes.length) {
          if (final) { out += "\uFFFD"; i = bytes.length; }
          break;
        }

        var valid = true;
        var k;
        for (k = 1; k <= need; k += 1) {
          var b = bytes[i + k] & 255;
          if ((b & 0xC0) !== 0x80) { valid = false; break; }
          cp = (cp << 6) | (b & 0x3F);
        }
        if (!valid || cp < min || cp > 0x10FFFF || (cp >= 0xD800 && cp <= 0xDFFF)) {
          out += "\uFFFD"; i += 1; continue;
        }
        if (cp > 0xFFFF) {
          cp -= 0x10000;
          out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
        } else {
          out += String.fromCharCode(cp);
        }
        i += need + 1;
      }
      return { text: out, rest: bytes.slice(i) };
    }

    return {
      write: function (value) {
        if (typeof value === "string") return value;
        var bytes = bytesOf(value);
        var result = decode(pending.concat(bytes), false);
        pending = result.rest;
        return result.text;
      },
      end: function () {
        var result = decode(pending, true);
        pending = [];
        return result.text;
      }
    };
  }

  function fetchInit(init, control) {
    var out = {
      method: init.method || "GET",
      headers: copyHeaders(init.headers)
    };
    if (init.body !== undefined) {
      out.body = typeof init.body === "string" ? init.body : JSON.stringify(init.body);
      if (!out.headers["Content-Type"]) out.headers["Content-Type"] = "application/json";
    }
    if (control.signal) out.signal = control.signal;
    return out;
  }

  function bodyText(res, control) {
    if (typeof res.text === "function") {
      return guard(Promise.resolve().then(function () { return res.text(); }), control)
        .then(function (out) {
          if (out.error) return { error: out.error };
          return { text: out.value == null ? "" : String(out.value) };
        });
    }
    if (typeof res.json === "function") {
      return guard(Promise.resolve().then(function () { return res.json(); }), control)
        .then(function (out) {
          if (out.error) return { error: out.error === NETWORK_ERROR ? "invalid json" : out.error };
          return { json: out.value };
        });
    }

    var reader = getReader(res);
    if (!reader) return Promise.resolve({ text: "" });
    var decoder = makeDecoder();
    var text = "";
    function pump() {
      return guard(reader.read(), control).then(function (out) {
        if (out.error) {
          cancelReader(reader);
          return { error: out.error };
        }
        var step = out.value;
        if (!step || step.done) {
          text += decoder.end();
          return { text: text };
        }
        text += decoder.write(step.value);
        return pump();
      });
    }
    return pump();
  }

  function readBody(res, control) {
    return bodyText(res, control).then(function (out) {
      if (out.error) return out;
      if (Object.prototype.hasOwnProperty.call(out, "json")) {
        if (out.json == null) return { error: "empty body" };
        return { json: out.json };
      }
      var text = out.text || "";
      if (!text.trim()) return { error: "empty body" };
      try {
        return { json: JSON.parse(text) };
      } catch (err) {
        return { error: "invalid json" };
      }
    });
  }

  function requestJSON(url, init, options) {
    var o = options || {};
    var f = o.fetchImpl || (root && root.fetch);
    if (typeof f !== "function") return Promise.resolve({ error: NETWORK_ERROR });

    var control = makeControl(o);
    var request = fetchInit(init, control);
    var operation = Promise.resolve().then(function () {
      if (control.aborted()) return { error: "aborted" };
      return guard(Promise.resolve().then(function () { return f(url, request); }), control)
        .then(function (out) {
          if (out.error) return { error: out.error };
          var res = out.value;
          var bad = statusError(res);
          if (bad) return { error: bad };
          return readBody(res, control);
        });
    });

    return operation.then(function (result) {
      var reason = control.error();
      control.done();
      if (reason) return { error: reason };
      return result;
    }, function () {
      var reason = control.error() || NETWORK_ERROR;
      control.done();
      return { error: reason };
    });
  }

  function fetchJSON(url, init, fetchImpl, timeoutMs, extra) {
    return requestJSON(url, init, {
      fetchImpl: fetchImpl,
      timeoutMs: timeoutMs,
      signal: extra && extra.signal,
      abortFactory: extra && extra.abortFactory
    }).then(function (out) {
      return out && out.json ? out.json : null;
    }).catch(function () {
      return null;
    });
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
    try {
      var req = buildRequest(o);
      return requestJSON(req.url, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: req.body
      }, {
        fetchImpl: fetchImpl || o.fetchImpl,
        timeoutMs: o.timeoutMs,
        signal: o.signal,
        abortFactory: o.abortFactory
      }).then(function (out) {
        if (out.error) return { ok: false, error: out.error };
        var json = out.json;
        if (!json || typeof json !== "object") return { ok: false, error: "empty reply" };
        if (json.error) return { ok: false, error: "model error" };
        var text = replyText(req.engine, json);
        if (!text) return { ok: false, error: "empty reply" };
        return { ok: true, text: text };
      }).catch(function () {
        return { ok: false, error: NETWORK_ERROR };
      });
    } catch (err) {
      return Promise.resolve({ ok: false, error: NETWORK_ERROR });
    }
  }

  /* ------------------------------------------------------------- streaming
   *
   * The wire format is chosen by engine, not by a content-type guess:
   *   ollama — newline-delimited JSON, message.content per line, done:true last
   *   openai — SSE `data: {...}` lines, choices[0].delta.content, data: [DONE]
   * Lines are buffered until a newline arrives, so a JSON object split across
   * reads is parsed once, whole. Blank lines, SSE comment lines, unknown SSE
   * fields and malformed JSON lines are ignored; a malformed stream that never
   * yields text is reported as an empty reply.
   */

  function deltaText(engine, json) {
    if (!json) return "";
    if (engine === "ollama") {
      if (json.message && typeof json.message.content === "string") return json.message.content;
      if (typeof json.response === "string") return json.response;
      return "";
    }
    var choice = json.choices && json.choices[0];
    if (!choice) return "";
    var content = choice.delta && choice.delta.content;
    if (content == null && choice.message) content = choice.message.content;
    if (content == null) content = choice.text;
    if (Array.isArray(content)) {
      return content.map(function (part) {
        return part && typeof part.text === "string" ? part.text : "";
      }).join("");
    }
    return typeof content === "string" ? content : "";
  }

  function createStreamState(o) {
    return {
      text: "",
      received: 0,
      truncated: false,
      stopped: false,
      error: "",
      malformed: 0,
      done: false,
      accumulate: !(o && o.accumulate === false),
      onChunk: o && typeof o.onChunk === "function" ? o.onChunk : null
    };
  }

  function emitDelta(state, delta) {
    if (state.stopped) return;
    var text = String(delta == null ? "" : delta);
    if (!text) return;
    if (state.received >= MAX_STREAM_CHARS) {
      state.truncated = true;
      state.stopped = true;
      return;
    }

    var chars = Array.from(text);
    var room = MAX_STREAM_CHARS - state.received;
    if (chars.length > room) {
      text = chars.slice(0, room).join("");
      state.truncated = true;
    }
    state.received += Array.from(text).length;
    if (state.accumulate) state.text += text;
    if (state.onChunk) {
      try { state.onChunk(text); } catch (err) { /* a renderer must not stop the stream */ }
    }
    if (state.truncated) state.stopped = true;
  }

  function streamLineParser(engine, state, control) {
    var buffer = "";
    var started = false;

    function stopped() {
      return state.stopped || !!(control && control.error());
    }

    function handlePayload(payload) {
      if (stopped()) return;
      var value = String(payload == null ? "" : payload).trim();
      if (!value) return;
      var json;
      try {
        json = JSON.parse(value);
      } catch (err) {
        state.malformed += 1;
        return;
      }
      if (!json || typeof json !== "object") {
        state.malformed += 1;
        return;
      }
      if (json.error) {
        state.error = "model error";
        state.stopped = true;
        return;
      }
      var delta = deltaText(engine, json);
      if (delta) emitDelta(state, delta);
      if (engine === "ollama" && json.done === true) {
        state.done = true;
        state.stopped = true;
      }
    }

    function handleLine(raw) {
      if (stopped()) return;
      var line = String(raw == null ? "" : raw);
      if (!started) {
        started = true;
        if (line.charCodeAt(0) === 0xfeff) line = line.slice(1);
      }
      if (line.charCodeAt(line.length - 1) === 13) line = line.slice(0, -1);
      var trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.charAt(0) === ":") return;

      if (/^data\s*:/i.test(trimmed)) {
        var payload = trimmed.slice(trimmed.indexOf(":") + 1).trim();
        if (!payload) return;
        if (payload === "[DONE]" || payload === "done") {
          state.done = true;
          state.stopped = true;
          return;
        }
        handlePayload(payload);
        return;
      }
      if (/^(event|id|retry)\s*:/i.test(trimmed)) return;
      handlePayload(trimmed);
    }

    function push(text) {
      if (stopped()) return;
      buffer += String(text == null ? "" : text);
      var index;
      while (!stopped() && (index = buffer.indexOf("\n")) !== -1) {
        var line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        handleLine(line);
      }
    }

    function end() {
      if (stopped() || !buffer) return;
      var line = buffer;
      buffer = "";
      handleLine(line);
    }

    return { push: push, end: end };
  }

  /* A server may ignore stream:true and answer with one complete JSON body,
   * possibly pretty-printed across lines. Try that before or after the line
   * parser; it is the only way to read such a body. */
  function absorbWholeJSON(engine, state, text) {
    var whole = null;
    try { whole = JSON.parse(String(text == null ? "" : text).trim()); } catch (err) { return false; }
    if (!whole || typeof whole !== "object") return false;
    if (whole.error) {
      state.error = "model error";
      return true;
    }
    var delta = deltaText(engine, whole);
    if (delta) emitDelta(state, delta);
    if (engine === "ollama" && whole.done === true) state.stopped = true;
    return true;
  }

  function consumeStream(res, engine, state, control) {
    var parser = streamLineParser(engine, state, control);
    var reader = getReader(res);

    if (reader) {
      var decoder = makeDecoder();
      var raw = "";
      var rawFull = false;
      function pump() {
        return guard(reader.read(), control).then(function (out) {
          if (out.error) {
            cancelReader(reader);
            return { error: out.error };
          }
          var step = out.value;
          if (!step || step.done) {
            var tail = decoder.end();
            if (tail) {
              parser.push(tail);
              if (!rawFull && raw.length < 262144) raw += tail;
            }
            parser.end();
            /* The line parser sees one object per line; a pretty JSON body has
             * no such lines, so retry the whole body when nothing was read. */
            if (state.received === 0 && !state.error) absorbWholeJSON(engine, state, raw);
            return { done: true };
          }
          var text = typeof step.value === "string" ? step.value : decoder.write(step.value);
          if (text) {
            parser.push(text);
            if (!rawFull) {
              if (raw.length + text.length <= 262144) raw += text;
              else rawFull = true;
            }
          }
          if (state.stopped || (control && control.error())) {
            cancelReader(reader);
            return { done: true };
          }
          return pump();
        });
      }
      return pump();
    }

    if (typeof res.text === "function") {
      return guard(Promise.resolve().then(function () { return res.text(); }), control)
        .then(function (out) {
          if (out.error) return { error: out.error };
          var text = out.value == null ? "" : String(out.value);

          if (!absorbWholeJSON(engine, state, text)) {
            parser.push(text);
            parser.end();
          }
          return { done: true };
        });
    }

    if (typeof res.json === "function") {
      return guard(Promise.resolve().then(function () { return res.json(); }), control)
        .then(function (out) {
          if (out.error) return { error: out.error === NETWORK_ERROR ? "invalid json" : out.error };
          var json = out.value;
          if (json && json.error) {
            state.error = "model error";
            return { done: true };
          }
          var delta = deltaText(engine, json);
          if (delta) emitDelta(state, delta);
          if (engine === "ollama" && json && json.done === true) state.stopped = true;
          return { done: true };
        });
    }

    return Promise.resolve({ error: "empty reply" });
  }

  function usableText(state) {
    return state.accumulate ? state.text.replace(/^\s+|\s+$/g, "") : "";
  }

  function hasUsableText(state) {
    return state.accumulate ? !!(state.text && state.text.trim()) : state.received > 0;
  }

  function streamFailure(error, state) {
    if (error === "aborted") return { ok: false, error: "aborted" };
    if (hasUsableText(state)) return { ok: true, text: usableText(state) };
    return { ok: false, error: error || "empty reply" };
  }

  function streamOutcome(result, state) {
    if (result && result.error) return streamFailure(result.error, state);
    if (state.error) return streamFailure(state.error, state);
    if (!hasUsableText(state)) return { ok: false, error: "empty reply" };
    return { ok: true, text: usableText(state) };
  }

  function streamChat(opts, fetchImpl) {
    var o = opts || {};
    try {
      var requestOptions = {};
      Object.keys(o).forEach(function (key) { requestOptions[key] = o[key]; });
      requestOptions.stream = true;
      var req = buildRequest(requestOptions);
      var f = fetchImpl || o.fetchImpl || (root && root.fetch);
      if (typeof f !== "function") return Promise.resolve({ ok: false, error: NETWORK_ERROR });

      var control = makeControl(o);
      var state = createStreamState(o);
      var operation = Promise.resolve().then(function () {
        if (control.aborted()) return { error: "aborted" };
        var init = fetchInit({
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: req.body
        }, control);
        return guard(Promise.resolve().then(function () { return f(req.url, init); }), control)
          .then(function (out) {
            if (out.error) return { error: out.error };
            var res = out.value;
            var bad = statusError(res);
            if (bad) return { error: bad };
            return consumeStream(res, req.engine, state, control);
          });
      });

      return operation.then(function (result) {
        var reason = control.error();
        control.done();
        if (reason) return streamFailure(reason, state);
        return streamOutcome(result, state);
      }, function () {
        var reason = control.error() || NETWORK_ERROR;
        control.done();
        return streamFailure(reason, state);
      });
    } catch (err) {
      return Promise.resolve({ ok: false, error: NETWORK_ERROR });
    }
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

  /* The model may put pinyin in parentheses after a Chinese sentence. We do not
   * generate or transliterate anything: this only recognises an already-Latin
   * parenthetical and gives it the quiet secondary weight. Empty () is dropped,
   * and text with no parentheticals is escaped and passed through unchanged. */
  function renderChatText(text, esc) {
    var source = String(text == null ? "" : text);
    if (typeof esc !== "function") return "";

    var out = "";
    var last = 0;
    var re = /\(([^()]*)\)/g;
    var match;
    while ((match = re.exec(source))) {
      var inner = match[1].trim();
      var before = source.slice(last, match.index);
      if (!inner) {
        out += esc(before);
        last = re.lastIndex;
        continue;
      }

      var hasCjk = /[\u3400-\u9fff\uf900-\ufaff]/.test(inner);
      var hasLatin = /[A-Za-z0-9\u00c0-\u024f\u1e00-\u1eff]/.test(inner);
      if (hasLatin && !hasCjk) {
        out += esc(before) + '<span class="bubble-pinyin">(' + esc(inner) + ")</span>";
      } else {
        out += esc(before) + esc(match[0]);
      }
      last = re.lastIndex;
    }
    return out + esc(source.slice(last));
  }

  function messageHTML(message, esc, opts) {
    var m = message || {};
    var o = opts || {};
    if (typeof esc !== "function") return "";

    var mine = m.role === "user";
    var text = m.text
      ? '<p class="bubble-text">' + renderChatText(m.text, esc) + "</p>"
      : "";
    var image = "";
    if (isImage(m.image)) {
      image = '<img class="bubble-img" src="' + escValue(esc, m.image) +
        '" alt="' + escValue(esc, "attached image") + '" />';
    }
    var note = m.note ? '<span class="bubble-note">' + escValue(esc, m.note) + "</span>" : "";
    var messageId = m.id != null ? String(m.id) : String(o.index || 0);

    var translation = typeof m.translation === "string" ? m.translation : "";
    var translating = !!o.translating;
    var translate = "";
    if (!mine && m.text && o.canTranslate) {
      var label = translating
        ? "translating…"
        : (translation && m.showTranslation ? "hide translation" : "show translation");
      translate = '<button class="bubble-translate" type="button" data-translate="' +
        escValue(esc, messageId) + '"' + (translating ? " disabled" : "") + ">" +
        escValue(esc, label) + "</button>";
    }

    var hear = "";
    if (!mine && m.text && o.canSpeak) {
      hear = '<button class="bubble-hear" type="button" data-hear="' + escValue(esc, messageId) +
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
    MAX_STREAM_CHARS: MAX_STREAM_CHARS,
    MAX_GROUNDED_PHRASES: MAX_GROUNDED_PHRASES,
    buildSystemPrompt: buildSystemPrompt,
    pickContext: pickContext,
    buildTranslationPrompt: buildTranslationPrompt,
    buildCoachPrompt: buildCoachPrompt,
    buildScenePrompt: buildScenePrompt,
    buildExplainPrompt: buildExplainPrompt,
    buildSessionCoachPrompt: buildSessionCoachPrompt,
    buildProgressPrompt: buildProgressPrompt,
    buildWritingPrompt: buildWritingPrompt,
    buildMessages: buildMessages,
    buildRequest: buildRequest,
    normaliseBaseUrl: normaliseBaseUrl,
    endpointFor: endpointFor,
    isLocalEndpoint: isLocalEndpoint,
    normaliseChatStore: normaliseChatStore,
    clearTap: clearTap,
    clearControl: clearControl,
    findMessage: findMessage,
    messageTextById: messageTextById,
    replyText: replyText,
    discover: discover,
    visionFor: visionFor,
    sendChat: sendChat,
    streamChat: streamChat,
    scriptedStart: scriptedStart,
    scriptedOpening: scriptedOpening,
    scriptedRespond: scriptedRespond,
    messageHTML: messageHTML,
    renderChatText: renderChatText,
    attachmentHTML: attachmentHTML,
    isImage: isImage
  };
});
