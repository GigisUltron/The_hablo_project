/* sema — application logic.
 *
 * Plain script, no modules, no build step: open index.html (or serve the folder)
 * and it runs. State lives in localStorage; audio uses the browser's own speech
 * synthesis, recognition uses the browser's own recogniser when it exists.
 *
 * The one rule the whole UI obeys: a learner is never shown a translation.
 */
(function () {
  "use strict";

  var LANGS = window.SemaLangs;
  var S = window.SemaSRS;
  var MEM = window.SemaMemory;
  var UI = window.SEMA_UI;

  /* Chrome in the learner's interface language, not the deck's. */
  function tr(key, fallback) {
    return (UI && UI.t(((state.profile || {}).uiLang) || "en", key)) || fallback || key;
  }

  function applyStrings() {
    if (!UI) return;
    var lang = (state.profile && state.profile.uiLang) || "en";
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      var key = el.getAttribute("data-i18n");
      var text = UI.t(lang, key);
      if (text) el.textContent = text;
    });
  }
  var TRACK = window.SemaTrack;
  var ADAPT = window.SemaAdaptive;
  var CORRECT = window.SemaCorrect;
  var CE = window.SemaChatEngine;
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
    voice = null;
    warnedNoVoice = false;
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
    cross: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
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
  renderLangPickers();
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
    if (!s.memory || !Array.isArray(s.memory.sentences)) s.memory = MEM.empty();

    if (s.profile) {
      s.profile.lang = code;
      s.profile.byLang = s.profile.byLang || {};
      /* Older saves kept one deck at the top level. Adopt it as that pack's
       * archive instead of throwing it away. */
      if (!s.profile.byLang[code]) s.profile.byLang[code] = bucketOf(s);
      else loadBucket(s, s.profile.byLang[code]);
    }

    s.settings = s.settings || {};
    if (typeof s.settings.chatEndpoint !== "string" || !s.settings.chatEndpoint.trim()) {
      s.settings.chatEndpoint = (CE && CE.DEFAULT_ENDPOINT) || "http://localhost:11434";
    }
    if (typeof s.settings.chatModel !== "string") s.settings.chatModel = "";
    s.chat = s.chat && typeof s.chat === "object" && !Array.isArray(s.chat) ? s.chat : {};
    if (!Array.isArray(s.settings.fields) || !s.settings.fields.length) {
      s.settings.fields = Object.keys(D.categories);
    } else {
      s.settings.fields = s.settings.fields.filter(function (f) { return D.categories[f]; });
      if (!s.settings.fields.length) s.settings.fields = Object.keys(D.categories);
    }
    if (!s.settings.size) s.settings.size = 8;
    /* There is one kind of lesson now. Older saves carried a deck mode; drop
     * it so nothing can quietly bring the chooser back. */
    delete s.settings.mode;

    seedDeck(s);
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
  }

  function bucketOf(s) {
    return {
      cards: s.cards || {},
      confusions: s.confusions || {},
      reviews: s.reviews || { good: 0, again: 0 },
      sessions: s.sessions || 0,
      lastSession: s.lastSession || null,
      placement: s.placement || null,
      memory: s.memory || MEM.empty()
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
  }

  function seedDeck(s) {
    var now = Date.now();
    deckIds().forEach(function (id) {
      if (!s.cards[id]) s.cards[id] = S.newCard(id, now);
    });
  }

  function save() {
    if (DEMO) return;
    if (state && state.profile && state.profile.byLang) {
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
    var current = state.profile ? state.profile.lang : (ACTIVE && ACTIVE.code);
    ["setup-lang", "settings-lang"].forEach(function (id) {
      var sel = $(id);
      if (!sel) return;
      sel.innerHTML = list.map(function (p) {
        return '<option value="' + esc(p.code) + '">' + esc(p.name) + "</option>";
      }).join("");
      if (list.some(function (p) { return p.code === current; })) sel.value = current;
    });

    var note = document.querySelector("#view-setup .builder-note");
    if (note) {
      note.textContent = list.length > 1
        ? "Each language keeps its own deck, progress and audio."
        : "More languages need their own deck and audio — Spanish is the only pack so far.";
    }
  }

  function updateSetupCopy() {
    var q = document.querySelector("#view-setup .setup-q");
    if (!q || !ACTIVE) return;
    q.textContent = "Have you studied " + ACTIVE.name + " before?";
  }

  function switchLang(code) {
    if (!code || !LANGS || !LANGS.has(code)) return false;
    if (ACTIVE && ACTIVE.code === code) {
      if (state.profile) state.profile.lang = code;
      return false;
    }

    if (state.profile) state.profile.byLang[state.profile.lang] = bucketOf(state);
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

    seedDeck(state);
    session = null;
    reader = null;
    chat = null;
    placement = null;
    mapBuilt = false;
    save();
    renderLangPickers();
    updateSetupCopy();
    renderToday();
    if (currentView === "map") buildMap();
    if (currentView === "stats") renderStats();
    return true;
  }

  function beginProfile(level) {
    var code = (ACTIVE && ACTIVE.code) || "es";
    var byLang = (state.profile && state.profile.byLang) || {};
    byLang[code] = bucketOf(state);
    state.profile = { level: level, lang: code, byLang: byLang };
    save();
  }

  /* -------------------------------------------------------------- speech */

  var voice = null;
  var hasTTS = "speechSynthesis" in window;

  function langVoices() {
    if (!hasTTS) return [];
    var voices = window.speechSynthesis.getVoices() || [];
    var want = String((LANG && LANG.code) || "").toLowerCase();
    var name = String((LANG && LANG.name) || "").toLowerCase();
    return voices.filter(function (v) {
      var lang = String(v.lang || "").toLowerCase();
      return lang.indexOf(want) === 0 || (name && String(v.name || "").toLowerCase().indexOf(name) !== -1);
    });
  }

  function pickVoice() {
    if (!hasTTS) return;
    var voices = langVoices();
    voice = voices[0] || null;
    updateAudioChip();
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
    if (hasBundled()) return { state: "ok", text: "bundled audio · " + Object.keys(bundled).length + " clips" };
    if (!hasTTS) return { state: "none", text: "no speech support" };
    var all = window.speechSynthesis.getVoices() || [];
    if (!all.length) {
      if (Date.now() - audioCheckedAt < 1500) return { state: "idle", text: "checking audio" };
      return { state: "none", text: "no voice on this device" };
    }
    var voices = langVoices();
    if (voices.length) return { state: "ok", text: voices.length + " " + LANG.name + " voice" + (voices.length > 1 ? "s" : "") };
    return { state: "no-" + LANG.code, text: "no " + LANG.name + " voice" };
  }

  function updateAudioChip() {
    var chip = $("audio-chip");
    if (!chip) return;
    var st = audioStatus();
    chip.textContent = (st.state === "ok" ? "🔊 " : "🔇 ") + st.text;
    chip.classList.toggle("warn", st.state !== "ok");
    chip.title = st.state === "ok"
      ? "Tap to hear a test word"
      : "No usable speech voice here. Everything still works without audio.";
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

  function hasBundled() {
    return !!(bundled && Object.keys(bundled).length);
  }

  /* Prefer the WAV shipped with the app: it works on a machine with no
   * installed voices, which is the common case on Linux. Speech synthesis is
   * the fallback, not the primary path. */
  function sayItem(it, btn) {
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
        return;
      } catch (err) { /* fall through */ }
    }
    speak(it.text, btn);
  }

  var warnedNoVoice = false;

  function speak(text, btn) {
    if (!hasTTS) { toast("This browser has no speech synthesis."); return; }
    var synth = window.speechSynthesis;
    try {
      if (!voice) pickVoice();
      if (!hasBundled() && !langVoices().length && !synth.speaking && !warnedNoVoice && audioStatus().state === "none") {
        warnedNoVoice = true;
        toast("No speech voice on this device — everything else still works.");
      }
      if (synth.paused) synth.resume();

      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = (ACTIVE && ACTIVE.locale) || LANG.locale;
      u.rate = 0.9;
      u.pitch = 1;
      if (voice) u.voice = voice;

      var face = $("chat-face");
      var stopFace = function () { if (face) face.classList.remove("is-speaking"); };
      if (btn) btn.classList.add("is-playing");
      u.onend = function () {
        if (btn) btn.classList.remove("is-playing");
        stopFace();
      };
      u.onerror = function () {
        if (btn) btn.classList.remove("is-playing");
        stopFace();
      };

      var busy = synth.speaking || synth.pending;
      if (busy) synth.cancel();
      var go = function () {
        try {
          if (face) face.classList.add("is-speaking");
          synth.speak(u);
        } catch (err) { stopFace(); }
      };
      clearTimeout(speakTimer);
      /* queuing inside the same tick as cancel() loses the utterance in Firefox */
      if (busy) speakTimer = setTimeout(go, 90);
      else go();
    } catch (err) { /* ignore */ }
  }

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var listening = false;

  function listen(expectedWord, onScore) {
    if (!SR) {
      toast("This browser has no speech recognition — use “I said it” to self-check.");
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
          var sc = S.similarity(alt.transcript, expectedWord);
          if (sc > best) { best = sc; said = alt.transcript; }
        }
      }
      onScore(best, said);
    };
    rec.onerror = function (ev) {
      listening = false;
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        toast("Microphone permission was refused.");
      } else if (ev.error !== "no-speech") {
        toast("Couldn't hear that — try again.");
      }
    };
    rec.onend = function () { listening = false; };
    try { rec.start(); } catch (err) { listening = false; return false; }
    return true;
  }

  /* ---------------------------------------------------------------- views */

  var VIEWS = ["today", "session", "reader", "conv", "setup", "settings", "map", "stats"];
  var currentView = "today";
  var mapBuilt = false;

  function show(view) {
    applyStrings();
    currentView = view;
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
    if (view === "settings") renderChatSettings();
    if (view === "stats") renderStats();
    if (view === "map" && !mapBuilt) { buildMap(); mapBuilt = true; }
    if (view === "map") {
      refreshMapState();
      renderMapList();
      /* the web pans on a phone; it opens on the middle, where the clusters meet */
      setMapMode($("view-map").getAttribute("data-mode") || "list");
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------------------------------------------------------- today */

  /* --------------------------------------------------------------- builder */

  function renderBuilder() {
    var box = $("fields");
    if (!box) return;

    var fields = selectedFields();
    box.innerHTML = Object.keys(D.categories).map(function (cat) {
      var n = D.concepts.filter(function (c) { return c.cat === cat; }).length;
      var on = fields.indexOf(cat) !== -1;
      return '<button type="button" class="field' + (on ? " is-on" : "") + '" data-cat="' + cat + '"' +
        ' aria-pressed="' + on + '">' + esc(D.categories[cat].label) +
        ' <b>' + n + "</b></button>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll(".field"), function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-cat");
        var current = selectedFields().slice();
        var i = current.indexOf(cat);
        if (i === -1) current.push(cat);
        else current.splice(i, 1);
        if (!current.length) { toast("Pick at least one field."); return; }
        state.settings.fields = current;
        save();
        renderBuilder();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll(".size"), function (b) {
      var on = Number(b.getAttribute("data-size")) === lessonSize();
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });

    /* one kind of lesson: every session draws from the whole deck */
    var due = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id].last !== null;
    }).length;

    var note = $("builder-note");
    if (note) {
      var goalNow = ADAPT ? ADAPT.dailyGoal((state.history || [])) : lessonSize();
      note.textContent = goalNow + " today · " + deckIds().length + " cards · " + due + " due";
    }
  }

  function renderToday() {
    renderBuilder();
    renderTrack();

    var due = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).length;
    var known = allIds.filter(function (id) { return state.cards[id].reps > 0; }).length;
    var mastered = allIds.filter(function (id) { return state.cards[id].interval >= 6; }).length;

    $("stat-due").textContent = due;
    $("stat-learned").textContent = known;
    $("stat-total").textContent = allIds.length;
    $("stat-streak").textContent = currentStreak();
    $("stat-mastered").textContent = mastered;
    $("known-bar").style.width = Math.round((known / Math.max(allIds.length, 1)) * 100) + "%";
    $("today-date").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

    var next = renderNextStack();
    $("lesson-name").textContent = next.title;
    $("start-sub").textContent = next.caption || "Nothing new or due. Practise anything.";
    renderReviewList();
  }

  /* What the schedule brings back next, soonest first. */
  function renderReviewList() {
    var box = $("review-list");
    var now = Date.now();
    var ids = allIds.concat(phraseIds).filter(function (id) {
      return state.cards[id] && state.cards[id].last !== null;
    }).sort(function (a, b) {
      return state.cards[a].due - state.cards[b].due;
    }).slice(0, 4);

    if (!ids.length) {
      box.innerHTML = '<p class="list-empty">Words you learn come back here when they are due.</p>';
      return;
    }
    box.innerHTML = ids.map(function (id) {
      var it = itemOf(id);
      var due = state.cards[id].due;
      return '<div class="row">' +
        '<span class="row-pic" aria-hidden="true">' +
          (it.schema && typeof schemaSVG === "function" ? schemaSVG(it.schema) : (it.emoji || "")) +
        "</span>" +
        '<span class="row-body">' +
          '<span class="row-main">' + articleHTML(it.article) + esc(it.text) + "</span>" +
          '<span class="row-meta">' + (due <= now ? "Now" : capital(whenFrom(due - now))) + "</span>" +
        "</span></div>";
    }).join("");
  }

  function capital(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* -------------------------------------------------------------- reader */

  var reader = null;

  function startReader() {
    var texts = (window.SEMA_TEXTS && window.SEMA_TEXTS.texts) || [];
    if (!texts.length) { toast("No texts yet."); return; }
    reader = { text: texts[0], qi: 0, correct: 0 };
    show("reader");
    renderReaderText();
  }

  function renderReaderText() {
    var t = reader.text;
    $("reader-count").textContent = "level " + t.level;
    $("reader-bar").style.width = "8%";
    $("reader-feedback").textContent = "";
    $("reader-stage").innerHTML =
      '<p class="prompt">Reading</p>' +
      '<h3 class="reader-title">' + esc(t.title) + "</h3>" +
      '<p class="reader-body">' + esc(t.body) + "</p>";
    $("reader-actions").innerHTML = '<button class="btn btn-primary" id="reader-go">Questions</button>';
    $("reader-go").addEventListener("click", renderReaderQuestion);
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
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        Array.prototype.forEach.call($("reader-stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (Number(b.getAttribute("data-i")) === q.answer) b.classList.add("pick-correct");
        });
        var why = !ok && q.why && q.why[picked];
        $("reader-feedback").textContent = ok
          ? "correct"
          : (why ? why + " — " + q.options[q.answer] : "the answer was: " + q.options[q.answer]);
        $("reader-feedback").className = "feedback " + (ok ? "good" : "bad");
        reader.qi += 1;
        $("reader-actions").innerHTML = '<button class="btn btn-primary" id="reader-next">Continue</button>';
        $("reader-next").addEventListener("click", function () {
          $("reader-feedback").className = "feedback";
          renderReaderQuestion();
        });
      });
    });
  }

  function finishReader() {
    var total = reader.text.questions.length;
    $("reader-bar").style.width = "100%";
    $("reader-stage").innerHTML =
      '<p class="prompt">Text finished</p>' +
      '<div class="word">' + reader.correct + "/" + total + "</div>" +
      '<p class="sentence">' + esc(reader.text.title) + " · level " + reader.text.level + "</p>";
    $("reader-feedback").textContent = "";
    $("reader-actions").innerHTML = '<button class="btn btn-primary" id="reader-done">Back to today</button>';
    $("reader-done").addEventListener("click", function () { reader = null; show("today"); });
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
  var pendingImage = null;

  function chatState() {
    if (!ACTIVE) return { messages: [], scripted: null };
    var code = ACTIVE.code;
    var c = state.chat[code];
    if (!c || typeof c !== "object" || Array.isArray(c)) c = state.chat[code] = { messages: [] };
    if (!Array.isArray(c.messages)) c.messages = [];
    return c;
  }

  function chatEndpoint() {
    var v = state.settings && state.settings.chatEndpoint;
    return String(v || (CE && CE.DEFAULT_ENDPOINT) || "http://localhost:11434").trim() ||
      "http://localhost:11434";
  }

  function cleanEndpoint(value) {
    var v = String(value || "").trim();
    if (!v) return (CE && CE.DEFAULT_ENDPOINT) || "http://localhost:11434";
    if (!/^https?:\/\//i.test(v)) v = "http://" + v;
    return v.replace(/\/+$/, "");
  }

  function chatStatusLine() {
    if (chatMeta.status === "ready" && chatMeta.model) {
      var what = CE && CE.isLocalEndpoint(chatEndpoint()) ? "local model" : "model";
      return ["ready", what + " · " + chatMeta.model +
        (chatMeta.vision ? " · sees images" : " · text only")];
    }
    if (chatMeta.status === "checking") return ["checking", "looking for a local model…"];
    if (chatMeta.status === "failed") return ["missing", "the model did not answer — scripted practice"];
    if (chatMeta.status === "missing") {
      if (CE && !CE.isLocalEndpoint(chatEndpoint())) {
        return ["missing", "no model answered — check the endpoint"];
      }
      return ["missing", "no local model found — run ollama serve"];
    }
    return ["idle", "not checked yet"];
  }

  function setChatStatus() {
    var line = chatStatusLine();
    var el = $("chat-status");
    if (el) {
      el.textContent = line[1];
      el.setAttribute("data-state", line[0]);
    }
    var settingsEl = $("chat-settings-status");
    if (settingsEl) settingsEl.textContent = line[1];
  }

  function renderChatSettings() {
    var ep = $("chat-endpoint");
    if (ep) ep.value = chatEndpoint();
    var model = $("chat-model");
    if (model) model.value = (state.settings && state.settings.chatModel) || "";
    setChatStatus();
  }

  function refreshChatEngine() {
    if (!CE) {
      chatMeta = { status: "missing", engine: null, model: null, vision: false };
      setChatStatus();
      return;
    }

    var token = ++chatCheck;
    chatMeta = { status: "checking", engine: null, model: null, vision: false };
    setChatStatus();
    var endpoint = chatEndpoint();

    CE.discover(endpoint, undefined, 2500).then(function (found) {
      if (token !== chatCheck) return;
      if (!found || !found.engine) {
        chatMeta = { status: "missing", engine: null, model: null, vision: false };
        setChatStatus();
        seedScriptedIfEmpty();
        return;
      }

      var chosen = String((state.settings && state.settings.chatModel) || "").trim();
      if (!chosen) chosen = (found.models[0] && found.models[0].name) || "";
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
    var name = (ACTIVE && ACTIVE.name) || "the language";
    return "Say something in " + name + ". Or attach a picture.";
  }

  function renderChatHeader() {
    if (ACTIVE) {
      var nm = $("chat-name");
      if (nm) nm.textContent = ACTIVE.name + " conversation";
      var input = $("chat-input");
      if (input) {
        input.placeholder = "say something in " + ACTIVE.name;
        input.setAttribute("aria-label", "your message in " + ACTIVE.name);
      }
    }
    setChatStatus();
  }

  function renderChat() {
    if (!chat) return;
    var log = $("chat");
    if (!log) return;

    if (!chat.messages.length) {
      log.innerHTML = '<p class="chat-empty">' + esc(emptyChatLine()) + "</p>";
    } else {
      log.innerHTML = chat.messages.map(function (m, i) {
        return CE && CE.messageHTML
          ? CE.messageHTML(m, esc, { canSpeak: hasTTS, index: i })
          : '<p class="bubble-text">' + esc(m.text) + "</p>";
      }).join("");
    }

    Array.prototype.forEach.call(log.querySelectorAll("[data-hear]"), function (btn) {
      btn.addEventListener("click", function () {
        var m = chat.messages[Number(btn.getAttribute("data-hear"))];
        if (m && m.text) speak(m.text, btn);
      });
    });
    log.scrollTop = log.scrollHeight;
  }

  function seedScriptedIfEmpty() {
    if (!chat || chat.messages.length || !CE || !ACTIVE) return;
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
      role: "assistant",
      text: clean,
      scripted: !!scripted,
      note: note || "",
      at: Date.now()
    });
    trimChat();
    save();
    renderChat();
    if (hasTTS && !quiet) speak(clean);
  }

  function addUser(text, image) {
    if (!chat) return;
    var msg = {
      role: "user",
      text: String(text == null ? "" : text).trim(),
      image: image || null,
      note: "",
      at: Date.now()
    };
    if (image && !(chatMeta.status === "ready" && chatMeta.vision)) {
      msg.note = chatMeta.status === "ready"
        ? "text-only model · image not sent"
        : "no model · image not sent";
    }
    chat.messages.push(msg);
    trimChat();
    save();
    renderChat();
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
      send.textContent = busy ? "Sending…" : "Send";
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

  function fallbackReply(userText, note) {
    if (!CE || !chat || !ACTIVE) return;
    var session = chat.scripted || CE.scriptedStart(ACTIVE.code);
    var res = CE.scriptedRespond(ACTIVE.code, session, userText);
    chat.scripted = session;

    var reply = [res.reply, res.next].filter(Boolean).join(" ").trim();
    if (!reply && res.done) reply = ACTIVE.code === "fr" ? "À bientôt !" : "¡Hasta pronto!";
    if (!reply) {
      setChatFeedback("the scripted partner has nothing more to say.", "");
      return;
    }

    addAssistant(reply, true, "scripted");
    if (note) setChatFeedback(note, "");
    save();
  }

  function sendChatTurn() {
    if (chatPending || !chat || !ACTIVE) return;
    var input = $("chat-input");
    var text = input ? input.value.trim() : "";
    var image = pendingImage ? pendingImage.dataUrl : null;
    if (!text && !image) return;

    addUser(text, image);
    rememberChatLine(text);
    pendingImage = null;
    renderAttachment();
    if (input) input.value = "";

    if (chatMeta.status !== "ready" || !CE) {
      fallbackReply(text, "");
      return;
    }

    var target = chat;
    var code = ACTIVE.code;
    setChatBusy(true);
    CE.sendChat({
      baseUrl: chatEndpoint(),
      engine: chatMeta.engine,
      model: chatMeta.model,
      system: CE.buildSystemPrompt(ACTIVE, state.profile && state.profile.level),
      history: chat.messages.slice(-CE.MAX_HISTORY),
      vision: chatMeta.vision,
      timeoutMs: 45000
    }).then(function (res) {
      if (chat !== target || !ACTIVE || ACTIVE.code !== code) return;
      setChatBusy(false);
      if (res && res.ok && res.text) {
        addAssistant(res.text, false, "");
        return;
      }
      chatMeta = { status: "failed", engine: null, model: null, vision: false };
      setChatStatus();
      fallbackReply(text, "the model did not answer — using scripted practice");
    }).catch(function () {
      if (chat !== target || !ACTIVE || ACTIVE.code !== code) return;
      setChatBusy(false);
      chatMeta = { status: "failed", engine: null, model: null, vision: false };
      setChatStatus();
      fallbackReply(text, "the model did not answer — using scripted practice");
    });
  }

  function startConversation() {
    if (!CE) { toast("The chat engine did not load."); return; }
    chat = chatState();
    show("conv");
    renderChatHeader();
    renderChat();
    renderAttachment();
    setChatBusy(false);
    refreshChatEngine();
  }

  function renderAttachment() {
    var box = $("chat-attachment");
    if (!box) return;
    box.innerHTML = pendingImage && CE ? CE.attachmentHTML(pendingImage, esc) : "";
    var clear = box.querySelector("[data-attach-clear]");
    if (clear) {
      clear.addEventListener("click", function () {
        pendingImage = null;
        renderAttachment();
        var file = $("chat-image");
        if (file) file.value = "";
      });
    }
  }

  function downscaleImage(dataUrl, done) {
    var img = new Image();
    img.onload = function () {
      try {
        var max = 1024;
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        if (!w || !h || (w <= max && h <= max)) { done(dataUrl); return; }

        var scale = Math.min(max / w, max / h);
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        var ctx = canvas.getContext("2d");
        if (!ctx) { done(dataUrl); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL("image/jpeg", 0.82));
      } catch (err) {
        done(dataUrl);
      }
    };
    img.onerror = function () { toast("That image could not be read."); };
    img.src = dataUrl;
  }

  function chatImageChange() {
    var input = $("chat-image");
    var file = input && input.files && input.files[0];
    if (!file) return;
    if (file.type && !/^image\//i.test(file.type)) {
      toast("Choose an image file.");
      input.value = "";
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast("That image is too large. Keep it under 12 MB.");
      input.value = "";
      return;
    }
    if (typeof FileReader === "undefined") {
      toast("This browser cannot read images.");
      return;
    }

    var reader = new FileReader();
    reader.onerror = function () { toast("That image could not be read."); };
    reader.onload = function () {
      var dataUrl = String(reader.result || "");
      if (!/^data:image\//i.test(dataUrl)) {
        toast("That file is not an image.");
        return;
      }
      downscaleImage(dataUrl, function (small) {
        pendingImage = { dataUrl: small, at: Date.now() };
        renderAttachment();
      });
    };
    reader.readAsDataURL(file);
  }

  function listenChat() {
    if (!SR) return;
    if (chatListening && chatRec) {
      try { chatRec.stop(); } catch (err) { /* already stopped */ }
      return;
    }

    var rec;
    try { rec = new SR(); } catch (err) {
      toast("This browser has no speech recognition.");
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
        input.value = (input.value ? input.value.replace(/\s+$/, "") + " " : "") + said;
        input.focus();
      }
    };
    rec.onerror = function (ev) {
      if (ev && (ev.error === "not-allowed" || ev.error === "service-not-allowed")) {
        toast("Microphone permission was refused.");
      } else if (ev && ev.error !== "no-speech") {
        toast("Couldn't hear that — try again.");
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

  /* Eight questions, mixed decks, hardest last. The result is a floor on the
   * track: a false beginner should not be made to click through "casa". */
  function startPlacement() {
    var queue = S.shuffle(allIds, Math.random).slice(0, 4)
      .concat(S.shuffle(phraseIds, Math.random).slice(0, 2))
      .concat(S.shuffle(termIds, Math.random).slice(0, 2));

    placement = { queue: queue, i: 0, correct: 0 };
    show("session");
    renderPlaceItem();
  }

  function placementFloor() {
    return (state.placement && state.placement.floor) || 0;
  }

  function renderPlaceItem() {
    if (!placement) return;
    if (placement.i >= placement.queue.length) { finishPlacement(); return; }

    clearCard();
    var id = placement.queue[placement.i];
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("counter").textContent = (placement.i + 1) + "/" + placement.queue.length;
    $("bar-fill").style.width = Math.round((placement.i / placement.queue.length) * 100) + "%";

    $("stage").innerHTML =
      '<p class="prompt">How much do you know?</p>' +
      tileHTML(it) +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-id") === id;
        if (ok) placement.correct += 1;
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        markChoices(".option-word", id);
        placement.i += 1;
        setTimeout(renderPlaceItem, ok ? 220 : 700);
      });
    });
  }

  function finishPlacement() {
    var total = placement.queue.length;
    var ratio = placement.correct / total;
    var floor = Math.min(TRACK.units.length - 1, Math.floor(ratio * TRACK.units.length));
    state.placement = { floor: floor, score: placement.correct, total: total, at: Date.now() };
    if (state.profile) {
      state.profile.level = floor >= 3 ? "B1" : floor >= 1 ? "A2" : "A1";
    }
    placement = null;
    save();

    show("today");
    toast(floor > 0
      ? "Starting at " + TRACK.units[floor].title + " — " + placement.correct + "/" + total + " right."
      : "Starting from the beginning.");
    renderToday();
  }

  /* ---------------------------------------------------------------- track */

  /* Where the learner is on the path: real progress, raised by the placement
   * floor. The floor never caps progress; it only opens a door. */
  function currentTrackIndex() {
    var solid = allIds.filter(function (id) { return state.cards[id].interval >= 6; }).length;
    var rows = TRACK ? TRACK.map(solid) : [];
    var bySolid = 0;
    rows.forEach(function (r) { if (r.current) bySolid = r.index; });
    return Math.max(bySolid, placementFloor());
  }

  function renderTrack() {
    var box = $("track");
    if (!box || !TRACK) return;

    var solid = allIds.filter(function (id) { return state.cards[id].interval >= 6; }).length;
    var rows = TRACK.map(solid);
    var currentIndex = currentTrackIndex();
    var floor = placementFloor();

    rows.forEach(function (r) {
      r.unlocked = r.unlocked || r.index <= floor;
      r.current = r.index === currentIndex;
    });

    box.innerHTML = rows.map(function (u) {
      var cls = "step" + (u.unlocked ? "" : " locked") + (u.current ? " now" : "");
      return '<button class="' + cls + '" type="button" data-unit="' + esc(u.id) + '"' +
        (u.unlocked ? "" : " disabled") + ">" +
        '<span class="step-n">' + (u.unlocked ? u.index + 1 : "·") + "</span>" +
        '<span class="step-t">' + esc(u.title) + "</span>" +
      "</button>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll(".step"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-unit");
        var unit = TRACK.units.filter(function (u) { return u.id === id; })[0];
        if (unit) startSession({ unit: unit });
      });
    });
  }

  /* --------------------------------------------------------------- streak */

  function dayKey(d) {
    var x = d || new Date();
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
  /* The English meaning, on request. Hidden by default in settings, and never
   * on the answer state, where the Spanish is already visible. */
  function glossHTML(id) {
    if ((state.settings && state.settings.translations) === "off") return "";
    var g = (window.SEMA_GLOSSES || {})[id];
    if (!g) return "";
    return '<button class="gloss-btn" type="button" data-gloss="' +
      String(g).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;") + '">' +
      tr("glossShow", "show translation") + "</button>";
  }

  /* Why the card means what it means: the frame for a connector, the person for
   * a verb, the sentence for a word. Shown on request, same quiet weight. */
  function explainHTML(it) {
    var bits = [];
    if (it.kind === "basic") {
      bits.push(it.of ? ("verb " + it.of + ", " + (it.person || "") ) : "pronoun");
      if (it.sub) bits.push(it.sub);
    } else if (it.kind === "term") {
      if (it.frame) bits.push(it.frame.replace("____", it.text));
      var twin = it.contrast && termById[it.contrast];
      if (twin) bits.push("opposite: " + twin.text);
    } else if (it.sub) {
      bits.push(it.sub);
    }
    if (!bits.length) return "";
    return '<button class="explain-btn" type="button" data-why="' + esc(bits.join(" · ")) + '">' +
      tr("explain", "why?") + "</button>";
  }

  function wireExplain() {
    Array.prototype.forEach.call(document.querySelectorAll(".explain-btn"), function (btn) {
      btn.addEventListener("click", function () {
        var on = btn.getAttribute("data-on") === "1";
        btn.setAttribute("data-on", on ? "0" : "1");
        btn.textContent = on ? tr("explain", "why?") : btn.getAttribute("data-why");
      });
    });
  }

  function wireGloss() {
    Array.prototype.forEach.call(document.querySelectorAll(".gloss-btn"), function (btn) {
      btn.addEventListener("click", function () {
        var on = btn.getAttribute("data-on") === "1";
        btn.setAttribute("data-on", on ? "0" : "1");
        btn.textContent = on ? tr("glossShow", "show translation") : esc(btn.getAttribute("data-gloss"));
      });
    });
  }

  function itemOf(id) {
    var b = basicById[id];
    if (b) {
      return {
        id: b.id, emoji: "", article: "", text: b.text, sub: b.gloss,
        kind: "basic", person: b.person, of: b.of
      };
    }
    var t = termById[id];
    if (t) {
      return {
        id: t.id, emoji: "", schema: t.schema, article: "", text: t.text,
        sub: t.frame, frame: t.frame, contrast: t.contrast, kind: "term"
      };
    }
    var p = phraseById[id];
    if (p) {
      return { id: p.id, emoji: p.emoji, article: "", text: p.text, sub: p.sub || "", kind: "phrase" };
    }
    var c = conceptById[id];
    if (!c) return { id: id, emoji: "❓", article: "", text: id, sub: "", kind: "word" };
    return { id: c.id, emoji: c.emoji, article: c.article, text: c.word, sub: c.sentence, kind: "word" };
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

  function wordsHTML(it) {
    var art = articleHTML(it.article);
    var long = it.text.length > 16 ? " long" : "";
    var kind = it.kind === "phrase" ? " phrase" : "";
    return '<div class="word' + long + kind + '">' + art + esc(it.text) + "</div>";
  }

  /* The picture takes the free height of the screen; its sound button sits
   * in the corner, where a thumb finds it without covering the picture. */
  function figureHTML(it, label) {
    return '<div class="figure">' +
      '<div class="tile" aria-hidden="true">' + it.emoji + "</div>" +
      '<button class="speak-btn round" id="hear-btn" aria-label="' + label + '" title="' + label + '">' +
        ICON.speaker + "</button></div>";
  }


  function contextHTML(it) {
    if (it.kind === "term") {
      var filled = String(it.frame || "").replace("____", "<b>" + esc(it.text) + "</b>");
      var twin = it.contrast && termById[it.contrast];
      return '<p class="sentence">' + filled + "</p>" +
        (twin ? '<p class="term-contrast">↔ ' + esc(twin.text) + "</p>" : "");
    }
    if (!it.sub) return "";
    if (it.kind === "phrase") return '<p class="sentence">' + esc(it.sub) + "</p>";
    var txt = esc(it.sub);
    var w = esc(it.text);
    return '<p class="sentence">' + txt.replace(new RegExp("\\b(" + w + ")\\b", "i"), "<b>$1</b>") + "</p>";
  }

  /* -------------------------------------------------------------- session */

  var session = null;

  function selectedFields() {
    var f = state.settings && state.settings.fields;
    if (!f || !f.length) return Object.keys(D.categories);
    return f;
  }

  function lessonSize() {
    return (state.settings && state.settings.size) || 8;
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

  function atLevel(id) {
    return ADAPT.within(itemLevel(id), (state.profile && state.profile.level) || "A2");
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
    var solid = allIds.filter(function (id) { return state.cards[id].interval >= 6; }).length;
    var unit = o.custom ? null : (o.unit || (TRACK ? TRACK.currentUnit(solid) : null));
    /* the path's reading unit is opened on purpose, from the path: it must not
     * take over the one Continue button and stall the vocabulary */
    if (unit && unit.mode === "read" && !o.unit) unit = null;
    var plan = ADAPT ? ADAPT.plan(solid) : { fresh: 4, review: 4, production: 0, size: 8, level: 1 };
    var hist = (state.history || []).map(function (h) { return typeof h === "number" ? h : h && h.size; });
    var goal = ADAPT ? ADAPT.nextGoal(ADAPT.dailyGoal(hist), hist.slice(-3)) : 8;
    var size = o.size || (o.custom ? lessonSize() : Math.min(plan.size + 2, goal));
    var fields = unit && unit.fields ? unit.fields : selectedFields();
    var now = Date.now();

    /* the reading unit is a lesson too, and it has a screen of its own */
    if (unit && unit.mode === "read") {
      return { unit: unit, plan: plan, size: 0, queue: [], fresh: [], due: [], read: true };
    }

    var scopeWords = fields.length
      ? allIds.filter(function (id) { return inFields(id, fields); })
      : allIds.slice();

    var ordered = {
      phrases: seedFirst(meetOrder(phraseIds.filter(atLevel), now)),
      grammar: seedFirst(meetOrder(basicIds.filter(atLevel), now)),
      words: seedFirst(meetOrder(scopeWords.filter(atLevel), now)),
      terms: seedFirst(meetOrder(termIds.filter(atLevel), now))
    };
    var openers = ADAPT.OPENERS.filter(function (id) { return ordered.phrases.indexOf(id) !== -1; });
    var queue = ADAPT.sessionMix(ordered, size, openers);
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
    var caption = p.read
      ? "one text, three questions"
      : [p.fresh.length ? p.fresh.length + " new" : "",
         p.due.length ? p.due.length + " to review" : ""].filter(Boolean).join(", ");
    if (box) {
      box.innerHTML = p.read ? "" : p.queue.slice(0, 5).map(function (id) {
        return '<span class="pic">' + itemOf(id).emoji + "</span>";
      }).join("");
    }
    return { title: title, caption: caption };
  }

  /* Named after the field its new words come from, the way a course names a unit. */
  function lessonTitle(p) {
    if (!p.fresh.length) return p.due.length ? "Review" : "Practice";
    var kinds = p.fresh.map(function (id) { return itemOf(id).kind; });
    var phrases = kinds.filter(function (k) { return k === "phrase"; }).length;
    if (phrases * 2 > kinds.length) return "Phrases";
    var cats = p.fresh.map(function (id) { return conceptById[id] && conceptById[id].cat; }).filter(Boolean);
    var same = cats.length && cats.every(function (c) { return c === cats[0]; });
    return same && D.categories[cats[0]] ? D.categories[cats[0]].label : "New words";
  }

  function startSession(opts) {
    var o = opts || {};
    var now = Date.now();
    var p = lessonPlan(o);

    /* the reading unit opens the reader; it is a lesson, not a dead end */
    if (p.read) { startReader(); return; }

    var queue = p.queue.slice();

    /* persistent memory, used: the pairs you keep trading come back first, but
     * never before the phrases that open every lesson */
    var lead = 0;
    while (lead < queue.length && itemOf(queue[lead]).kind === "phrase") lead += 1;
    var weak = MEM.weakItems(state, 6).filter(function (id) {
      return queue.indexOf(id) === -1 && state.cards[id];
    }).slice(0, 2);
    if (weak.length) queue = queue.slice(0, lead).concat(weak, queue.slice(lead));

    if (!queue.length) {
      queue = S.shuffle(deckIds(), Math.random).slice(0, p.size || lessonSize());
      toast("Nothing due here — free practice.");
    }

    /* one card per item: the study step is gone, so a new item is taught by
     * being asked, and the answer is shown the moment it is missed. */
    session = newSession("mixed", [], queue);
    session.plan = p.plan;

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
    var hint = $("kbd-hint");
    hint.classList.add("is-demo");
    hint.innerHTML = 'demo · miss one, it comes back<span class="keys"> · 1–4 → choose · Enter → check</span>';
    renderStudy();
    toast("Demo — starts clean; saved progress is untouched.", 3200);
  }

  /* ---- the personal card: your sentence from a previous day ------------ */

  function shortDate(ts) {
    try {
      return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (err) { return "earlier"; }
  }

  function renderPersonal() {
    clearCard();
    setProgress();
    renderSteps("warm");

    var p = session.personal;
    $("stage").innerHTML =
      '<p class="prompt">Your own sentence · ' + esc(shortDate(p.sentence.created)) + "</p>" +
      '<p class="personal-line">' + esc(p.cloze.blanked) + "</p>" +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="the missing word" placeholder="the missing word" />' +
      '<button class="btn btn-primary" id="check">Check</button>';

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
    var score = S.similarity(value, p.cloze.answer);
    var ok = score >= 0.7;

    MEM.markReviewed(state.memory, p.sentence.id, Date.now());
    MEM.recordAttempt(state.memory, ok, 0);
    save();

    var answer = esc(p.cloze.answer);
    var full = esc(p.sentence.text).replace(
      new RegExp("\\b" + answer + "\\b", "i"), "<b>$&</b>"
    );

    $("stage").innerHTML =
      '<p class="prompt">' + (ok ? "Correct" : tr("notQuite", "Not quite")) + "</p>" +
      '<p class="personal-line">' + full + "</p>" +
      '<p class="sentence">your own words, from ' + esc(shortDate(p.sentence.created)) + "</p>";

    feedback(ok ? "that was yours" : "the word was “" + p.cloze.answer + "”", ok ? "good" : "bad");

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">Continue</button>';
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
    var ids = MEM.weakItems(state, 12);

    if (!ids.length) {
      ids = S.topConfusions(state, 12).map(function (r) { return r.target; });
    }
    if (!ids.length) {
      toast("Nothing to review yet — do a lesson first.");
      return;
    }

    var mode = "mixed";
    session = newSession(mode, [], S.shuffle(ids, Math.random).slice(0, 10));
    show("session");
    renderQuiz();
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
      firstCorrect: 0,
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
    $("counter").textContent = Math.min(done + 1, n) + " of " + n;
    $("bar-fill").style.width = Math.round((done / n) * 100) + "%";
  }

  /* The process, made visible: a lesson is four named steps, not one long
   * undifferentiated deck. You always know where you are and what is left. */
  function renderSteps(active) {
    var box = $("steps");
    if (!box || !session) return;
    var steps = [];
    if (session.hasPersonal) steps.push(["warm", "Warm up"]);
    steps.push(["learn", "Learn"], ["quiz", "Quiz"], ["done", "Done"]);

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
    $("card").classList.remove("is-summary", "is-answered");
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

    $("stage").innerHTML =
      '<p class="prompt">Learn the pair · ' + (session.si + 1) + " of " + session.study.length +
        (it.kind === "phrase" ? " · phrase" : "") + "</p>" +
      figureHTML(it, "Hear it") +
      wordsHTML(it) +
      contextHTML(it);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">' +
      (last ? "Start the quiz" : "Next") + "</button>";
    $("next").addEventListener("click", function () {
      session.si += 1;
      if (session.si < session.study.length) renderStudy();
      else { session.phase = "quiz"; renderQuiz(); }
    });
  }

  /* ---- phase 2: hide one half, ask for the other ------------------------ */

  function quizType(card, i) {
    if (session.types) return session.types[i] || "pick-picture";
    if (session.forceWrite) return "write";
    if (card.last === null) return "pick-word";
    var prod = (session.plan && session.plan.production) || 0;
    if (prod >= 2 && i % 2 === 1) return "write";
    if (prod >= 1 && i % 3 === 2) return "write";   // production without a microphone
    if (SR && i % 2 === 1) return "say";
    return "pick-picture";
  }

  function renderQuiz() {
    if (session.qi >= session.quiz.length) { finishSession(); return; }
    /* end on a high: a learner who is getting everything right should stop
     * while it still feels good, not grind to the eighth card. */
    if (ADAPT.shouldStop(session.unique, session.firstCorrect)) {
      session.quiz.length = session.qi;   // so the bar reads finished, not cut off
      finishSession();
      return;
    }
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

    if (itemOf(id).kind === "basic") { renderPerson(id); return; }
    if (itemOf(id).kind === "term") { renderPickFrame(id); return; }

    var type = quizType(card, session.qi);
    if (type === "pick-word") renderPickWord(id);
    else if (type === "write") renderWrite(id);
    else if (type === "say") renderSay(id);
    else renderPickPicture(id);
  }

  /* The number on each option is also its key: 1–4 answer from the keyboard. */
  function optionHTML(id, i) {
    var it = itemOf(id);
    /* phrases share one size, so four options never look like four fonts */
    var long = it.kind === "phrase" ? " phrase" : it.text.length > 16 ? " long" : "";
    return '<button class="option-word' + long + '" data-id="' + esc(id) + '">' +
      '<span class="key" aria-hidden="true">' + (i + 1) + "</span>" +
      '<span class="opt-text">' + articleHTML(it.article) + esc(it.text) + "</span></button>";
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
    $("stage").innerHTML =
      '<p class="prompt">New</p>' +
      figureHTML(it, "Hear it") +
      wordsHTML(it) +
      contextHTML(it);
    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    var tile = $("stage").querySelector(".tile");
    if (tile) {
      tile.style.cursor = "pointer";
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", "Play the audio");
      tile.addEventListener("click", function () { sayItem(it); });
    }
    $("actions").innerHTML = glossHTML(id) +
      '<button class="btn btn-primary" id="gotit">' + tr("gotit", "Got it") + '</button>';
    wireGloss();
    wireExplain();
    $("gotit").addEventListener("click", function () {
      session.firstCorrect += 1;   // it was taught and acknowledged, not guessed
      S.review(state, id, 2, Date.now());
      save();
      session.qi += 1;
      renderQuiz();
    });
  }

  /* The first question that tests a rule, not a word. */
  /* Some persons have two valid pronouns: "es" is either él or ella. Both must
   be offered and both accepted, or the question punishes a coin flip. */
  var PRONOUN = { "1s": ["yo"], "2s": ["tú"], "3s": ["él", "ella"], "1p": ["nosotros"], "3p": ["ellos"] };

  function renderPerson(id) {
    var it = itemOf(id);
    var accepted = PRONOUN[it.person] || ["yo"];
    var others = Object.keys(PRONOUN).reduce(function (acc, k) {
      if (k === it.person) return acc;
      return acc.concat(PRONOUN[k]);
    }, []).slice(0, 2);
    var set = S.shuffle(accepted.concat(others), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">¿Quién?</p>' +
      '<div class="word">' + esc(it.text) + "</div>" +
      '<p class="sentence">' + esc(it.sub || "") + "</p>" +
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
  }

  function renderPickFrame(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(S.pickDistractors(id, termIds, [], 3, Math.random)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Which one fits?</p>' +
      '<p class="term-blank">' + esc(it.frame) + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";

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
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">' + tr("whichOne", "Which one is this?") + "</p>" +
      figureHTML(it, "Hear it") +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    chooseThenCheck(".option-word", id);
  }

  /* A tap only selects; Check commits. A slip of the finger is not a wrong
   * answer, and the learner gets a beat to reconsider. */
  function chooseThenCheck(cls, id) {
    var picked = null;
    var opts = $("stage").querySelectorAll(cls);
    $("actions").innerHTML = '<button class="btn btn-primary" id="check" disabled>Check</button>';

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
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Find the picture</p>' +
      '<div class="say-line">' +
        '<button class="speak-btn round" id="hear-btn" aria-label="Hear it" title="Hear it">' + ICON.speaker + "</button>" +
        wordsHTML(it) +
      "</div>" +
      '<div class="options">' + set.map(function (o, i) {
        return '<button class="option" data-id="' + esc(o) + '" aria-label="Picture ' + (i + 1) + '">' +
          '<span aria-hidden="true">' + itemOf(o).emoji + "</span></button>";
      }).join("") + "</div>";

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    chooseThenCheck(".option", id);
  }

  /* Write it: the only exercise that tests production without a microphone.
   * Fuzzy on purpose - "cafe" for "café" is not a spelling lesson, it is a
   * recall success. */
  function renderWrite(id) {
    var it = itemOf(id);

    $("stage").innerHTML =
      '<p class="prompt">Write it in ' + esc(LANG.name) + "</p>" +
      tileHTML(it) +
      '<input class="type-input" id="type-input" type="text" autocomplete="off" ' +
        'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'aria-label="write the word" placeholder="type it" />' +
      '<button class="btn btn-primary" id="write-check">Check</button>';
    var input = $("type-input");
    if (input) {
      input.focus();
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); submitWrite(id, it); }
      });
    }
    $("write-check").addEventListener("click", function () { submitWrite(id, it); });
  }

  function submitWrite(id, it) {
    var input = $("type-input");
    var typed = input ? input.value : "";
    var score = S.similarity(typed, it.text);
    var kind = CORRECT ? CORRECT.classify(typed, it.text) : "spelling";

    if (score >= 0.8) { answer(true, null); return; }

    /* A tutor says what was wrong, not just that it was. */
    toast(CORRECT ? CORRECT.message(kind, it.text) : "not quite");
    answer(false, null);
  }

  function renderSay(id) {
    var it = itemOf(id);

    $("stage").innerHTML =
      '<p class="prompt">Say it in ' + esc(LANG.name) + "</p>" +
      figureHTML(it, "Hear it") +
      (SR ? '<button class="mic" id="mic-btn">' + ICON.mic + 'Say it aloud</button>' : "") +
      '<p class="score" id="score"></p>';

    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

    var mic = $("mic-btn");
    if (mic) mic.addEventListener("click", function () {
      var btn = this;
      var started = listen(it.text, function (score, said) {
        var el = $("score");
        if (el) el.textContent = "heard “" + said + "” · match " + Math.round(score * 100) + "%";
        answer(score > 0.6, null);
      });
      if (started) {
        btn.classList.add("is-live");
        btn.innerHTML = ICON.mic + "Listening…";
        var reset = setInterval(function () {
          if (!listening) {
            clearInterval(reset);
            btn.classList.remove("is-live");
            btn.innerHTML = ICON.mic + "Say it aloud";
          }
        }, 400);
      }
    });

    /* without a recogniser the learner says it aloud and checks themselves */
    $("actions").innerHTML = (SR ? "" : '<button class="btn btn-primary" id="said">I said it</button>') +
      '<button class="btn btn-ghost" id="reveal">Show the answer</button>';
    if (!SR) $("said").addEventListener("click", function () { answer(true, null); });
    $("reveal").addEventListener("click", function () { answer(false, null); });
  }

  function answer(ok, chosenId) {
    var id = session.quiz[session.qi];
    var it = itemOf(id);
    if (session.qStart) {
      session.times.push(Date.now() - session.qStart);
      session.qStart = 0;
    }

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
    save();
    showAnswer(ok, it);
  }

  /* The question stays on screen; the verdict rises from the bottom with
   * the word, its sentence and the way on. */
  function showAnswer(ok, it) {
    sayItem(it);
    var mic = $("mic-btn");
    if (mic) mic.disabled = true;

    feedback(ok ? "got it" : "it comes back at the end", ok ? "good" : "bad", it);

    var advance = function () { session.qi += 1; renderQuiz(); };
    if (ok) {
      /* correct: no confirmation tap. It moves on by itself. */
      $("actions").innerHTML = "";
      setTimeout(advance, 650);
    } else {
      $("actions").innerHTML = '<button class="btn btn-primary" id="next">Continue →</button>';
      $("next").addEventListener("click", advance);
    }
  }

  function finishSession() {
    state.history = state.history || [];
    state.history.push(session.qi);
    if (state.history.length > 50) state.history = state.history.slice(-50);

    state.sessions += 1;
    state.lastSession = Date.now();
    save();

    var now = Date.now();
    var total = session.unique || 1;
    var seen = Object.keys(session.answered);
    var missed = Object.keys(session.missed);
    var kept = seen.filter(function (id) { return !session.missed[id]; });

    renderSteps("done");
    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);

    var days = bumpStreak();
    save();

    /* This screen gets shown to other people, across a room: one number,
     * then what stuck and what is coming back. Nothing else competes. */
    var noun = session.mode === "words" ? "word" : "card";
    var secs = Math.max(1, Math.round((now - session.startedAt) / 1000));
    var took = secs < 120 ? secs + " second" + (secs === 1 ? "" : "s") : Math.round(secs / 60) + " minutes";

    $("card").classList.add("is-summary");
    $("stage").innerHTML =
      '<p class="prompt">Lesson done</p>' +
      '<p class="sum-big">' + total + "</p>" +
      '<p class="sum-line">' + noun + (total === 1 ? "" : "s") + " in " + took + "</p>" +
      '<div class="sum-cols">' +
        (kept.length ? sumGroup("kept", "Remembered · " + kept.length, kept, now) : "") +
        (missed.length ? sumGroup("back", "Comes back · " + missed.length, missed, now) : "") +
      "</div>" +
      '<p class="sum-meta">' + session.firstCorrect + " of " + total + " right the first time · " +
        days + "-day streak</p>";

    feedback("", "");
    $("stage").insertAdjacentHTML("beforeend",
      '<div class="compose">' +
        '<label class="prompt" for="compose-input">one sentence with today\'s words</label>' +
        '<textarea class="type-input" id="compose-input" rows="2" maxlength="160" ' +
          'placeholder="escribe una frase"></textarea>' +
        '<button class="btn btn-ghost btn-sm" id="compose-save">keep it</button>' +
      "</div>");

    $("compose-save").addEventListener("click", function () {
      var field = $("compose-input");
      var text = field ? field.value : "";
      var kept = MEM.addSentence(state.memory, text, Object.keys(session.answered), Date.now());
      if (!kept) { toast("A few more words, in Spanish."); return; }
      save();
      var form = document.querySelector(".compose");
      if (form) {
        form.innerHTML = '<p class="sentence">kept — “' + esc(kept.text) +
          '”. It comes back as a card tomorrow.</p>';
      }
      toast("Saved to your memory.");
    });

    $("actions").innerHTML =
      '<button class="btn btn-primary" id="again">One more</button>' +
      '<button class="foot-link" id="back" type="button">done for now</button>';

    $("back").addEventListener("click", function () { session = null; show("today"); });
    $("again").addEventListener("click", function () { startSession(); });
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
        return '<li><span aria-hidden="true">' + it.emoji + "</span> " + esc(it.text) + when + "</li>";
      }).join("") + "</ul></section>";
  }

  function whenFrom(ms) {
    var min = Math.round(ms / 60000);
    if (min < 60) return "in " + Math.max(1, min) + " min";
    var h = Math.round(min / 60);
    if (h < 20) return "in " + h + " h";
    var d = Math.round(h / 24);
    return d <= 1 ? "tomorrow" : "in " + d + " days";
  }

  function whyText(it) {
    if (!it) return "";
    if (it.kind === "basic") {
      if (it.of) {
        var who = { "1s": "yo", "2s": "tú", "3s": "él o ella", "1p": "nosotros", "3p": "ellos" }[it.person] || "";
        return it.text + " is " + it.of + " for " + who + " — " + (it.sub || "");
      }
      return it.text + " names who the verb is about.";
    }
    if (it.kind === "term" && it.frame) return it.frame.replace("____", it.text);
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
    f.innerHTML = esc(msg) +
      (why ? '<span class="why">' + esc(why) + "</span>" : "") +
      (note ? '<span class="why">' + esc(note) + "</span>" : "");
    f.className = "feedback" + (kind ? " " + kind : "");
  }

  /* ------------------------------------------------------------------ map */

  var positions = {};

  function layout() {
    var cats = Object.keys(D.categories);
    var cx = 450, cy = 345, rx = 332, ry = 226;
    var byCat = {};
    cats.forEach(function (c) { byCat[c] = []; });
    D.concepts.forEach(function (c) {
      (byCat[c.cat] || (byCat[c.cat] = [])).push(c.id);
    });

    cats.forEach(function (cat, ci) {
      var angle = (ci / cats.length) * Math.PI * 2 - Math.PI / 2;
      var gx = cx + Math.cos(angle) * rx;
      var gy = cy + Math.sin(angle) * ry;
      var ids = byCat[cat] || [];
      var spread = ids.length > 1 ? 40 + ids.length * 7 : 0;

      ids.forEach(function (id, i) {
        var a = (i / Math.max(ids.length, 1)) * Math.PI * 2 - Math.PI / 2;
        var r = ids.length > 1 ? spread : 0;
        positions[id] = {
          x: gx + Math.cos(a) * r,
          y: gy + Math.sin(a) * r,
          cat: cat,
          cx: gx,
          cy: gy
        };
      });
    });

    separate(Object.keys(positions), 54);
  }

  /* Neighbouring clusters on the ellipse can land a node exactly on top of
   * another (mar under perro, amor under correr). A few rounds of pairwise
   * pushing keep every node visible without redesigning the layout. */
  function separate(ids, minGap) {
    for (var round = 0; round < 80; round += 1) {
      var moved = false;
      for (var i = 0; i < ids.length; i += 1) {
        for (var j = i + 1; j < ids.length; j += 1) {
          var a = positions[ids[i]], b = positions[ids[j]];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d >= minGap) continue;
          if (d < 0.01) { dx = 1; dy = 0; d = 1; }
          var push = (minGap - d) / 2;
          a.x -= (dx / d) * push; a.y -= (dy / d) * push;
          b.x += (dx / d) * push; b.y += (dy / d) * push;
          moved = true;
        }
      }
      ids.forEach(function (id) {
        var p = positions[id];
        p.x = Math.max(40, Math.min(860, p.x));
        p.y = Math.max(30, Math.min(650, p.y));
      });
      if (!moved) break;
    }
  }

  function buildMap() {
    layout();
    var edgeLayer = $("map-edges");
    var nodeLayer = $("map-nodes");
    edgeLayer.innerHTML = "";
    nodeLayer.innerHTML = "";

    var svgNS = "http://www.w3.org/2000/svg";

    D.edges.forEach(function (e) {
      var p1 = positions[e.a], p2 = positions[e.b];
      if (!p1 || !p2) return;
      var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      var cxp = mx - dy * 0.12, cyp = my + dx * 0.12;
      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", "M" + p1.x + "," + p1.y + " Q" + cxp + "," + cyp + " " + p2.x + "," + p2.y);
      path.setAttribute("class", "edge" + (e.type === "opposite" ? " strong" : ""));
      path.setAttribute("data-a", e.a);
      path.setAttribute("data-b", e.b);
      edgeLayer.appendChild(path);
    });

    D.concepts.forEach(function (c) {
      var p = positions[c.id];
      if (!p) return;
      var g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "node");
      g.setAttribute("data-id", c.id);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", c.word);

      var halo = document.createElementNS(svgNS, "circle");
      halo.setAttribute("class", "halo");
      halo.setAttribute("cx", p.x);
      halo.setAttribute("cy", p.y);
      halo.setAttribute("r", 21);
      g.appendChild(halo);

      var glyph = document.createElementNS(svgNS, "text");
      glyph.setAttribute("class", "glyph");
      glyph.setAttribute("x", p.x);
      glyph.setAttribute("y", p.y);
      glyph.textContent = c.emoji;
      g.appendChild(glyph);

      // Labels are pushed away from the centre of the drawing, not from the
      // cluster: that always aims them at the empty margin instead of at the
      // neighbouring nodes inside the same cluster.
      var dx = p.x - 450;
      var dy = p.y - 345;
      var len = Math.sqrt(dx * dx + dy * dy);
      var ox = len > 12 ? (dx / len) * 32 : 0;
      var oy = len > 12 ? (dy / len) * 32 : 34;

      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("class", "node-word");
      label.setAttribute("x", p.x + ox);
      label.setAttribute("y", p.y + oy + 3);
      label.setAttribute("text-anchor", "middle");
      label.textContent = c.word;
      g.appendChild(label);

      g.addEventListener("click", function () { selectNode(c.id); });
      g.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selectNode(c.id); }
      });
      nodeLayer.appendChild(g);
    });

    var legend = $("map-legend");
    legend.innerHTML = Object.keys(D.relationTypes).map(function (k) {
      return '<span class="' + (k === "opposite" ? "purple" : "") + '"><i></i>' +
        esc(D.relationTypes[k].label) + "</span>";
    }).join("");
  }

  function refreshMapState() {
    Array.prototype.forEach.call(document.querySelectorAll("#map-nodes .node"), function (g) {
      var id = g.getAttribute("data-id");
      var card = state.cards[id];
      var learned = card && card.reps > 0;
      g.classList.toggle("learned", !!learned);
      var halo = g.querySelector(".halo");
      var hue = (D.categories[conceptById[id].cat] || {}).hue || "#d93a1c";
      if (learned) {
        halo.setAttribute("fill", hue);
        halo.setAttribute("fill-opacity", "0.78");
      } else {
        halo.removeAttribute("fill");
        halo.removeAttribute("fill-opacity");
      }
    });
  }

  /* On a phone the web is too wide to read, so the same graph also comes as
   * a list: each field, its words, and what each word sits next to. */
  function renderMapList() {
    var box = $("map-list");
    box.innerHTML = Object.keys(D.categories).map(function (cat) {
      var words = D.concepts.filter(function (c) { return c.cat === cat; });
      if (!words.length) return "";
      var known = words.filter(function (c) { return state.cards[c.id].reps > 0; }).length;
      return '<section class="group">' +
        '<h3 class="group-title">' + esc(D.categories[cat].label) + " · " + known + " of " + words.length + "</h3>" +
        '<div class="list">' + words.map(function (c) {
          var near = neighboursOf(c.id).slice(0, 3).map(function (n) { return esc(conceptById[n].word); }).join(", ");
          return '<button class="row" type="button" data-id="' + esc(c.id) + '">' +
            '<span class="row-pic" aria-hidden="true">' + c.emoji + "</span>" +
            '<span class="row-body">' +
              '<span class="row-main">' + articleHTML(c.article) + esc(c.word) + "</span>" +
              '<span class="row-meta">' + near + "</span>" +
            "</span></button>";
        }).join("") + "</div></section>";
    }).join("");

    Array.prototype.forEach.call(box.querySelectorAll(".row"), function (btn) {
      btn.addEventListener("click", function () { sayItem(itemOf(btn.getAttribute("data-id"))); });
    });
  }

  function setMapMode(mode) {
    $("view-map").setAttribute("data-mode", mode);
    Array.prototype.forEach.call(document.querySelectorAll("[data-mapmode]"), function (b) {
      var on = b.getAttribute("data-mapmode") === mode;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (mode === "web") {
      var panel = document.querySelector(".map-panel");
      if (panel) panel.scrollLeft = (panel.scrollWidth - panel.clientWidth) / 2;
    }
  }

  function selectNode(id) {
    var c = conceptById[id];
    sayItem(itemOf(c.id));
    var info = $("map-info");
    var links = (neighbours[id] || []).slice(0, 4).map(function (n) {
      var rel = D.relationTypes[n.type] ? D.relationTypes[n.type].label : "related to";
      return "<b>" + esc(conceptById[n.id].word) + "</b> (" + esc(rel) + ")";
    }).join(" · ");

    info.innerHTML =
      '<div class="tile" aria-hidden="true">' + c.emoji + "</div>" +
      '<div class="info-body">' +
        '<div class="info-word">' + (c.article ? esc(c.article) + " " : "") + esc(c.word) + "</div>" +
        '<div class="info-links">' + (links || "no links yet") + "</div>" +
        '<div class="hint">' + contextHTML(itemOf(c.id)) + "</div>" +
      "</div>" +
      '<button class="speak-btn" id="info-hear">' + ICON.speaker + 'Again</button>';

    var hear = $("info-hear");
    if (hear) hear.addEventListener("click", function () { speak(c.sentence, this); });
  }

  /* ---------------------------------------------------------------- stats */

  function renderStats() {
    var bars = $("cat-bars");
    var cats = Object.keys(D.categories);
    var rows = cats.map(function (cat) {
      var ids = D.concepts.filter(function (c) { return c.cat === cat; }).map(function (c) { return c.id; });
      var learned = ids.filter(function (id) { return state.cards[id].reps > 0; }).length;
      var pct = ids.length ? Math.round((learned / ids.length) * 100) : 0;
      return { cat: cat, learned: learned, total: ids.length, pct: pct };
    }).filter(function (r) { return r.total > 0; });

    bars.innerHTML = rows.map(function (r) {
      var hue = D.categories[r.cat].hue;
      return '<div class="bar-row">' +
        '<span class="label">' + esc(D.categories[r.cat].label) + "</span>" +
        '<span class="track" style="background:' + hue + '33"><span class="fill" style="width:' + r.pct + "%;background:" + hue + '"></span></span>' +
        '<span class="n">' + r.learned + "/" + r.total + "</span>" +
      "</div>";
    }).join("");

    var conf = S.topConfusions(state, 5);
    var box = $("confusions");
    if (!conf.length) {
      box.innerHTML = '<div class="empty">No confusions recorded yet.<br />They appear here when you pick a neighbouring concept instead of the right one.</div>';
    } else {
      box.innerHTML = conf.map(function (row) {
        var a = conceptById[row.target], b = conceptById[row.chosen];
        if (!a || !b) return "";
        return '<div class="confusion">' +
          '<span class="e">' + a.emoji + "</span>" +
          '<span class="w">' + esc(a.word) + "</span>" +
          '<span class="e" style="opacity:.6">' + b.emoji + "</span>" +
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
      : '<div class="empty">Nothing kept yet. Finish a lesson and write one sentence with the words you just met.</div>';


    $("stat-sessions").textContent = state.sessions;
    $("stat-good").textContent = state.reviews.good;
    $("stat-again").textContent = state.reviews.again;
  }

  /* ----------------------------------------------------------------- wire */

  Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
    t.addEventListener("click", function () { show(t.getAttribute("data-view")); });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"), function (b) {
    b.addEventListener("click", function () { show(b.getAttribute("data-goto")); });
  });

  $("start-btn").addEventListener("click", function () {
    var at = currentTrackIndex();
    var unit = TRACK.units[Math.min(TRACK.units.length - 1, at)];
    /* Continue is always a drill; reading is a node you choose on the path */
    startSession(unit && unit.mode === "read" ? {} : { unit: unit });
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
  $("setup-uilang").addEventListener("change", function () {
    state.profile = state.profile || {};
    state.profile.uiLang = this.value;
    save();
    applyStrings();
  });
  $("setup-test").addEventListener("click", function () {
    beginProfile("?");
    startPlacement();
  });
  $("setup-lang").addEventListener("change", function () {
    if (switchLang(this.value)) toast(ACTIVE.name + " deck loaded. Progress stays with each language.");
  });
  $("settings-lang").addEventListener("change", function () {
    if (switchLang(this.value)) toast(ACTIVE.name + " deck loaded. Progress stays with each language.");
  });
  $("home-conv").addEventListener("click", startConversation);
  $("reset-btn").addEventListener("click", function () {
    if (!window.confirm("Clear all progress in every language on this device?")) return;
    try { localStorage.removeItem(STORE_KEY); } catch (err) { /* ignore */ }
    window.location.reload();
  });
  $("conv-back").addEventListener("click", function () {
    pendingImage = null;
    renderAttachment();
    show("today");
  });
  $("chat-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    sendChatTurn();
  });
  $("chat-attach").addEventListener("click", function () {
    var file = $("chat-image");
    if (file) file.click();
  });
  $("chat-image").addEventListener("change", chatImageChange);
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
  if (SR) $("chat-listen").hidden = false;
  if (typeof FileReader === "undefined") $("chat-attach").hidden = true;
  renderChatSettings();
  $("settings-back").addEventListener("click", function () { show("today"); });
  $("reader-back").addEventListener("click", function () { reader = null; show("today"); });

  Array.prototype.forEach.call(document.querySelectorAll(".size"), function (b) {
    b.addEventListener("click", function () {
      state.settings.size = Number(b.getAttribute("data-size"));
      save();
      renderToday();
    });
  });
  $("quit-btn").addEventListener("click", function () {
    session = null;
    // backing out of the placement returns to the question, not to a lesson
    if (state.profile && state.profile.level === "?") { show("setup"); return; }
    show("today");
  });
  $("map-practice").addEventListener("click", function () { startSession(); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-mapmode]"), function (b) {
    b.addEventListener("click", function () { setMapMode(b.getAttribute("data-mapmode")); });
  });

  document.addEventListener("keydown", function (ev) {
    if (currentView !== "session" || !session) return;
    if (ev.key === "Escape") { session = null; show("today"); return; }
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
    sayItem(itemOf("noche"));
    toast(audioStatus().state === "ok"
      ? "That was the synthesized voice — if you heard nothing, check the system volume."
      : "No " + LANG.name + " voice on this device; everything still works without audio.");
  });
  updateAudioChip();

  if (!state.profile) show("setup");
  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (initial === "placement") startPlacement();
  else if (initial === "read") startReader();
  else if (initial === "chat") startConversation();
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
      state.settings = state.settings || {};
      state.settings.translations = state.settings.translations === "off" ? "on" : "off";
      save();
      glossBtn.textContent = state.settings.translations === "off"
        ? tr("translationsOff", "translations off")
        : tr("translationsOn", "translations on");
    });
  }

})();
