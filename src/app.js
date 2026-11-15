/* sema — application logic.
 *
 * Plain script, no modules, no build step: open index.html (or serve the folder)
 * and it runs. State lives in localStorage; audio uses the browser's own speech
 * synthesis, recognition uses the browser's own recogniser when it exists.
 *
 * A translation is available on request and on the answer state, but never
 * before the learner has tried to recall the item.
 */
(function () {
  "use strict";

  var LANGS = window.SemaLangs;
  var S = window.SemaSRS;
  var MEM = window.SemaMemory;
  var UI = window.SEMA_UI;
  /* Extra chrome tables and extra keys for the locales in src/ui-strings.js.
   * The learner chooses an interface language once; everything below resolves
   * through these tables, never through a literal. */
  var UI_LANGS = window.SEMA_UI_LANGS || {};
  var UI_EXTRA = window.SEMA_UI_EXTRA || {};
  var RUBY = window.SemaRuby;
  var WRITING = window.SemaWriting;
  var EX = window.SemaExercises;
  var WORDSET = window.SemaWordSet;
  var ECON = window.SemaEconomy;
  var AITOOLS = window.SemaAiTools;
  var SYNONYMS = window.SemaSynonyms;
  var PERSONA = window.SemaPersona;

  function audioEnabled() {
    return (state && state.settings && state.settings.audio) !== "off";
  }

  function autoSpeakOn() {
    return audioEnabled() && (!state || !state.settings || state.settings.autoSpeak !== "off");
  }

  var uiCache = {};

  function uiTable(code) {
    var lang = String(code || "en");
    if (uiCache[lang]) return uiCache[lang];
    var table = {};
    var base = (UI && UI[lang]) || {};
    Object.keys(base).forEach(function (k) { if (k !== "t") table[k] = base[k]; });
    var more = UI_LANGS[lang] || {};
    Object.keys(more).forEach(function (k) {
      if (k === "name" || k === "locale" || k === "keys") return;
      table[k] = more[k];
    });
    var extra = UI_EXTRA[lang] || {};
    Object.keys(extra).forEach(function (k) { table[k] = extra[k]; });
    if (!Object.keys(table).length) return uiTable("en");
    uiCache[lang] = table;
    return table;
  }

  function uiLang() {
    return (state && state.profile && state.profile.uiLang) || defaultUiFor(ACTIVE && ACTIVE.code);
  }

  /* Dates follow the interface language, not a hardcoded en-GB. */
  function uiLocale() {
    return uiLang() === "en" ? "en-GB" : uiLang();
  }

  /* Chrome in the learner's interface language, not the deck's. */
  function tr(key, fallback) {
    var table = uiTable(uiLang());
    return table[key] || uiTable("en")[key] || fallback || key;
  }

  function catLabel(cat) {
    var fallback = D && D.categories && D.categories[cat] ? D.categories[cat].label : cat;
    return tr("cat_" + cat, fallback);
  }

  /* Locales we can actually paint: every one with a chrome table. The list is
   * data, not a hardcoded set, so a new table appears here by itself. */
  function uiChoices(except) {
    var codes = [];
    ["en"].concat(Object.keys(UI || {}), Object.keys(UI_LANGS)).forEach(function (code) {
      if (!code || code === "t" || code === except || codes.indexOf(code) !== -1) return;
      var table = uiTable(code);
      if (table.start && table.tabToday) codes.push(code);
    });
    return codes;
  }

  /* The interface and the deck are different choices, but choosing the same
   * language for both makes the app explain Spanish in Spanish to a beginner.
   * Keep the two pickers disjoint, for every pack. */
  function defaultUiFor(deck) {
    return deck === "en" ? "es" : "en";
  }

  function keepUiOffDeck() {
    if (!state.profile || !ACTIVE) return;
    if (state.profile.uiLang === ACTIVE.code) {
      state.profile.uiLang = defaultUiFor(ACTIVE.code);
      save();
    }
  }

  /* A language's own name comes from its pack; without one, the code is all we
   * honestly have. No language name is ever typed into the chrome. */
  function uiName(code) {
    var own = UI_LANGS[code] && UI_LANGS[code].name;
    if (own) return own;
    var list = (LANGS && LANGS.list && LANGS.list()) || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].code === code) return list[i].name || code.toUpperCase();
    }
    return String(code).toUpperCase();
  }

  var LANG_FLAGS = {
    es: "🇪🇸", fr: "🇫🇷", it: "🇮🇹", en: "🇬🇧", de: "🇩🇪", nl: "🇳🇱",
    pt: "🇵🇹", ru: "🇷🇺", tr: "🇹🇷", ar: "🇸🇦", hi: "🇮🇳", ja: "🇯🇵", zh: "🇨🇳"
  };

  /* Small, human transitions for the offline dialogue. They are deliberately
   * short: the authored turn still carries the actual question. */
  var CHAT_REACTIONS = {
    en: { miss: ["Not quite.", "Let's try again.", "Hmm?"], good: ["Nice.", "Good.", "Okay."] },
    es: { miss: ["Casi.", "Otra vez.", "¿Cómo?"], good: ["Bien.", "Genial.", "Vale."] },
    fr: { miss: ["Presque.", "On réessaie.", "Pardon ?"], good: ["Bien.", "Super.", "D'accord."] },
    it: { miss: ["Quasi.", "Riproviamo.", "Come?"], good: ["Bene.", "Ottimo.", "Va bene."] },
    pt: { miss: ["Quase.", "Vamos tentar outra vez.", "Como?"], good: ["Bem.", "Ótimo.", "Está bem."] },
    de: { miss: ["Fast.", "Versuch es noch einmal.", "Wie bitte?"], good: ["Gut.", "Super.", "Okay."] },
    nl: { miss: ["Bijna.", "Probeer het nog eens.", "Pardon?"], good: ["Goed.", "Super.", "Oké."] },
    ru: { miss: ["Почти.", "Попробуйте ещё раз.", "Как?"], good: ["Хорошо.", "Отлично.", "Ладно."] },
    tr: { miss: ["Neredeyse.", "Tekrar deneyin.", "Efendim?"], good: ["İyi.", "Harika.", "Tamam."] },
    ar: { miss: ["تقريباً.", "حاول مرة أخرى.", "ماذا؟"], good: ["جيد.", "رائع.", "حسناً."] },
    hi: { miss: ["लगभग।", "फिर कोशिश करो।", "क्या?"], good: ["अच्छा।", "बढ़िया।", "ठीक है।"] },
    ja: { miss: ["惜しい。", "もう一度。", "え？"], good: ["いいね。", "すごい。", "はい。"] },
    zh: { miss: ["差一点。", "再试一次。", "什么？"], good: ["好。", "很好。", "可以。"] }
  };

  function chatReaction(kind) {
    var bank = CHAT_REACTIONS[(ACTIVE && ACTIVE.code) || "en"] || CHAT_REACTIONS.en;
    var list = bank[kind] || bank.good;
    return list[Math.floor(Math.random() * list.length)];
  }

  function ensureLanguage(code) {
    if (!state.profile || !code || !LANGS || !LANGS.has(code)) return;
    state.profile.languages = state.profile.languages || [];
    if (state.profile.languages.indexOf(code) === -1) state.profile.languages.push(code);
  }

  function rememberLang(code) {
    if (!state.profile || !code) return;
    var recent = state.profile.recentLangs || [];
    /* Existing flags keep their positions. A genuinely new language enters
     * at the front and pushes the oldest one out. */
    if (recent.indexOf(code) !== -1) return;
    state.profile.recentLangs = [code].concat(recent).slice(0, 3);
  }

  function renderLangSwitch() {
    var box = $("lang-switch");
    if (!box) return;
    if (!state.profile || !ACTIVE) { box.hidden = true; return; }
    var recent = (state.profile.recentLangs || []).filter(function (code, i, all) {
      return LANGS && LANGS.has(code) && all.indexOf(code) === i;
    });
    /* If the active language is not in the saved row, add it without
     * reshuffling the languages that are already there. */
    if (recent.indexOf(ACTIVE.code) === -1) recent.unshift(ACTIVE.code);
    var codes = recent.slice(0, 3);
    box.hidden = codes.length < 2;
    box.innerHTML = codes.map(function (code) {
      return '<button class="lang-flag' + (code === ACTIVE.code ? " is-active" : "") +
        '" type="button" data-lang="' + esc(code) + '" aria-label="' + esc(uiName(code)) +
        '" title="' + esc(uiName(code)) + '">' + (LANG_FLAGS[code] || code.toUpperCase()) + "</button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-lang]"), function (b) {
      b.addEventListener("click", function () { switchLang(b.getAttribute("data-lang")); });
    });
  }

  function renderUiLangPickers() {
    var choices = uiChoices(ACTIVE && ACTIVE.code);
    var current = uiLang();
    if (current && choices.indexOf(current) === -1) choices = choices.concat([current]);
    ["setup-uilang", "settings-uilang"].forEach(function (id) {
      var sel = $(id);
      if (!sel) return;
      sel.innerHTML = choices.map(function (code) {
        return '<option value="' + esc(code) + '">' + esc(uiName(code)) + "</option>";
      }).join("");
      var fallback = choices.indexOf(defaultUiFor(ACTIVE && ACTIVE.code)) !== -1
        ? defaultUiFor(ACTIVE && ACTIVE.code)
        : (choices[0] || "en");
      sel.value = choices.indexOf(current) === -1 ? fallback : current;
    });
  }

  function applyStrings() {
    /* The document language follows the interface language, so screen readers
     * and hyphenation do not keep announcing an English page in Arabic or
     * Japanese. Direction stays LTR until the RTL layout is audited. */
    if (document.documentElement) document.documentElement.lang = uiLang();
    var table = uiTable(uiLang());
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      var text = table[el.getAttribute("data-i18n")];
      if (text) el.textContent = text;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-ph]"), function (el) {
      var text = table[el.getAttribute("data-i18n-ph")];
      if (text) el.setAttribute("placeholder", text);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (el) {
      var text = table[el.getAttribute("data-i18n-aria")];
      if (text) el.setAttribute("aria-label", text);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-title]"), function (el) {
      var text = table[el.getAttribute("data-i18n-title")];
      if (text) el.setAttribute("title", text);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-chrome]"), function (el) {
      /* A key with no translation keeps the text already in the markup: printing
       * the key name is the one failure mode a learner cannot read. */
      var key = el.getAttribute("data-chrome");
      var text = table[key];
      if (text) el.textContent = text;
    });
    var gloss = $("gloss-toggle");
    if (gloss) {
      gloss.textContent = (state.settings && state.settings.translations) === "off"
        ? tr("translationsOff", "translations off")
        : tr("translationsOn", "translations on");
    }
    if (typeof updateAudioChip === "function") updateAudioChip();
    if (typeof renderCoins === "function") renderCoins();
    if (typeof renderLangSwitch === "function") renderLangSwitch();
  }

  var TRACK = window.SemaTrack;
  var CURR = window.SemaCurriculum;
  var ADAPT = window.SemaAdaptive;
  var CORRECT = window.SemaCorrect;
  var CE = window.SemaChatEngine;
  var MINI = window.SemaMiniChat;
  var STORE_KEY = "sema.v1";

  /* The live pack. Everything below reads it through these bindings; switching
   * a language swaps the bindings and rebuilds the indexes, so no other part of
   * the app needs to know which language is active. */
  var ACTIVE = null;
  var D = null;
  var LANG = null;
  var TERMS = null;
  var P = null;
  var CONV = null;
  var bundled = null;
  var miniChat = null;

  var conceptById = {};
  var allIds = [];
  var neighbours = {};   // id -> [id]   (ordered by relation weight)
  var weights = {};      // "a|b" -> type
  var termById = {};
  var termIds = [];
  var phraseById = {};
  var phraseIds = [];
  var basicById = {};
  var basicIds = [];

  function deckIds() {
    return allIds.concat(phraseIds, termIds, basicIds);
  }

  function rebuildIndexes() {
    conceptById = {};
    allIds = [];
    neighbours = {};
    weights = {};

    D.concepts.forEach(function (c) {
      conceptById[c.id] = c;
      allIds.push(c.id);
      neighbours[c.id] = [];
    });

    D.edges.forEach(function (e) {
      if (!conceptById[e.a] || !conceptById[e.b]) return;
      var w = (D.relationTypes[e.type] && D.relationTypes[e.type].weight) || 1;
      neighbours[e.a].push({ id: e.b, w: w, type: e.type });
      neighbours[e.b].push({ id: e.a, w: w, type: e.type });
      weights[e.a + "|" + e.b] = e.type;
      weights[e.b + "|" + e.a] = e.type;
    });

    Object.keys(neighbours).forEach(function (id) {
      neighbours[id].sort(function (a, b) { return b.w - a.w; });
    });

    termById = {};
    termIds = [];
    (TERMS.terms || []).forEach(function (t) {
      termById[t.id] = t;
      termIds.push(t.id);
    });

    phraseById = {};
    phraseIds = [];
    (P.phrases || []).forEach(function (p) {
      phraseById[p.id] = p;
      phraseIds.push(p.id);
    });

    basicById = {};
    basicIds = [];
    ((ACTIVE && ACTIVE.basics && ACTIVE.basics.items) || []).forEach(function (b) {
      basicById[b.id] = b;
      basicIds.push(b.id);
    });
  }

  function activatePack(code) {
    var pack = LANGS && LANGS.load(code);
    if (!pack && LANGS) pack = LANGS.load(LANGS.defaultCode || "es");
    if (!pack) throw new Error("sema: no language pack available");

    ACTIVE = pack;
    D = pack.concepts;
    LANG = D.language || { code: pack.code, name: pack.name, locale: pack.locale };
    TERMS = pack.terms;
    P = pack.phrases;
    CONV = pack.conv;
    bundled = pack.audio && Object.keys(pack.audio).length ? pack.audio : null;

    /* A few renderers read the pack globals directly (texts, glosses). Point
     * them at the live pack rather than whichever script loaded last. */
    LANGS.bind(pack);

    rebuildIndexes();
    miniChat = MINI ? MINI.build(pack) : null;
    voice = null;
    if (hasTTS) pickVoice();
    updateAudioChip();
    return pack;
  }

  /* Scenes are gone with the deck chooser: a lesson is no longer "the phrase
   * lesson". A session mixes phrases, words, grammar and connectors, and it
   * opens on the phrases a person needs first. */

  /* ------------------------------------------------------------ utilities */

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  /* Line icons drawn inline: nothing to fetch, and they take the text colour. */
  var ICON = {
    speaker: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/></svg>',
    mic: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
    check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cross: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    lock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>'
  };

  function neighboursOf(id) {
    return (neighbours[id] || []).map(function (n) { return n.id; });
  }

  function toast(msg, ms) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, ms || 2200);
  }

  /* ----------------------------------------------------------- persistence */

  /* #demo runs on a throwaway state: it starts clean every time and never
   * writes, so showing the app to someone leaves the real progress alone. */
  var DEMO = String(window.location.hash || "") === "#demo";
  var DEMO_IDS = ["casa", "gato", "agua", "sol", "manzana"];
  /* one of each question type up front, so a minute is enough to see all three */
  var DEMO_TYPES = ["pick-word", "pick-picture", "say", "pick-picture", "pick-word"];

  var state = boot();
  applyAccent();
  renderCoins();
  renderLangPickers();
  renderUiLangPickers();
  updateSetupCopy();

  /* Progress is per language. `state.cards` and friends are the live deck for
   * the active language; `state.profile.byLang[code]` is its archive, so a
   * switch never discards what was learned in the other language. */
  function boot() {
    var saved = DEMO ? null : loadSaved();
    var code = saved && saved.profile && saved.profile.lang;
    if (!code || !LANGS || !LANGS.has(code)) code = (LANGS && LANGS.defaultCode) || "es";
    activatePack(code);

    var s = saved || emptyLive();
    /* the demo skips first-run setup and starts on a clean deck */
    if (DEMO) s.profile = { lang: code, byLang: {} };
    s.version = 1;
    s.cards = s.cards || {};
    s.confusions = s.confusions || {};
    s.reviews = s.reviews || { good: 0, again: 0 };
    s.sessions = s.sessions || 0;
    if (typeof s.xp !== "number") s.xp = 0;
    s.vocabStats = s.vocabStats || { sessions: 0, correct: 0, again: 0 };
    s.anchors = s.anchors || {};
    if (!s.memory || !Array.isArray(s.memory.sentences)) s.memory = MEM.empty();

    if (s.profile) {
      s.profile.lang = code;
      s.profile.byLang = s.profile.byLang || {};
      s.profile.languages = (Array.isArray(s.profile.languages) ? s.profile.languages : []).filter(function (x) { return LANGS.has(x); });
      if (s.profile.languages.indexOf(code) === -1) s.profile.languages.push(code);
      if (!Array.isArray(s.profile.recentLangs) || !s.profile.recentLangs.length) {
        s.profile.recentLangs = [code];
      }
      /* Levels are per language: leaving Spanish at B1 must not make a brand
       * new Arabic deck report B1 too. Older saves carry one global level, so
       * adopt it for the language they were on and start others at A1. */
      s.profile.levelByLang = s.profile.levelByLang && typeof s.profile.levelByLang === "object"
        ? s.profile.levelByLang
        : {};
      if (s.profile.level && !s.profile.levelByLang[code]) {
        s.profile.levelByLang[code] = s.profile.level;
      }
      /* Older saves kept one deck at the top level. Adopt it as that pack's
       * archive instead of throwing it away. */
      if (!s.profile.byLang[code]) s.profile.byLang[code] = bucketOf(s);
      else loadBucket(s, s.profile.byLang[code]);
    }

    /* A day starts clean; an old save with no counter starts at zero. */
    if (!s.daily || s.daily.date !== dayKey(Date.now()) || typeof s.daily.cards !== "number") {
      s.daily = { date: dayKey(Date.now()), cards: 0 };
    }
    s.days = s.days && typeof s.days === "object" && !Array.isArray(s.days) ? s.days : {};
    var todayKey = dayKey(Date.now());
    if (s.daily && s.daily.date === todayKey) {
      s.days[todayKey] = Math.max(Number(s.days[todayKey]) || 0, Number(s.daily.cards) || 0);
    }
    var cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    Object.keys(s.days).forEach(function (key) {
      var at = new Date(key + "T12:00:00").getTime();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !isFinite(at) || at < cutoff) delete s.days[key];
    });

    s.settings = s.settings || {};
    if (typeof s.settings.wordsetDraft !== "string") s.settings.wordsetDraft = "";
    var themeIds = ((ECON && ECON.THEMES) || []).map(function (t) { return t.id; });
    s.coins = Math.max(0, Math.floor(Number(s.coins) || 0));
    s.settings.unlockedAccents = (Array.isArray(s.settings.unlockedAccents) ? s.settings.unlockedAccents : [])
      .filter(function (id) { return themeIds.indexOf(id) !== -1; });
    if (s.settings.unlockedAccents.indexOf("ember") === -1) s.settings.unlockedAccents.unshift("ember");
    if (themeIds.indexOf(s.settings.accent) === -1 || s.settings.unlockedAccents.indexOf(s.settings.accent) === -1) {
      s.settings.accent = "ember";
    }
    s.dailyGoalReward = s.dailyGoalReward && s.dailyGoalReward.date === dayKey(Date.now())
      ? s.dailyGoalReward
      : { date: dayKey(Date.now()), paid: false };
    s.alphabet = s.alphabet && typeof s.alphabet === "object" && !Array.isArray(s.alphabet) ? s.alphabet : {};
    if (s.profile) {
      var uiChoicesHere = uiChoices(code);
      /* Keep a chosen immersion language. The picker hides the deck language
       * from new choices, but it must not silently turn Spanish UI into English. */
      if (!s.profile.uiLang || (s.profile.uiLang !== code && uiChoicesHere.indexOf(s.profile.uiLang) === -1)) {
        s.profile.uiLang = uiChoicesHere.indexOf(defaultUiFor(code)) !== -1
          ? defaultUiFor(code)
          : (uiChoicesHere[0] || "en");
      }
      if (PERSONA) PERSONA.ensure(s.profile);
    }
    /* The local model is the intended conversation engine. If none answers,
     * the scripted practice takes over; there is no engine chooser. */
    s.settings.chatEngine = "local";
    if (typeof s.settings.chatEndpoint !== "string" || !s.settings.chatEndpoint.trim()) {
      s.settings.chatEndpoint = (CE && CE.DEFAULT_ENDPOINT) || "http://localhost:11434";
    }
    if (typeof s.settings.chatModel !== "string") s.settings.chatModel = "";
    s.chat = CE && CE.normaliseChatStore
      ? CE.normaliseChatStore(s)
      : (s.chat && typeof s.chat === "object" && !Array.isArray(s.chat) ? s.chat : {});
    if (!Array.isArray(s.settings.fields) || !s.settings.fields.length) {
      s.settings.fields = Object.keys(D.categories);
    } else {
      s.settings.fields = s.settings.fields.filter(function (f) { return D.categories[f]; });
      if (!s.settings.fields.length) s.settings.fields = Object.keys(D.categories);
    }
    /* the numeric session length became goal/short/long; keep an old choice */
    if (!s.settings.length) {
      s.settings.length = s.settings.size === 5 ? "short" : s.settings.size === 12 ? "long" : "goal";
    }
    if (["goal", "short", "long"].indexOf(s.settings.length) === -1) s.settings.length = "goal";
    if (["on", "off"].indexOf(s.settings.audio) === -1) s.settings.audio = "on";
    if (["on", "off"].indexOf(s.settings.autoSpeak) === -1) s.settings.autoSpeak = "on";
    if (["on", "off"].indexOf(s.settings.ruby) === -1) s.settings.ruby = "on";
    if (["on", "off"].indexOf(s.settings.translations) === -1) s.settings.translations = "on";
    /* There is one kind of lesson now. Older saves carried a deck mode; drop
     * it so nothing can quietly bring the chooser back. */
    delete s.settings.mode;

    seedDeck(s);
    /* Path progress is lesson progress. Vocabulary review feeds the SRS but
     * must not unlock the next lesson by itself, or "Got it" replaces the
     * course. Older saves are migrated from their existing card history so a
     * path already earned does not relock. */
    if (!s.trackMet || typeof s.trackMet !== "object" || Array.isArray(s.trackMet)) {
      s.trackMet = {};
      Object.keys(s.cards || {}).forEach(function (id) {
        if (s.cards[id] && s.cards[id].reps > 0) s.trackMet[id] = true;
      });
    }
    return s;
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return null;
      return saved;
    } catch (err) {
      return null;
    }
  }

  function emptyLive() {
    var s = S.newState(deckIds(), Date.now());
    s.memory = MEM.empty();
    s.profile = null;
    return s;
  }

  function resetLive() {
    var fresh = emptyLive();
    state.cards = fresh.cards;
    state.confusions = fresh.confusions;
    state.reviews = fresh.reviews;
    state.sessions = fresh.sessions;
    state.lastSession = null;
    state.placement = null;
    state.memory = fresh.memory;
    state.alphabet = {};
    state.trackMet = {};
    /* Daily progress is device-wide, not per deck: switching language must
     * not erase the cards already finished today. */
  }

  function bucketOf(s) {
    return {
      cards: s.cards || {},
      confusions: s.confusions || {},
      reviews: s.reviews || { good: 0, again: 0 },
      sessions: s.sessions || 0,
      lastSession: s.lastSession || null,
      placement: s.placement || null,
      memory: s.memory || MEM.empty(),
      alphabet: s.alphabet || {},
      trackMet: s.trackMet || {}
    };
  }

  function loadBucket(s, bucket) {
    s.cards = bucket.cards || {};
    s.confusions = bucket.confusions || {};
    s.reviews = bucket.reviews || { good: 0, again: 0 };
    s.sessions = bucket.sessions || 0;
    s.lastSession = bucket.lastSession || null;
    s.placement = bucket.placement || null;
    s.memory = bucket.memory && Array.isArray(bucket.memory.sentences) ? bucket.memory : MEM.empty();
    s.alphabet = bucket.alphabet && typeof bucket.alphabet === "object" ? bucket.alphabet : {};
    if (bucket.trackMet && typeof bucket.trackMet === "object" && !Array.isArray(bucket.trackMet)) {
      s.trackMet = bucket.trackMet;
    } else {
      /* Old per-language archives predate trackMet: adopt their cards once so
       * an already-earned path does not relock, then keep vocabulary review out
       * of it from here on. */
      s.trackMet = {};
      Object.keys(bucket.cards || {}).forEach(function (id) {
        if (bucket.cards[id] && bucket.cards[id].reps > 0) s.trackMet[id] = true;
      });
    }
  }

  function seedDeck(s) {
    var now = Date.now();
    deckIds().forEach(function (id) {
      if (!s.cards[id]) s.cards[id] = S.newCard(id, now);
    });
  }

  function save() {
    if (DEMO) return;
    if (state && state.profile && state.profile.byLang && state.profile.lang) {
      state.profile.byLang[state.profile.lang] = bucketOf(state);
    }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  /* --------------------------------------------------------------- language */

  function packList() {
    var list = (LANGS && LANGS.list()) || [];
    if (!list.length) list = [{ code: "es", name: "Spanish", locale: "es-ES" }];
    return list;
  }

  function renderLangPickers() {
    var list = packList();
    var current = (state.profile && state.profile.lang) || (ACTIVE && ACTIVE.code);
    ["setup-lang"].forEach(function (id) {
      var sel = $(id);
      if (!sel) return;
      sel.innerHTML = list.map(function (p) {
        return '<option value="' + esc(p.code) + '">' + esc(uiName(p.code)) + "</option>";
      }).join("");
      if (list.some(function (p) { return p.code === current; })) sel.value = current;
    });

  }

  function updateSetupCopy() {
    var q = document.querySelector("#view-setup .setup-q");
    if (!q || !ACTIVE) return;
    q.textContent = tr("studiedBefore", "Have you studied this language before?");
  }

  function setUiLang(code) {
    if (uiChoices(ACTIVE && ACTIVE.code).indexOf(code) === -1) return;
    state.profile = state.profile || {};
    state.profile.uiLang = code;
    save();
    applyStrings();
    renderUiLangPickers();
    if (typeof renderAccentPicker === "function") renderAccentPicker();
    if (typeof renderWishPresets === "function") renderWishPresets();
  }

  function switchLang(code) {
    if (!code || !LANGS || !LANGS.has(code)) return false;
    if (ACTIVE && ACTIVE.code === code) {
      if (state.profile) state.profile.lang = code;
      return false;
    }

    /* Remember the language being left before switching, so the flag row can
     * actually become a row instead of only ever containing the new one. */
    rememberLang(ACTIVE && ACTIVE.code);

    /* Choosing an interface language on first run creates a profile before it
     * has a deck or a byLang archive. Do not assume either exists. */
    if (state.profile) {
      state.profile.byLang = state.profile.byLang || {};
      if (state.profile.lang) state.profile.byLang[state.profile.lang] = bucketOf(state);
    }
    activatePack(code);

    if (state.profile) {
      state.profile.lang = code;
      var bucket = state.profile.byLang[code];
      if (bucket) {
        loadBucket(state, bucket);
      } else {
        resetLive();
      }
      state.settings.fields = Object.keys(D.categories);
      state.profile.byLang[code] = bucketOf(state);
    } else {
      /* Before the first profile exists there is nothing to keep, but the live
       * deck must still contain only the chosen pack's ids. */
      resetLive();
      state.settings.fields = Object.keys(D.categories);
    }

    /* A language with no placement of its own starts at the beginning. The
     * level of the deck you left stays with that deck. */
    if (state.profile) {
      state.profile.levelByLang = state.profile.levelByLang || {};
      if (!state.profile.levelByLang[code]) {
        /* Preserve an older placement, which predates per-language levels. */
        var pf = state.placement && state.placement.floor;
        state.profile.levelByLang[code] = pf >= 3 ? "B1" : pf >= 1 ? "A2" : "A1";
      }
      state.profile.level = state.profile.levelByLang[code];
    }

    seedDeck(state);
    ensureLanguage(code);
    session = null;
    reader = null;
    writing = null;
    alphabet = null;
    wordset = null;
    chat = null;
    chatEpoch += 1;
    resetChatClear();
    placement = null;
    rememberLang(code);
    save();
    applyStrings();
    renderUiLangPickers();
    renderLangPickers();
    updateSetupCopy();
    renderToday();
    if (currentView === "settings") { renderSettingsOptions(); renderLanguageLibrary(); }
    if (currentView === "stats") renderStats();
    /* A deck switch must not leave a half-finished lesson from the old pack on
     * screen. Settings and setup are the only views that belong to the switch. */
    if (currentView !== "setup" && currentView !== "settings" && currentView !== "wordset") show("today");
    return true;
  }

  function beginProfile(level) {
    var code = (ACTIVE && ACTIVE.code) || "es";
    var byLang = (state.profile && state.profile.byLang) || {};
    var levels = (state.profile && state.profile.levelByLang) || {};
    var ui = (state.profile && state.profile.uiLang) || defaultUiFor(code);
    byLang[code] = bucketOf(state);
    levels[code] = level;
    var languages = (state.profile && state.profile.languages) || [];
    if (languages.indexOf(code) === -1) languages.push(code);
    var personal = PERSONA ? PERSONA.ensure(state.profile || {}) : (state.profile || {});
    state.profile = {
      level: level, levelByLang: levels, lang: code, byLang: byLang, uiLang: ui,
      languages: languages, why: personal.why || "", interests: personal.interests || ""
    };
    save();
  }

  /* -------------------------------------------------------------- speech */

  var voice = null;
  var hasTTS = "speechSynthesis" in window;

  function allVoices() {
    return hasTTS ? (window.speechSynthesis.getVoices() || []) : [];
  }

  function allLangVoices() {
    if (!hasTTS) return [];
    var voices = window.speechSynthesis.getVoices() || [];
    var want = String((LANG && LANG.code) || "").toLowerCase();
    var name = String((LANG && LANG.name) || "").toLowerCase();
    return voices.filter(function (v) {
      var lang = String(v.lang || "").toLowerCase();
      return lang.indexOf(want) === 0 || (name && String(v.name || "").toLowerCase().indexOf(name) !== -1);
    });
  }

  function langVoices() {
    return allLangVoices().filter(function (v) { return v.localService !== false; });
  }

  function anyLangVoice() {
    var local = langVoices();
    if (local.length) return local[0];
    var target = allLangVoices();
    if (target.length) return target[0];
    /* Last resort: a local voice from another language. It is better than
     * silence for an AI reply the learner asked to hear. */
    var all = allVoices();
    var localAny = all.filter(function (v) { return v.localService !== false; });
    return localAny[0] || all[0] || null;
  }

  function canSpeak() {
    /* The voice list can arrive after the first assistant message. Allow the
     * attempt; speak() queues it until a voice appears. */
    return !!hasTTS;
  }

  function pickVoice() {
    if (!hasTTS) return;
    voice = anyLangVoice();
    updateAudioChip();
    if (pendingSpeech && allVoices().length) {
      var pending = pendingSpeech;
      pendingSpeech = null;
      setTimeout(function () { speak(pending.text, pending.btn, pending.onDone); }, 0);
    }
    setTimeout(updateAudioChip, 1600);
    setTimeout(updateAudioChip, 4000);
  }

  /* Audio is a bonus, not a dependency: if the device has no voice for the
   * active language the whole app still works, and it says so instead of
   * failing silently. */
  var audioCheckedAt = Date.now();

  /* Some platforms expose the API with an empty voice list and never populate
   * it. Waiting forever is why a silent device looks identical to a loading
   * one, so after a short grace period "no voices" becomes a definite answer. */
  function audioStatus() {
    if (hasBundled()) return { state: "ok", text: tr("audio", "audio") + " · " + Object.keys(bundled).length };
    if (!hasTTS) return { state: "none", text: tr("noVoice", "no usable voice") };
    var all = window.speechSynthesis.getVoices() || [];
    if (!all.length) {
      if (Date.now() - audioCheckedAt < 1500) return { state: "idle", text: "checking audio" };
      return { state: "none", text: tr("noVoice", "no usable voice") };
    }
    var voices = langVoices();
    if (voices.length) return { state: "ok", text: voices.length + " " + uiName(LANG.code) };
    return { state: "no-" + LANG.code, text: tr("noVoice", "no usable voice") + " · " + uiName(LANG.code) };
  }

  function updateAudioChip() {
    var chip = $("audio-chip");
    if (!chip) return;
    var st = audioStatus();
    chip.textContent = audioEnabled()
      ? (st.state === "ok" ? "🔊 " : "🔇 ") + st.text
      : "🔇 audio off";
    chip.classList.toggle("warn", st.state !== "ok");
    chip.title = st.state === "ok"
      ? tr("tapTestWord", "Tap to hear a test word")
      : tr("noVoice", "no usable voice") + ".";
  }

  if (hasTTS) {
    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
    try { window.speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (err) { /* older engines */ }
  }

  var audioCache = {};
  var speakTimer = null;
  var pendingSpeech = null;

  function hasBundled() {
    return !!(bundled && Object.keys(bundled).length);
  }

  /* Actual playback, not just the presence of an API. A pack with no clips and
   * no installed voice (Chinese on most machines) should not produce a speaking
   * task or a repeated "cannot play" toast. */
  function audioAvailable() {
    if (!audioEnabled()) return false;
    if (hasBundled()) return true;
    if (!hasTTS) return false;
    return langVoices().length > 0;
  }

  /* Test the active pack, not a hardcoded Spanish word: the settings chip used
   * to say "noche" while a French or Arabic deck was loaded. */
  function audioTestItem() {
    var ids = deckIds();
    for (var i = 0; i < ids.length; i += 1) {
      if (bundled && bundled[ids[i]]) return itemOf(ids[i]);
    }
    return ids.length ? itemOf(ids[0]) : null;
  }

  /* Prefer the WAV shipped with the app: it works on a machine with no
   * installed voices, which is the common case on Linux. Speech synthesis is
   * the fallback, not the primary path. */
  function sayItem(it, btn) {
    if (!audioAvailable()) return false;
    var url = bundled && bundled[it.id];
    if (url) {
      try {
        var a = audioCache[url] || (audioCache[url] = new Audio(url));
        a.currentTime = 0;
        var p = a.play();
        if (p && typeof p.catch === "function") p.catch(function () { /* autoplay policy */ });
        if (btn) {
          btn.classList.add("is-playing");
          a.onended = function () { btn.classList.remove("is-playing"); };
        }
        return true;
      } catch (err) { /* fall through */ }
    }
    speak(it.text, btn);
    return true;
  }

  function speak(text, btn, onDone) {
    var finished = false;
    var safety = 0;
    function done() {
      if (finished) return;
      finished = true;
      if (safety) clearTimeout(safety);
      if (onDone) onDone();
    }
    if (onDone) safety = setTimeout(done, Math.min(30000, 3000 + String(text || "").length * 90));
    if (!audioEnabled() || !hasTTS) { done(); return; }
    var synth = window.speechSynthesis;
    try {
      if (!voice) pickVoice();
      if (!allVoices().length) {
        pendingSpeech = { text: String(text), btn: btn, onDone: onDone };
        return;
      }
      if (synth.paused) synth.resume();

      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = (ACTIVE && ACTIVE.locale) || LANG.locale;
      u.rate = 0.9;
      u.pitch = 1;
      /* Only bind a voice whose language matches: a voice from another locale is
       * silent on some platforms, which reads as "the button does nothing". */
      var want = String(u.lang || "").slice(0, 2).toLowerCase();
      var pick = voice;
      if (pick && want && String(pick.lang || "").slice(0, 2).toLowerCase() !== want) {
        pick = anyLangVoice();
      }
      if (!pick) pick = anyLangVoice();
      if (pick) {
        u.voice = pick;
        if (pick.lang) u.lang = pick.lang;
      }

      var face = $("chat-face");
      var stopFace = function () { if (face) face.classList.remove("is-speaking"); };
      if (btn) btn.classList.add("is-playing");
      u.onend = function () {
        if (btn) btn.classList.remove("is-playing");
        stopFace();
        done();
      };
      u.onerror = function (ev) {
        if (ev && ev.error && ev.error !== "canceled" && ev.error !== "interrupted") {
          toast(tr("speechFailed", "This device could not speak that — try the speaker on a card."));
        }
        if (btn) btn.classList.remove("is-playing");
        stopFace();
        done();
      };

      var busy = synth.speaking || synth.pending;
      if (busy) synth.cancel();
      var go = function () {
        try {
          if (face) face.classList.add("is-speaking");
          synth.speak(u);
        } catch (err) { stopFace(); done(); }
      };
      clearTimeout(speakTimer);
      /* queuing inside the same tick as cancel() loses the utterance in Firefox */
      if (busy) speakTimer = setTimeout(go, 90);
      else go();
    } catch (err) { done(); }
  }

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var listening = false;

  function listen(expectedWord, onScore) {
    if (!SR) {
      toast(tr("noRecognitionSelfCheck", "This browser has no speech recognition — use “I said it” to self-check."));
      return false;
    }
    if (listening) return false;
    var rec;
    try { rec = new SR(); } catch (err) { return false; }
    rec.lang = LANG.locale;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    listening = true;

    rec.onresult = function (ev) {
      var best = 0;
      var said = "";
      for (var i = 0; i < ev.results.length; i += 1) {
        for (var j = 0; j < ev.results[i].length; j += 1) {
          var alt = ev.results[i][j];
          var sc = S.similarity(alt.transcript, expectedWord, ACTIVE && ACTIVE.code);
          if (sc > best) { best = sc; said = alt.transcript; }
        }
      }
      onScore(best, said);
    };
    rec.onerror = function (ev) {
      listening = false;
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        toast(tr("micRefused", "Microphone permission was refused."));
      } else if (ev.error !== "no-speech") {
        toast(tr("couldNotHear", "Couldn't hear that — try again."));
      }
    };
    rec.onend = function () { listening = false; };
    try { rec.start(); } catch (err) { listening = false; return false; }
    return true;
  }

  /* ---------------------------------------------------------------- views */

  var VIEWS = ["today", "session", "reader", "alphabet", "vocab", "wordset", "conv", "setup", "settings", "stats"];
  var currentView = "today";

  /* Setup is a gate, not a suggestion: tabs, deep links and buttons cannot
   * carry a learner into a lesson before a deck and a level exist. A placement
   * in flight is the one exception, because it owns the session screen. */
  function needsSetup() {
    if (!state || !state.profile) return true;
    var level = state.profile.levelByLang && state.profile.levelByLang[ACTIVE && ACTIVE.code];
    if (!level || level === "?") return !placement;
    return false;
  }

  function show(view) {
    if (needsSetup() && view !== "setup") view = "setup";
    if (view !== "conv" && chatVoice) setVoiceMode(false);
    /* If the control that opened this view is hidden with it, focus would be
     * lost in the document. Capture the origin now, and move focus into the new
     * view once it is visible. Tabs live outside the views, so switching tabs
     * leaves focus where the learner put it. */
    var previous = document.activeElement;
    var fromView = previous && previous.closest ? previous.closest(".view") : null;
    applyStrings();
    currentView = view;
    if (view === "conv") renderVoiceControl();
    VIEWS.forEach(function (v) {
      var el = $("view-" + v);
      if (el) el.classList.toggle("is-active", v === view);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      var on = t.getAttribute("data-view") === view;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });
    if (view === "today" || view === "settings") renderToday();
    if (view === "settings") { renderSettingsOptions(); renderChatSettings(); renderLanguageLibrary(); }
    if (view === "wordset") renderWordset();
    if (view === "stats") renderStats();
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + view);
    }
    /* Smooth scrolling is motion; a reduced-motion preference gets the jump. */
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var targetView = $("view-" + view);
    if (fromView && targetView && fromView !== targetView) {
      var focusTarget = targetView.querySelector("h1:not([hidden]), h2:not([hidden])") ||
        targetView.querySelector(".card") || targetView;
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        try { focusTarget.focus({ preventScroll: true }); }
        catch (err) { focusTarget.focus(); }
      }
    }
  }

  /* ---------------------------------------------------------------- today */

  /* --------------------------------------------------------------- builder */

  function renderLanguageLibrary() {
    var box = $("language-list");
    var select = $("settings-add-lang");
    var add = $("add-lang-btn");
    if (!box || !state.profile) return;
    var languages = (state.profile.languages || []).filter(function (code) { return LANGS.has(code); });
    if (languages.indexOf(ACTIVE.code) === -1) languages.unshift(ACTIVE.code);
    box.innerHTML = languages.map(function (code) {
      var lv = (state.profile.levelByLang && state.profile.levelByLang[code]) || "A1";
      return '<div class="language-card' + (code === ACTIVE.code ? " is-active" : "") + '">' +
        '<button class="language-pick" type="button" data-lang-card="' + esc(code) + '">' +
          '<span class="flag" aria-hidden="true">' + (LANG_FLAGS[code] || "") + "</span>" +
          '<span class="name">' + esc(uiName(code)) + "</span>" +
          '<span class="level">' + esc(lv) + "</span></button>" +
        (languages.length > 1
          ? '<button class="language-remove" type="button" data-remove-lang="' + esc(code) +
            '" aria-label="' + esc(tr("removeLanguage", "Remove language") + " " + uiName(code)) +
            '" title="' + esc(tr("removeLanguage", "Remove language")) + '">×</button>'
          : "") +
      "</div>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-lang-card]"), function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-lang-card") === ACTIVE.code) return;
        switchLang(b.getAttribute("data-lang-card"));
        renderLanguageLibrary();
      });
    });
    Array.prototype.forEach.call(box.querySelectorAll("[data-remove-lang]"), function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-remove-lang");
        askConfirm(tr("removeLanguage", "Remove language"),
          uiName(code) + " — " + tr("removeLanguageConfirm", "All progress for this language will be deleted. This cannot be undone."),
          tr("remove", "Remove"),
          function () { removeLanguage(code); });
      });
    });
    if (select) {
      var available = packList().filter(function (p) { return languages.indexOf(p.code) === -1; });
      select.innerHTML = available.map(function (p) {
        return '<option value="' + esc(p.code) + '">' + (LANG_FLAGS[p.code] || "") + " " + esc(uiName(p.code)) + "</option>";
      }).join("");
      select.disabled = !available.length;
    }
    if (add) add.disabled = !available.length;
  }

  function removeLanguage(code) {
    if (!state.profile || !code || !LANGS.has(code)) return;
    var languages = (state.profile.languages || []).filter(function (x) { return x !== code; });
    if (!languages.length) return;
    if (ACTIVE.code === code) switchLang(languages[0]);
    state.profile.languages = languages;
    delete state.profile.byLang[code];
    delete state.profile.levelByLang[code];
    if (state.chat) delete state.chat[code];
    state.profile.recentLangs = (state.profile.recentLangs || []).filter(function (x) { return x !== code; });
    if (state.profile.lang === code) state.profile.lang = ACTIVE.code;
    save();
    renderLanguageLibrary();
    renderToday();
    renderStats();
    toast(uiName(code) + " · " + tr("done", "removed"), 1800);
  }

  function renderPersonalSettings() {
    var why = $("personal-why");
    var interests = $("personal-interests");
    if (!state.profile) return;
    var p = PERSONA ? PERSONA.ensure(state.profile) : state.profile;
    if (why) why.value = p.why || "";
    if (interests) interests.value = p.interests || "";
  }

  function renderSettingsOptions() {
    function mark(selector, attr, value) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (b) {
        var on = b.getAttribute(attr) === value;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
      });
    }
    mark("[data-length]", "data-length", (state.settings && state.settings.length) || "goal");
    mark("[data-audio]", "data-audio", audioEnabled() ? "on" : "off");
    mark("[data-speak]", "data-speak", (state.settings && state.settings.autoSpeak) === "off" ? "off" : "on");
    mark("[data-ruby]", "data-ruby", rubyOn() ? "on" : "off");

    var group = $("ruby-group");
    if (group) group.hidden = !hasScriptLesson();

    var gloss = $("gloss-toggle");
    if (gloss) {
      var on = (state.settings && state.settings.translations) !== "off";
      gloss.textContent = on ? tr("translationsOn", "on") : tr("translationsOff", "off");
      gloss.classList.toggle("is-on", on);
      gloss.setAttribute("aria-pressed", String(on));
    }
    renderPersonalSettings();
    renderAccentPicker();
  }

  function applyAudioSetting() {
    var off = !audioEnabled();
    if (document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.toggle("audio-off", off);
    }
    if (off && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (err) { /* no voice */ }
    }
    updateAudioChip();
  }

  function applyAccent() {
    var id = (state && state.settings && state.settings.accent) || "ember";
    var rootEl = document.documentElement;
    if (!rootEl) return;
    if (id === "ember") rootEl.removeAttribute("data-accent");
    else rootEl.setAttribute("data-accent", id);
  }

  function accentLabel(theme) {
    var key = "accent" + theme.id.charAt(0).toUpperCase() + theme.id.slice(1);
    return tr(key, theme.name);
  }

  function renderAccentPicker() {
    var box = $("accent-list");
    if (!box || !ECON) return;
    var unlocked = (state.settings && state.settings.unlockedAccents) || ["ember"];
    var active = (state.settings && state.settings.accent) || "ember";
    box.innerHTML = ECON.THEMES.map(function (theme) {
      var owned = unlocked.indexOf(theme.id) !== -1;
      var on = theme.id === active;
      var meta = owned
        ? (on ? tr("equipped", "equipped") : tr("use", "use"))
        : theme.cost + " " + tr("coins", "coins");
      return '<button class="accent-swatch' + (on ? " is-active" : "") + '" type="button" ' +
        'data-accent-theme="' + esc(theme.id) + '" aria-pressed="' + on + '">' +
        '<span class="swatch swatch-' + esc(theme.id) + '" aria-hidden="true"></span>' +
        '<span class="accent-name">' + esc(accentLabel(theme)) + "</span>" +
        '<span class="accent-price">' + esc(meta) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-accent-theme]"), function (b) {
      b.addEventListener("click", function () { chooseAccent(b.getAttribute("data-accent-theme")); });
    });
  }

  function chooseAccent(id) {
    if (!ECON) return;
    var theme = ECON.theme(id);
    if (!theme) return;
    var unlocked = state.settings.unlockedAccents || ["ember"];
    var owned = unlocked.indexOf(theme.id) !== -1;
    if (!owned) {
      if (!ECON.canBuy(state.coins || 0, theme.id)) {
        var missing = theme.cost - (state.coins || 0);
        toast(tr("notEnoughCoins", "Need {n} more coins.").replace("{n}", String(missing)));
        return;
      }
      state.coins = (state.coins || 0) - theme.cost;
      unlocked.push(theme.id);
      state.settings.unlockedAccents = unlocked;
    }
    state.settings.accent = theme.id;
    save();
    applyAccent();
    renderAccentPicker();
    renderCoins();
    renderToday();
    var picked = document.querySelector('[data-accent-theme="' + theme.id + '"]');
    if (picked) {
      try { picked.focus({ preventScroll: true }); }
      catch (err) { picked.focus(); }
    }
    toast((owned ? tr("accentEquipped", "{name} in use.") : tr("accentBought", "{name} unlocked."))
      .replace("{name}", accentLabel(theme)));
  }

  function renderCoins() {
    var count = (state && state.coins) || 0;
    var el = $("stat-coins");
    if (el) el.textContent = String(count);
    var pill = document.querySelector(".coin-pill");
    if (pill) pill.setAttribute("aria-label", tr("coins", "coins") + " " + count);
  }

  function addCoins(n) {
    var gain = Math.max(0, Math.round(Number(n) || 0));
    if (!gain) return 0;
    state.coins = (state.coins || 0) + gain;
    save();
    renderCoins();
    return gain;
  }

  function dailyGoalTarget() {
    var hist = (state.history || []).map(function (h) {
      return typeof h === "number" ? h : h && h.size;
    });
    return ADAPT ? ADAPT.dailyGoal(hist) : 8;
  }

  /* The goal pays once per day, on reaching it, not for opening the app. */
  function payDailyGoal() {
    var today = dayKey(Date.now());
    var reward = state.dailyGoalReward;
    if (!reward || reward.date !== today) {
      reward = state.dailyGoalReward = { date: today, paid: false };
    }
    if (reward.paid) return;
    if ((state.daily && state.daily.cards || 0) < dailyGoalTarget()) return;
    reward.paid = true;
    var gain = addCoins(ECON ? ECON.dailyGoalCoins() : 5);
    toast(tr("dailyGoalCoins", "Daily goal · +{n} coins").replace("{n}", String(gain)));
  }

  /* A setting must change what is on screen now, not after a reload. */
  function redraw() {
    renderToday();
    if (currentView === "session" && session) renderQuiz();
  }

  function renderBuilder() {
    var box = $("fields");
    if (!box) return;

    var fields = selectedFields();
    box.innerHTML = Object.keys(D.categories).map(function (cat) {
      var n = D.concepts.filter(function (c) { return c.cat === cat; }).length;
      var on = fields.indexOf(cat) !== -1;
      return '<button type="button" class="field' + (on ? " is-on" : "") + '" data-cat="' + cat + '"' +
        ' aria-pressed="' + on + '">' + esc(catLabel(cat)) +
        ' <b>' + n + "</b></button>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll(".field"), function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-cat");
        var current = selectedFields().slice();
        var i = current.indexOf(cat);
        if (i === -1) current.push(cat);
        else current.splice(i, 1);
        if (!current.length) { toast(tr("pickField", "Pick at least one field.")); return; }
        state.settings.fields = current;
        save();
        renderBuilder();
      });
    });

    renderSettingsOptions();

    /* one kind of lesson: every session draws from the whole deck */
    var due = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).length;

    var note = $("builder-note");
    if (note) {
      var goalNow = ADAPT ? ADAPT.dailyGoal((state.history || [])) : lessonSize();
      note.textContent = goalNow + " " + tr("today", "today") + " · " + deckIds().length + " " +
        tr("cards", "cards") + " · " + due + " " + tr("due", "due");
    }
  }

  function renderToday() {
    renderBuilder();
    renderTrack();
    renderCustomLessons();
    renderWishLangs();
    renderLangSwitch();

    var due = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).length;
    var known = allIds.filter(function (id) { return state.cards[id] && state.cards[id].reps > 0; }).length;
    var mastered = allIds.filter(function (id) { return state.cards[id] && state.cards[id].interval >= 6; }).length;

    $("stat-due").textContent = due;
    $("stat-learned").textContent = known;
    $("stat-total").textContent = allIds.length;
    $("stat-streak").textContent = currentStreak();
    var xp = $("stat-xp");
    if (xp) xp.textContent = state.xp || 0;
    var lvl = $("stat-level");
    if (lvl) lvl.textContent = tr("levelShort", "Lv") + " " + (Math.floor((state.xp || 0) / 100) + 1);
    renderCoins();
    $("stat-mastered").textContent = mastered;
    $("known-bar").style.width = Math.round((known / Math.max(allIds.length, 1)) * 100) + "%";

    var date = new Date().toLocaleDateString(uiLocale(), { weekday: "short", day: "numeric", month: "short" });
    $("today-date").textContent = date + " · " + uiName(ACTIVE.code) + " · " + learnerLevel();

    var next = renderNextStack();
    $("lesson-meta").textContent = tr("aboutMinutes", "about {n} min")
      .replace("{n}", String(next.minutes));

    var goal = dailyGoalTarget();
    var doneToday = (state.daily && state.daily.cards) || 0;
    $("goal-done").textContent = String(Math.min(doneToday, goal));
    $("goal-target").textContent = String(goal);
    $("goal-fill").style.width = Math.min(100, Math.round((doneToday / Math.max(goal, 1)) * 100)) + "%";
    $("goal-line").classList.toggle("is-done", doneToday >= goal);
    $("goal-line").setAttribute("aria-label", tr("goal", "goal") + " " + doneToday + "/" + goal);
    $("lesson-name").textContent = next.title;
    $("start-sub").textContent = next.caption || tr("nothingDue", "Nothing new or due. Practise anything.");
    $("lesson-goal").textContent = next.goal || "";
    var personal = PERSONA && state.profile ? PERSONA.ensure(state.profile) : null;
    var personalLine = $("personal-line");
    var why = personal && personal.why;
    var interests = personal && personal.interests;
    if (personalLine) {
      var bits = [];
      if (why) bits.push(tr("yourWhy", "Why you're learning") + " · " + why);
      if (interests) bits.push(tr("interests", "What you like") + " · " + interests);
      personalLine.hidden = !bits.length;
      personalLine.textContent = bits.join(" · ");
    }
    var personalPrompt = $("personal-prompt");
    if (personalPrompt) personalPrompt.hidden = !!(why || interests);
    renderReviewList();
  }

  /* What the schedule brings back next, soonest first. */
  function renderReviewList() {
    var box = $("review-list");
    var now = Date.now();
    /* Grammar basics have no picture or schema glyph, so they stay out of this
     * visual list; they are still scheduled and still appear in a lesson. */
    var ids = allIds.concat(phraseIds, termIds).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).sort(function (a, b) {
      return state.cards[a].due - state.cards[b].due;
    }).slice(0, 4);

    if (!ids.length) {
      box.innerHTML = '<p class="list-empty">' + esc(tr("reviewEmpty", "Words you learn come back here when they are due.")) + "</p>";
      return;
    }
    box.innerHTML = ids.map(function (id) {
      var it = itemOf(id);
      var due = state.cards[id].due;
      return '<button class="row" type="button" data-review="' + esc(id) + '"' +
        ' aria-label="' + esc(tr("reviewOne", "Review") + " " + it.text) + '">' +
        '<span class="row-body">' +
          '<span class="row-main">' + articleHTML(it.article) + textHTML(it) + "</span>" +
          '<span class="row-meta">' + (due <= now ? tr("today", "today") : capital(whenFrom(due - now))) + "</span>" +
        "</span></button>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll("[data-review]"), function (btn) {
      btn.addEventListener("click", function () {
        reviewOne(btn.getAttribute("data-review"));
      });
    });
  }

  /* A due row is a direct route into a one-card review, not just a label. */
  function reviewOne(id) {
    if (!state.cards[id] || !reviewable(id)) {
      toast(tr("notReadyReview", "That one is not ready to review yet."));
      return;
    }
    session = newSession("mixed", [], [id]);
    show("session");
    renderQuiz();
  }

  function capital(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* -------------------------------------------------------------- reader */

  var reader = null;

  /* Reading is graded like everything else: a learner reads at their own band
   * and never above it. A1 meets level 1, A2 level 2, B1 level 3, and B2 or C1
   * level 4. */
  function readerLevel() {
    return ADAPT.shelf(learnerLevel());
  }

  function readerShelf() {
    var texts = (window.SEMA_TEXTS && window.SEMA_TEXTS.texts) || [];
    var max = readerLevel();
    var open = texts.filter(function (t) { return t.level <= max; });
    return open.length ? open : texts.slice(0, 1);
  }

  function startReader() {
    var shelf = readerShelf();
    if (!shelf.length) { toast(tr("noTexts", "No texts in this pack yet.")); return; }
    var read = state.readTexts || [];
    var next = shelf.filter(function (t) { return read.indexOf(t.id) === -1; })[0] || shelf[0];
    reader = { text: next, qi: 0, correct: 0, misses: [], done: false };
    show("reader");
    renderReaderText();
  }

  function renderReaderText() {
    var t = reader.text;
    $("reader-count").textContent = tr("level", "level") + " " + t.level;
    $("reader-bar").style.width = t.ai ? "100%" : "8%";
    $("reader-feedback").textContent = "";
    $("reader-feedback").className = "feedback";
    $("reader-stage").innerHTML =
      '<p class="prompt">' + esc(tr("read", "Read")) + "</p>" +
      '<h3 class="reader-title">' + esc(t.title) + "</h3>" +
      '<p class="reader-body">' + esc(t.body) + "</p>";
    var listen = hasTTS && audioEnabled()
      ? '<button class="btn btn-ghost" id="reader-listen" type="button">' +
        esc(tr("listenText", "Listen to text")) + "</button>"
      : "";
    var generate = '<button class="btn btn-ghost" id="reader-generate" type="button">' +
      esc(tr(t.ai ? "readerAnother" : "readerGenerate", t.ai ? "Another text" : "Write me a text")) +
      "</button>";
    var questions = t.questions && t.questions.length
      ? '<button class="btn btn-primary" id="reader-go" type="button">' +
        esc(tr("questions", "Questions")) + "</button>"
      : "";
    $("reader-actions").innerHTML = listen + generate + questions;
    var listenBtn = $("reader-listen");
    if (listenBtn) listenBtn.addEventListener("click", function () {
      speak(t.title + ". " + t.body, listenBtn);
    });
    var generateBtn = $("reader-generate");
    if (generateBtn) generateBtn.addEventListener("click", function () { generateReaderText(generateBtn); });
    var go = $("reader-go");
    if (go) go.addEventListener("click", renderReaderQuestion);
  }

  function generateReaderText(btn) {
    if (!AITOOLS) {
      toast(tr("readerNoModel", "No local model answered; keeping the packed text."));
      return;
    }
    var old = btn.textContent;
    btn.disabled = true;
    btn.textContent = tr("readerWriting", "Writing a text…");
    var feedback = $("reader-feedback");
    if (feedback) { feedback.textContent = ""; feedback.className = "feedback"; }
    var personal = PERSONA && state.profile ? PERSONA.ensure(state.profile) : {};
    var level = learnerLevel();
    var context = [];
    if (personal.why) context.push("The learner is learning for: " + personal.why + ".");
    if (personal.interests) context.push("Topics they enjoy: " + personal.interests + ".");
    var system = "You write very short reading practice in " + ACTIVE.name + ". " +
      "Return only a title on the first line and three to five short sentences on the following lines. " +
      "Use everyday words at the learner's level. No English, no markdown, no questions, no explanations.";
    var prompt = "Level " + level + ". " + context.join(" ") +
      " Write a new everyday text. Keep it under 70 words.";
    localModelAsk(system, prompt).then(function (reply) {
      var parsed = AITOOLS.parseReading(reply);
      if (!parsed) throw new Error("no reading");
      reader = {
        text: { id: "ai-" + Date.now(), title: parsed.title, body: parsed.body,
          level: level, questions: [], ai: true },
        qi: 0, correct: 0, misses: [], done: false
      };
      renderReaderText();
    }).catch(function () {
      if (feedback) feedback.textContent = tr("readerNoModel", "No local model answered; keeping the packed text.");
      btn.disabled = false;
      btn.textContent = old;
    });
  }

  /* Why that option was wrong, in the words the text ships with, and always the
   * right answer beside it: a wrong tap must teach, not just subtract. */
  function readerWhy(q, picked) {
    var why = q.why && q.why[picked];
    if (!why) return "the answer was: " + q.options[q.answer];
    return why + " · the answer was: " + q.options[q.answer];
  }

  function renderReaderQuestion() {
    if (!reader) return;
    if (reader.qi >= reader.text.questions.length) { finishReader(); return; }

    var q = reader.text.questions[reader.qi];
    $("reader-bar").style.width = Math.round(((reader.qi + 1) / reader.text.questions.length) * 100) + "%";
    $("reader-count").textContent = (reader.qi + 1) + "/" + reader.text.questions.length;
    $("reader-stage").innerHTML =
      '<p class="prompt">' + esc(reader.text.title) + "</p>" +
      '<p class="reader-q">' + esc(q.q) + "</p>" +
      '<div class="word-options">' + q.options.map(function (o, i) {
        return '<button class="option-word" data-i="' + i + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
    $("reader-actions").innerHTML = "";

    Array.prototype.forEach.call($("reader-stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = Number(btn.getAttribute("data-i"));
        var ok = picked === q.answer;
        if (ok) reader.correct += 1;
        else reader.misses.push({ q: q.q, why: readerWhy(q, picked) });
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        Array.prototype.forEach.call($("reader-stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (Number(b.getAttribute("data-i")) === q.answer) b.classList.add("pick-correct");
        });
        $("reader-feedback").textContent = ok ? "right" : readerWhy(q, picked);
        $("reader-feedback").className = "feedback " + (ok ? "good" : "bad");
        reader.qi += 1;
        $("reader-actions").innerHTML = '<button class="btn btn-primary" id="reader-next">' + esc(tr("continue", "Continue")) + '</button>';
        $("reader-next").addEventListener("click", renderReaderQuestion);
      });
    });
  }

  function finishReader() {
    var t = reader.text;
    var total = t.questions.length;
    state.readTexts = state.readTexts || [];
    $("reader-bar").style.width = "100%";
    $("reader-count").textContent = tr("done", "done");
    $("reader-feedback").textContent = "";
    $("reader-feedback").className = "feedback";
    $("reader-stage").innerHTML =
      '<p class="prompt">' + esc(tr("textFinished", "Text finished")) + "</p>" +
      '<div class="word">' + reader.correct + "/" + total + "</div>" +
      '<p class="sentence">' + esc(t.title) + " · " + esc(tr("level", "level")) + " " + t.level + "</p>" +
      (reader.misses.length
        ? '<ul class="reader-why">' + reader.misses.map(function (m) {
            return "<li><b>" + esc(m.q) + "</b>" + esc(m.why) + "</li>";
          }).join("") + "</ul>"
        : "");

    /* a lesson is a lesson: finishing a text counts like any other */
    if (!reader.done) {
      reader.done = true;
      state.readTexts = (state.readTexts || []).filter(function (id) { return id !== t.id; });
      state.readTexts.push(t.id);
      state.history = state.history || [];
      state.history.push(total);
      if (state.history.length > 50) state.history = state.history.slice(-50);
      state.sessions += 1;
      state.lastSession = Date.now();
      bumpDaily();
      bumpStreak();
      save();
    }

    /* never a dead end: the next text is one tap, leaving is the other */
    var shelf = readerShelf();
    var next = shelf.filter(function (x) { return state.readTexts.indexOf(x.id) === -1; })[0] || shelf[0];
    var more = next && next.id !== t.id;
    $("reader-actions").innerHTML =
      '<button class="btn btn-primary" id="reader-again">' +
        esc(more ? tr("nextText", "Next text") : tr("readAgain", "Read it again")) + "</button>" +
      '<button class="btn btn-ghost btn-sm" id="reader-done" type="button">done for now</button>';
    $("reader-again").addEventListener("click", startReader);
    $("reader-done").addEventListener("click", function () { reader = null; show("today"); });
  }

  /* -------------------------------------------------------------- alphabet */

  /* A non-Latin pack opens on its script, one character at a time: the letter,
   * its name, how it sounds, and a word that uses it. The lesson is a real
   * lesson - progress is saved per language and it always ends with a way on. */
  var alphabet = null;
  var ALPHABET_CHUNK = 8;

  function alphabetChunk() {
    var letters = scriptLetters();
    var known = state.alphabet || {};
    var fresh = letters.filter(function (l) { return !known[l.letter]; });
    return (fresh.length ? fresh : letters).slice(0, ALPHABET_CHUNK);
  }

  /* The example word is audio if the deck already voices it, otherwise the
   * device's voice; with neither, the letter is still readable. */
  function exampleIdFor(word) {
    var want = String(word || "").toLowerCase();
    if (!want) return null;
    var ids = allIds.concat(phraseIds, termIds, basicIds);
    for (var i = 0; i < ids.length; i += 1) {
      if (String(itemOf(ids[i]).text).toLowerCase() === want) return ids[i];
    }
    return null;
  }

  function sayExample(l, btn) {
    var id = exampleIdFor(l.example);
    if (id) sayItem(itemOf(id), btn);
    else if (l.example) speak(l.example, btn);
  }

  function startAlphabet() {
    var queue = alphabetChunk();
    if (!queue.length) { toast(tr("noAlphabet", "This deck has no alphabet yet.")); return; }
    alphabet = { queue: queue, i: 0, startedAt: Date.now(), done: false };
    show("alphabet");
    renderAlphabetLetter();
  }

  function renderAlphabetLetter() {
    if (!alphabet) return;
    if (alphabet.i >= alphabet.queue.length) { finishAlphabet(); return; }

    var l = alphabet.queue[alphabet.i];
    var last = alphabet.i === alphabet.queue.length - 1;
    $("alphabet-count").textContent = (alphabet.i + 1) + "/" + alphabet.queue.length;
    $("alphabet-bar").style.width = Math.round((alphabet.i / alphabet.queue.length) * 100) + "%";
    $("alphabet-feedback").textContent = "";
    $("alphabet-feedback").className = "feedback";
    $("alphabet-stage").innerHTML =
      '<p class="prompt">' + esc(tr("theScript", "The script")) + "</p>" +
      '<div class="letter-big" lang="' + esc((LANG && LANG.locale) || "") + '">' + esc(l.letter) + "</div>" +
      (String(l.name || "").toLowerCase() !== String(l.letter || "").toLowerCase()
        ? '<p class="letter-name">' + esc(l.name) + "</p>" : "") +
      (l.hint ? '<p class="letter-hint">' + esc(l.hint) + "</p>" : "") +
      (l.example
        ? (audioAvailable()
          ? '<button class="letter-example" id="letter-hear" type="button" aria-label="' +
              esc(tr("hearit", "Hear it")) + '">' + ICON.speaker + "<span>" + esc(l.example) + "</span></button>"
          : '<p class="letter-example-text">' + esc(l.example) + "</p>")
        : "");

    var hear = $("letter-hear");
    if (hear) hear.addEventListener("click", function () { sayExample(l, hear); });
    /* only the bundled clip plays on arrival; a synthesized voice on every
     * letter would talk over the learner */
    var exampleId = exampleIdFor(l.example);
    if (exampleId && audioAvailable() && bundled && bundled[exampleId]) sayItem(itemOf(exampleId));

    $("alphabet-actions").innerHTML =
      '<button class="btn btn-primary" id="letter-next">' +
        esc(last ? tr("finish", "Finish") : tr("nextLetter", "Next letter")) + "</button>";
    $("letter-next").addEventListener("click", function () {
      var known = state.alphabet || (state.alphabet = {});
      var reps = (known[l.letter] && known[l.letter].reps) || 0;
      known[l.letter] = { reps: reps + 1, at: Date.now() };
      save();
      alphabet.i += 1;
      renderAlphabetLetter();
    });
  }

  function finishAlphabet() {
    var total = alphabet.queue.length;
    state.alphabet = state.alphabet || {};
    $("alphabet-bar").style.width = "100%";
    $("alphabet-count").textContent = tr("done", "done");
    $("alphabet-stage").innerHTML =
      '<p class="prompt">' + esc(tr("theScript", "The script")) + "</p>" +
      '<div class="word">' + alphabetKnown() + "/" + scriptLetters().length + "</div>" +
      '<p class="sentence">' + esc(tr("letters", "letters")) + "</p>";

    if (!alphabet.done) {
      alphabet.done = true;
      state.history = state.history || [];
      state.history.push(total);
      if (state.history.length > 50) state.history = state.history.slice(-50);
      state.sessions += 1;
      state.lastSession = Date.now();
      bumpDaily();
      bumpStreak();
      save();
    }

    /* never a dead end: more letters, then writing, or back to today */
    var more = alphabetKnown() < scriptLetters().length;
    var canWrite = !more && writingPool().length > 0;
    $("alphabet-actions").innerHTML =
      '<button class="btn btn-primary" id="alphabet-again">' +
        esc(more ? tr("nextLetter", "Next letter") : canWrite ? tr("writeCharacters", "Write the characters") : tr("start", "Start lesson")) + "</button>" +
      '<button class="btn btn-ghost btn-sm" id="alphabet-done" type="button">' + esc(tr("leave", "done for now")) + "</button>";
    $("alphabet-again").addEventListener("click", function () {
      if (canWrite) startWriting();
      else startAlphabet();
    });
    $("alphabet-done").addEventListener("click", function () { alphabet = null; show("today"); });
  }

  /* --------------------------------------------------------------- writing */

  /* Writing practice exists only where the script does: the pool is built from
   * items whose text is not Latin and that carry a reading. A Latin deck has no
   * candidates, so the lesson cannot appear there by accident. Nothing here
   * grades how a character is drawn - only whether it was produced. */
  var writing = null;
  var WRITING_SIZE = 6;

  /* Only items whose `sub` is a reading, never a gloss: a concept's word or a
   * phrase's text. Basics carry an English gloss in `sub`, terms a frame, so
   * they are not writing material. */
  function writingItem(id) {
    var c = conceptById[id];
    var p = phraseById[id];
    var text = c ? c.word : p ? p.text : "";
    var sub = c ? c.sub : p ? p.sub : "";
    return {
      id: id,
      text: text || "",
      sub: sub || "",
      gloss: (ACTIVE && ACTIVE.glosses && ACTIVE.glosses[id]) || ""
    };
  }

  function writingPool() {
    if (!WRITING) return [];
    var items = allIds.concat(phraseIds).map(writingItem);
    return WRITING.candidates(items).filter(function (it) { return atLevel(it.id); });
  }

  /* The script lesson: letters first, writing once they are all known. */
  function startScriptLesson() {
    if (alphabetDone() && writingPool().length) { startWriting(); return; }
    startAlphabet();
  }

  function writingQueue() {
    var pool = writingPool();
    var fresh = [], seen = [];
    S.shuffle(pool, Math.random).forEach(function (it) {
      var card = state.cards[it.id];
      (card && card.reps > 0 ? seen : fresh).push(it);
    });
    return fresh.concat(seen).slice(0, WRITING_SIZE);
  }

  function startWriting() {
    var queue = writingQueue();
    if (!queue.length) { toast(tr("noWriting", "This deck has no writing practice yet.")); return; }
    writing = {
      queue: queue, i: 0, firstCorrect: 0, missed: {}, done: false,
      answers: S.shuffle(queue.map(function (it) { return it.sub; }), Math.random),
      startedAt: Date.now()
    };
    show("session");
    renderWritingCard();
  }

  function writingGloss(it) {
    return it.gloss || "";
  }

  function renderWritingCard() {
    if (!writing) return;
    if (writing.i >= writing.queue.length) { finishWriting(); return; }

    var it = writing.queue[writing.i];
    clearCard();
    $("counter").textContent = (writing.i + 1) + "/" + writing.queue.length;
    $("bar-fill").style.width = Math.round((writing.i / writing.queue.length) * 100) + "%";

    /* recognise first: reading the script has to come before producing it */
    if (writing.i % 2 === 0 || !WRITING.canRecall(it)) renderWritingRecognise(it);
    else renderWritingRecall(it);
  }

  function renderWritingRecall(it) {
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("writeIt", "Write it")) + "</p>" +
      '<div class="writing-pinyin">' + esc(it.sub) + "</div>" +
      (writingGloss(it) ? '<p class="writing-gloss">' + esc(writingGloss(it)) + "</p>" : "") +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="' + esc(tr("characters", "The characters")) + '" placeholder="' + esc(tr("characters", "The characters")) + '" />' +
      '<p class="writing-hint">' + esc(tr("typeCharacters", "Type or paste the characters.")) + '</p>' +
      '<button class="btn btn-primary" id="write-check">' + esc(tr("check", "Check")) + '</button>';

    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); checkWriting(it, input.value); }
      });
    }
    $("write-check").addEventListener("click", function () {
      checkWriting(it, input ? input.value : "");
    });
    $("actions").innerHTML = typingSkipHTML();
    wireTypingSkip(skipWriting);
  }

  function skipWriting() {
    if (!writing) return;
    /* A skipped task is not a wrong answer and not a completed card: remove it
     * from the queue, so the summary and the denominator ignore it. */
    writing.queue.splice(writing.i, 1);
    if (!writing.queue.length) finishWriting();
    else renderWritingCard();
  }

  function checkWriting(it, answer) {
    var result = WRITING.grade(answer, it.text);
    if (result.reason === "empty") { toast(tr("typeCharacters", "Type or paste the characters.")); return; }
    if (result.reason === "latin-only") {
      toast(tr("latinKeyboard", "These characters are not on a Latin keyboard — paste them."));
      return;
    }
    if (!result.ok) {
      $("stage").innerHTML += '<p class="sentence">the answer was ' + textHTML(it) + "</p>";
    }
    writingResult(it, result.ok, result.ok ? tr("correct", "Correct") : tr("notQuite", "Not quite"));
  }

  function renderWritingRecognise(it) {
    var seen = {};
    var set = [it.sub];
    seen[it.sub] = true;
    writing.answers.forEach(function (sub) {
      if (set.length >= 4 || seen[sub]) return;
      seen[sub] = true;
      set.push(sub);
    });
    if (set.length < 4) {
      writingPool().forEach(function (other) {
        if (set.length >= 4 || seen[other.sub]) return;
        seen[other.sub] = true;
        set.push(other.sub);
      });
    }

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("whichReading", "Which reading?")) + "</p>" +
      '<div class="word">' + esc(it.text) + "</div>" +
      '<div class="word-options">' + S.shuffle(set, Math.random).map(function (sub) {
        return '<button class="option-word" data-sub="' + esc(sub) + '">' + esc(sub) + "</button>";
      }).join("") + "</div>";
    $("actions").innerHTML = glossHTML(it.id);
    wireGloss();

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-sub") === it.sub;
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-sub") === it.sub) b.classList.add("pick-correct");
        });
        if (!ok) btn.classList.add("pick-wrong");
        writingResult(it, ok, ok ? tr("correct", "Correct") :
          tr("wrongAnswer", "the answer was {answer}").replace("{answer}", it.sub));
      });
    });
  }

  function writingResult(it, ok, message) {
    if (ok) writing.firstCorrect += 1;
    else writing.missed[it.id] = true;
    S.review(state, it.id, ok ? 2 : 0, Date.now());
    save();

    $("card").classList.add("is-answered");
    Array.prototype.forEach.call($("stage").querySelectorAll("button, input, select, textarea"), function (el) {
      el.disabled = true;
    });
    $("feedback").textContent = message;
    $("feedback").className = "feedback " + (ok ? "good" : "bad");
    $("actions").innerHTML = glossHTML(it.id) +
      '<button class="btn btn-primary" id="next">' + esc(tr("continue", "Continue")) + '</button>';
    wireGloss();
    $("next").addEventListener("click", function () {
      writing.i += 1;
      renderWritingCard();
    });
  }

  function finishWriting() {
    if (!writing || !writing.queue.length) {
      writing = null;
      show("today");
      toast(tr("skippedAll", "No cards answered; nothing was counted."));
      return;
    }
    var total = writing.queue.length;
    var good = writing.firstCorrect;
    state.history = state.history || [];
    state.history.push(total);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.sessions += 1;
    state.lastSession = Date.now();
    bumpDaily();
    bumpStreak();
    save();

    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);
    $("card").classList.add("is-summary");
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("writingDone", "Writing done")) + "</p>" +
      '<p class="sum-big">' + good + "/" + total + "</p>";
    $("actions").innerHTML =
      '<button class="btn btn-primary" id="writing-again">' + esc(tr("writeMore", "Write more")) + "</button>" +
      '<button class="btn btn-ghost btn-sm" id="writing-done" type="button">done for now</button>';
    $("writing-again").addEventListener("click", startWriting);
    $("writing-done").addEventListener("click", function () { writing = null; show("today"); });
  }

  /* --------------------------------------------------------- conversation */

  /* The chat is per language. Everything below reads `chat`, which points at
   * state.chat[ACTIVE.code]; the rest of the app never needs to know which
   * language the conversation belongs to. */
  var CHAT_MAX_MESSAGES = 80;
  var chat = null;
  var chatMeta = { status: "idle", engine: null, model: null, vision: false };
  var chatCheck = 0;
  var chatPending = false;
  var chatListening = false;
  var chatRec = null;
  var chatVoice = false;
  var chatEpoch = 0;
  var chatTranslating = {};
  var chatCleared = false;
  var clearState = { armed: false };
  var chatSeq = 0;

  function newChatId() {
    chatSeq += 1;
    return "m-" + Date.now().toString(36) + "-" + chatSeq.toString(36);
  }

  function chatState() {
    if (!ACTIVE) return { messages: [], scripted: null };
    var code = ACTIVE.code;
    var c = state.chat[code];
    if (!c || typeof c !== "object" || Array.isArray(c)) c = state.chat[code] = { messages: [] };
    if (!Array.isArray(c.messages)) c.messages = [];
    if (!c.mission) c.mission = null;
    c.messages.forEach(function (m) {
      if (m && !m.id) m.id = newChatId();
    });
    return c;
  }

  function chatEndpoint() {
    var v = state.settings && state.settings.chatEndpoint;
    if (CE && CE.normaliseBaseUrl) return CE.normaliseBaseUrl(v);
    return String(v || "http://localhost:11434").trim() || "http://localhost:11434";
  }

  function chatEngine() {
    return "local";
  }

  function cleanEndpoint(value) {
    if (CE && CE.normaliseBaseUrl) return CE.normaliseBaseUrl(value);
    var v = String(value || "").trim();
    if (!v) return "http://localhost:11434";
    if (!/^https?:\/\//i.test(v)) v = "http://" + v;
    return v.replace(/\/+$/, "");
  }

  function chatStatusLine() {
    if (chatEngine() === "offline") return ["ready", tr("offlineChat", "Offline practice")];
    if (chatMeta.status === "ready" && chatMeta.model) {
      var what = CE && CE.isLocalEndpoint(chatEndpoint()) ? "local model" : "model";
      return ["ready", tr("localModel", "local model") + " · " + chatMeta.model];
    }
    if (chatMeta.status === "checking") return ["checking", tr("checkingModel", "looking for a local model…")];
    if (chatMeta.status === "failed") return ["missing", tr("modelFailed", "the model did not answer — scripted practice")];
    if (chatMeta.status === "missing") {
      if (CE && !CE.isLocalEndpoint(chatEndpoint())) {
        return ["missing", tr("noModelEndpoint", "no model answered — check the endpoint")];
      }
      return ["missing", tr("noLocalModel", "no local model found — run ollama serve")];
    }
    return ["idle", tr("notChecked", "not checked yet")];
  }

  function setChatStatus() {
    var line = chatStatusLine();
    var el = $("chat-status");
    if (el) {
      el.textContent = line[1];
      el.setAttribute("data-state", line[0]);
    }
    var face = $("chat-face");
    if (face) face.setAttribute("data-state", line[0]);
    var settingsEl = $("chat-settings-status");
    if (settingsEl) settingsEl.textContent = line[1];
    var settingsSummary = $("chat-summary-status");
    if (settingsSummary) settingsSummary.textContent = line[1];
    if (currentView === "conv" && chat) renderChat();
  }

  /* ------------------------------------------------------- optional local AI
   *
   * The browser talks to an OpenAI-compatible local server (llama.cpp, Ollama).
   * It is an assistant: planned lessons and word suggestions always fall back
   * to the authored pack when no model answers.
   */
  var localCandidates = function () {
    var out = [];
    [chatEndpoint(), "http://localhost:8080", "http://localhost:8081", "http://localhost:11434"].forEach(function (value) {
      var base = CE && CE.normaliseBaseUrl ? CE.normaliseBaseUrl(value) : String(value || "");
      if (base && out.indexOf(base) === -1 && (!CE || CE.isLocalEndpoint(base))) out.push(base);
    });
    return out;
  };

  function discoverLocal() {
    if (!CE) return Promise.resolve(null);
    var list = localCandidates();
    var i = 0;
    function next() {
      if (i >= list.length) return null;
      var base = list[i++];
      return CE.discover(base, undefined, 1800).then(function (found) {
        if (found && found.engine && found.models && found.models.length) return found;
        return next();
      }).catch(next);
    }
    return Promise.resolve().then(next);
  }

  function localModelAsk(system, prompt) {
    return discoverLocal().then(function (found) {
      if (!found) throw new Error("no local model");
      var wanted = (state.settings && state.settings.chatModel) || "";
      var model = (found.models.filter(function (m) { return m.name === wanted; })[0] || found.models[0]).name;
      return CE.sendChat({
        baseUrl: found.baseUrl,
        engine: found.engine,
        model: model,
        system: system,
        history: [{ role: "user", text: prompt }],
        timeoutMs: 20000
      });
    }).then(function (reply) {
      if (!reply || !reply.ok || !reply.text) throw new Error("no reply");
      return reply.text;
    });
  }

  function findLocalModel() {
    var btn = $("chat-find");
    var status = $("chat-settings-status");
    if (btn) { btn.disabled = true; btn.textContent = tr("findingModel", "Looking for a local model…"); }
    if (status) status.textContent = tr("findingModel", "Looking for a local model…");
    discoverLocal().then(function (found) {
      if (!found) {
        if (status) status.textContent = tr("modelNotFound", "No local model answered.");
        toast(tr("modelNotFound", "No local model answered."));
        return;
      }
      state.settings.chatEngine = "local";
      state.settings.chatEndpoint = found.baseUrl;
      state.settings.chatModel = found.models[0].name;
      save();
      refreshChatEngine();
      renderChatSettings();
      var name = found.models[0].name;
      toast(tr("modelFound", "Found {model}").replace("{model}", name));
    }).catch(function () {
      if (status) status.textContent = tr("modelNotFound", "No local model answered.");
      toast(tr("modelNotFound", "No local model answered."));
    }).then(function () {
      if (btn) { btn.disabled = false; btn.textContent = tr("findModel", "Find local model"); }
    });
  }

  function suggestWordset() {
    var areaInput = $("wordset-area");
    var area = areaInput ? areaInput.value.trim() : "";
    var note = $("wordset-ai-note");
    var btn = $("wordset-suggest");
    if (!area) {
      if (note) note.textContent = tr("wordsetEmpty", "Paste at least one word.");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = tr("wordsetSuggesting", "Asking the local model…"); }
    if (note) note.textContent = tr("wordsetSuggesting", "Asking the local model…");
    localModelAsk(
      AITOOLS.systemWords(uiName(ACTIVE.code)),
      AITOOLS.wordsPrompt(uiName(ACTIVE.code), area)
    ).then(function (text) {
      var words = AITOOLS.parseList(text, 12);
      if (!words.length) throw new Error("no words");
      var input = $("wordset-input");
      if (input) { input.value = words.join("\n"); input.scrollTop = 0; }
      state.settings.wordsetDraft = input ? input.value : "";
      save();
      findWordset();
      if (note) note.textContent = "";
    }).catch(function () {
      /* No model is not a dead end, but an unrelated greeting list is worse
       * than an honest empty answer. Use only the pack's matching topic
       * phrases; never openers, due revision or grammar filler. */
      var wish = wishLesson(area, ACTIVE.code, { areaOnly: true });
      var texts = (wish.ids || []).map(function (id) { return itemOf(id).text; }).filter(Boolean);
      var input = $("wordset-input");
      if (texts.length && input) {
        input.value = texts.join("\n");
        input.scrollTop = 0;
        state.settings.wordsetDraft = input.value;
        save();
        findWordset();
        if (note) note.textContent = tr("wordsetFallback", "Local model is not connected; used the pack's topic matches.");
      } else {
        if (input) input.value = "";
        state.settings.wordsetDraft = "";
        save();
        clearWordsetPreview();
        if (note) note.textContent = tr("wordsetNoArea", "No pack words for that area yet. Connect a local model for a suggestion.");
      }
    }).then(function () {
      if (btn) { btn.disabled = false; btn.textContent = tr("wordsetSuggest", "Suggest words"); }
    });
  }

  function suggestWish() {
    var input = $("wish-input");
    var text = input ? input.value.trim() : "";
    var note = $("wish-note");
    var btn = $("wish-ai");
    if (!text) {
      if (note) note.textContent = tr("wishEmpty", "Tell me where you are going and what you want to do.");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = tr("wishAsking", "Asking the local model…"); }
    if (note) note.textContent = tr("wishAsking", "Asking the local model…");
    localModelAsk(AITOOLS.systemKeywords(), AITOOLS.keywordsPrompt(text)).then(function (reply) {
      var keys = AITOOLS.parseList(reply, 8);
      if (!keys.length) throw new Error("no keywords");
      buildWishLesson(text + " " + keys.join(" "), $("wish-lang") && $("wish-lang").value);
    }).catch(function () {
      if (note) note.textContent = tr("wishFallback", "Local model is not connected; built the lesson from the pack.");
      buildWishLesson(text, $("wish-lang") && $("wish-lang").value);
    }).then(function () {
      if (btn) { btn.disabled = false; btn.textContent = tr("wishAi", "Suggest with local model"); }
    });
  }

  function renderChatSettings() {
    var ep = $("chat-endpoint");
    if (ep) ep.value = chatEndpoint();
    var model = $("chat-model");
    if (model) model.value = (state.settings && state.settings.chatModel) || "";
    setChatStatus();
  }

  function refreshChatEngine() {
    if (chatEngine() === "offline") {
      chatMeta = { status: "ready", engine: "mini", model: null, vision: false };
      setChatStatus();
      seedScriptedIfEmpty();
      return;
    }
    if (!CE) {
      chatMeta = { status: "missing", engine: null, model: null, vision: false };
      setChatStatus();
      return;
    }

    var token = ++chatCheck;
    chatMeta = { status: "checking", engine: null, model: null, vision: false };
    setChatStatus();

    /* Probe all local candidates, not just the configured endpoint: when the
     * app starts the model beside itself it lands on 8081, while a standalone
     * installer uses 8080 and Ollama uses 11434. */
    discoverLocal().then(function (found) {
      if (token !== chatCheck) return;
      if (!found || !found.engine) {
        chatMeta = { status: "missing", engine: null, model: null, vision: false };
        setChatStatus();
        seedScriptedIfEmpty();
        return;
      }
      var endpoint = found.baseUrl;
      state.settings.chatEndpoint = endpoint;

      var chosen = String((state.settings && state.settings.chatModel) || "").trim();
      if (!chosen) chosen = (found.models[0] && found.models[0].name) || "";
      state.settings.chatModel = chosen;
      save();
      if (!chosen) {
        chatMeta = { status: "missing", engine: null, model: null, vision: false };
        setChatStatus();
        seedScriptedIfEmpty();
        return;
      }

      chatMeta = { status: "checking", engine: found.engine, model: chosen, vision: false };
      setChatStatus();
      return CE.visionFor({
        baseUrl: endpoint,
        engine: found.engine,
        model: chosen,
        models: found.models,
        timeoutMs: 2500
      }).then(function (vision) {
        if (token !== chatCheck) return;
        chatMeta = { status: "ready", engine: found.engine, model: chosen, vision: !!vision };
        setChatStatus();
      });
    }).catch(function () {
      if (token !== chatCheck) return;
      chatMeta = { status: "missing", engine: null, model: null, vision: false };
      setChatStatus();
      seedScriptedIfEmpty();
    });
  }

  function emptyChatLine() {
    var name = (ACTIVE && uiName(ACTIVE.code)) || "the language";
    return "Say something in " + name + ". Or attach a picture.";
  }

  function renderChatHeader() {
    if (ACTIVE) {
      var nm = $("chat-name");
      if (nm) nm.textContent = uiName(ACTIVE.code) + " · " + tr("conversation", "Conversation");
      var input = $("chat-input");
      if (input) {
        input.placeholder = tr("saySomething", "say something");
        input.setAttribute("aria-label", tr("yourMessage", "your message"));
      }
    }
    setChatStatus();
  }

  function renderChat(forceBottom) {
    if (!chat) return;
    var log = $("chat");
    if (!log) return;

    var atBottom = !!forceBottom ||
      log.scrollHeight - log.scrollTop - log.clientHeight < 24;
    var keepTop = log.scrollTop;
    if (!chat.messages.length) {
      log.innerHTML = '<p class="chat-empty">' + esc(emptyChatLine()) + "</p>";
    } else {
      log.innerHTML = chat.messages.map(function (m, i) {
        return CE && CE.messageHTML
          ? CE.messageHTML(m, esc, {
            canSpeak: audioEnabled() && canSpeak(),
            canTranslate: chatMeta.status === "ready" && !!chatMeta.model,
            index: i,
            translating: !!chatTranslating[m.id]
          })
          : '<p class="bubble-text">' + esc(m.text) + "</p>";
      }).join("");
    }

    Array.prototype.forEach.call(log.querySelectorAll("[data-hear]"), function (btn) {
      btn.addEventListener("click", function () {
        var text = CE && CE.messageTextById
          ? CE.messageTextById(chat.messages, btn.getAttribute("data-hear"))
          : "";
        if (text) speak(text, btn);
        else setChatFeedback("that reply is no longer available.", "");
      });
    });
    Array.prototype.forEach.call(log.querySelectorAll("[data-translate]"), function (btn) {
      btn.addEventListener("click", function () {
        translateMessage(btn.getAttribute("data-translate"));
      });
    });
    updateChatClear();
    updateWrapButton();
    log.scrollTop = atBottom ? log.scrollHeight : keepTop;
    if (forceBottom && window.requestAnimationFrame) {
      window.requestAnimationFrame(function () {
        if (log) log.scrollTop = log.scrollHeight;
      });
    }
  }

  function updateChatClear() {
    var btn = $("chat-clear");
    if (!btn) return;
    var has = !!(chat && chat.messages.length);
    if (!has) clearState.armed = false;
    btn.hidden = !has;
    btn.textContent = tr("clear", "clear");
    btn.classList.remove("is-armed");
    btn.setAttribute("aria-label", btn.textContent);
  }

  function resetChatClear() {
    clearState.armed = false;
    updateChatClear();
  }

  function clearChat() {
    if (!chat) return;
    chat.messages = [];
    chat.scripted = null;
    chat.scene = null;
    chatCleared = true;
    hideCoach();
    renderScene();
    chatEpoch += 1;
    chatTranslating = {};
    setVoiceMode(false);
    setChatBusy(false);
    save();
    renderChat();
    setChatFeedback(tr("cleared", "conversation cleared."), "");
    var cleared = tr("cleared", "conversation cleared.");
    setTimeout(function () {
      var el = $("conv-feedback");
      if (el && el.textContent === cleared) setChatFeedback("", "");
    }, 2400);
  }

  function chatClearClick() {
    if (!chat || !ACTIVE || !chat.messages.length) return;
    askConfirm(
      tr("clear", "clear"),
      tr("clearChatConfirm", "Clear this conversation? This cannot be undone."),
      tr("clear", "clear"),
      clearChat
    );
  }

  function translateMessage(id) {
    if (!chat || !CE || !ACTIVE || chatMeta.status !== "ready" || !chatMeta.model) return;
    var msg = CE.findMessage ? CE.findMessage(chat.messages, id) : null;
    if (!msg || msg.role !== "assistant" || !msg.text) return;

    if (msg.translation) {
      msg.showTranslation = !msg.showTranslation;
      save();
      renderChat();
      return;
    }
    if (chatTranslating[id]) return;

    chatTranslating[id] = true;
    msg.translationError = false;
    renderChat();

    var epoch = chatEpoch;
    var code = ACTIVE.code;
    var target = msg;
    CE.sendChat({
      baseUrl: chatEndpoint(),
      engine: chatMeta.engine,
      model: chatMeta.model,
      system: CE.buildTranslationPrompt(ACTIVE),
      history: [{ role: "user", text: msg.text }],
      vision: false,
      timeoutMs: 30000
    }).then(function (res) {
      delete chatTranslating[id];
      if (!chat || chatEpoch !== epoch || !ACTIVE || ACTIVE.code !== code) return;
      if (chat.messages.indexOf(target) === -1) return;
      if (res && res.ok && res.text) {
        target.translation = String(res.text).trim();
        target.showTranslation = true;
        target.translationError = false;
        save();
      } else {
        target.translationError = true;
      }
      renderChat();
    }).catch(function () {
      delete chatTranslating[id];
      if (!chat || chatEpoch !== epoch || !ACTIVE || ACTIVE.code !== code) return;
      if (chat.messages.indexOf(target) === -1) return;
      target.translationError = true;
      renderChat();
    });
  }

  function seedScriptedIfEmpty() {
    if (!chat || chat.messages.length || !ACTIVE || chatCleared) return;
    if (chatEngine() === "offline") {
      if (miniChat) {
        var opening = miniChat.opening();
        if (opening) addAssistant(opening, true, "mini", true);
      }
      return;
    }
    /* The authored dialogue is the offline course's real conversation, not
     * an invented "No local model found." The model, when present, still wins. */
    var dialogues = (CONV && CONV.dialogues) || [];
    var d = dialogues.length ? dialogues[Math.floor(Math.random() * dialogues.length)] : null;
    if (d && d.turns && d.turns.length) {
      chat.scripted = { dialogue: d.id, turn: 0, misses: 0 };
      addAssistant(d.turns[0].es, true, "scripted", true);
      return;
    }
    if (!CE) {
      if (miniChat) {
        var miniOpen = miniChat.opening();
        if (miniOpen) addAssistant(miniOpen, true, "mini", true);
      }
      return;
    }
    var opening = CE.scriptedOpening(ACTIVE.code);
    if (!opening) return;
    chat.scripted = chat.scripted || CE.scriptedStart(ACTIVE.code);
    addAssistant(opening, true, "scripted", true);
  }

  function trimChat() {
    if (!chat || chat.messages.length <= CHAT_MAX_MESSAGES) return;
    chat.messages = chat.messages.slice(-CHAT_MAX_MESSAGES);
  }

  function addAssistant(text, scripted, note, quiet) {
    if (!chat) return;
    var clean = String(text == null ? "" : text).trim();
    if (!clean) return;
    chat.messages.push({
      id: newChatId(),
      role: "assistant",
      text: clean,
      scripted: !!scripted,
      note: note || "",
      at: Date.now()
    });
    trimChat();
    save();
    renderChat(true);
    var listenNext = function () {
      if (!chatVoice || !SR) return;
      setTimeout(function () {
        if (chatVoice && currentView === "conv" && !chatPending && chat) listenChat();
      }, 260);
    };
    if (autoSpeakOn() && hasTTS && allVoices().length && !quiet) speak(clean, null, listenNext);
    else if (chatVoice && !quiet) listenNext();
  }

  function addUser(text) {
    if (!chat) return;
    var msg = {
      id: newChatId(),
      role: "user",
      text: String(text == null ? "" : text).trim(),
      at: Date.now()
    };
    chat.messages.push(msg);
    trimChat();
    save();
    renderChat(true);
  }

  function setChatFeedback(text, kind) {
    var el = $("conv-feedback");
    if (!el) return;
    el.textContent = text || "";
    el.className = "feedback" + (kind ? " " + kind : "");
  }

  function setChatBusy(busy) {
    chatPending = !!busy;
    var send = $("chat-send");
    if (send) {
      send.disabled = !!busy;
      send.textContent = busy ? tr("sending", "Sending…") : tr("send", "Send");
    }
    var log = $("chat");
    if (log) log.setAttribute("aria-busy", busy ? "true" : "false");
    setChatFeedback(busy ? "thinking…" : "", "");
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Keep the learner's own line as review material, but only when it actually
   * contains a word the pack knows: that is what makes a later cloze card
   * possible. Lines with no deck word stay in the conversation only. */
  function rememberChatLine(text) {
    var t = String(text || "").replace(/\s+/g, " ").trim();
    if (t.length < 4 || !MEM) return;
    var hay = MEM.normalize(t);
    var ids = deckIds().filter(function (id) {
      var it = itemOf(id);
      var needle = MEM.normalize(it && it.text ? it.text : "")
        .replace(/[^a-z0-9]+/g, " ").trim();
      if (needle.length < 2) return false;
      var re = new RegExp("(^|[^a-z0-9])" + escapeRegExp(needle) + "([^a-z0-9]|$)");
      return re.test(hay);
    }).slice(0, 6);
    if (!ids.length) return;
    MEM.addSentence(state.memory, t, ids, Date.now());
  }

  function miniAnswer(text) {
    if (!miniChat) return "";
    var context = (chat.miniContext || []).slice(-3).join(" ");
    var reply = miniChat.reply(text, {
      last: chat.lastMini || "",
      context: context,
      recent: (chat.recentMini || []).slice(-4)
    });
    if (reply) {
      chat.lastMini = reply;
      chat.recentMini = (chat.recentMini || []).concat([reply]).slice(-6);
      chat.miniContext = (chat.miniContext || []).concat([text, reply]).slice(-4);
    }
    return reply;
  }

  function fallbackReply(userText, note) {
    if (!chat || !ACTIVE) return;
    /* Offline practice is a live predictor conversation, not a fixed script. */
    if (chatEngine() === "offline") {
      var miniNow = miniAnswer(userText);
      if (miniNow) {
        addAssistant(miniNow, true, "mini");
        return;
      }
      setChatFeedback(tr("notChecked", "The offline partner has nothing to add."), "");
      return;
    }
    var d = null;
    if (chat.scripted && chat.scripted.dialogue && CONV && CONV.dialogues) {
      CONV.dialogues.forEach(function (item) {
        if (item.id === chat.scripted.dialogue) d = item;
      });
    }
    if (d && d.turns) {
      var turn = d.turns[chat.scripted.turn] || d.turns[0];
      var said = S.normalize(userText, ACTIVE && ACTIVE.code);
      var fits = !turn.expects || !turn.expects.length || turn.expects.some(function (word) {
        return said.indexOf(S.normalize(word, ACTIVE && ACTIVE.code)) !== -1;
      });
      if (!fits) {
        chat.scripted.misses = (chat.scripted.misses || 0) + 1;
        if (chat.scripted.misses >= 2 && miniChat) {
          var miniMiss = miniAnswer(userText);
          if (miniMiss) {
            chat.scripted.misses = 0;
            addAssistant(miniMiss, true, "mini");
            setChatFeedback(tr("notQuite", "Not quite"), "");
            return;
          }
        }
        addAssistant(chatReaction("miss") + " " + turn.es, true, "scripted");
        setChatFeedback(tr("notQuite", "Not quite"), "");
        return;
      }
      chat.scripted.turn += 1;
      var next = d.turns[chat.scripted.turn];
      if (!next) {
        if (miniChat) {
          var freeReply = miniAnswer(userText);
          if (freeReply) {
            addAssistant(freeReply, true, "mini");
            setChatFeedback(tr("lessonDone", "Lesson done"), "");
            return;
          }
        }
        setChatFeedback(tr("lessonDone", "Lesson done"), "");
        return;
      }
      var lead = Math.random() < 0.5 ? chatReaction("good") + " " : "";
      addAssistant((lead + next.es).trim(), true, "scripted");
      return;
    }
    if (!d && miniChat) {
      var miniReply = miniAnswer(userText);
      if (miniReply) {
        addAssistant(miniReply, true, "mini");
        return;
      }
    }
    if (!CE || !chat) return;
    var session = chat.scripted || CE.scriptedStart(ACTIVE.code);
    var res = CE.scriptedRespond(ACTIVE.code, session, userText);
    chat.scripted = session;

    var reply = [res.reply, res.next].filter(Boolean).join(" ").trim();
    if (!reply) {
      /* Never invent a Spanish goodbye for an Arabic or Japanese deck: when
       * the script is out of turns, say so in the interface language and stop. */
      setChatFeedback(res.done
        ? "that's the end of this scripted conversation."
        : "the scripted partner has nothing more to say.", "");
      return;
    }

    addAssistant(reply, true, "scripted");
    if (note) setChatFeedback(note, "");
    save();
  }

  function sendChatTurn() {
    if (chatPending || !chat || !ACTIVE) return;
    if (chatListening && chatRec) {
      try { chatRec.stop(); } catch (err) { /* stopped */ }
    }
    var input = $("chat-input");
    var text = input ? input.value.trim() : "";
    if (!text) return;

    resetChatClear();
    chatCleared = false;
    addUser(text);
    checkMission(text);
    rememberChatLine(text);
    if (input) input.value = "";

    if (chatEngine() === "offline" || chatMeta.status !== "ready" || !CE) {
      fallbackReply(text, "");
      return;
    }

    var target = chat;
    var code = ACTIVE.code;
    var epoch = chatEpoch;
    setChatBusy(true);
    CE.sendChat({
      baseUrl: chatEndpoint(),
      engine: chatMeta.engine,
      model: chatMeta.model,
      system: CE.buildSystemPrompt(ACTIVE, learnerLevel(), PERSONA ? PERSONA.prompt(state.profile) : ""),
      history: chat.messages.slice(-CE.MAX_HISTORY),
      vision: chatMeta.vision,
      timeoutMs: 45000
    }).then(function (res) {
      if (chat !== target || !ACTIVE || ACTIVE.code !== code || epoch !== chatEpoch) return;
      setChatBusy(false);
      if (res && res.ok && res.text) {
        addAssistant(res.text, false, "");
        return;
      }
      chatMeta = { status: "failed", engine: null, model: null, vision: false };
      setChatStatus();
      fallbackReply(text, "the model did not answer — using scripted practice");
    }).catch(function () {
      if (chat !== target || !ACTIVE || ACTIVE.code !== code || epoch !== chatEpoch) return;
      setChatBusy(false);
      chatMeta = { status: "failed", engine: null, model: null, vision: false };
      setChatStatus();
      fallbackReply(text, "the model did not answer — using scripted practice");
    });
  }

  /* Transfer mission: choose words the learner has met and ask them to use
   * those words in a real exchange. It is retrieval in context, not a quiz. */
  function assignMission() {
    if (!chat) return;
    var now = Date.now();
    var pool = allIds.filter(function (id) {
      if (!atLevel(id) || itemOf(id).kind !== "phrase") return false;
      var card = state.cards[id];
      return !card || !card.due || card.due <= now || (card.ease || 2.5) < 2.5;
    });
    pool.sort(function (a, b) {
      var ca = state.cards[a] || {};
      var cb = state.cards[b] || {};
      return (ca.ease || 2.5) - (cb.ease || 2.5);
    });
    if (pool.length < 2) pool = allIds.filter(function (id) { return itemOf(id).kind === "phrase" && atLevel(id); });
    chat.mission = { ids: pool.slice(0, 3), used: {} };
  }

  function missionHit(text, item) {
    var hay = String(text || "").toLowerCase();
    var target = String(item.text || "").toLowerCase();
    if (!hay || !target) return false;
    if (hay.indexOf(target) !== -1) return true;
    var words = target.split(/[^\p{L}\p{N}]+/u).filter(function (w) { return w.length > 2; });
    if (!words.length) return false;
    var hits = 0;
    words.forEach(function (w) { if (hay.indexOf(w) !== -1) hits += 1; });
    return hits >= Math.max(1, Math.ceil(words.length / 2));
  }

  function checkMission(text) {
    if (!chat || !chat.mission || !chat.mission.ids.length) return;
    chat.mission.ids.forEach(function (id) {
      if (!chat.mission.used[id] && missionHit(text, itemOf(id))) chat.mission.used[id] = true;
    });
    save();
    renderMission();
    var used = chat.mission.ids.filter(function (id) { return chat.mission.used[id]; });
    if (used.length === chat.mission.ids.length && !chat.mission.done) {
      chat.mission.done = true;
      state.xp = (state.xp || 0) + 5;
      save();
      toast(tr("missionDone", "Transfer mission complete") + " · +5 XP");
    }
  }

  function renderScene() {
    var el = $("chat-scene");
    if (!el) return;
    if (!chat || !chat.scene) { el.hidden = true; return; }
    el.hidden = false;
    var text = $("chat-scene-text");
    if (text) text.textContent = chat.scene;
  }

  function renderMission() {
    var el = $("chat-mission");
    if (!el) return;
    if (!chat || !chat.mission || !chat.mission.ids.length) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<p class="mission-title">' + esc(tr("missionTitle", "Use these in the conversation")) + "</p>" +
      '<div class="mission-chips">' + chat.mission.ids.map(function (id) {
        return '<span class="mission-chip' + (chat.mission.used[id] ? " is-used" : "") + '">' + esc(itemOf(id).text) + "</span>";
      }).join("") + "</div>";
  }

  function hideCoach() {
    var panel = $("coach-panel");
    if (!panel) return;
    panel.hidden = true;
    panel.innerHTML = "";
  }

  function updateWrapButton() {
    var btn = $("chat-wrap");
    if (!btn) return;
    var hasUser = !!(chat && chat.messages.some(function (m) { return m.role === "user"; }));
    btn.disabled = !hasUser;
  }

  function coachPicks() {
    var transcript = (chat ? chat.messages.map(function (m) { return m.text || ""; }).join(" ") : "").toLowerCase();
    var personal = PERSONA && state.profile ? PERSONA.ensure(state.profile) : {};
    var topics = String((personal.why || "") + " " + (personal.interests || ""))
      .toLowerCase().match(/[a-zà-ÿā-ž]+/g) || [];
    var now = Date.now();
    var pool = allIds.filter(function (id) {
      return itemOf(id).kind === "phrase" && atLevel(id);
    });
    function score(id) {
      var it = itemOf(id);
      var card = state.cards[id] || {};
      var hay = (it.text + " " + (it.sub || "") + " " + (glossFor(id) || "")).toLowerCase();
      var n = 0;
      if (!card.last || (card.due && card.due <= now)) n += 4;
      if (card.ease && card.ease < 2.5) n += 3;
      topics.forEach(function (word) { if (word.length > 3 && hay.indexOf(word) !== -1) n += 3; });
      if (transcript.indexOf(String(it.text || "").toLowerCase()) !== -1) n -= 2;
      return n;
    }
    pool.sort(function (a, b) { return score(b) - score(a); });
    return pool.slice(0, 3);
  }

  function renderCoach() {
    if (!chat || !chat.messages.length) return;
    var panel = $("coach-panel");
    if (!panel) return;
    var picks = coachPicks();
    var turns = chat.messages.filter(function (m) { return m.role === "user"; }).length;
    panel.hidden = false;
    panel.innerHTML =
      '<p class="coach-kicker">' + esc(tr("coachCheck", "Coach check-in")) + "</p>" +
      '<h3 class="coach-title">' + esc(tr("coachCheck", "Coach check-in")) + "</h3>" +
      '<p class="coach-copy">' + esc(tr("coachTurns", "You kept going for {n} turns. Keep these phrases:")
        .replace("{n}", String(turns))) + "</p>" +
      '<div class="coach-chips">' + picks.map(function (id) {
        var it = itemOf(id);
        return '<div class="coach-chip"><b>' + textHTML(it) + "</b><span>" +
          esc(glossFor(id) || "") + "</span></div>";
      }).join("") + "</div>" +
      '<p class="coach-note" id="coach-note"></p>' +
      '<div class="coach-actions">' +
        (picks.length ? '<button class="btn btn-primary btn-sm" id="coach-practice" type="button">' +
          esc(tr("coachPractice", "Practise these")) + "</button>" : "") +
        '<button class="btn btn-ghost btn-sm" id="coach-close" type="button">' +
          esc(tr("done", "Done")) + "</button>" +
      "</div>";
    var note = $("coach-note");
    var practice = $("coach-practice");
    if (practice) practice.addEventListener("click", function () {
      hideCoach();
      if (picks.length) startSession({ ids: picks, size: picks.length, title: tr("coachCheck", "Coach check-in") });
    });
    var close = $("coach-close");
    if (close) close.addEventListener("click", hideCoach);
    var transcript = chat.messages.map(function (m) { return m.text || ""; }).join("\n");
    if (CE && chatMeta.status === "ready" && chatMeta.model) {
      note.textContent = tr("coachThinking", "Writing a short coach note…");
      CE.sendChat({
        baseUrl: chatEndpoint(),
        engine: chatMeta.engine,
        model: chatMeta.model,
        system: CE.buildCoachPrompt(ACTIVE, PERSONA ? PERSONA.prompt(state.profile) : "", uiName(uiLang())),
        history: [{ role: "user", text: transcript }],
        timeoutMs: 30000
      }).then(function (res) {
        if (!note || !note.isConnected) return;
        note.textContent = (res && res.ok && res.text)
          ? String(res.text).trim().slice(0, 320)
          : tr("coachFallback", "Keep the conversation going — try one of these phrases next time.");
      }).catch(function () {
        if (note && note.isConnected) {
          note.textContent = tr("coachFallback", "Keep the conversation going — try one of these phrases next time.");
        }
      });
    } else {
      note.textContent = tr("coachFallback", "Keep the conversation going — try one of these phrases next time.");
    }
  }

  function startConversation() {
    if (!CE) { toast(tr("chatEngineMissing", "The chat engine did not load.")); return; }
    chat = chatState();
    setVoiceMode(false);
    hideCoach();
    if (!chat.mission) assignMission();
    chatCleared = false;
    chatTranslating = {};
    chatEpoch += 1;
    resetChatClear();
    show("conv");
    renderChatHeader();
    renderChat(true);
    renderScene();
    renderMission();
    renderVoiceControl();
    setChatBusy(false);
    refreshChatEngine();
  }

  function renderVoiceControl() {
    var row = $("chat-voice-row");
    if (!row) return;
    row.hidden = !SR;
    var btn = $("chat-voice");
    if (btn) {
      btn.classList.toggle("is-on", chatVoice);
      btn.setAttribute("aria-pressed", String(chatVoice));
      btn.textContent = tr(chatVoice ? "voiceModeOn" : "voiceMode", chatVoice ? "Hands-free on" : "Hands-free");
    }
  }

  function setVoiceMode(on) {
    chatVoice = !!on;
    var btn = $("chat-voice");
    if (!chatVoice) {
      if (chatListening && chatRec) {
        try { chatRec.stop(); } catch (err) { /* stopped */ }
      }
      if (btn) { btn.classList.remove("is-on"); btn.setAttribute("aria-pressed", "false"); }
      renderVoiceControl();
      return;
    }
    if (!SR) {
      chatVoice = false;
      toast(tr("noRecognition", "This browser has no speech recognition."));
      renderVoiceControl();
      return;
    }
    renderVoiceControl();
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (err) { /* no voice */ }
    if (!chatListening) listenChat();
  }

  function listenChat() {
    if (!SR) return;
    if (chatListening && chatRec) {
      try { chatRec.stop(); } catch (err) { /* already stopped */ }
      return;
    }

    var rec;
    try { rec = new SR(); } catch (err) {
      toast(tr("noRecognition", "This browser has no speech recognition."));
      return;
    }

    rec.lang = (ACTIVE && ACTIVE.locale) || (LANG && LANG.locale) || "es-ES";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    chatListening = true;
    chatRec = rec;

    var btn = $("chat-listen");
    if (btn) {
      btn.classList.add("is-live");
      btn.setAttribute("aria-pressed", "true");
    }

    rec.onresult = function (ev) {
      var said = "";
      try { said = ev.results[0][0].transcript || ""; } catch (err) { said = ""; }
      var input = $("chat-input");
      if (input && said) {
        if (chatVoice) {
          input.value = said;
          sendChatTurn();
        } else {
          input.value = (input.value ? input.value.replace(/\s+$/, "") + " " : "") + said;
          input.focus();
        }
      }
    };
    rec.onerror = function (ev) {
      if (ev && (ev.error === "not-allowed" || ev.error === "service-not-allowed")) {
        chatVoice = false;
        renderVoiceControl();
        toast(tr("micRefused", "Microphone permission was refused."));
      } else if (ev && ev.error !== "no-speech") {
        toast(tr("couldNotHear", "Couldn't hear that — try again."));
      }
    };
    rec.onend = function () {
      chatListening = false;
      chatRec = null;
      if (btn) {
        btn.classList.remove("is-live");
        btn.setAttribute("aria-pressed", "false");
      }
    };

    try {
      rec.start();
    } catch (err) {
      chatListening = false;
      chatRec = null;
      if (btn) btn.classList.remove("is-live");
    }
  }

  /* ------------------------------------------------------------ placement */

  var placement = null;
  var PLACEMENT_TOTAL = 12;

  /* Twelve questions on a staircase, not a random sample. Three correct
   * answers in a row move the next question up a CEFR band; a miss steps back
   * one. A perfect run can reach C1, and the question's band is visible in the
   * counter. The learner never picks a level by hand. */
  function startPlacement() {
    placement = { i: 0, correct: 0, band: 0, streak: 0, peak: 0, asked: {}, id: null };
    show("session");
    renderPlaceItem();
  }

  function placementFloor() {
    return (state.placement && state.placement.floor) || 0;
  }

  function pickPlacementItem() {
    var asked = placement.asked;
    function atBand(band) {
      var want = ADAPT.CEFR[band];
      return deckIds().filter(function (id) {
        return !asked[id] && itemLevel(id) === want;
      });
    }
    var ids = atBand(placement.band);
    for (var lower = placement.band - 1; !ids.length && lower >= 0; lower -= 1) ids = atBand(lower);
    for (var higher = placement.band + 1; !ids.length && higher < ADAPT.CEFR.length; higher += 1) ids = atBand(higher);
    if (!ids.length) {
      ids = deckIds().filter(function (id) { return !asked[id]; });
    }
    return S.shuffle(ids, Math.random)[0] || null;
  }

  function renderPlaceItem() {
    if (!placement) return;
    if (placement.i >= PLACEMENT_TOTAL) { finishPlacement(); return; }
    if (!placement.id) {
      placement.id = pickPlacementItem();
      if (!placement.id) { finishPlacement(); return; }
      placement.asked[placement.id] = true;
    }

    clearCard();
    var id = placement.id;
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("counter").textContent = (placement.i + 1) + "/" + PLACEMENT_TOTAL +
      " · " + (ADAPT.CEFR[placement.band] || "A1");
    $("bar-fill").style.width = Math.round((placement.i / PLACEMENT_TOTAL) * 100) + "%";

    var prompt = translationFor(id) || glossFor(id) || it.sub || "";
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("howMuch", "How much do you know?")) + "</p>" +
      (prompt ? '<p class="word">' + esc(prompt) + "</p>" : "") +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-id") === id;
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        markChoices(".option-word", id);
        ADAPT.placementStep(placement, ok);
        placement.i += 1;
        placement.id = null;
        setTimeout(renderPlaceItem, ok ? 220 : 700);
      });
    });
  }

  function finishPlacement() {
    var total = Math.max(1, placement.i);
    var correct = placement.correct;
    var units = trackUnits();
    var maxBand = 0;
    deckIds().forEach(function (id) {
      var at = ADAPT.CEFR.indexOf(itemLevel(id));
      if (at > maxBand) maxBand = at;
    });
    /* Twelve answers can open any band the deck actually carries; a perfect
     * run should reach C1 if C1 material exists. */
    var bandIndex = Math.min(placement.band, maxBand);
    var band = ADAPT.CEFR[bandIndex] || "A1";
    var floor = Math.min(units.length - 1, bandIndex * 2);
    state.placement = { floor: floor, band: band, score: correct, total: total, at: Date.now() };
    if (state.profile) {
      state.profile.level = band;
      state.profile.levelByLang = state.profile.levelByLang || {};
      state.profile.levelByLang[ACTIVE.code] = band;
      ensureLanguage(ACTIVE.code);
      state.profile.pendingLang = null;
      state.profile.pendingFrom = null;
    }
    placement = null;
    save();

    show("today");
    toast(tr("rightCount", "{correct}/{total} right")
      .replace("{correct}", String(correct)).replace("{total}", String(total)));
    renderToday();
    renderStats();
  }

  /* ---------------------------------------------------------------- track */

  function solidCount() {
    return allIds.filter(function (id) { return state.cards[id] && state.cards[id].interval >= 6; }).length;
  }

  /* The path is measured in everything the deck teaches, not only its nouns.
   * A starter pack has 24 concepts but 80 cards, so a concept-only count made
   * its last units permanently locked. The path unlocks on cards *met*, so a
   * learner sees the next lesson after a session rather than after six days of
   * spaced repetition. Solidity still drives the adaptive session below. */
  function seenDeckCount() {
    var met = state.trackMet || {};
    return deckIds().filter(function (id) { return !!met[id]; }).length;
  }

  /* ------------------------------------------------------------- the script */

  function scriptLetters() {
    var a = ACTIVE && ACTIVE.alphabet;
    return a && Array.isArray(a.letters) ? a.letters : [];
  }

  /* A pack teaches its script only when the script is not Latin. A pack may say
   * so itself with alphabet.script (or language.script); otherwise the letters
   * decide, so Latin decks never grow an alphabet lesson by accident. */
  function declaredScript() {
    return (ACTIVE && ACTIVE.alphabet && ACTIVE.alphabet.script) ||
      (ACTIVE && ACTIVE.concepts && ACTIVE.concepts.language && ACTIVE.concepts.language.script) || null;
  }

  function hasScriptLesson() {
    return TRACK ? TRACK.scriptNeeded(scriptLetters(), declaredScript()) : false;
  }

  function alphabetKnown() {
    var known = state.alphabet || {};
    return scriptLetters().filter(function (l) { return !!known[l.letter]; }).length;
  }

  function alphabetDone() {
    var letters = scriptLetters();
    return !!letters.length && alphabetKnown() === letters.length;
  }

  /* Titles come from the language being learned: a pack may ship its own, the
   * track's table fills the rest. No title names a language. */
  function trackOpts() {
    var titles = ACTIVE && (ACTIVE.titles || (ACTIVE.concepts && ACTIVE.concepts.titles));
    return {
      script: hasScriptLesson(),
      lang: ACTIVE && ACTIVE.code,
      only: allowedTrackUnits().map(function (u) { return u.id; }),
      titles: titles && typeof titles === "object" ? titles : null
    };
  }

  /* A starter deck honestly shows fewer lessons: do not offer "opinions" if
   * the pack has no opinion phrases, and do not fill the gap with a random
   * deck slice. Full packs carry the whole twelve-lesson arc. */
  function allowedTrackUnits() {
    var units = TRACK ? TRACK.unitList(hasScriptLesson()) : [];
    return CURR ? CURR.available(units, phraseIds.map(function (id) { return phraseById[id]; })) : units;
  }

  /* The units this pack actually shows, in order. */
  function trackUnits() {
    return allowedTrackUnits();
  }

  function unitById(id) {
    var units = trackUnits();
    for (var i = 0; i < units.length; i += 1) if (units[i].id === id) return units[i];
    return null;
  }

  /* Where the learner is on the path. Real progress wins; the placement floor
   * only opens a door. A finished alphabet steps aside for the next unit. */
  function currentTrackIndex() {
    var rows = trackRows();
    var floor = Math.min(placementFloor(), Math.max(0, rows.length - 1));
    for (var i = rows.length - 1; i >= 0; i -= 1) {
      if (rows[i].current) return Math.max(i, floor);
    }
    return floor;
  }

  function trackRows() {
    var rows = TRACK ? TRACK.map(seenDeckCount(), trackOpts()) : [];
    var floor = placementFloor();
    rows.forEach(function (r) {
      r.unlocked = r.unlocked || r.index <= floor;
    });
    if (alphabetDone()) {
      var last = null;
      rows.forEach(function (r) { if (r.mode !== "script" && r.unlocked) last = r; });
      rows.forEach(function (r) { r.current = false; });
      if (last) last.current = true;
    }
    return rows;
  }

  function unitRow(id) {
    var rows = trackRows();
    for (var i = 0; i < rows.length; i += 1) if (rows[i].id === id) return rows[i];
    return null;
  }

  /* Locked is a session rule, not only a styling one: hash links, stale state
   * and keyboard reaches all pass through startSession. */
  function unitUnlocked(unit) {
    var row = unitRow(unit && unit.id);
    return !row || row.unlocked;
  }

  function unlockLine(row) {
    if (!row) return "that lesson opens later";
    return row.remaining + " " + tr("cards", "cards") + " → " + row.title;
  }

  function defaultUnit() {
    var rows = trackRows();
    return TRACK && TRACK.highestUnlocked ? TRACK.highestUnlocked(rows) : (rows[0] || null);
  }

  function renderTrack() {
    var box = $("track");
    if (!box || !TRACK) return;

    var rows = trackRows();
    var currentIndex = currentTrackIndex();

    rows.forEach(function (r) { r.current = r.current && r.index === currentIndex; });

    box.innerHTML = rows.map(function (u) {
      var done = u.unlocked && !u.current && u.index < currentIndex;
      var cls = "step" + (u.unlocked ? "" : " locked") + (u.current ? " now" : "") + (done ? " done" : "");
      var face = done ? ICON.check : u.unlocked ? u.index + 1 : ICON.lock;
      var label = u.title + (u.unlocked ? "" : ", " + u.remaining + " more cards to unlock");
      return '<button class="' + cls + '" type="button" data-unit="' + esc(u.id) + '"' +
        ' aria-label="' + esc(label) + '"' +
        (u.unlocked ? "" : ' aria-disabled="true"') + ">" +
        '<span class="step-n">' + face + "</span>" +
        '<span class="step-t">' + esc(u.title) + "</span>" +
        (u.unlocked ? "" : '<span class="step-need" aria-hidden="true">' + u.remaining + "</span>") +
      "</button>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll(".step"), function (b) {
      b.addEventListener("click", function () {
        var unit = unitRow(b.getAttribute("data-unit"));
        if (!unit) return;
        if (!unitUnlocked(unit)) { toast(unlockLine(unit)); return; }
        startSession({ unit: unit });
      });
    });

    var note = $("track-note");
    if (note) {
      var next = rows.filter(function (r) { return !r.unlocked; })[0];
      var hidden = TRACK.unitList(hasScriptLesson()).length - rows.length;
      note.textContent = (next
        ? next.remaining + " " + tr("cards", "cards") + " → " + next.title
        : rows.length + " " + tr("units", "units") + " · " + tr("done", "done")) +
        (hidden ? " · " + hidden + " " + tr("fullOnly", "full A2/B1 course") : "");
    }
  }

  /* --------------------------------------------------------------- streak */

  function dayKey(d) {
    var x = d == null ? new Date() : (d instanceof Date ? d : new Date(d));
    return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2);
  }

  function yesterdayKey() {
    var y = new Date();
    y.setDate(y.getDate() - 1);
    return dayKey(y);
  }

  /* A streak stays alive until a day is missed; it does not reset at midnight. */
  function currentStreak() {
    var st = state.streak;
    if (!st || !st.last) return 0;
    if (st.last === dayKey() || st.last === yesterdayKey()) return st.days;
    return 0;
  }

  function bumpStreak() {
    var today = dayKey();
    var st = state.streak || { last: null, days: 0 };
    if (st.last === today) { state.streak = st; return st.days; }
    st.days = st.last === yesterdayKey() ? st.days + 1 : 1;
    st.last = today;
    state.streak = st;
    return st.days;
  }

  /* --------------------------------------------------------- items + pools */

  /* A lesson can teach a word or a whole phrase; both present the same shape
   * to the drill, so there is one renderer to maintain instead of two. */
  /* Translations are hidden by default. Pressing the reveal control shows the
   * meaning in the interface language, not English-by-default. */
  function translationsOn() {
    return !state.settings || state.settings.translations !== "off";
  }

  function rawGloss(id) {
    var g = (window.SEMA_GLOSSES || {})[id];
    return g ? String(g) : "";
  }

  function glossFor(id) {
    if (!translationsOn()) return "";
    return rawGloss(id);
  }

  /* The UI-language pack has its own words and glosses. Matching on the shared
   * English gloss gives a real Chinese/French/Arabic translation where that
   * pack has the same concept, instead of printing English under a Chinese UI. */
  var translationIndexCache = {};
  function translationIndex(code) {
    if (translationIndexCache[code]) return translationIndexCache[code];
    var pack = LANGS && LANGS.load(code);
    if (!pack) return {};
    var map = {};
    function add(id, text) {
      var g = pack.glosses && pack.glosses[id];
      if (!g || !text) return;
      var key = String(g).trim().toLowerCase();
      if (!map[key]) map[key] = String(text);
    }
    (pack.concepts.concepts || []).forEach(function (c) {
      add(c.id, c.article ? c.article + " " + c.word : c.word);
    });
    (pack.phrases.phrases || []).forEach(function (p) { add(p.id, p.text); });
    (pack.terms.terms || []).forEach(function (t) { add(t.id, t.text); });
    (pack.basics.items || []).forEach(function (b) { add(b.id, b.text); });
    translationIndexCache[code] = map;
    return map;
  }

  function translationFor(id) {
    if (!translationsOn()) return "";
    var ui = uiLang();
    /* Immersion: the UI language is the target language. Returning the target
     * text here would make the "translation" the answer itself. */
    if (ui === ACTIVE.code) return "";
    if (ui === "en") return glossFor(id);
    var g = rawGloss(id);
    if (!g) return "";
    return translationIndex(ui)[String(g).trim().toLowerCase()] || "";
  }

  function glossHTML(id) {
    var translated = translationFor(id);
    var g = translated || glossFor(id);
    if (!g) return "";
    return '<button class="gloss-btn" type="button" data-gloss="' + esc(g) + '"' +
      (translated ? "" : ' data-fallback="en" title="English"') + ">" +
      tr("glossShow", "show translation") + "</button>";
  }

  function wireGloss() {
    Array.prototype.forEach.call(document.querySelectorAll(".gloss-btn"), function (btn) {
      btn.addEventListener("click", function () {
        var on = btn.getAttribute("data-on") === "1";
        btn.setAttribute("data-on", on ? "0" : "1");
        btn.textContent = on ? tr("glossShow", "show translation") : btn.getAttribute("data-gloss");
      });
    });
  }

  /* Extremely basic, concrete items may use a picture as a second cue.
   * Everything else is taught by meaning. The picture never replaces the
   * translation toggle; it only supports it. */
  var EMOJI_BASIC = {
    "water": 1, "apple": 1, "heart": 1, "hello": 1, "hi": 1,
    "goodbye": 1, "bye": 1, "thank you": 1, "thanks": 1, "please": 1,
    "yes": 1, "no": 1, "sorry": 1, "good morning": 1, "good night": 1,
    "coffee": 1, "tea": 1, "bread": 1, "milk": 1, "cat": 1, "dog": 1,
    "house": 1, "home": 1, "sun": 1, "moon": 1, "friend": 1, "love": 1
  };

  function basicEmoji(it) {
    if (!it || !it.emoji || (it.kind !== "word" && it.kind !== "phrase")) return "";
    var gloss = rawGloss(it.id).toLowerCase().replace(/[.!?]+/g, "").trim();
    return EMOJI_BASIC[gloss] ? it.emoji : "";
  }

  function meaningHTML(id, cls) {
    var translated = translationFor(id);
    var g = translated || glossFor(id);
    if (!g) return "";
    return '<p class="meaning' + (cls ? " " + cls : "") + '">' + esc(g) +
      (translated ? "" : ' <span class="gloss-fallback">EN</span>') + "</p>";
  }

  function itemOf(id) {
    var b = basicById[id];
    if (b) {
      return {
        id: b.id, emoji: "", article: "", text: b.text, sub: b.gloss,
        kind: "basic", person: b.person, of: b.of, why: b.why || ""
      };
    }
    var t = termById[id];
    if (t) {
      return {
        id: t.id, emoji: "", schema: t.schema, article: "", text: t.text,
        sub: t.frame, frame: t.frame, contrast: t.contrast, kind: "term", why: t.why || ""
      };
    }
    var p = phraseById[id];
    if (p) {
      return { id: p.id, emoji: p.emoji, article: "", text: p.text, sub: p.sub || "", kind: "phrase", why: p.why || "" };
    }
    var c = conceptById[id];
    if (!c) return { id: id, emoji: "❓", article: "", text: id, sub: "", kind: "word" };
    /* concepts carry a reading aid of their own in `sub` (pinyin, a
     * transliteration); the example sentence is a separate field */
    return {
      id: c.id, emoji: c.emoji, article: c.article, text: c.word,
      sub: c.sub || "", sentence: c.sentence || "", kind: "word", why: c.why || "",
      synonyms: c.synonyms || []
    };
  }

  /* Small schematic glyphs. A picture cannot carry "however"; a balance can. */
  var SCHEMAS = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.6"/><path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M17 3v4h-4"/><path d="M7 21v-4h4"/>',
    left: '<path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/>',
    right: '<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
    fork: '<path d="M12 20v-8"/><path d="M12 12L6 5"/><path d="M12 12l6-7"/>',
    balance: '<path d="M4 9h16"/><path d="M12 9v8"/><path d="M8 17h8"/><path d="M4 9l2 4h4z"/><path d="M20 9l-2 4h-4z"/>',
    parallel: '<path d="M4 9h16"/><path d="M4 15h16"/>',
    question: '<path d="M9 9a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7"/><circle cx="12" cy="18" r="1"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    chain: '<circle cx="8" cy="12" r="3.5"/><circle cx="16" cy="12" r="3.5"/>'
  };

  function schemaSVG(key) {
    var body = SCHEMAS[key] || SCHEMAS.question;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  function tileHTML(it, small) {
    var cls = "tile" + (small ? " sm" : "");
    if (it.schema) return '<div class="' + cls + ' schema">' + schemaSVG(it.schema) + "</div>";
    return '<div class="' + cls + '" aria-hidden="true">' + it.emoji + "</div>";
  }

  function distractorsFor(id, count) {
    var it = itemOf(id);
    if (it.kind === "phrase") return S.pickDistractors(id, phraseIds, [], count, Math.random);
    return S.pickDistractors(id, allIds, neighboursOf(id), count, Math.random);
  }

  function articleHTML(article) {
    if (!article) return "";
    /* French elides the article before a vowel (l'eau, l'arbre); the space
     * that separates a full article from its noun must not appear there. */
    var elide = /['’]$/.test(article) ? " elide" : "";
    return '<span class="art' + elide + '">' + esc(article) + "</span>";
  }

  /* A word with its reading under the characters when the deck supplies one
   * that lines up; plain escaped text otherwise. Never for Latin text: the
   * helper only annotates Han characters. */
  function rubyOn() {
    return (state && state.settings && state.settings.ruby) !== "off";
  }

  function textHTML(it) {
    if (!it) return "";
    if (RUBY && rubyOn() && it.sub && RUBY.aligns(it.text, it.sub)) return RUBY.html(it.text, it.sub);
    return esc(it.text);
  }

  function hasRuby(it) {
    return !!(RUBY && rubyOn() && it && it.sub && RUBY.aligns(it.text, it.sub));
  }

  function wordsHTML(it) {
    var art = articleHTML(it.article);
    var long = it.text.length > 16 ? " long" : "";
    var kind = it.kind === "phrase" ? " phrase" : "";
    return '<div class="word' + long + kind + '">' + art + textHTML(it) + "</div>";
  }

  /* The picture takes the free height of the screen; its sound button sits
   * in the corner, where a thumb finds it without covering the picture. */
  function figureHTML(it, label) {
    var text = label || tr("hearit", "Hear it");
    var can = audioAvailable();
    return '<div class="figure">' +
      '<div class="tile" aria-hidden="true">' + it.emoji + "</div>" +
      '<button class="speak-btn round" id="hear-btn" aria-label="' + esc(text) + '" title="' + esc(text) + '"' +
        (can ? "" : " disabled") + ">" +
        ICON.speaker + "</button></div>";
  }


  function contextHTML(it) {
    if (it.kind === "term") {
      var filled = String(it.frame || "").replace("____", "<b>" + esc(it.text) + "</b>");
      var twin = it.contrast && termById[it.contrast];
      return '<p class="sentence">' + filled + "</p>" +
        (twin ? '<p class="term-contrast">↔ ' + esc(twin.text) + "</p>" : "");
    }
    /* the phrase's own reading is already under its characters */
    if (it.kind === "phrase") {
      if (hasRuby(it)) return "";
      return it.sub ? '<p class="sentence">' + esc(it.sub) + "</p>" : "";
    }

    var line = it.sentence || it.sub || "";
    if (!line) return "";
    var bolded = boldFirst(line, it.text);
    return (it.sub && it.kind === "word" && !hasRuby(it) ? '<p class="roman">' + esc(it.sub) + "</p>" : "") +
      '<p class="sentence">' + bolded + "</p>";
  }

  /* Bold the target word in its own sentence. Plain indexOf, because \b is
   * ASCII-only and silently skips every Chinese or Japanese character. */
  function boldFirst(sentence, word) {
    var text = String(sentence || "");
    var needle = String(word || "");
    if (!needle) return esc(text);
    var at = text.toLowerCase().indexOf(needle.toLowerCase());
    if (at === -1) return esc(text);
    return esc(text.slice(0, at)) + "<b>" + esc(text.slice(at, at + needle.length)) + "</b>" + esc(text.slice(at + needle.length));
  }

  /* -------------------------------------------------------------- session */

  var session = null;
  var vocab = null;

  function selectedFields() {
    var f = state.settings && state.settings.fields;
    if (!f || !f.length) return Object.keys(D.categories);
    return f;
  }

  /* null means "follow the goal": the app's own learned pace decides. */
  function lessonSize() {
    var mode = (state.settings && state.settings.length) || "goal";
    if (mode === "short") return 5;
    if (mode === "long") return 12;
    return null;
  }

  function inFields(id, fields) {
    var c = conceptById[id];
    return !!c && fields.indexOf(c.cat) !== -1;
  }

  /* The learner's band gates every layer: a session never shows material above
   * it, whatever the deck holds. */
  function itemLevel(id) {
    var LV = (ACTIVE && ACTIVE.levels) || window.SEMA_LEVELS || {};
    return LV[id];
  }

  /* An old save may carry no level, or a placement abandoned at "?"; both are a
   * beginner. Treating an unknown band as permission is how a B1 connector
   * reached someone who had not met "hola" yet. */
  function learnerLevel() {
    if (!ADAPT) return "A1";
    var placed = ADAPT.levelFor(state.profile, ACTIVE && ACTIVE.code);
    return ADAPT.higherLevel(placed, ADAPT.earnedLevel(seenDeckCount()));
  }

  function atLevel(id) {
    return ADAPT.within(itemLevel(id), learnerLevel());
  }

  /* Connectors are a later stage of the track, not filler for a mixed drill. */
  function connectorsUnlocked() {
    /* The path opens the connectors unit after this many cards met; keep the
     * connector layer in step with the node rather than with an older metric. */
    return seenDeckCount() >= 46;
  }

  /* Every deck opens on the same four ideas: hello, how are you, favourite
   * colour, where are you from. A pack may declare its own ids (`openers` on its
   * phrases or concepts); this table covers the decks we ship, and a deck with
   * none still opens on its first phrases. In Spanish the order is fixed. */
  var OPENERS_BY_DECK = {
    es: ["ph-hola", "ph-como-estas", "ph-color", "ph-de-donde"],
    fr: ["ph-salut", "ph-ca-va", "ph-couleur", "ph-d-ou-viens"],
    it: ["ph-it-hola", "ph-it-como-estas", "ph-it-color", "ph-it-de-donde"],
    en: ["ph-en-greetings-1", "ph-en-small-talk-1"],
    de: ["ph-de-hello", "ph-de-how-are-you"],
    nl: ["ph-nl-hello", "ph-nl-how-are-you"],
    pt: ["ph-pt-hello", "ph-pt-how-are-you"],
    ru: ["ph-ru-hello", "ph-ru-how-are-you"],
    tr: ["ph-tr-hello", "ph-tr-how-are-you"],
    ar: ["ph-ar-hello", "ph-ar-how-are-you"],
    hi: ["ph-hi-hello", "ph-hi-how-are-you"],
    ja: ["ph-ja-hello", "ph-ja-how-are-you"],
    zh: ["ph-zh-hello", "ph-zh-how-are-you"]
  };

  function openersFor() {
    var declared = (P && P.openers) || (ACTIVE && ACTIVE.concepts && ACTIVE.concepts.openers);
    if (Array.isArray(declared) && declared.length) {
      var fromPack = declared.filter(function (id) { return !!phraseById[id]; });
      if (fromPack.length) return fromPack;
    }
    var known = (OPENERS_BY_DECK[ACTIVE && ACTIVE.code] || []).filter(function (id) {
      return !!phraseById[id];
    });
    return known.length ? known : phraseIds.slice(0, 4);
  }

  /* The order a layer is met in: what is due comes back first, soonest due
   * first; then what is new, in the deck's own order; then what is still
   * resting. Pure enough to reason about, and never a dice roll. */
  function meetOrder(ids, now) {
    var due = [], fresh = [], later = [];
    ids.forEach(function (id) {
      var c = state.cards[id];
      if (!c || c.last === null) fresh.push(id);
      else if (c.due <= now) due.push(id);
      else later.push(id);
    });
    var byDue = function (a, b) { return state.cards[a].due - state.cards[b].due; };
    return due.sort(byDue).concat(fresh, later.sort(byDue));
  }

  /* The pair you keep trading leads its own layer, because a drill that opens
   * on your confusion is worth more than one that opens on alphabetical order. */
  function seedFirst(ids) {
    var seed = ADAPT.confusionSeed(state.confusions, ids);
    if (!seed) return ids;
    return [seed].concat(ids.filter(function (id) { return id !== seed; }));
  }

  /* What the next lesson holds. There is one kind of lesson: it opens on the
   * phrases a person needs first, at least half of it is phrases, and the rest
   * mixes words, grammar and connectors. The track only decides which words are
   * in scope; `custom` skips the track and uses the lesson settings.
   *
   * The deal is deterministic - due items first, then new ones in the deck's own
   * order - so the Today card shows the cards that will actually be taught, not
   * a different random draw. */
  function lessonPlan(opts) {
    var o = opts || {};
    var solid = solidCount();
    var unit = o.custom ? null : (o.unit || (TRACK ? defaultUnit() : null));
    /* the path's reading unit is opened on purpose, from the path: it must not
     * take over the one Continue button and stall the vocabulary */
    if (unit && unit.mode === "read" && !o.unit) unit = null;
    var plan = ADAPT ? ADAPT.plan(solid) : { fresh: 4, review: 4, production: 0, size: 8, level: 1 };
    var hist = (state.history || []).map(function (h) { return typeof h === "number" ? h : h && h.size; });
    var goal = ADAPT ? ADAPT.nextGoal(ADAPT.dailyGoal(hist), hist.slice(-3)) : 8;
    var chosen = o.size || lessonSize();
    var size = chosen || Math.min(plan.size + 4, Math.max(goal, 10));
    var fields = unit && unit.fields ? unit.fields : selectedFields();
    var now = Date.now();

    /* A requested lesson is an explicit list of ids, not a whole track unit. */
    if (o.ids && o.ids.length) {
      var wanted = o.ids.filter(function (id) { return !!itemOf(id); }).slice(0, o.size || o.ids.length);
      return {
        unit: null, plan: plan, size: wanted.length, queue: wanted,
        fresh: wanted.filter(function (id) { return !state.cards[id] || state.cards[id].last === null; }),
        due: wanted.filter(function (id) { var c = state.cards[id]; return c && c.last !== null && c.due <= now; }),
        read: false, custom: true, title: o.title || ""
      };
    }

    /* reading and the script are lessons too, each with its own screen */
    if (unit && unit.mode === "read") {
      return { unit: unit, plan: plan, size: 0, queue: [], fresh: [], due: [], read: true };
    }
    if (unit && unit.mode === "script") {
      return { unit: unit, plan: plan, size: 0, queue: [], fresh: [], due: [], script: true };
    }

    var scopeWords = fields.length
      ? allIds.filter(function (id) { return inFields(id, fields); })
      : allIds.slice();

    /* Only the first-contact lesson opens on the four greetings; a café or
     * past-tense lesson opens on its own phrases. */
    var openers = (!unit || unit.openers)
      ? openersFor().filter(function (id) { return ADAPT.within(itemLevel(id), "A2"); })
      : [];
    var topicPhrases = phraseIds.filter(function (id) { return CURR.matches(phraseById[id], unit); });
    var phrases = topicPhrases.filter(atLevel);
    /* A tutor does not cancel the café lesson because only one café phrase is
     * graded A1. Top the topic up to a session's opening run with A2 phrases;
     * never reach into B1 just to fill a card. */
    if (phrases.length < 4) {
      topicPhrases.forEach(function (id) {
        if (phrases.length >= 4 || phrases.indexOf(id) !== -1) return;
        if (ADAPT.within(itemLevel(id), "A2")) phrases.push(id);
      });
    }
    if (!phrases.length) phrases = phraseIds.filter(atLevel);
    openers.forEach(function (id) {
      if (phraseById[id] && phrases.indexOf(id) === -1) phrases.push(id);
    });
    var ordered = {
      phrases: seedFirst(meetOrder(phrases, now)),
      grammar: seedFirst(meetOrder(basicIds.filter(atLevel), now)),
      words: seedFirst(meetOrder(scopeWords.filter(atLevel), now)),
      terms: connectorsUnlocked() ? seedFirst(meetOrder(termIds.filter(atLevel), now)) : []
    };
    var available = openers.filter(function (id) { return ordered.phrases.indexOf(id) !== -1; });
    var queue = ADAPT.sessionMix(ordered, size, available);
    var fresh = queue.filter(function (id) { return !state.cards[id] || state.cards[id].last === null; });
    var due = queue.filter(function (id) {
      var c = state.cards[id];
      return c && c.last !== null && c.due <= now;
    });
    return { unit: unit, plan: plan, size: size, queue: queue, fresh: fresh, due: due, read: false };
  }

  /* The lesson card shows the pictures the next lesson opens with, and
   * returns its name and a line saying what is in it. */
  function renderNextStack() {
    var box = $("next-stack");
    var p = lessonPlan();
    var title = p.unit ? p.unit.title : lessonTitle(p);
    var caption = p.script
      ? alphabetChunk().length + " " + tr("letters", "letters")
      : [p.fresh.length ? p.fresh.length + " " + tr("new", "new") : "",
         p.due.length ? p.due.length + " " + tr("toReview", "to review") : ""].filter(Boolean).join(", ");
    if (box) {
      box.innerHTML = p.script ? "" : p.queue.slice(0, 3).map(function (id) {
        var meaning = translationFor(id) || glossFor(id) || itemOf(id).sub || "";
        return meaning ? '<span class="pic-text">' + esc(meaning) + "</span>" : "";
      }).join("");
    }
    var minutes = p.read ? 2 : p.script ? 1 : Math.max(1, Math.round((p.size || 8) * 0.15));
    return {
      title: title,
      caption: caption,
      goal: p.unit ? tr("goal_" + p.unit.id, p.unit.goal) : "",
      minutes: minutes
    };
  }

  /* Named after the field its new words come from, the way a course names a unit. */
  function lessonTitle(p) {
    if (!p.fresh.length) {
      return p.due.length ? tr("lessonReview", "Review") : tr("lessonPractice", "Practice");
    }
    var kinds = p.fresh.map(function (id) { return itemOf(id).kind; });
    var phrases = kinds.filter(function (k) { return k === "phrase"; }).length;
    if (phrases * 2 > kinds.length) return tr("lessonPhrases", "Phrases");
    var cats = p.fresh.map(function (id) { return conceptById[id] && conceptById[id].cat; }).filter(Boolean);
    var same = cats.length && cats.every(function (c) { return c === cats[0]; });
    return same && D.categories[cats[0]] ? catLabel(cats[0]) : tr("lessonNewWords", "New words");
  }

  /* A small, honest planner: it chooses real pack phrases for the situation
   * the learner describes. It cannot invent a town dialect that is not in the
   * data, so it says so and teaches the standard language instead. */
  var WISH_PLACES = [
    ["italy", "it"], ["italian", "it"], ["rome", "it"], ["florence", "it"], ["venice", "it"], ["milan", "it"],
    ["spain", "es"], ["spanish", "es"], ["madrid", "es"], ["barcelona", "es"],
    ["france", "fr"], ["french", "fr"], ["paris", "fr"],
    ["germany", "de"], ["german", "de"], ["berlin", "de"],
    ["portugal", "pt"], ["portuguese", "pt"], ["lisbon", "pt"],
    ["netherlands", "nl"], ["dutch", "nl"], ["amsterdam", "nl"],
    ["russia", "ru"], ["russian", "ru"], ["moscow", "ru"],
    ["turkey", "tr"], ["turkish", "tr"], ["istanbul", "tr"],
    ["russia", "ru"], ["russian", "ru"], ["moscow", "ru"], ["novgorod", "ru"],
    ["lyon", "fr"], ["bristol", "en"], ["bologna", "it"], ["seville", "es"],
    ["japan", "ja"], ["japanese", "ja"], ["tokyo", "ja"],
    ["china", "zh"], ["chinese", "zh"], ["beijing", "zh"],
    ["india", "hi"], ["hindi", "hi"], ["delhi", "hi"],
    ["arabic", "ar"], ["morocco", "ar"], ["egypt", "ar"],
    ["england", "en"], ["english", "en"], ["london", "en"]
  ];

  var WISH_PRESETS = {
    food: "dinner out, I want pizza",
    family: "a cousin's wedding",
    hotel: "hotel check-in tomorrow",
    health: "I need a pharmacy and a doctor",
    travel: "train to the airport"
  };

  function renderWishLangs() {
    var sel = $("wish-lang");
    if (!sel) return;
    var current = sel.value || (ACTIVE && ACTIVE.code) || "en";
    var list = (LANGS && LANGS.list && LANGS.list()) || [];
    sel.innerHTML = list.map(function (p) {
      var flag = LANG_FLAGS[p.code] || "";
      return '<option value="' + esc(p.code) + '">' + flag + " " + esc(uiName(p.code)) + "</option>";
    }).join("");
    if (list.some(function (p) { return p.code === current; })) sel.value = current;
    else if (ACTIVE) sel.value = ACTIVE.code;
  }

  function renderWishPresets() {
    var box = $("wish-presets");
    if (!box) return;
    box.innerHTML = Object.keys(WISH_PRESETS).map(function (key) {
      return '<button class="wish-chip" type="button" data-wish-preset="' + key + '">' +
        esc(tr("wishPreset_" + key, key)) + "</button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-wish-preset]"), function (b) {
      b.addEventListener("click", function () {
        buildWishLesson(WISH_PRESETS[b.getAttribute("data-wish-preset")], $("wish-lang") && $("wish-lang").value);
      });
    });
  }

  function startRoleplay(text, lang) {
    var input = $("wish-input");
    var personal = PERSONA && state.profile ? PERSONA.ensure(state.profile) : {};
    var scene = String(text || (input && input.value) || "").trim();
    if (!scene) scene = [personal.why, personal.interests].filter(Boolean).join(" · ");
    if (!scene) {
      if ($("wish-note")) $("wish-note").textContent = tr("wishEmpty", "Tell me where you are going and what you want to do.");
      return;
    }
    var code = lang || ($("wish-lang") && $("wish-lang").value) || ACTIVE.code;
    if (code && LANGS && LANGS.has(code) && ACTIVE && ACTIVE.code !== code) {
      switchLang(code);
    }
    var begin = function () {
      var wish = wishLesson(scene, ACTIVE.code, { areaOnly: true });
      chat = chatState();
      chat.messages = [];
      chat.scripted = null;
      chat.scene = scene.slice(0, 160);
      chatCleared = false;
      chat.mission = wish.ids && wish.ids.length
        ? { ids: wish.ids.slice(0, 3), used: {} }
        : null;
      chatEpoch += 1;
      chatTranslating = {};
      hideCoach();
      show("conv");
      renderChatHeader();
      renderChat(true);
      renderScene();
      renderMission();
      setChatFeedback(tr("sceneSetting", "Setting the scene…"), "");
      refreshChatEngine();
      localModelAsk(
        CE.buildScenePrompt(ACTIVE, learnerLevel(), PERSONA ? PERSONA.prompt(state.profile) : "", scene),
        "Start the scene now."
      ).then(function (reply) {
        if (!chat || chat.scene !== scene.slice(0, 160)) return;
        if (reply) addAssistant(reply, false, "scene", false);
        setChatFeedback("", "");
      }).catch(function () {
        if (!chat || chat.scene !== scene.slice(0, 160)) return;
        if (!chat.messages.length) {
          var opening = CE.scriptedOpening(ACTIVE.code);
          if (opening) addAssistant(opening, true, "scripted", false);
        }
        setChatFeedback(tr("sceneFail", "No local model answered; the packed conversation starts."), "");
      });
    };
    if (chat && chat.messages.length) {
      askConfirm(tr("roleplay", "Roleplay"), tr("clearChatConfirm", "Clear this conversation? This cannot be undone."),
        tr("roleplay", "Roleplay"), begin);
    } else {
      begin();
    }
  }

  function buildWishLesson(text, lang) {
    var input = $("wish-input");
    var selected = $("wish-lang");
    var code = lang || (selected && selected.value) || "";
    if (!text) {
      $("wish-note").textContent = tr("wishEmpty", "Tell me where you are going and what you want to do.");
      return;
    }
    if (!code) {
      $("wish-note").textContent = tr("wishLanguage", "Lesson language");
      return;
    }
    var wish = wishLesson(text, code);
    if (!wish.ids.length) {
      $("wish-note").textContent = tr("wishEmpty", "Tell me where you are going and what you want to do.");
      return;
    }
    var saved = saveCustomLesson(wish, text);
    if (input) input.value = "";
    $("wish-note").textContent = "";
    var details = $("wish-details");
    if (details) details.open = false;
    toast(wish.note, 3200);
    startSession({ ids: wish.ids, size: wish.ids.length, title: wish.title, customId: saved.id });
  }

  function wishLesson(text, requestedCode, opts) {
    var raw = String(text || "").toLowerCase();
    var code = requestedCode || "";
    var areaOnly = !!(opts && opts.areaOnly);
    if (!code) {
      WISH_PLACES.forEach(function (pair) {
        if (!code && new RegExp("\\b" + pair[0] + "\\b").test(raw)) code = pair[1];
      });
    }
    var switched = false;
    if (code && LANGS && LANGS.has(code) && ACTIVE && ACTIVE.code !== code) {
      switched = switchLang(code) !== false;
    }

    var topics = [];
    if (/restaurant|dinner|lunch|eat|food|menu|pizza|pasta|meal|cafe|café|cook|kitchen|recipe|bake/.test(raw)) topics.push("restaurant", "café");
    if (/tech|computer|phone|internet|email|software|app/.test(raw)) topics.push("phone", "messages", "work");
    if (/hotel|stay|room|check.?in/.test(raw)) topics.push("hotel");
    if (/train|station|platform|ticket/.test(raw)) topics.push("station", "tickets");
    if (/airport|flight|plane/.test(raw)) topics.push("airport");
    if (/doctor|pharmacy|hurt|pain|sick/.test(raw)) topics.push("emergency", "pharmacy", "doctor");
    if (/shop|market|buy|clothes/.test(raw)) topics.push("shopping", "market", "clothes");
    if (/work|office|meeting|colleague|job|business/.test(raw)) topics.push("work");
    if (/school|study|class|university|lesson/.test(raw)) topics.push("study");
    if (/coffee|tea|cafe|café/.test(raw)) topics.push("café");
    if (/lost|direction|city|centre|center|where is/.test(raw)) topics.push("city", "directions");
    if (/cousin|aunt|uncle|family|wedding|marry|brother|sister|grandmother|grandfather/.test(raw)) {
      topics.push("family");
    }

    if (areaOnly && !topics.length) {
      return { ids: [], focus: [], title: tr("wishTitle", "Plan a lesson"), note: "" };
    }

    var STOP = { "going": 1, "want": 1, "need": 1, "with": 1, "that": 1, "this": 1, "there": 1,
      "about": 1, "from": 1, "have": 1, "will": 1, "would": 1, "into": 1, "your": 1, "their": 1,
      "other": 1, "some": 1, "just": 1, "really": 1, "very": 1, "going": 1, "i'm": 1, "im": 1,
      "russian": 1, "italian": 1, "spanish": 1, "french": 1, "german": 1, "family": 1 };
    var words = raw.match(/[a-zà-ÿā-ž]+/g) || [];
    var keywords = words.filter(function (w) { return w.length > 3 && !STOP[w]; });

    function phraseScore(id) {
      var p = phraseById[id];
      var topic = CURR.topicOf(p);
      var hay = (p.text + " " + (p.sub || "") + " " + (glossFor(id) || "")).toLowerCase();
      var score = 0;
      if (topics.indexOf(topic) !== -1) score += 4;
      keywords.forEach(function (w) { if (hay.indexOf(w) !== -1) score += 3; });
      if (/wedding|marry/.test(raw) && /wedding|mariage|matrimonio|boda|свадьб/.test(hay)) score += 4;
      if (/cousin|brother|sister|aunt|uncle/.test(raw) && /cousin|brat|cugino|primo|брат|сестр/.test(hay)) score += 4;
      if (/pizza/.test(raw) && /pizza|пицц|ピザ|披萨/.test(hay)) score += 5;
      return score;
    }

    var ranked = phraseIds.slice().sort(function (a, b) {
      return phraseScore(b) - phraseScore(a);
    });
    var phrases = ranked.filter(function (id) {
      if (!topics.length) return true;
      if (topics.indexOf(CURR.topicOf(phraseById[id])) !== -1) return true;
      return phraseScore(id) >= 3;
    });
    if (!phrases.length) {
      if (areaOnly) return { ids: [], focus: [], title: tr("wishTitle", "Plan a lesson"), note: "" };
      phrases = ranked;
    }

    var picked = [];
    function add(id) { if (id && picked.indexOf(id) === -1) picked.push(id); }
    phrases.slice(0, 8).forEach(add);
    var now = Date.now();
    if (!areaOnly) {
      var revision = phraseIds.filter(function (id) {
        var card = state.cards[id];
        return card && (!card.due || card.due <= now);
      }).sort(function (a, b) {
        var ca = state.cards[a] || {};
        var cb = state.cards[b] || {};
        return (ca.ease || 2.5) - (cb.ease || 2.5);
      });
      revision.slice(0, 2).forEach(add);

      var foodWords = allIds.filter(function (id) {
        var c = conceptById[id];
        var hay = (c.word + " " + (glossFor(id) || "")).toLowerCase();
        return c.cat === "food" || keywords.some(function (w) { return hay.indexOf(w) !== -1; });
      }).sort(function (a, b) {
        function score(id) { var h = (conceptById[id].word + " " + (glossFor(id) || "")).toLowerCase(); return keywords.filter(function (w) { return h.indexOf(w) !== -1; }).length; }
        return score(b) - score(a);
      });
      foodWords.slice(0, 2).forEach(add);
      basicIds.slice(0, 2).forEach(add);
      if (termIds.length && /because|although|however|but|so/.test(raw)) termIds.slice(0, 2).forEach(add);
    }

    return {
      ids: picked.slice(0, 12),
      focus: topics.slice(0, 3),
      title: tr("wishTitle", "Plan a lesson"),
      note: (switched ? uiName(ACTIVE.code) + " · " : "") +
        tr("wishReady", "Your lesson is ready.") + " " +
        tr("wishDialect", "Using the standard language; this pack has no town-dialect data yet.") + " " +
        tr("wishMemory", "Recall each phrase before revealing it; review this lesson in three days.")
    };
  }

  var confirmState = null;

  function closeConfirm() {
    var modal = $("confirm-modal");
    if (modal) modal.hidden = true;
    var last = confirmState && confirmState.last;
    confirmState = null;
    if (last && last.focus) last.focus();
  }

  function askConfirm(title, body, okLabel, onOk) {
    var modal = $("confirm-modal");
    if (!modal) { if (window.confirm(body)) onOk(); return; }
    confirmState = { onOk: onOk, last: document.activeElement, openedAt: Date.now() };
    $("confirm-title").textContent = title;
    $("confirm-body").textContent = body;
    $("confirm-ok").textContent = okLabel;
    modal.hidden = false;
    var cancel = $("confirm-cancel");
    if (cancel) cancel.focus();
  }

  function saveCustomLesson(wish, text) {
    state.customLessons = state.customLessons || [];
    var lesson = {
      id: "wish-" + Date.now(),
      title: String(text || "").slice(0, 70),
      lang: ACTIVE.code,
      ids: wish.ids.slice(),
      focus: (wish.focus || []).slice(),
      at: Date.now(),
      last: 0,
      next: 0
    };
    state.customLessons.unshift(lesson);
    state.customLessons = state.customLessons.slice(0, 8);
    save();
    return lesson;
  }

  function renderCustomLessons() {
    var box = $("custom-lessons");
    var group = $("custom-group");
    if (!box || !group) return;
    var list = state.customLessons || [];
    group.hidden = !list.length;
    box.innerHTML = list.map(function (w) {
      var due = w.next && w.next <= Date.now();
      var when = due ? tr("today", "today") : (w.next ? shortDate(w.next) : "");
      return '<div class="custom-row">' +
        '<button class="row custom-open" type="button" data-custom="' + esc(w.id) + '">' +
          '<span class="row-body"><span class="row-main">' + esc(w.title) + "</span>" +
          '<span class="row-meta">' + esc(uiName(w.lang)) + (when ? " · " + esc(when) : "") +
            (w.focus && w.focus.length ? " · " + esc(w.focus.join(" / ")) : "") + "</span></span>" +
        "</button>" +
        '<button class="custom-del" type="button" data-delete-custom="' + esc(w.id) + '" ' +
          'aria-label="' + esc(tr("deleteLesson", "Delete lesson")) + '" title="' + esc(tr("deleteLesson", "Delete lesson")) + '">×</button>' +
      "</div>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-custom]"), function (b) {
      b.addEventListener("click", function () { startCustomLesson(b.getAttribute("data-custom")); });
    });
    Array.prototype.forEach.call(box.querySelectorAll("[data-delete-custom]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-delete-custom");
        askConfirm(
          tr("deleteLesson", "Delete lesson"),
          tr("deleteLessonConfirm", "Delete this lesson? This cannot be undone."),
          tr("deleteLesson", "Delete lesson"),
          function () {
            state.customLessons = (state.customLessons || []).filter(function (w) { return w.id !== id; });
            save();
            renderCustomLessons();
          }
        );
      });
    });
  }

  function startCustomLesson(id) {
    var list = state.customLessons || [];
    var wish = null;
    list.forEach(function (w) { if (w.id === id) wish = w; });
    if (!wish) return;
    if (ACTIVE.code !== wish.lang && LANGS && LANGS.has(wish.lang)) switchLang(wish.lang);
    startSession({ ids: wish.ids, size: wish.ids.length, customId: wish.id });
  }

  /* The word set: paste the words you need, see what the pack has, start a
   * focused lesson. Matching lives in src/wordset.js so it can be tested. */
  var wordset = null;

  function wordsetLabel(id) {
    var it = itemOf(id);
    return (it.article ? it.article + " " : "") + it.text;
  }

  function wordsetCandidates() {
    var items = [];
    allIds.forEach(function (id) {
      var c = conceptById[id];
      if (!c) return;
      items.push({
        id: id, kind: "word",
        text: (c.article ? c.article + " " : "") + c.word,
        gloss: rawGloss(id), sub: c.sentence || ""
      });
    });
    phraseIds.forEach(function (id) {
      var p = phraseById[id];
      if (p) items.push({ id: id, kind: "phrase", text: p.text, gloss: rawGloss(id), sub: p.sub || "" });
    });
    termIds.forEach(function (id) {
      var t = termById[id];
      if (t) items.push({ id: id, kind: "term", text: t.text, gloss: rawGloss(id), sub: t.frame || "" });
    });
    basicIds.forEach(function (id) {
      var b = basicById[id];
      if (b) items.push({ id: id, kind: "basic", text: b.text, gloss: rawGloss(id), sub: "" });
    });
    return items;
  }

  function wordsetRevisionIds() {
    var now = Date.now();
    var out = [];
    allIds.concat(phraseIds).forEach(function (id) {
      if (!atLevel(id)) return;
      var c = state.cards[id];
      if (c && c.last !== null && c.due <= now) out.push(id);
    });
    out.sort(function (a, b) {
      return (state.cards[a].due || 0) - (state.cards[b].due || 0);
    });
    return out.slice(0, 8);
  }

  function renderWordsetLangs() {
    var sel = $("wordset-lang");
    if (!sel) return;
    var list = packList();
    var current = sel.value || (ACTIVE && ACTIVE.code) || "es";
    sel.innerHTML = list.map(function (p) {
      var flag = LANG_FLAGS[p.code] || "";
      return '<option value="' + esc(p.code) + '">' + flag + " " + esc(uiName(p.code)) + "</option>";
    }).join("");
    if (list.some(function (p) { return p.code === current; })) sel.value = current;
    else if (ACTIVE) sel.value = ACTIVE.code;
  }

  function setWordsetStatus(text) {
    var el = $("wordset-status");
    if (el) el.textContent = text || "";
  }

  function clearWordsetPreview() {
    var preview = $("wordset-preview");
    var find = $("wordset-find");
    if (preview) { preview.hidden = true; preview.innerHTML = ""; }
    if (find) {
      find.hidden = false;
      find.classList.add("btn-primary");
      find.classList.remove("btn-ghost");
    }
    setWordsetStatus("");
  }

  function renderWordset() {
    renderWordsetLangs();
    var input = $("wordset-input");
    if (input && !input.value) input.value = state.settings.wordsetDraft || "";
    if (!wordset) return;
    if (wordset.code !== (ACTIVE && ACTIVE.code)) { wordset = null; clearWordsetPreview(); return; }
    renderWordsetPreview();
  }

  function openWordset() {
    if (needsSetup()) { show("setup"); return; }
    wordset = null;
    show("wordset");
    var input = $("wordset-input");
    if (input) { input.value = state.settings.wordsetDraft || ""; input.scrollTop = 0; }
    clearWordsetPreview();
    renderWordsetLangs();
    if (input) input.focus();
  }

  function findWordset() {
    var input = $("wordset-input");
    var text = input ? input.value : "";
    var queries = WORDSET.parseList(text);
    state.settings.wordsetDraft = text;
    save();
    if (!queries.length) {
      setWordsetStatus(tr("wordsetEmpty", "Paste at least one word."));
      return;
    }
    var code = $("wordset-lang") ? $("wordset-lang").value : (ACTIVE && ACTIVE.code);
    if (code && ACTIVE && code !== ACTIVE.code && LANGS && LANGS.has(code)) {
      if (!switchLang(code)) { setWordsetStatus(tr("wordsetUnavailable", "That language is not available.")); return; }
    }
    var candidates = wordsetCandidates();
    var result = WORDSET.build(queries, candidates, wordsetRevisionIds().slice(0, 4), { limit: 12 });
    wordset = { code: ACTIVE.code, queries: queries, result: result };
    renderWordsetPreview();
  }

  function renderWordsetPreview() {
    var preview = $("wordset-preview");
    var find = $("wordset-find");
    if (!preview || !wordset) return;
    var result = wordset.result;
    var found = result.matched.length;
    var missing = result.missing;
    if (find) {
      find.classList.remove("btn-primary");
      find.classList.add("btn-ghost");
    }
    preview.hidden = false;
    var review = Math.max(0, result.ids.length - found);
    preview.innerHTML =
      '<p class="settings-label">' + esc(tr("wordsetWillTeach", "These will be taught")) + "</p>" +
      (found
        ? '<div class="wordset-chips">' + result.matched.map(function (row) {
            var gloss = glossFor(row.id);
            return '<span class="wordset-chip"><b>' + esc(wordsetLabel(row.id)) + "</b>" +
              (gloss ? '<span>' + esc(gloss) + "</span>" : "") + "</span>";
          }).join("") + "</div>"
        : '<p class="builder-note">' + esc(tr("wordsetNoMatch", "None of these are in this pack yet.")) + "</p>") +
      (missing.length
        ? '<p class="wordset-missing">' + esc(tr("wordsetMissing", "{n} not in this pack")
            .replace("{n}", String(missing.length))) + ": " + esc(missing.join(", ")) + "</p>"
        : "") +
      (found && review
        ? '<p class="wordset-missing">' + esc(tr("wordsetPlusReview", "{n} due reviews included")
            .replace("{n}", String(review))) + "</p>"
        : "") +
      (found
        ? '<button class="btn btn-primary wordset-start" id="wordset-start" type="button">' +
          esc(tr("wordsetStart", "Start with these")) + "</button>"
        : "");
    var bits = [tr("wordsetFound", "{n} found").replace("{n}", String(found))];
    if (missing.length) bits.push(tr("wordsetMissing", "{n} not in this pack").replace("{n}", String(missing.length)));
    setWordsetStatus(bits.join(" · "));
    var start = $("wordset-start");
    if (start) start.addEventListener("click", startWordset);
  }

  function startWordset() {
    if (!wordset || !wordset.result.ids.length) return;
    var title = wordset.queries.slice(0, 3).join(", ");
    if (wordset.queries.length > 3) title += "…";
    var saved = saveCustomLesson({ ids: wordset.result.ids, focus: [] }, title);
    saved.type = "wordset";
    saved.missing = wordset.result.missing.slice();
    save();
    startSession({
      ids: wordset.result.ids,
      size: wordset.result.ids.length,
      title: title,
      customId: saved.id
    });
  }

  /* Vocabulary expansion is deliberately not a lesson: one word, recall,
   * reveal, decide. It feeds the same SRS store as lessons. */
  function vocabPool() {
    var now = Date.now();
    var due = [];
    var fresh = [];
    allIds.forEach(function (id) {
      if (!atLevel(id)) return;
      var kind = itemOf(id).kind;
      if (kind === "term") return;
      var card = state.cards[id];
      if (!card) fresh.push(id);
      else if (!card.due || card.due <= now) due.push(id);
    });
    var pool = due.concat(fresh);
    /* After a placement, recall should start near the learner's band. The
     * old pool ignored the band once every item was within the ceiling, so a
     * C1 learner still opened with casa and pan. */
    var me = ADAPT ? ADAPT.CEFR.indexOf(learnerLevel()) : 0;
    function rank(id) {
      var at = ADAPT ? ADAPT.CEFR.indexOf(itemLevel(id)) : 0;
      return at < 0 ? 0 : at;
    }
    pool.sort(function (a, b) { return rank(b) - rank(a); });
    var near = pool.filter(function (id) { return rank(id) >= me - 1; });
    if (near.length >= 6) pool = near;
    return S.shuffle(pool, Math.random);
  }

  function synonymVocabIds() {
    return allIds.filter(function (id) {
      return atLevel(id) && SYNONYMS && SYNONYMS.forItem(itemOf(id)).length;
    });
  }

  function startVocab() {
    var ids = [];
    var syn = synonymVocabIds();
    if (syn.length) {
      /* The synonym mode is the whole session now: no recall-meaning cards in
       * front of it. Small decks repeat the authored pairs to fill the set. */
      while (ids.length < 12) {
        S.shuffle(syn, Math.random).forEach(function (id) {
          if (ids.length < 12) ids.push(id);
        });
      }
    } else {
      ids = vocabPool().slice(0, 12);
      if (!ids.length) {
        ids = S.shuffle(allIds.filter(function (id) {
          return atLevel(id) && itemOf(id).kind !== "term";
        }), Math.random).slice(0, 12);
      }
    }
    vocab = { queue: ids, i: 0, correct: 0, again: 0, retry: {}, done: false, revealed: false, anchorDraft: "" };
    show("vocab");
    renderVocab();
  }

  function vocabHarder(id) {
    var base = ADAPT.CEFR.indexOf(itemLevel(id));
    var used = vocab.queue.slice();
    var harder = allIds.filter(function (x) {
      return used.indexOf(x) === -1 && atLevel(x) &&
        SYNONYMS.forItem(itemOf(x)).length &&
        ADAPT.CEFR.indexOf(itemLevel(x)) > base;
    });
    if (!harder.length) return null;
    return S.shuffle(harder, Math.random)[0];
  }

  function answerVocab(ok) {
    if (!vocab || vocab.done) return;
    var id = vocab.queue[vocab.i];
    if (!id) { finishVocab(); return; }
    var anchorInput = $("vocab-anchor");
    if (anchorInput) {
      var anchor = String(anchorInput.value || "").trim().slice(0, 120);
      if (anchor) state.anchors[id] = anchor;
    }
    S.review(state, id, ok ? 2 : 0, Date.now());
    if (ok) {
      vocab.correct += 1;
      var harder = vocab.correct % 2 === 0 ? vocabHarder(id) : null;
      if (harder && vocab.queue.length < 18) vocab.queue.push(harder);
    } else {
      vocab.again += 1;
      if (!vocab.retry[id] && vocab.queue.length < 18) {
        vocab.retry[id] = true;
        vocab.queue.push(id);
      }
    }
    save();
    vocab.i += 1;
    vocab.revealed = false;
    vocab.anchorDraft = "";
    if (vocab.i >= vocab.queue.length) finishVocab();
    else renderVocab();
  }

  function finishVocab() {
    if (!vocab) return;
    vocab.done = true;
    var gained = Math.max(2, vocab.correct * 2);
    state.xp = (state.xp || 0) + gained;
    var coinGain = addCoins(ECON ? ECON.vocabCoins(vocab.correct) : 0);
    state.vocabStats = state.vocabStats || { sessions: 0, correct: 0, again: 0 };
    state.vocabStats.sessions += 1;
    state.vocabStats.correct += vocab.correct;
    state.vocabStats.again += vocab.again;
    save();
    var stage = $("vocab-stage");
    stage.innerHTML =
      '<div class="vocab-summary">' +
        '<p class="vocab-word">' + vocab.correct + " / " + (vocab.correct + vocab.again) + "</p>" +
        '<p class="vocab-meaning">' + esc(tr("vocabDone", "Vocabulary session done")) +
          " · +" + gained + " XP · +" + coinGain + " " + esc(tr("coins", "coins")) + "</p>" +
        '<div class="vocab-summary-actions">' +
          '<button class="btn btn-primary" id="vocab-more">' + esc(tr("oneMore", "One more")) + "</button>" +
          (vocab.again
            ? '<button class="btn btn-ghost btn-sm" id="vocab-review" type="button">' +
              esc(tr("vocabReview", "Review missed")) + "</button>"
            : "") +
        "</div>" +
      "</div>";
    var bar = $("vocab-bar");
    if (bar) bar.style.width = "100%";
    $("vocab-more").addEventListener("click", startVocab);
    try { $("vocab-more").focus({ preventScroll: true }); }
    catch (err) { $("vocab-more").focus(); }
    var review = $("vocab-review");
    if (review) review.addEventListener("click", function () {
      var ids = Object.keys(vocab.retry || {}).filter(function (id) { return !!state.cards[id]; });
      if (!ids.length) return;
      vocab = {
        queue: ids, i: 0, correct: 0, again: 0, retry: {},
        done: false, revealed: false, anchorDraft: ""
      };
      renderVocab();
    });
    $("vocab-count").textContent = "";
    $("vocab-stats").textContent = "";
  }

  function renderVocabSynonym(it, syn, meaning) {
    var correct = syn[vocab.correct % syn.length];
    var synonymSet = {};
    syn.forEach(function (word) { synonymSet[word] = true; });
    /* After a run of correct answers, add more options and pull distractors
     * from the same field first: a harder discrimination, not a longer card. */
    var optionCount = vocab.correct >= 8 ? 6 : vocab.correct >= 4 ? 5 : 4;
    var cat = conceptById[it.id] && conceptById[it.id].cat;
    var near = allIds.filter(function (id) {
      var c = conceptById[id];
      return c && c.cat === cat && c.word !== it.text && c.word !== correct;
    }).map(function (id) { return itemOf(id).text; });
    var pool = near.concat(allIds.map(function (id) { return itemOf(id).text; })).filter(function (word) {
      return word && word !== it.text && !synonymSet[word];
    });
    var options = SYNONYMS.options(correct, pool, optionCount, Math.random);
    $("vocab-feedback").textContent = "";
    $("vocab-stage").innerHTML =
      '<p class="prompt">' + esc(tr("vocabSame", "Which word means the same?")) + "</p>" +
      '<p class="vocab-word">' + esc(it.text) + "</p>" +
      '<div class="word-options">' + options.map(function (word) {
        return '<button class="option-word" type="button" data-synonym="' + esc(word) + '">' +
          esc(word) + "</button>";
      }).join("") + "</div>";
    var buttons = $("vocab-stage").querySelectorAll("[data-synonym]");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-synonym") === correct;
        Array.prototype.forEach.call(buttons, function (b) {
          b.disabled = true;
          if (b.getAttribute("data-synonym") === correct) b.classList.add("pick-correct");
        });
        if (!ok) btn.classList.add("pick-wrong");
        $("vocab-feedback").innerHTML = esc(ok ? tr("correct", "Correct") : tr("notQuite", "Not quite")) +
          " · " + esc(correct) +
          (meaning
            ? ' <button class="gloss-btn" id="vocab-syn-meaning" type="button">' +
              esc(tr("glossShow", "show translation")) + "</button>"
            : "");
        var meaningBtn = $("vocab-syn-meaning");
        if (meaningBtn) meaningBtn.addEventListener("click", function () {
          meaningBtn.outerHTML = '<span class="vocab-syn-def">' + esc(meaning) + "</span>";
        });
        var advanced = false;
        function advance() {
          if (advanced) return;
          advanced = true;
          if (!vocab || vocab.done || currentView !== "vocab") return;
          answerVocab(ok);
        }
        if (ok) {
          /* A correct synonym moves on by itself; the learner only has to
           * press Continue after a miss, where the explanation matters. */
          setTimeout(advance, 800);
        } else {
          $("vocab-stage").insertAdjacentHTML("beforeend",
            '<div class="vocab-actions"><button class="btn btn-primary" id="vocab-syn-continue" type="button">' +
            esc(tr("continue", "Continue")) + "</button></div>");
          var next = $("vocab-syn-continue");
          next.addEventListener("click", advance);
          try { next.focus({ preventScroll: true }); } catch (err) { next.focus(); }
        }
      });
    });
    var first = $("vocab-stage").querySelector("[data-synonym]");
    if (first) {
      try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
    }
  }

  function renderVocab() {
    if (!vocab) return;
    if (vocab.done) return;
    var id = vocab.queue[vocab.i];
    if (!id) { finishVocab(); return; }
    var it = itemOf(id);
    var meaning = translationFor(id) || glossFor(id) || "";
    var reveal = vocab.revealed;
    var anchor = state.anchors[id] || vocab.anchorDraft || "";
    $("vocab-count").textContent = (vocab.i + 1) + "/" + vocab.queue.length +
      " · " + learnerLevel();
    $("vocab-bar").style.width = Math.round((vocab.i / Math.max(vocab.queue.length, 1)) * 100) + "%";
    $("vocab-stats").textContent = vocab.correct + " ✓ · " + vocab.again + " ↺";
    $("vocab-feedback").textContent = "";
    var syn = SYNONYMS ? SYNONYMS.forItem(it) : [];
    if (syn.length) {
      renderVocabSynonym(it, syn, meaning);
      return;
    }
    var context = it.sentence || (it.kind === "phrase" ? it.sub : "");
    $("vocab-stage").innerHTML =
      '<p class="prompt">' + esc(tr("vocabHint", "Recall the meaning before revealing")) + "</p>" +
      '<p class="vocab-word">' + esc(it.text) + "</p>" +
      '<div class="vocab-word-actions">' +
        '<button class="vocab-reveal" id="vocab-reveal" type="button">' + esc(reveal ? tr("glossHide", "hide translation") : tr("glossShow", "show translation")) + "</button>" +
        (audioAvailable()
          ? '<button class="icon-btn vocab-hear" id="vocab-hear" type="button" aria-label="' +
            esc(tr("hearit", "Hear it")) + '" title="' + esc(tr("hearit", "Hear it")) + '">' + ICON.speaker + "</button>"
          : "") +
      "</div>" +
      '<p class="vocab-meaning"' + (reveal ? "" : " hidden") + ">" + esc(meaning) + "</p>" +
      (context && reveal ? '<p class="vocab-sentence">' + esc(context) + "</p>" : "") +
      '<input class="vocab-anchor-input" id="vocab-anchor" type="text" maxlength="120" autocomplete="off" placeholder="' + esc(tr("vocabAnchor", "Personal cue (optional)")) + '" value="' + esc(anchor) + '" />' +
      '<div class="vocab-actions">' +
        '<button class="btn btn-ghost" id="vocab-again" type="button">' + esc(tr("again", "Again")) + "</button>" +
        '<button class="btn btn-primary" id="vocab-got" type="button">' + esc(tr("gotit", "Got it")) + "</button>" +
      "</div>";
    $("vocab-anchor").addEventListener("input", function () { vocab.anchorDraft = this.value; });
    $("vocab-reveal").addEventListener("click", function () {
      vocab.revealed = !vocab.revealed;
      renderVocab();
    });
    var hear = $("vocab-hear");
    if (hear) hear.addEventListener("click", function () { sayItem(it, this); });
    $("vocab-again").addEventListener("click", function () { answerVocab(false); });
    $("vocab-got").addEventListener("click", function () { answerVocab(true); });
    var revealBtn = $("vocab-reveal");
    if (revealBtn) {
      try { revealBtn.focus({ preventScroll: true }); }
      catch (err) { revealBtn.focus(); }
    }
  }

  function startSession(opts) {
    if (needsSetup()) { show("setup"); return; }
    var o = opts || {};
    var now = Date.now();
    /* a locked unit is refused here, not only at the node: a hash, a stale
     * button or the keyboard must not skip ahead either */
    if (o.unit && !unitUnlocked(o.unit)) {
      toast(unlockLine(unitRow(o.unit.id)));
      o = {};
    }
    var p = lessonPlan(o);

    /* reading and the script open their own screens; both are lessons */
    if (p.read) { startReader(); return; }
    if (p.script) { startScriptLesson(); return; }

    var queue = p.queue.slice();

    /* persistent memory, used: the pairs you keep trading come back first, but
     * never before the phrases that open every lesson */
    var lead = 0;
    while (lead < queue.length && itemOf(queue[lead]).kind === "phrase") lead += 1;
    var weak = MEM.weakItems(state, 6).filter(function (id) {
      if (queue.indexOf(id) !== -1 || !state.cards[id]) return false;
      if (!atLevel(id)) return false;
      if (itemOf(id).kind === "term" && !connectorsUnlocked()) return false;
      return true;
    }).slice(0, 2);
    if (weak.length) queue = queue.slice(0, lead).concat(weak, queue.slice(lead));

    if (!queue.length) {
      queue = S.shuffle(deckIds(), Math.random).slice(0, p.size || lessonSize() || 8);
      toast(tr("noDue", "Nothing due here — free practice."));
    }

    /* one card per item: the study step is gone, so a new item is taught by
     * being asked, and the answer is shown the moment it is missed. */
    /* A requested lesson opens on two short chunks with their meanings, then
     * retrieves them in the quiz. Encoding before testing is the point. */
    var warm = o.customId && queue.length > 2 ? queue.slice(0, 2) : [];
    var quizQueue = warm.length ? queue.slice(2) : queue;
    session = newSession("mixed", warm, quizQueue);
    session.plan = p.plan;
    session.customId = o.customId || "";
    /* A requested lesson deliberately cycles recognition, production,
     * translation and sentence construction instead of leaving the mix to
     * chance. Unsupported kinds are skipped per item. */
    if (o.customId) {
      session.types = quizQueue.map(function (id, i) {
        var it = itemOf(id);
        var hasTranslation = !!translationFor(id);
        if (it.kind === "word") {
          var words = hasTranslation
            ? ["translate", "type-translation", "translate-out", "write"]
            : ["write"];
          if (listenable(id)) words.push("listen-type");
          if (hasTranslation) words.push("match");
          words = S.shuffle(words, Math.random);
          return words[i % words.length];
        }
        if (it.kind === "phrase") {
          var phrases = hasTranslation ? ["translate", "translate-out", "write"] : ["write"];
          if (buildable(id)) phrases.push("build");
          if (gapFor(id)) phrases.push("message");
          if (listenable(id)) phrases.push("listen-type");
          if (hasTranslation) phrases.push("match");
          phrases = S.shuffle(phrases, Math.random);
          return phrases[i % phrases.length];
        }
        return "pick-word";
      });
    }

    /* your own sentence, if one is old enough to be worth re-reading */
    var older = MEM.nextToReview(state.memory, now, MEM.DAY_MS / 2);
    if (older) {
      var words = older.items.map(function (id) { return itemOf(id).text; });
      var blanked = MEM.cloze(older.text, words);
      if (blanked) session.personal = { sentence: older, cloze: blanked };
    }
    session.hasPersonal = !!session.personal;

    show("session");
    if (session.personal) renderPersonal();
    else if (session.study.length) renderStudy();
    else renderQuiz();
  }

  function startDemo() {
    var ids = DEMO_IDS.filter(function (id) { return conceptById[id]; });
    session = newSession("words", ids, S.shuffle(ids, Math.random));
    session.types = DEMO_TYPES;
    show("session");
    renderStudy();
    toast(tr("demoClean", "Demo — starts clean; saved progress is untouched."), 3200);
  }

  /* ---- the personal card: your sentence from a previous day ------------ */

  function shortDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(uiLocale(), { month: "short", day: "numeric" });
    } catch (err) { return "earlier"; }
  }

  function renderPersonal() {
    clearCard();
    setProgress();
    renderSteps("warm");

    var p = session.personal;
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("yourSentence", "Your own sentence")) + " · " + esc(shortDate(p.sentence.created)) + "</p>" +
      '<p class="personal-line">' + esc(p.cloze.blanked) + "</p>" +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="' + esc(tr("missingWord", "The missing word")) + '" placeholder="' + esc(tr("missingWord", "The missing word")) + '" />' +
      '<button class="btn btn-primary" id="check">' + esc(tr("check", "Check")) + '</button>';

    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); checkPersonal(); }
      });
    }
    $("check").addEventListener("click", checkPersonal);
  }

  function checkPersonal() {
    var p = session.personal;
    var input = $("type-input");
    var value = input ? input.value : "";
    var score = S.similarity(value, p.cloze.answer, ACTIVE && ACTIVE.code);
    var ok = score >= 0.7;

    MEM.markReviewed(state.memory, p.sentence.id, Date.now());
    MEM.recordAttempt(state.memory, ok, 0);
    countToday("personal:" + p.sentence.id);
    save();

    var answer = esc(p.cloze.answer);
    var full = esc(p.sentence.text).replace(
      new RegExp("\\b" + answer + "\\b", "i"), "<b>$&</b>"
    );

    $("stage").innerHTML =
      '<p class="prompt">' + (ok ? tr("correct", "Correct") : tr("notQuite", "Not quite")) + "</p>" +
      '<p class="personal-line">' + full + "</p>" +
      '<p class="sentence">your own words, from ' + esc(shortDate(p.sentence.created)) + "</p>";

    feedback(ok ? "that was yours" : "the word was “" + p.cloze.answer + "”", ok ? "good" : "bad");

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">' + esc(tr("continue", "Continue")) + '</button>';
    $("next").addEventListener("click", function () {
      session.personal = null;
      if (session.study.length) renderStudy();
      else renderQuiz();
    });
  }

  function startQuizOnly() {
    var p = lessonPlan({ custom: true, size: 6 });
    session = newSession("mixed", [], p.queue);
    show("session");
    renderQuiz();
  }

  /* One queue for everything you keep getting wrong, across all three decks.
   * Memory already ranks it; this just refuses to pretend a review is a deck. */
  function reviewMistakes() {
    var ids = MEM.weakItems(state, 12).filter(reviewable);

    if (!ids.length) {
      ids = S.topConfusions(state, 12).map(function (r) { return r.target; }).filter(reviewable);
    }
    if (!ids.length) {
      toast(tr("nothingToReview", "Nothing to review yet — do a lesson first."));
      return;
    }

    var mode = "mixed";
    session = newSession(mode, [], S.shuffle(ids, Math.random).slice(0, 10));
    show("session");
    renderQuiz();
  }

  /* Anything that could reach a learner by any route answers the same two
   * questions: is it in their band, and is their stage ready for a connector? */
  function reviewable(id) {
    if (!atLevel(id)) return false;
    return itemOf(id).kind !== "term" || connectorsUnlocked();
  }

  function newSession(mode, study, quiz) {
    return {
      mode: mode,
      phase: "study",
      study: study,
      si: 0,
      quiz: quiz,
      qi: 0,
      types: null,
      startedAt: Date.now(),
      requeued: {},
      missed: {},
      times: [],
      qStart: 0,
      answered: {},
      counted: {},
      replaying: null,
      taskShift: Math.floor(Math.random() * 4),
      history: [],
      viewing: null,
      advanceTimer: 0,
      firstCorrect: 0,
      taughtIds: {},
      unique: 0
    };
  }

  function totalSteps() {
    var extra = session.hasPersonal ? 1 : 0;
    return extra + session.study.length + Math.max(session.unique, session.quiz.length);
  }

  function doneSteps() {
    var extra = session.hasPersonal ? 1 : 0;
    if (session.personal) return 0;
    if (session.phase === "study") return extra + session.si;
    return extra + session.study.length + session.qi;
  }

  function setProgress() {
    var n = Math.max(totalSteps(), 1);
    var done = Math.min(doneSteps(), n);
    $("counter").textContent = Math.min(done + 1, n) + "/" + n;
    $("bar-fill").style.width = Math.round((done / n) * 100) + "%";
    var back = $("back-btn");
    if (back) {
      var canBack = !!session && (
        (session.phase === "study" && session.si > 0) ||
        (session.phase === "quiz" && session.qi > 0 && session.history.length)
      );
      back.disabled = !canBack;
      back.setAttribute("aria-disabled", String(!canBack));
    }
  }

  /* The process, made visible: a lesson is four named steps, not one long
   * undifferentiated deck. You always know where you are and what is left. */
  function renderSteps(active) {
    var box = $("steps");
    if (!box || !session) return;
    var steps = [];
    if (session.hasPersonal) steps.push(["warm", tr("warmup", "Warm up")]);
    steps.push(["learn", tr("learn", "Learn")], ["quiz", tr("quiz", "Quiz")], ["done", tr("done", "Done")]);

    var passed = false;
    box.innerHTML = steps.map(function (s) {
      var cls = s[0] === active ? " is-current" : (passed ? " is-done" : "");
      if (s[0] === active) passed = true;
      return '<li class="pstep' + cls + '">' + esc(s[1]) + "</li>";
    }).join("");
  }

  function clearCard() {
    $("stage").innerHTML = "";
    $("actions").innerHTML = "";
    $("card").classList.remove("is-summary", "is-answered", "is-reviewing");
    var f = $("feedback");
    f.textContent = "";
    f.className = "feedback";
  }

  /* ---- phase 1: form the association, both halves visible at once -------- */

  function renderStudy() {
    setProgress();
    clearCard();
    renderSteps("learn");

    var it = itemOf(session.study[session.si]);
    var last = session.si === session.study.length - 1;
    var emoji = basicEmoji(it);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("learnPair", "Learn the pair")) + " · " + (session.si + 1) + " / " + session.study.length +
        (it.kind === "phrase" ? " · " + esc(tr("phrase", "phrase")) : "") + "</p>" +
      (emoji ? '<div class="emoji-basic" aria-hidden="true">' + emoji + "</div>" : "") +
      wordsHTML(it) +
      (emoji ? "" : meaningHTML(it.id)) +
      contextHTML(it);

    sayItem(it);
    var hearStudy = $("hear-btn");
    if (hearStudy) hearStudy.addEventListener("click", function () { sayItem(it, this); });

    $("actions").innerHTML = (emoji ? glossHTML(it.id) : "") +
      '<button class="btn btn-primary" id="next">' +
      (last ? esc(tr("startQuiz", "Start the quiz")) : esc(tr("next", "Next"))) + "</button>";
    if (emoji) wireGloss();
    $("next").addEventListener("click", function () {
      session.si += 1;
      if (session.si < session.study.length) renderStudy();
      else { session.phase = "quiz"; renderQuiz(); }
    });
  }

  /* ---- phase 2: hide one half, ask for the other ------------------------ */

  function buildable(id) {
    var it = itemOf(id);
    return it.kind === "phrase" && EX.canBuild(it.text);
  }

  function listenable(id) {
    if (!audioAvailable()) return false;
    return EX.canListen(bundled, id, hasTTS);
  }

  function gapFor(id) {
    var it = itemOf(id);
    if (it.kind === "phrase") return EX.gapPhrase(it.text, it.sub);
    if (it.kind !== "word") return null;
    var texts = (window.SEMA_TEXTS && window.SEMA_TEXTS.texts) || [];
    for (var i = 0; i < texts.length; i += 1) {
      var parts = String(texts[i].body || "").split(/[.!?。！？]/);
      for (var j = 0; j < parts.length; j += 1) {
        var gap = EX.gapWord(parts[j], it.text);
        if (gap) return gap;
      }
    }
    return null;
  }

  /* Three wrong words, taken from the deck itself, never a duplicate. */
  function gapDistractors(answer, count) {
    var seen = {};
    seen[String(answer).toLowerCase()] = true;
    var pool = [];
    deckIds().forEach(function (id) {
      EX.words(itemOf(id).text).forEach(function (w) {
        var key = w.toLowerCase();
        if (key.length < 2 || seen[key]) return;
        seen[key] = true;
        pool.push(w);
      });
    });
    return S.shuffle(pool, Math.random).slice(0, count);
  }

  function quizType(card, i) {
    if (session.types) return session.types[i] || "pick-picture";
    if (session.forceWrite) return "write";
    if (card.last === null) return "pick-word";
    /* harder cards arrive as a minority: one in four, gated on the pack's own
     * sentences and clips */
    var link = session.quiz[i];
    var tick = i + (session.taskShift || 0);
    var concept = conceptById[link];
    if (concept && ["abstract", "emotion", "time"].indexOf(concept.cat) !== -1 && translationFor(link)) {
      return tick % 2 ? "translate" : "translate-out";
    }
    var extra = EX ? EX.extraKind(tick, {
      listen: listenable(link),
      build: buildable(link),
      gap: !!gapFor(link)
    }) : null;
    if (extra) return extra;
    /* reviewed cards alternate both directions: target → UI meaning, and
     * UI meaning → target. No emoji matching, no English under a non-English UI. */
    if (itemOf(link).kind === "phrase" && gapFor(link) && tick % 6 === 4) return "message";
    if (listenable(link) && tick % 9 === 7) return "listen-type";
    if (translationFor(link) && tick % 10 === 8) return "match";
    if (translationFor(link)) {
      if (itemOf(link).kind === "word" && tick % 7 === 5) return "type-translation";
      /* A clean session can stop at six; both directions must appear before
       * the stop rule, so they alternate in the first four reviewed cards. */
      if (tick % 4 === 1) return "translate";
      if (tick % 4 === 3) return "translate-out";
    }
    /* A whole sentence cannot be guessed from a copied emoji. Phrases are
     * built, translated or listened to; pictures stay with concrete words. */
    if (itemOf(link).kind === "phrase") {
      if (buildable(link)) return "build";
      return "translate-out";
    }
    var prod = (session.plan && session.plan.production) || 0;
    if (prod >= 2 && tick % 2 === 1) return "write";
    if (prod >= 1 && tick % 3 === 2) return "write";   // production without a microphone
    if (SR && tick % 2 === 1) return "say";
    return "pick-picture";
  }

  function renderQuiz() {
    if (session.qi >= session.quiz.length) { finishSession(); return; }
    /* end on a high: a learner who is getting everything right should stop
     * while it still feels good, not grind to the eighth card. */
    var realAnswered = Math.max(0, session.unique - Object.keys(session.taughtIds || {}).length);
    if (ADAPT.shouldStop(realAnswered, session.firstCorrect)) {
      session.quiz.length = session.qi;   // so the bar reads finished, not cut off
      finishSession();
      return;
    }
    /* Normal lessons start directly in the quiz phase; without this the bar
     * kept reading the study-phase counter and never advanced. */
    session.phase = "quiz";
    setProgress();
    clearCard();
    renderSteps("quiz");

    var id = session.quiz[session.qi];
    var card = state.cards[id];
    if (!session.answered[id]) {
      session.answered[id] = true;
      session.unique += 1;
    }

    session.qStart = Date.now();
    /* never seen it? teach on this card, then move on. One screen per item,
     * but the first exposure informs instead of interrogating. */
    /* teach the first few, then ask: a session of eight brand-new items used to
     * be eight teach cards and zero questions, and every answer counted zero. */
    var taught = session.taught || 0;
    /* a lesson that opened with study cards (the demo) has taught them already */
    if (!session.study.length && card.last === null && taught < 3) { session.taught = taught + 1; renderTeach(id); return; }

    if (itemOf(id).kind === "basic") {
      var basic = itemOf(id);
      if (basic.of && basic.person) renderPerson(id);
      else if (basicById[id] && basicById[id].kind === "pronoun") renderPronoun(id);
      else renderBasicMeaning(id);
      return;
    }
    if (itemOf(id).kind === "term") { renderTermMeaning(id); return; }

    var type = quizType(card, session.qi);
    if (type === "pick-word") renderPickWord(id);
    else if (type === "write") renderWrite(id);
    else if (type === "say") renderSay(id);
    else if (type === "build") renderBuild(id);
    else if (type === "listen") renderListen(id);
    else if (type === "gap") renderGap(id);
    else if (type === "translate") renderTranslate(id);
    else if (type === "translate-out") renderTranslateToTarget(id);
    else if (type === "message") renderMessage(id);
    else if (type === "type-translation") renderTypeTranslation(id);
    else if (type === "listen-type") renderListenType(id);
    else if (type === "match") renderMatch(id);
    else renderPickPicture(id);
  }

  /* The number on each option is also its key: 1–4 answer from the keyboard. */
  function optionHTML(id, i) {
    var it = itemOf(id);
    /* phrases share one size, so four options never look like four fonts */
    var long = it.kind === "phrase" ? " phrase" : it.text.length > 16 ? " long" : "";
    return '<button class="option-word' + long + '" data-id="' + esc(id) + '">' +
      '<span class="key" aria-hidden="true">' + (i + 1) + "</span>" +
      '<span class="opt-text">' + articleHTML(it.article) + textHTML(it) + "</span></button>";
  }

  /* A translation exercise is the other direction: the target is the prompt,
   * the four meanings in the interface language are the choices. It teaches
   * meaning without an emoji and without giving the target away. */
  function glossOptionHTML(id, i) {
    var g = translationFor(id) || itemOf(id).text;
    var long = g.length > 24 ? " long" : "";
    return '<button class="option-word' + long + '" data-id="' + esc(id) + '">' +
      '<span class="key" aria-hidden="true">' + (i + 1) + "</span>" +
      '<span class="opt-text">' + esc(g) + "</span></button>";
  }

  function glossDistractors(id, count) {
    var target = translationFor(id).toLowerCase();
    var seen = {};
    seen[target] = true;
    var pool = [];
    deckIds().forEach(function (other) {
      if (other === id) return;
      var g = translationFor(other);
      var key = g.toLowerCase();
      if (!g || seen[key]) return;
      seen[key] = true;
      pool.push(other);
    });
    return S.shuffle(pool, Math.random).slice(0, count);
  }

  function renderTranslate(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(glossDistractors(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + tr("whichOne", "Which one is this?") + "</p>" +
      '<div class="say-line">' +
        '<button class="speak-btn round" id="hear-btn" aria-label="' + esc(tr("hearit", "Hear it")) + '" title="' + esc(tr("hearit", "Hear it")) + '"' + (audioAvailable() ? "" : " disabled") + ">" + ICON.speaker + "</button>" +
        wordsHTML(it) +
      "</div>" +
      '<div class="word-options">' + set.map(glossOptionHTML).join("") + "</div>";

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    chooseThenCheck(".option-word", id, true);
  }

  /* The other direction: a meaning in the interface language, and four
   * target-language words. This is the task the learner asked for. */
  function renderTranslateToTarget(id) {
    var translated = translationFor(id);
    var prompt = translated || glossFor(id);
    if (!prompt) { renderPickWord(id); return; }
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("translateInto", "Translate into") + " · " + uiName(ACTIVE.code)) + "</p>" +
      '<p class="word">' + esc(prompt) + (translated ? "" : ' <span class="gloss-fallback">EN</span>') + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";
    $("actions").innerHTML = "";

    chooseThenCheck(".option-word", id, true);
  }

  function markChoices(cls, targetId) {
    Array.prototype.forEach.call($("stage").querySelectorAll(cls), function (b) {
      b.disabled = true;
      if (b.getAttribute("data-id") === targetId) b.classList.add("pick-correct");
    });
  }

  /* The only honest question for "aunque": which one fits this sentence. */
  function renderTeach(id) {
    var it = itemOf(id);
    var emoji = basicEmoji(it);
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("new", "New")) + "</p>" +
      (emoji ? '<div class="emoji-basic" aria-hidden="true">' + emoji + "</div>" : "") +
      wordsHTML(it) +
      (emoji ? "" : meaningHTML(id)) +
      contextHTML(it);
    sayItem(it);
    var hearTeach = $("hear-btn");
    if (hearTeach) hearTeach.addEventListener("click", function () { sayItem(it, this); });
    var tile = $("stage").querySelector(".tile");
    if (tile) {
      tile.style.cursor = "pointer";
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", "Play the audio");
      tile.addEventListener("click", function () { sayItem(it); });
    }
    $("actions").innerHTML = (emoji ? glossHTML(id) : "") +
      '<button class="btn btn-primary" id="gotit">' + tr("gotit", "Got it") + '</button>';
    if (emoji) wireGloss();
    $("gotit").addEventListener("click", function () {
      /* Taught is exposure, not recall. Do not inflate accuracy or "remembered". */
      session.taughtIds[id] = true;
      S.review(state, id, 2, Date.now());
      countToday(id);
      save();
      session.qi += 1;
      renderQuiz();
    });
  }

  /* The first question that tests a rule, not a word. */
  /* Pronouns come from the live pack's grammar deck, never a Spanish table:
   * French needs "je / tu / il / elle", Japanese needs its own words, and a
   * learner should never be shown "yo" while studying Arabic. Some persons
   * have two valid pronouns, and both are accepted. */
  function pronounsFor(person) {
    var out = [];
    basicIds.forEach(function (id) {
      var b = basicById[id];
      if (!b || b.kind !== "pronoun" || b.person !== person || !b.text) return;
      if (out.indexOf(b.text) === -1) out.push(b.text);
    });
    return out;
  }

  function allPronouns() {
    var out = [];
    basicIds.forEach(function (id) {
      var b = basicById[id];
      if (!b || b.kind !== "pronoun" || !b.text) return;
      if (out.indexOf(b.text) === -1) out.push(b.text);
    });
    return out;
  }

  /* A pronoun is not a "which person is this verb" question. It is a
   * meaning-to-target choice; a verb form is the person question. */
  function renderPronoun(id) {
    var it = itemOf(id);
    var translated = translationFor(id);
    var prompt = translated || it.sub || it.text;
    var others = S.shuffle(allPronouns().filter(function (w) { return w !== it.text; }), Math.random).slice(0, 3);
    var set = S.shuffle([it.text].concat(others), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("translateInto", "Translate into") + " · " + uiName(ACTIVE.code)) + "</p>" +
      '<p class="word">' + esc(prompt) + (translated ? "" : ' <span class="gloss-fallback">EN</span>') + "</p>" +
      '<div class="word-options">' + set.map(function (w) {
        return '<button class="option-word" data-w="' + esc(w) + '">' + esc(w) + "</button>";
      }).join("") + "</div>";

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-w") === it.text;
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-w") === it.text) b.classList.add("pick-correct");
        });
        if (!ok) btn.classList.add("pick-wrong");
        answer(ok, null);
      });
    });
    $("actions").innerHTML = "";
  }

  /* A basic item without a person (Japanese です, Chinese 是, a pronoun) is
   * taught as meaning-to-target, never as a "which pronoun is this verb" card. */
  function renderBasicMeaning(id) {
    var it = itemOf(id);
    var b = basicById[id];
    var translated = translationFor(id);
    var prompt = translated || (b && b.gloss) || it.sub || it.text;
    var pool = basicIds.filter(function (other) {
      var ob = basicById[other];
      return other !== id && ob && ob.kind === b.kind;
    });
    var set = S.shuffle([id].concat(S.shuffle(pool, Math.random).slice(0, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("translateInto", "Translate into") + " · " + uiName(ACTIVE.code)) + "</p>" +
      '<p class="word">' + esc(prompt) + (translated ? "" : ' <span class="gloss-fallback">EN</span>') + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";
    $("actions").innerHTML = "";
    chooseThenCheck(".option-word", id, true);
  }

  function renderPerson(id) {
    var it = itemOf(id);
    var accepted = pronounsFor(it.person);
    if (!accepted.length) accepted = [it.text];
    var others = allPronouns().filter(function (w) {
      return accepted.indexOf(w) === -1;
    }).slice(0, 3);
    var set = S.shuffle(accepted.concat(others), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("whichOne", "Which one is this?")) + "</p>" +
      '<div class="word">' + esc(it.text) + "</div>" +
      '<div class="word-options">' + set.map(function (w) {
        return '<button class="option-word" data-w="' + esc(w) + '">' + esc(w) + "</button>";
      }).join("") + "</div>";

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = accepted.indexOf(btn.getAttribute("data-w")) !== -1;
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (accepted.indexOf(b.getAttribute("data-w")) !== -1) b.classList.add("pick-correct");
        });
        if (!ok) btn.classList.add("pick-wrong");
        answer(ok, null);
      });
    });
    $("actions").innerHTML = glossHTML(id);
    wireGloss();
  }

  /* A connector such as "however" cannot be taught by a balance glyph.
   * Its UI meaning is the prompt; the target connector is the answer. */
  function renderTermMeaning(id) {
    var translated = translationFor(id);
    var prompt = translated || glossFor(id);
    if (!prompt) { renderPickFrame(id); return; }
    var pool = termIds.filter(function (other) { return other !== id; });
    var set = S.shuffle([id].concat(S.shuffle(pool, Math.random).slice(0, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("translateInto", "Translate into") + " · " + uiName(ACTIVE.code)) + "</p>" +
      '<p class="word">' + esc(prompt) + (translated ? "" : ' <span class="gloss-fallback">EN</span>') + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";
    $("actions").innerHTML = "";
    chooseThenCheck(".option-word", id, true);
  }

  function renderPickFrame(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(S.pickDistractors(id, termIds, [], 3, Math.random)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("whichFits", "Which one fits?")) + "</p>" +
      '<p class="term-blank">' + esc(it.frame) + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";
    $("actions").innerHTML = glossHTML(id);
    wireGloss();

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        var ok = picked === id;
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        markChoices(".option-word", id);
        answer(ok, ok ? null : picked);
      });
    });
  }

  /* Build the sentence: the phrase's own words, shuffled, placed in order. */
  function renderBuild(id) {
    var it = itemOf(id);
    var tokens = EX.words(it.text);
    var bank = tokens.slice();
    /* Two words that belong to other phrases, so this tests construction,
     * not just putting the only available words in order. */
    var decoys = [];
    phraseIds.forEach(function (other) {
      if (decoys.length >= 2 || other === id) return;
      EX.words(phraseById[other].text).forEach(function (word) {
        if (decoys.length >= 2) return;
        if (bank.indexOf(word) === -1 && decoys.indexOf(word) === -1) decoys.push(word);
      });
    });
    bank = bank.concat(decoys);
    var pool = S.shuffle(bank.map(function (w, i) { return { w: w, i: i }; }), Math.random);
    var placed = [];

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("buildSentence", "Build the sentence")) + "</p>" +
      '<div class="build-line" id="build-line" aria-live="polite"></div>' +
      '<div class="word-options" id="build-pool"></div>';
    $("actions").innerHTML = glossHTML(id) +
      '<button class="btn btn-primary" id="build-check" disabled>' + esc(tr("check", "Check")) + '</button>';
    wireGloss();

    function paint() {
      $("build-pool").innerHTML = pool.map(function (t) {
        var used = placed.indexOf(t.i) !== -1;
        return '<button class="option-word token" type="button" data-token="' + t.i + '"' +
          (used ? ' aria-pressed="true" disabled' : "") + ">" + esc(t.w) + "</button>";
      }).join("");
      $("build-line").innerHTML = placed.length
        ? placed.map(function (i) {
            return '<button class="token placed" type="button" data-slot="' + i + '">' + esc(bank[i]) + "</button>";
          }).join("")
        : '<span class="build-hint">tap the words in order</span>';
      $("build-check").disabled = placed.length < tokens.length;
      Array.prototype.forEach.call($("build-pool").querySelectorAll(".token"), function (b) {
        b.addEventListener("click", function () {
          var i = Number(b.getAttribute("data-token"));
          if (placed.indexOf(i) === -1) { placed.push(i); paint(); }
        });
      });
      Array.prototype.forEach.call($("build-line").querySelectorAll(".placed"), function (b) {
        b.addEventListener("click", function () {
          var i = Number(b.getAttribute("data-slot"));
          placed = placed.filter(function (x) { return x !== i; });
          paint();
        });
      });
    }
    paint();

    $("build-check").addEventListener("click", function () {
      var attempt = placed.map(function (i) { return bank[i]; }).join(" ");
      var ok = EX.sameOrder(attempt, it.text);
      if (!ok) $("stage").innerHTML += '<p class="sentence">the sentence is ' + esc(it.text) + "</p>";
      answer(ok, null);
    });
  }

  /* A short message with one missing word, the way a chat exchange looks.
   * This is the "complete the message" task, using the phrase's own context. */
  function renderMessage(id) {
    var it = itemOf(id);
    var gap = gapFor(id);
    if (!gap) { renderGap(id); return; }
    var options = S.shuffle([gap.answer].concat(gapDistractors(gap.answer, 3)), Math.random).slice(0, 4);
    var line = esc(gap.sentence).replace("___", '<span class="msg-blank">___</span>');

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("completeMessage", "Complete the message")) + "</p>" +
      '<div class="msg-thread">' +
        (it.sub ? '<div class="msg-bubble">' + esc(it.sub) + "</div>" : "") +
        '<div class="msg-bubble mine">' + line + "</div>" +
      "</div>" +
      '<div class="word-options">' + options.map(function (word) {
        return '<button class="option-word" data-word="' + esc(word) + '">' + esc(word) + "</button>";
      }).join("") + "</div>";
    $("actions").innerHTML = glossHTML(id);
    wireGloss();

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = EX.gradeGap(btn.getAttribute("data-word"), gap.answer);
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-word") === gap.answer) b.classList.add("pick-correct");
        });
        if (!ok) btn.classList.add("pick-wrong");
        answer(ok, null);
      });
    });
  }

  /* Fill the gap: one word removed, four offered. A wrong pick shows the
   * completed sentence, not just a red chip. */
  function renderGap(id) {
    var gap = gapFor(id);
    if (!gap) { renderPickWord(id); return; }
    var options = S.shuffle([gap.answer].concat(gapDistractors(gap.answer, 3)), Math.random);
    var completed = gap.sentence.replace("___", gap.answer);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("fillGap", "Fill the gap")) + "</p>" +
      '<p class="gap-sentence">' + esc(gap.sentence) + "</p>" +
      '<div class="word-options">' + options.map(function (word) {
        return '<button class="option-word" data-word="' + esc(word) + '">' + esc(word) + "</button>";
      }).join("") + "</div>";
    $("actions").innerHTML = glossHTML(id);
    wireGloss();

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = EX.gradeGap(btn.getAttribute("data-word"), gap.answer);
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-word") === gap.answer) b.classList.add("pick-correct");
        });
        if (!ok) {
          btn.classList.add("pick-wrong");
          $("stage").innerHTML += '<p class="sentence">' + esc(completed) + "</p>";
        }
        answer(ok, null);
      });
    });
  }

  /* Listen and pick: the clip first, the text only in the four answers. */
  function renderListen(id) {
    var it = itemOf(id);
    if (!audioAvailable()) {
      $("stage").innerHTML =
        '<p class="prompt">' + esc(tr("listenPick", "Listen and pick")) + "</p>" +
        '<p class="sentence">' + esc(tr("audioUnavailable", "Audio is unavailable on this device. Skip this one.")) + "</p>";
      $("actions").innerHTML = '<button class="btn btn-ghost" id="skip">' + esc(tr("skip", "Skip")) + "</button>";
      $("skip").addEventListener("click", skipCard);
      return;
    }
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<div class="listen-line">' +
        '<p class="prompt">' + esc(tr("listenPick", "Listen and pick")) + "</p>" +
        (audioAvailable()
          ? '<button class="speak-btn round" id="hear-btn" aria-label="' + esc(tr("hearit", "Hear it")) + '" title="' + esc(tr("hearit", "Hear it")) + '">' + ICON.speaker + "</button>"
          : "") +
      "</div>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";
    $("actions").innerHTML = glossHTML(id) +
      '<button class="btn btn-ghost" id="skip">' + esc(tr("skip", "Skip")) + "</button>";
    wireGloss();

    if (audioAvailable()) sayItem(it);
    if ($("hear-btn")) $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    $("skip").addEventListener("click", skipCard);
    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        var ok = picked === id;
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        markChoices(".option-word", id);
        answer(ok, ok ? null : picked);
      });
    });
  }

  function renderPickWord(id) {
    var it = itemOf(id);
    if (it.kind === "word" || it.kind === "phrase") { renderTranslateToTarget(id); return; }
    renderTranslateToTarget(id);
  }

  /* A tap only selects; Check commits. A slip of the finger is not a wrong
   * answer, and the learner gets a beat to reconsider. */
  function chooseThenCheck(cls, id, noGloss) {
    var picked = null;
    var opts = $("stage").querySelectorAll(cls);
    $("actions").innerHTML = (noGloss ? "" : glossHTML(id)) +
      '<button class="btn btn-primary" id="check" disabled>' + esc(tr("check", "Check")) + '</button>';
    if (!noGloss) wireGloss();

    Array.prototype.forEach.call(opts, function (btn) {
      btn.addEventListener("click", function () {
        picked = btn.getAttribute("data-id");
        Array.prototype.forEach.call(opts, function (b) {
          b.classList.toggle("is-selected", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        $("check").disabled = false;
      });
    });

    $("check").addEventListener("click", function () {
      if (!picked) return;
      var ok = picked === id;
      Array.prototype.forEach.call(opts, function (b) {
        b.classList.remove("is-selected");
        if (b.getAttribute("data-id") === picked) b.classList.add(ok ? "pick-correct" : "pick-wrong");
      });
      markChoices(cls, id);
      answer(ok, ok ? null : picked);
    });
  }

  function renderPickPicture(id) {
    renderTranslateToTarget(id);
  }

  /* Write it: the only exercise that tests production without a microphone.
   * Fuzzy on purpose - "cafe" for "café" is not a spelling lesson, it is a
   * recall success. */
  /* Type the target from its UI meaning. Unlike the multiple-choice
   * translation, this tests production without showing the answer first. */
  /* Match three target lines to their UI meanings. Only the current card is
   * graded; the other pairs are there to make the retrieval less mechanical. */
  function renderMatch(id) {
    var it = itemOf(id);
    var meaning = translationFor(id) || glossFor(id);
    if (!meaning) { renderTranslateToTarget(id); return; }
    var seenMeanings = {};
    seenMeanings[String(meaning).toLowerCase()] = true;
    var other = distractorsFor(id, 6).filter(function (x) {
      var m = translationFor(x) || glossFor(x);
      if (x === id || !m) return false;
      var key = String(m).toLowerCase();
      if (seenMeanings[key]) return false;
      seenMeanings[key] = true;
      return true;
    }).slice(0, 2);
    var ids = [id].concat(other);
    if (ids.length < 3) { renderTranslateToTarget(id); return; }
    var pairs = ids.map(function (x) {
      return { id: x, text: itemOf(x).text, meaning: translationFor(x) || glossFor(x) };
    });
    var targets = S.shuffle(pairs, Math.random);
    var meanings = S.shuffle(pairs, Math.random);
    var picked = null;
    var matched = {};

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("matchPairs", "Match the pairs")) + "</p>" +
      '<div class="match-grid">' +
        '<div class="match-col">' + targets.map(function (p) {
          return '<button class="match-btn" type="button" data-target="' + esc(p.id) + '">' + esc(p.text) + "</button>";
        }).join("") + "</div>" +
        '<div class="match-col">' + meanings.map(function (p) {
          return '<button class="match-btn" type="button" data-meaning="' + esc(p.id) + '">' + esc(p.meaning) + "</button>";
        }).join("") + "</div>" +
      "</div>";
    $("actions").innerHTML = glossHTML(id);
    wireGloss();

    Array.prototype.forEach.call($("stage").querySelectorAll("[data-target]"), function (b) {
      b.addEventListener("click", function () {
        if (b.disabled) return;
        Array.prototype.forEach.call($("stage").querySelectorAll("[data-target]"), function (x) {
          x.classList.remove("is-selected");
        });
        picked = b.getAttribute("data-target");
        b.classList.add("is-selected");
      });
    });
    Array.prototype.forEach.call($("stage").querySelectorAll("[data-meaning]"), function (b) {
      b.addEventListener("click", function () {
        if (!picked || b.disabled) return;
        var target = picked;
        var targetButton = null;
        Array.prototype.forEach.call($("stage").querySelectorAll("[data-target]"), function (x) {
          if (x.getAttribute("data-target") === target) targetButton = x;
        });
        if (b.getAttribute("data-meaning") !== target) {
          if (targetButton) targetButton.classList.add("pick-wrong");
          b.classList.add("pick-wrong");
          setTimeout(function () {
            if (targetButton) targetButton.classList.remove("pick-wrong", "is-selected");
            b.classList.remove("pick-wrong");
          }, 360);
          picked = null;
          return;
        }
        matched[target] = true;
        if (targetButton) {
          targetButton.disabled = true;
          targetButton.classList.remove("is-selected");
          targetButton.classList.add("pick-correct");
        }
        b.disabled = true;
        b.classList.add("pick-correct");
        picked = null;
        if (Object.keys(matched).length === pairs.length) {
          setTimeout(function () { answer(true, null); }, 280);
        }
      });
    });
  }

  /* Typing is production, not a spelling bee: case, accents and punctuation
   * are already folded by S.similarity. A non-Latin item also accepts its
   * authored reading (sub) so a Latin keyboard is not a dead end. */
  function acceptedAnswers(it) {
    var out = [it.text];
    function add(value) {
      var v = String(value || "").trim();
      if (v && out.indexOf(v) === -1) out.push(v);
    }
    if (it.sub && WRITING && WRITING.hasScript(it.text) && !WRITING.hasScript(it.sub)) add(it.sub);
    ["accept", "alternatives", "answers", "synonyms"].forEach(function (key) {
      if (Array.isArray(it[key])) it[key].forEach(add);
    });
    return out.filter(Boolean);
  }

  function bestAnswer(typed, it) {
    var best = it.text;
    var bestScore = -1;
    acceptedAnswers(it).forEach(function (answer) {
      var score = S.similarity(typed, answer, ACTIVE && ACTIVE.code);
      if (score > bestScore) { best = answer; bestScore = score; }
    });
    return { answer: best, score: bestScore };
  }

  function typingSkipHTML() {
    return '<button class="btn btn-ghost btn-sm" id="skip-typing" type="button">' +
      esc(tr("skipTyping", "Skip typing")) + "</button>";
  }

  function wireTypingSkip(handler) {
    var btn = $("skip-typing");
    if (btn) btn.addEventListener("click", handler || skipCard);
  }

  /* Audio first, production second: no target text is shown. */
  function renderListenType(id) {
    var it = itemOf(id);
    if (!audioAvailable()) {
      $("stage").innerHTML =
        '<p class="prompt">' + esc(tr("listenType", "Listen and type")) + " · " + esc(uiName(LANG.code)) + "</p>" +
        '<p class="sentence">' + esc(tr("audioUnavailable", "Audio is unavailable on this device. Skip this one.")) + "</p>";
      $("actions").innerHTML = typingSkipHTML();
      wireTypingSkip(skipCard);
      return;
    }
    $("stage").innerHTML =
      '<div class="listen-line">' +
        '<p class="prompt">' + esc(tr("listenType", "Listen and type")) + " · " + esc(uiName(LANG.code)) + "</p>" +
        (audioAvailable()
          ? '<button class="speak-btn round" id="hear-btn" aria-label="' + esc(tr("hearit", "Hear it")) + '" title="' + esc(tr("hearit", "Hear it")) + '">' + ICON.speaker + "</button>"
          : "") +
      "</div>" +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="' + esc(tr("typeIt", "type it")) + '" />' +
      '<button class="btn btn-primary" id="write-check">' + esc(tr("check", "Check")) + '</button>';
    if (audioAvailable()) sayItem(it);
    var hearBtn = $("hear-btn");
    if (hearBtn) hearBtn.addEventListener("click", function () { sayItem(it, this); });
    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); submitWrite(id, it); }
      });
    }
    $("write-check").addEventListener("click", function () { submitWrite(id, it); });
    $("actions").innerHTML = typingSkipHTML();
    wireTypingSkip(skipCard);
  }

  function renderTypeTranslation(id) {
    var it = itemOf(id);
    var prompt = translationFor(id) || glossFor(id) || it.sub || "";
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("translateInto", "Translate into") + " · " + esc(uiName(LANG.code))) + "</p>" +
      '<p class="word">' + esc(prompt) + "</p>" +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="' + esc(tr("writeIt", "Write it")) + '" placeholder="' + esc(tr("writeIt", "Write it")) + '" />' +
      '<button class="btn btn-primary" id="write-check">' + esc(tr("check", "Check")) + '</button>';
    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); submitWrite(id, it); }
      });
    }
    $("write-check").addEventListener("click", function () { submitWrite(id, it); });
    $("actions").innerHTML = typingSkipHTML();
    wireTypingSkip(skipCard);
  }

  function renderWrite(id) {
    var it = itemOf(id);
    var prompt = translationFor(id) || glossFor(id) || it.sub || "";

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("writeIt", "Write it")) + " · " + esc(uiName(LANG.code)) + "</p>" +
      (prompt ? '<p class="word">' + esc(prompt) + "</p>" : "") +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="' + esc(tr("writeIt", "Write it")) + '" placeholder="' + esc(tr("typeIt", "type it")) + '" />' +
      '<button class="btn btn-primary" id="write-check">' + esc(tr("check", "Check")) + '</button>';
    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); submitWrite(id, it); }
      });
    }
    $("write-check").addEventListener("click", function () { submitWrite(id, it); });
    $("actions").innerHTML = glossHTML(id) + typingSkipHTML();
    wireGloss();
    wireTypingSkip(skipCard);
  }

  function submitWrite(id, it) {
    var input = $("type-input");
    var typed = input ? input.value : "";
    var best = bestAnswer(typed, it);
    var score = best.score;
    var kind = CORRECT ? CORRECT.classify(typed, best.answer, ACTIVE && ACTIVE.code) : "spelling";
    var articleMiss = kind === "article" || kind === "extra-article" || kind === "missing-article";

    if (score >= 0.8 && !articleMiss) { answer(true, null); return; }

    /* A tutor says what was wrong, not just that it was. */
    var key = "correction" + kind.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
    var message = tr(key, "");
    if (!message) message = CORRECT ? CORRECT.message(kind, best.answer) : tr("notQuite", "Not quite");
    toast(message.replace("{word}", best.answer));
    answer(false, null);
  }

  function renderSay(id) {
    var it = itemOf(id);

    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("sayIt", "Say it")) + " · " + esc(uiName(LANG.code)) + "</p>" +
      meaningHTML(id) +
      (SR ? '<button class="mic" id="mic-btn">' + ICON.mic + esc(tr("sayAloud", "Say it aloud")) + '</button>' : "") +
      '<p class="score" id="score"></p>';

    var mic = $("mic-btn");
    if (mic) mic.addEventListener("click", function () {
      var btn = this;
      var started = listen(it.text, function (score, said) {
        var el = $("score");
        if (el) el.textContent = tr("heard", "heard") + " “" + said + "” · " +
          tr("match", "match") + " " + Math.round(score * 100) + "%";
        answer(score > 0.6, null);
      });
      if (started) {
        btn.classList.add("is-live");
        btn.innerHTML = ICON.mic + esc(tr("listening", "Listening…"));
        var reset = setInterval(function () {
          if (!listening) {
            clearInterval(reset);
            btn.classList.remove("is-live");
            btn.innerHTML = ICON.mic + esc(tr("sayAloud", "Say it aloud"));
          }
        }, 400);
      }
    });

    /* without a recogniser the learner says it aloud and checks themselves */
    $("actions").innerHTML = glossHTML(id) +
      (SR ? "" : '<button class="btn btn-primary" id="said">I said it</button>') +
      '<button class="btn btn-ghost" id="skip">' + esc(tr("skip", "Skip")) + "</button>" +
      '<button class="btn btn-ghost" id="reveal">' + esc(tr("showAnswer", "Show the answer")) + '</button>';
    wireGloss();
    if (!SR) $("said").addEventListener("click", function () { answer(true, null); });
    $("skip").addEventListener("click", skipCard);
    $("reveal").addEventListener("click", function () { answer(false, null); });
  }

  /* Count a whole lesson (a text, a script chunk) toward today's goal. */
  function bumpDaily() {
    state.daily = ADAPT && ADAPT.bumpDaily
      ? ADAPT.bumpDaily(state.daily, Date.now())
      : { date: dayKey(Date.now()), cards: ((state.daily && state.daily.cards) || 0) + 1 };
    state.days = state.days && typeof state.days === "object" ? state.days : {};
    if (state.daily && state.daily.date) {
      state.days[state.daily.date] = Number(state.daily.cards) || 0;
    }
  }

  /* One card counts once for the day, even when a miss brings it back later. */
  function countToday(id) {
    if (!session) return;
    session.counted = session.counted || {};
    if (session.counted[id]) return;
    session.counted[id] = true;
    bumpDaily();
    payDailyGoal();
    save();
  }

  /* Leave a task the device cannot actually run, without marking it wrong. */
  function skipCard() {
    if (!session) return;
    var id = session.quiz[session.qi];
    if (!id) return;
    if (session.answered[id]) {
      delete session.answered[id];
      session.unique = Math.max(0, (session.unique || 0) - 1);
    }
    /* Ignore the task completely. Removing it also keeps it out of the
     * progress denominator and the summary; it is not a correct answer. */
    session.quiz.splice(session.qi, 1);
    if (session.types && session.types.length > session.qi) session.types.splice(session.qi, 1);
    if (session.qi >= session.quiz.length) finishSession();
    else renderQuiz();
  }

  function answer(ok, chosenId) {
    var id = session.quiz[session.qi];
    var it = itemOf(id);
    var replay = session.replaying === id;
    if (session.qStart && !replay) {
      session.times.push(Date.now() - session.qStart);
    }
    session.qStart = 0;
    if (!replay) countToday(id);

    if (!replay) {
      if (ok) {
        if (!session.missed[id]) session.firstCorrect += 1;
      } else {
        if (chosenId) S.recordConfusion(state, id, chosenId);
        session.missed[id] = true;
        if (!session.requeued[id] && session.quiz.length < 40) {
          session.requeued[id] = true;
          session.quiz.push(id);
        }
      }
      S.review(state, id, ok ? 2 : 0, Date.now());
      state.trackMet[id] = true;
    }
    var wasReplay = replay;
    var answerEl = $("type-input");
    var typed = answerEl ? String(answerEl.value || "").slice(0, 160) : "";
    var chosenText = chosenId && itemOf(chosenId) ? itemOf(chosenId).text : "";
    session.lastAnswer = { text: typed || chosenText || "" };
    session.replaying = null;
    save();
    showAnswer(ok, it, wasReplay);
  }

  /* The question stays on screen; the verdict rises from the bottom with
   * the word, its sentence and the way on. */
  function showAnswer(ok, it, replay) {
    sayItem(it);
    var mic = $("mic-btn");
    if (mic) mic.disabled = true;

    /* The task is answered: the in-card Check is no longer a valid action, and
     * two filled buttons on one card read as a choice that does not exist. */
    $("card").classList.add("is-answered");
    Array.prototype.forEach.call($("stage").querySelectorAll("button, input, select, textarea"), function (el) {
      el.disabled = true;
    });

    feedback(ok ? tr("correct", "Correct") : tr("comesBack", "Comes back"), ok ? "good" : "bad", it);

    var advance = function () { session.qi += 1; renderQuiz(); };
    var snapshot = {
      qi: session.qi,
      id: it && it.id,
      stage: $("stage").innerHTML,
      feedback: $("feedback").innerHTML,
      feedbackClass: $("feedback").className,
      counter: $("counter").textContent,
      bar: $("bar-fill").style.width
    };
    if (!replay) {
      session.history.push(snapshot);
      if (session.history.length > 12) session.history.shift();
    }
    if (ok) {
      /* correct: no confirmation tap. It moves on by itself. */
      $("actions").innerHTML = "";
      /* long enough to read the one-line reason, short enough to keep the loop */
      session.advanceTimer = setTimeout(function () {
        if (!session || session.viewing) return;
        advance();
      }, 900);
    } else {
      $("actions").innerHTML =
        '<button class="btn btn-ghost" id="coach-ask" type="button">' +
          esc(tr("askCoach", "Ask coach")) + "</button>" +
        '<button class="btn btn-primary" id="next">' + esc(tr("continue", "Continue")) + "</button>";
      $("coach-ask").addEventListener("click", function () { explainMistake(it); });
      $("next").addEventListener("click", advance);
    }
  }

  function explainMistake(it) {
    if (!it || !session) return;
    var btn = $("coach-ask");
    var answer = (session.lastAnswer && session.lastAnswer.text) || "";
    if (btn) { btn.disabled = true; btn.textContent = tr("coachThinking", "Writing a short coach note…"); }
    var feedbackBox = $("feedback");
    if (!feedbackBox) return;
    feedbackBox.insertAdjacentHTML("beforeend",
      '<p class="coach-explain" id="coach-explain" role="status">' +
      esc(tr("coachThinking", "Writing a short coach note…")) + "</p>");
    var note = $("coach-explain");
    var meaning = glossFor(it.id) || it.sub || "";
    var fallback = tr("coachExplainFallback", "The correct answer is above. Read it once, then say it aloud.") +
      (meaning ? " · " + meaning : "");
    if (!AITOOLS) {
      if (note) note.textContent = fallback;
      return;
    }
    localModelAsk(
      CE.buildExplainPrompt(ACTIVE, learnerLevel(), uiName(uiLang()), {
        text: it.text, meaning: meaning, sentence: it.sentence || it.sub || ""
      }, answer)
    ).then(function (reply) {
      if (!note || !note.isConnected) return;
      note.textContent = String(reply || "").trim().slice(0, 320) || fallback;
    }).catch(function () {
      if (note && note.isConnected) note.textContent = fallback;
    });
  }

  function showPreviousTask() {
    if (!session || !session.history.length) return;
    /* The snapshot records the task's qi. Pick the latest snapshot at or
     * before the previous task, not "last minus one": replays and repeated
     * back taps used to skip two tasks. */
    var target = Math.max(0, session.qi - 1);
    var snap = null;
    for (var i = session.history.length - 1; i >= 0; i -= 1) {
      if (session.history[i].qi <= target) { snap = session.history[i]; break; }
    }
    if (!snap) return;
    if (session.advanceTimer) clearTimeout(session.advanceTimer);
    session.advanceTimer = 0;
    session.viewing = snap;
    $("card").classList.remove("is-answered");
    $("card").classList.add("is-reviewing");
    $("stage").innerHTML = snap.stage;
    $("feedback").innerHTML = snap.feedback;
    $("feedback").className = snap.feedbackClass;
    $("counter").textContent = snap.counter;
    $("bar-fill").style.width = snap.bar;
    Array.prototype.forEach.call($("stage").querySelectorAll("button, input, select, textarea"), function (el) {
      el.disabled = true;
    });
    /* The restored feedback contains its own "show translation" control. It
     * was cloned as HTML, so it needs a fresh listener after every restore. */
    wireGloss();
    $("actions").innerHTML = '<button class="btn btn-primary" id="return-task" type="button" aria-label="' + esc(tr("returnTask", "Return to current task")) + '">→</button>';
    $("return-task").addEventListener("click", function () {
      session.viewing = null;
      $("card").classList.remove("is-reviewing");
      renderQuiz();
    });
    var back = $("back-btn");
    if (back) {
      back.disabled = false;
      back.setAttribute("aria-label", "Return to current task");
    }
  }

  function returnToTask() {
    if (!session || !session.viewing) return;
    session.viewing = null;
    $("card").classList.remove("is-reviewing");
    renderQuiz();
  }

  function oneMoreIds(missed) {
    var weak = MEM && MEM.weakItems ? MEM.weakItems(state, 4).filter(function (id) {
      return atLevel(id);
    }) : [];
    if (weak.length) return weak;
    return (missed || []).slice().filter(function (id) { return itemOf(id); }).slice(0, 4);
  }

  function finishSession() {
    /* A session of only skipped tasks is not a session: no XP, coins, streak,
     * path progress or history entry. */
    if (!session.unique) {
      session = null;
      show("today");
      toast(tr("skippedAll", "No cards answered; nothing was counted."));
      return;
    }
    state.history = state.history || [];
    state.history.push(session.qi);
    if (state.history.length > 50) state.history = state.history.slice(-50);

    state.sessions += 1;
    state.lastSession = Date.now();
    if (session.customId) {
      (state.customLessons || []).forEach(function (w) {
        if (w.id !== session.customId) return;
        w.last = Date.now();
        w.next = Date.now() + 3 * 24 * 60 * 60 * 1000;
      });
    }
    save();

    var now = Date.now();
    var total = session.unique || 1;
    var xpEarned = Math.max(3, total * 3 + (session.firstCorrect || 0) * 2);
    var oldLevel = Math.floor((state.xp || 0) / 100) + 1;
    state.xp = (state.xp || 0) + xpEarned;
    var newLevel = Math.floor((state.xp || 0) / 100) + 1;
    var levelLine = newLevel > oldLevel
      ? '<p class="level-up">' + esc(tr("levelUp", "Level {n}").replace("{n}", String(newLevel))) + "</p>"
      : "";
    save();
    var seen = Object.keys(session.answered);
    var missed = Object.keys(session.missed);
    var kept = seen.filter(function (id) {
      return !session.missed[id] && !(session.taughtIds && session.taughtIds[id]);
    });
    var coinGain = addCoins(ECON ? ECON.sessionCoins(session.firstCorrect, missed.length === 0) : 0);

    renderSteps("done");
    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);

    var days = bumpStreak();
    save();

    /* This screen gets shown to other people, across a room: one number,
     * then what stuck and what is coming back. Nothing else competes. */
    var noun = tr("cards", "cards");
    var secs = Math.max(1, Math.round((now - session.startedAt) / 1000));
    var took = secs < 120 ? secs + "s" : Math.round(secs / 60) + "m";

    $("card").classList.add("is-summary");
    $("stage").innerHTML =
      '<p class="prompt">' + esc(tr("lessonDone", "Lesson done")) + "</p>" +
      '<p class="sum-big">' + total + "</p>" +
      '<p class="sum-line">' + esc(noun) + " · " + took + "</p>" +
      '<p class="xp-line">+' + xpEarned + " XP · +" + coinGain + " " +
        esc(tr("coins", "coins")) + "</p>" +
      levelLine +
      '<div class="sum-cols">' +
        (kept.length ? sumGroup("kept", tr("remembered", "Remembered") + " · " + kept.length, kept, now) : "") +
        (missed.length ? sumGroup("back", tr("comesBack", "Comes back") + " · " + missed.length, missed, now) : "") +
      "</div>" +
      '<p class="sum-meta">' + session.firstCorrect + "/" + total + " " +
        esc(tr("rightFirst", "right the first time")) + " · " + days + " " +
        esc(tr("dayStreak", "day streak")) + "</p>" +
      '<div class="coach-debrief" id="coach-debrief" hidden>' +
        '<span class="coach-kicker">' + esc(tr("coachDebriefKicker", "Coach note")) + "</span>" +
        '<p id="coach-debrief-text"></p>' +
      "</div>";

    feedback("", "");
    $("stage").insertAdjacentHTML("beforeend",
      '<div class="compose">' +
        '<label class="prompt" for="compose-input">' + esc(tr("composeLabel", "one sentence with today's words")) + "</label>" +
        '<textarea class="type-input" id="compose-input" rows="2" maxlength="160" ' +
          'placeholder="' + esc(tr("composePlaceholder", "write a sentence")) + '"></textarea>' +
        '<div class="compose-actions">' +
          '<button class="btn btn-ghost btn-sm" id="compose-check" type="button">' +
            esc(tr("checkSentence", "Check sentence")) + "</button>" +
          '<button class="btn btn-ghost btn-sm" id="compose-save">' + esc(tr("keepIt", "keep it")) + '</button>' +
        "</div>" +
        '<p class="builder-note" id="compose-feedback" role="status"></p>' +
      "</div>");

    $("compose-check").addEventListener("click", function () {
      var field = $("compose-input");
      var text = field ? String(field.value || "").trim() : "";
      var btn = $("compose-check");
      var note = $("compose-feedback");
      if (!text) {
        if (note) note.textContent = tr("composeEmpty", "Write a sentence first.");
        return;
      }
      if (!AITOOLS || !CE) {
        if (note) note.textContent = tr("sentenceCoachFallback", "No model answered; keep the sentence if it uses today's words.");
        return;
      }
      btn.disabled = true;
      btn.textContent = tr("coachThinking", "Writing a short coach note…");
      if (note) note.textContent = tr("coachThinking", "Writing a short coach note…");
      localModelAsk(
        CE.buildWritingPrompt(ACTIVE, learnerLevel(), uiName(uiLang()), text),
        "Check the sentence now."
      ).then(function (reply) {
        if (note && note.isConnected) {
          note.textContent = String(reply || "").trim().slice(0, 360) ||
            tr("sentenceCoachFallback", "No model answered; keep the sentence if it uses today's words.");
        }
      }).catch(function () {
        if (note && note.isConnected) {
          note.textContent = tr("sentenceCoachFallback", "No model answered; keep the sentence if it uses today's words.");
        }
      }).then(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = tr("checkSentence", "Check sentence");
        }
      });
    });
    $("compose-save").addEventListener("click", function () {
      var field = $("compose-input");
      var text = field ? field.value : "";
      var kept = MEM.addSentence(state.memory, text, Object.keys(session.answered), Date.now());
      if (!kept) { toast(tr("moreWords", "A few more words, in {lang}.").replace("{lang}", uiName(LANG.code))); return; }
      save();
      var form = document.querySelector(".compose");
      if (form) {
        form.innerHTML = '<p class="sentence">' +
          esc(tr("keptSentence", "kept — “{text}”. It comes back as a card tomorrow.")
            .replace("{text}", kept.text)) + "</p>";
      }
      toast(tr("savedMemory", "Saved to your memory."));
    });

    var nextIds = oneMoreIds(missed);
    $("actions").innerHTML =
      '<button class="btn btn-primary" id="again">' + esc(tr("oneMore", "One more")) + "</button>" +
      (missed.length ? '<button class="btn btn-ghost btn-sm" id="review-session" type="button">' +
        esc(tr("review", "Review my mistakes")) + "</button>" : "") +
      '<button class="btn btn-ghost btn-sm" id="back" type="button">' + esc(tr("leave", "done for now")) + "</button>";

    $("back").addEventListener("click", function () { session = null; show("today"); });
    $("again").addEventListener("click", function () {
      if (nextIds.length) startSession({ ids: nextIds, size: nextIds.length, title: tr("oneMore", "One more") });
      else startSession();
    });
    var review = $("review-session");
    if (review) review.addEventListener("click", function () {
      startSession({ ids: missed, size: missed.length });
    });
    renderSessionCoach(kept, missed, total);
  }

  function renderSessionCoach(kept, missed, total) {
    var box = $("coach-debrief");
    var note = $("coach-debrief-text");
    if (!box || !note) return;
    var keptText = (kept || []).map(function (id) { return itemOf(id).text; });
    var missedText = (missed || []).map(function (id) { return itemOf(id).text; });
    var fallback = tr("coachDebriefFallback", "You finished {n} cards. Notice the ones that are coming back.")
      .replace("{n}", String(total || 0));
    box.hidden = false;
    note.textContent = tr("coachThinking", "Writing a short coach note…");
    if (!AITOOLS || !CE) { note.textContent = fallback; return; }
    localModelAsk(CE.buildSessionCoachPrompt(ACTIVE, learnerLevel(), uiName(uiLang()), keptText, missedText),
      "Write the note now.").then(function (reply) {
        if (!note || !note.isConnected) return;
        note.textContent = String(reply || "").trim().slice(0, 320) || fallback;
      }).catch(function () {
        if (note && note.isConnected) note.textContent = fallback;
      });
  }

  /* What stuck is a plain run of words; what comes back says when. */
  function sumGroup(kind, title, ids, now) {
    return '<section class="sum-col ' + kind + '">' +
      "<h3>" + esc(title) + "</h3>" +
      '<ul class="sum-chips">' + ids.map(function (id) {
        var it = itemOf(id);
        var when = kind === "back"
          ? '<span class="row-meta">' + esc(capital(whenFrom(state.cards[id].due - now))) + "</span>"
          : "";
        return "<li>" + textHTML(it) + when + "</li>";
      }).join("") + "</ul></section>";
  }

  function whenFrom(ms) {
    var min = Math.round(ms / 60000);
    if (min < 60) return Math.max(1, min) + "m";
    var h = Math.round(min / 60);
    if (h < 20) return h + "h";
    var d = Math.round(h / 24);
    return d <= 1 ? "24h" : d + "d";
  }

  function whyText(it) {
    if (!it) return "";
    if (it.why) return it.why;
    if (it.kind === "basic") {
      if (it.of) {
        var who = pronounsFor(it.person).join(" / ");
        return [it.text, it.of, who].filter(Boolean).join(" · ");
      }
      return it.text;
    }
    if (it.kind === "term" && it.frame) return it.frame.replace("____", it.text);
    if (it.kind === "word") return [it.sub, it.sentence].filter(Boolean).join(" · ");
    if (it.sub) return it.sub;
    return "";
  }

  /* Say why this card is here: it is one of the pairs you keep mixing. */
  function confusionNote(id) {
    var c = state.confusions || {};
    var best = null, bestN = 0;
    Object.keys(c).forEach(function (k) {
      var ids = String(k).split("|");
      if (ids.indexOf(id) === -1) return;
      if (c[k] < 2 || c[k] <= bestN) return;
      best = ids; bestN = c[k];
    });
    if (!best) return "";
    var other = best[0] === id ? best[1] : best[0];
    var it = itemOf(other);
    if (!it || !it.text) return "";
    return tr("mix", "you mix these up") + ": " + it.text;
  }

  function feedback(msg, kind, it) {
    var f = $("feedback");
    var why = whyText(it);
    var note = it ? confusionNote(it.id) : "";
    var aid = it && !(it.kind === "basic" && !it.of) ? glossHTML(it.id) : "";
    var target = it && it.text ? '<span class="why answer-line"><b>' + esc(it.text) + "</b></span>" : "";
    f.innerHTML = esc(msg) + target +
      (why ? '<span class="why">' + esc(why) + "</span>" : "") +
      (note ? '<span class="why">' + esc(note) + "</span>" : "") +
      aid;
    f.className = "feedback" + (kind ? " " + kind : "");
    wireGloss();
  }

  /* ---------------------------------------------------------------- stats */

  var progressCoachKey = "";
  var progressCoachText = "";

  function renderProgressCoach(stats) {
    var box = $("coach-read");
    var note = $("coach-read-text");
    if (!box || !note) return;
    var fallback = tr("coachProgressFallback",
      "You've met {known} words; {solid} are solid and {due} are due. Next: review the due ones and keep one conversation going.")
      .replace("{known}", String(stats.known || 0))
      .replace("{solid}", String(stats.solid || 0))
      .replace("{due}", String(stats.due || 0));
    var key = [ACTIVE && ACTIVE.code, learnerLevel(), stats.known, stats.solid, stats.due,
      stats.sessions, stats.streak, stats.weakest, stats.confusion].join("|");
    box.hidden = false;
    if (key === progressCoachKey && progressCoachText) {
      note.textContent = progressCoachText;
      return;
    }
    progressCoachKey = key;
    note.textContent = tr("coachThinking", "Writing a short coach note…");
    if (!AITOOLS || !CE) { progressCoachText = fallback; note.textContent = fallback; return; }
    localModelAsk(CE.buildProgressPrompt(ACTIVE, learnerLevel(), uiName(uiLang()), stats,
      PERSONA ? PERSONA.prompt(state.profile) : ""), "Write the read now.").then(function (reply) {
        progressCoachText = String(reply || "").trim().slice(0, 320) || fallback;
        if (note && note.isConnected && $("coach-read-text") === note) note.textContent = progressCoachText;
      }).catch(function () {
        progressCoachText = fallback;
        if (note && note.isConnected && $("coach-read-text") === note) note.textContent = fallback;
      });
  }

  function renderWeek() {
    var box = $("week-strip");
    var totalEl = $("week-total");
    if (!box) return;
    var days = [];
    var total = 0;
    for (var i = 6; i >= 0; i -= 1) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      var key = dayKey(date);
      var count = Number(state.days && state.days[key]) || 0;
      total += count;
      days.push({ date: date, key: key, count: count, today: i === 0 });
    }
    var max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.count; })));
    box.innerHTML = days.map(function (d) {
      var pct = d.count ? Math.max(8, Math.round((d.count / max) * 100)) : 0;
      var label = d.date.toLocaleDateString(uiLocale(), { weekday: "short" });
      var full = d.date.toLocaleDateString(uiLocale(), { day: "numeric", month: "short" });
      return '<div class="week-day' + (d.today ? " is-today" : "") + (d.count ? "" : " is-zero") + '" aria-label="' +
        esc(full + ": " + d.count + " " + tr("cards", "cards")) + '">' +
        '<span class="week-bar" aria-hidden="true"><i style="height:' + pct + '%"></i></span>' +
        '<b>' + d.count + '</b><span class="week-label">' + esc(label) + "</span></div>";
    }).join("");
    if (totalEl) totalEl.textContent = total + " " + tr("cards", "cards");
  }

  function renderStats() {
    var cats = Object.keys(D.categories);
    var rows = cats.map(function (cat) {
      var ids = D.concepts.filter(function (c) { return c.cat === cat; }).map(function (c) { return c.id; });
      var learned = ids.filter(function (id) { return state.cards[id] && state.cards[id].reps > 0; }).length;
      var pct = ids.length ? Math.round((learned / ids.length) * 100) : 0;
      return { cat: cat, learned: learned, total: ids.length, pct: pct };
    }).filter(function (r) { return r.total > 0; });

    var known = allIds.filter(function (id) { return state.cards[id] && state.cards[id].reps > 0; }).length;
    var solid = allIds.filter(function (id) { return state.cards[id] && state.cards[id].interval >= 6; }).length;
    var current = defaultUnit();
    $("progress-summary").textContent = learnerLevel() + " · " +
      (current ? current.title + " · " : "") +
      known + "/" + allIds.length + " " + tr("wordsMet", "words met") + " · " +
      solid + " " + tr("solid", "solid") + " · " +
      currentStreak() + " " + tr("dayStreak", "day streak") + " · " +
      (state.coins || 0) + " " + tr("coins", "coins");

    /* The path is repeated here so a placement that skips lessons is visible
     * on Progress too, not only on Today. */
    var pathRows = trackRows();
    var currentIndex = currentTrackIndex();
    $("progress-path").innerHTML = pathRows.map(function (row, i) {
      var now = i === currentIndex;
      var cls = "progress-step" + (now ? " now" : row.unlocked ? " open" : " locked");
      var meta = now
        ? tr("today", "Today")
        : row.unlocked ? "" : row.remaining + " " + tr("cards", "cards");
      return '<div class="' + cls + '" aria-label="' + esc(row.title + (now ? ", " + tr("today", "Today") : "")) + '">' +
        '<span class="n">' + (i + 1) + "</span>" +
        '<span class="t">' + esc(row.title) + "</span>" +
        (meta ? '<span class="m">' + esc(meta) + "</span>" : "") +
      "</div>";
    }).join("");

    /* The roadmap: one ring per topic, filled to the share of its words met.
     * This replaces the old semantic map; the edges still power distractors,
     * but the screen is about how far the learner has travelled. */
    $("progress-roadmap").innerHTML = rows.map(function (r) {
      return '<div class="topic" style="--pct:' + r.pct + '" aria-label="' +
        esc(catLabel(r.cat) + ": " + r.pct + " percent, " + r.learned + " of " + r.total) + '">' +
        '<span class="topic-ring" aria-hidden="true"><b>' + r.pct + "%</b></span>" +
        '<span class="topic-name">' + esc(catLabel(r.cat)) + "</span>" +
        '<span class="topic-count">' + r.learned + "/" + r.total + "</span>" +
      "</div>";
    }).join("");

    var conf = S.topConfusions(state, 5);
    var box = $("confusions");
    if (!conf.length) {
      box.innerHTML = '<div class="empty">' + esc(tr("noConfusions", "No confusions yet.")) + "</div>";
    } else {
      box.innerHTML = conf.map(function (row) {
        var a = conceptById[row.target], b = conceptById[row.chosen];
        if (!a || !b) return "";
        return '<div class="confusion">' +
          '<span class="w">' + esc(a.word) + "</span>" +
          '<span class="w" style="opacity:.6">' + esc(b.word) + "</span>" +
          '<span class="n">×' + row.count + "</span>" +
        "</div>";
      }).join("");
    }

    var mem = state.memory;
    var prof = MEM.profile(mem);
    $("mem-sentences").textContent = prof.sentences;
    $("mem-acc").textContent = prof.accuracy === null ? "—" : Math.round(prof.accuracy * 100) + "%";
    $("mem-days").textContent = prof.days;

    var recent = mem.sentences.slice(-3).reverse();
    $("mem-list").innerHTML = recent.length
      ? recent.map(function (item) {
          return '<p class="mem-line">“' + esc(item.text) + "” <span>" +
            esc(shortDate(item.created)) + "</span></p>";
        }).join("")
      : '<div class="empty">' + esc(tr("noMemory", "Nothing kept yet.")) + "</div>";


    $("stat-sessions").textContent = state.sessions;
    var vs = state.vocabStats || { sessions: 0, correct: 0 };
    var vstat = $("stat-vocab");
    if (vstat) vstat.textContent = vs.sessions + " · " + vs.correct;
    var daily = $("stat-daily");
    if (daily) daily.textContent = (state.daily && state.daily.cards) || 0;
    $("stat-good").textContent = state.reviews.good;
    $("stat-again").textContent = state.reviews.again;
    var dueNow = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).length;
    var weakest = rows.slice().sort(function (a, b) { return a.pct - b.pct; })[0];
    var confused = S.topConfusions(state, 1)[0];
    renderProgressCoach({
      known: known, total: allIds.length, solid: solid, due: dueNow,
      sessions: state.sessions || 0, streak: currentStreak(),
      weakest: weakest ? catLabel(weakest.cat) : "",
      confusion: confused ? (conceptById[confused.target] || {}).word + " / " + (conceptById[confused.chosen] || {}).word : ""
    });
    renderWeek();
  }

  /* ----------------------------------------------------------------- wire */

  Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
    t.addEventListener("click", function () { show(t.getAttribute("data-view")); });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"), function (b) {
    b.addEventListener("click", function () { show(b.getAttribute("data-goto")); });
  });

  $("start-btn").addEventListener("click", function () {
    startSession({ unit: defaultUnit() });
  });
  $("personal-open").addEventListener("click", function () {
    var details = $("personal-details");
    if (details) details.open = true;
    show("settings");
    setTimeout(function () {
      var field = $("personal-why");
      if (field) {
        try { field.focus({ preventScroll: true }); } catch (err) { field.focus(); }
      }
    }, 0);
  });
  $("wish-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = $("wish-input");
    buildWishLesson(input ? input.value.trim() : "", $("wish-lang") && $("wish-lang").value);
  });
  $("build-start").addEventListener("click", function () { startSession({ custom: true }); });
  $("review-missed").addEventListener("click", reviewMistakes);
  $("place-btn").addEventListener("click", startPlacement);
  $("read-btn").addEventListener("click", startReader);
  $("settings-btn").addEventListener("click", function () { show("settings"); });
  $("conv-btn").addEventListener("click", startConversation);
  $("settings-start").addEventListener("click", function () { startSession(); });
  $("setup-new").addEventListener("click", function () {
    beginProfile("A1");
    show("today");
  });
  $("setup-uilang").addEventListener("change", function () { setUiLang(this.value); });
  $("settings-uilang").addEventListener("change", function () { setUiLang(this.value); });
  $("setup-test").addEventListener("click", function () {
    beginProfile("?");
    startPlacement();
  });
  $("setup-lang").addEventListener("change", function () {
    if (switchLang(this.value)) toast(uiName(ACTIVE.code) + " · " + tr("done", "loaded"));
  });
  $("add-lang-btn").addEventListener("click", function () {
    var sel = $("settings-add-lang");
    if (sel && sel.value) addLanguageFlow(sel.value);
  });
  $("home-conv").addEventListener("click", startConversation);
  $("home-read").addEventListener("click", startReader);
  $("home-vocab").addEventListener("click", startVocab);
  $("home-wordset").addEventListener("click", openWordset);
  $("wordset-back").addEventListener("click", function () {
    state.settings.wordsetDraft = ($("wordset-input") || {}).value || state.settings.wordsetDraft;
    save();
    wordset = null;
    show("today");
  });
  $("wordset-find").addEventListener("click", findWordset);
  $("wordset-lang").addEventListener("change", function () {
    wordset = null;
    clearWordsetPreview();
  });
  $("wordset-input").addEventListener("input", function () {
    state.settings.wordsetDraft = this.value;
    wordset = null;
    clearWordsetPreview();
  });
  $("wordset-input").addEventListener("blur", function () {
    state.settings.wordsetDraft = this.value;
    save();
  });
  $("vocab-back").addEventListener("click", function () { vocab = null; show("today"); renderToday(); });
  $("review-all").addEventListener("click", reviewMistakes);
  $("reset-btn").addEventListener("click", function () {
    askConfirm(
      tr("reset", "Reset progress"),
      tr("resetConfirm", "Clear all progress in every language on this device? This cannot be undone."),
      tr("reset", "Reset progress"),
      function () {
        try { localStorage.removeItem(STORE_KEY); } catch (err) { /* ignore */ }
        window.location.reload();
      }
    );
  });
  $("conv-back").addEventListener("click", function () {
    resetChatClear();
    show("today");
  });
  renderWishLangs();
  renderWishPresets();
  $("chat-clear").addEventListener("click", chatClearClick);
  $("chat-find").addEventListener("click", findLocalModel);
  $("wordset-suggest").addEventListener("click", suggestWordset);
  $("wish-roleplay").addEventListener("click", function () {
    startRoleplay($("wish-input") ? $("wish-input").value : "", $("wish-lang") && $("wish-lang").value);
  });
  $("wish-ai").addEventListener("click", suggestWish);
  $("confirm-cancel").addEventListener("click", closeConfirm);
  $("confirm-ok").addEventListener("click", function () {
    var fn = confirmState && confirmState.onOk;
    closeConfirm();
    if (fn) fn();
  });
  $("confirm-modal").addEventListener("click", function (ev) {
    if (ev.target === this) closeConfirm();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape" || !confirmState) return;
    if (Date.now() - (confirmState.openedAt || 0) < 100) return;
    closeConfirm();
  });
  $("chat-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    sendChatTurn();
  });
  $("chat-listen").addEventListener("click", listenChat);
  $("chat-endpoint").addEventListener("change", function () {
    state.settings.chatEndpoint = cleanEndpoint(this.value);
    this.value = state.settings.chatEndpoint;
    save();
    refreshChatEngine();
  });
  $("chat-model").addEventListener("change", function () {
    state.settings.chatModel = String(this.value || "").trim();
    this.value = state.settings.chatModel;
    save();
    refreshChatEngine();
  });
  $("chat-check").addEventListener("click", refreshChatEngine);
  $("chat-wrap").addEventListener("click", function () {
    if (!chat || !chat.messages.some(function (m) { return m.role === "user"; })) {
      toast(tr("coachFirst", "Say something first, then ask the coach for a check-in."));
      return;
    }
    renderCoach();
  });
  if (SR) $("chat-listen").hidden = false;
  renderVoiceControl();
  renderChatSettings();
  $("settings-back").addEventListener("click", function () { show("today"); });
  $("reader-back").addEventListener("click", function () {
    askConfirm(tr("leaveLesson", "Leave lesson?"), tr("leaveLessonConfirm", "Your progress in this lesson will be lost."), tr("leave", "Leave"), function () {
      reader = null;
      show("today");
    });
  });
  $("alphabet-back").addEventListener("click", function () {
    askConfirm(tr("leaveLesson", "Leave lesson?"), tr("leaveLessonConfirm", "Your progress in this lesson will be lost."), tr("leave", "Leave"), function () {
      alphabet = null;
      show("today");
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-length]"), function (b) {
    b.addEventListener("click", function () {
      state.settings.length = b.getAttribute("data-length");
      save();
      renderSettingsOptions();
      renderToday();
    });
  });

  [["personal-why", "why"], ["personal-interests", "interests"]].forEach(function (pair) {
    var input = $(pair[0]);
    if (!input) return;
    input.addEventListener("input", function () {
      if (!state.profile) return;
      state.profile[pair[1]] = PERSONA ? PERSONA.clean(input.value, PERSONA.LIMITS[pair[1]]) : input.value;
      save();
    });
    input.addEventListener("change", function () {
      if (!state.profile) return;
      state.profile[pair[1]] = PERSONA ? PERSONA.clean(input.value, PERSONA.LIMITS[pair[1]]) : input.value;
      input.value = state.profile[pair[1]];
      save();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-audio]"), function (b) {
    b.addEventListener("click", function () {
      state.settings.audio = b.getAttribute("data-audio");
      save();
      applyAudioSetting();
      renderSettingsOptions();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-speak]"), function (b) {
    b.addEventListener("click", function () {
      state.settings.autoSpeak = b.getAttribute("data-speak");
      save();
      if (state.settings.autoSpeak === "off" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (err) { /* no voice */ }
      }
      renderSettingsOptions();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-ruby]"), function (b) {
    b.addEventListener("click", function () {
      state.settings.ruby = b.getAttribute("data-ruby");
      save();
      renderSettingsOptions();
      redraw();
    });
  });

  function goBackTask() {
    if (!session) return;
    if (session.viewing) {
      returnToTask();
      return;
    }
    if (session.phase === "study" && session.si > 0) {
      session.si -= 1;
      renderStudy();
      return;
    }
    if (session.phase === "quiz" && session.history.length) {
      showPreviousTask();
    }
  }

  function addLanguageFlow(code) {
    if (!code || !LANGS || !LANGS.has(code) || !ACTIVE) return;
    if (ACTIVE.code === code) return;
    state.profile = state.profile || {};
    state.profile.pendingLang = code;
    state.profile.pendingFrom = ACTIVE.code;
    switchLang(code);
    startPlacement();
  }

  function leaveSession() {
    var lvl = state.profile && state.profile.levelByLang && state.profile.levelByLang[ACTIVE.code];
    askConfirm(
      tr("leaveLesson", "Leave lesson?"),
      tr("leaveLessonConfirm", "Your progress in this lesson will be lost."),
      tr("leave", "Leave"),
      function () {
        session = null;
        var pending = state.profile && state.profile.pendingLang;
        var from = state.profile && state.profile.pendingFrom;
        if (pending) {
          state.profile.languages = (state.profile.languages || []).filter(function (x) { return x !== pending; });
          state.profile.pendingLang = null;
          state.profile.pendingFrom = null;
          placement = null;
          if (from && LANGS.has(from)) switchLang(from);
          show("settings");
          return;
        }
        // backing out of the placement returns to the question, not to a lesson
        if ((lvl || (state.profile && state.profile.level)) === "?") {
          placement = null;
          show("setup");
          return;
        }
        show("today");
      }
    );
  }

  $("quit-btn").addEventListener("click", leaveSession);
  $("back-btn").addEventListener("click", goBackTask);
  document.addEventListener("keydown", function (ev) {
    if (currentView !== "session" || !session) return;
    if (ev.key === "Escape") {
      if (confirmState) return;
      leaveSession();
      return;
    }
    if (ev.key === "Enter") {
      /* a focused button already gets its own click from Enter */
      var t = ev.target;
      var choice = t && t.closest && t.closest(".option, .option-word");
      if (!choice && t && t.closest && t.closest("button, [role=button]") && t.id !== "next" && t.id !== "check") return;
      /* Enter checks the chosen answer, then moves on */
      var check = $("check");
      var go = check && !check.disabled ? check : $("next");
      if (go) { ev.preventDefault(); go.click(); }
      return;
    }
    if (["1", "2", "3", "4"].indexOf(ev.key) !== -1) {
      var opts = document.querySelectorAll("#stage .option-word, #stage .option");
      var idx = Number(ev.key) - 1;
      if (opts[idx] && !opts[idx].disabled) { ev.preventDefault(); opts[idx].click(); }
    }
  });

  /* Deep links: #map, #stats and #practice are shareable — useful for sharing,
   * and they let the views be driven without a click. */
  $("audio-chip").addEventListener("click", function () {
    var sample = audioTestItem();
    if (!sample) { toast(tr("noSample", "This pack has no sample to play yet.")); return; }
    sayItem(sample);
    toast(hasBundled()
      ? tr("bundledVoice", "That was the bundled pronunciation.")
      : audioStatus().state === "ok"
        ? tr("synthVoice", "That was the synthesized voice — if you heard nothing, check the system volume.")
        : tr("noVoice", "no usable voice") + " · " + uiName(LANG.code));
  });
  updateAudioChip();

  /* a chosen interface language is not onboarding: setup still asks a level */
  var currentLevel = state.profile && state.profile.levelByLang && state.profile.levelByLang[ACTIVE.code];
  if (!state.profile || !currentLevel || currentLevel === "?") show("setup");
  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (initial === "placement") startPlacement();
  else if (initial === "read") startReader();
  else if (initial === "writing") startScriptLesson();
  else if (initial === "chat" || initial === "conv") startConversation();
  else if (initial === "write") {
    session = newSession("words", [], S.shuffle(allIds, Math.random).slice(0, 6));
    session.forceWrite = true;
    show("session");
    renderQuiz();
  }
  else if (initial === "quiz") startQuizOnly();
  else if (DEMO) startDemo();
  else if (VIEWS.indexOf(initial) !== -1 && initial !== "today") show(initial);
  applyStrings();
  var glossBtn = $("gloss-toggle");
  if (glossBtn) {
    glossBtn.addEventListener("click", function () {
      state.settings.translations = state.settings.translations === "off" ? "on" : "off";
      save();
      renderSettingsOptions();
      redraw();
    });
  }
  renderSettingsOptions();
  applyAudioSetting();

})();
