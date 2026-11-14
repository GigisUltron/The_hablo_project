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

  var D = window.SEMA_DATA;
  var S = window.SemaSRS;
  var STORE_KEY = "sema.v1";
  var LANG = D.language;

  var conceptById = {};
  var allIds = [];
  var neighbours = {};   // id -> [id]   (ordered by relation weight)
  var weights = {};      // "a|b" -> type

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

  /* phrase deck: same shape as a concept once itemOf() normalises it */
  var P = window.SEMA_PHRASES || { phrases: [] };
  var phraseById = {};
  var phraseIds = [];
  P.phrases.forEach(function (p) {
    phraseById[p.id] = p;
    phraseIds.push(p.id);
  });

  /* Scenes: a phrase lesson is one short exchange from one situation, in the
   * order it happens, instead of a shuffled deck. The grouping lives here
   * until the phrase file carries a scene field of its own. */
  var SCENES = [
    { emoji: "☕", title: "En el café", lines: ["ph-cafe", "ph-agua", "ph-rico", "ph-cuenta"] },
    { emoji: "👋", title: "Saludar", lines: ["ph-dias", "ph-hola", "ph-gusto", "ph-adios"] },
    { emoji: "🚉", title: "En la estación", lines: ["ph-estacion", "ph-hora", "ph-tarda", "ph-precio"] },
    { emoji: "🔁", title: "Si no entiendes", lines: ["ph-perdon", "ph-repetir", "ph-despacio"] }
  ].map(function (s) {
    s.lines = s.lines.filter(function (id) { return phraseById[id]; });
    return s;
  }).filter(function (s) { return s.lines.length >= 2; });

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
    mic: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>'
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

  var state = DEMO ? S.newState(allIds.concat(phraseIds), Date.now()) : load();
  /* a fresh browser has no saved settings; every screen reads them */
  if (!state.settings) {
    state.settings = { fields: Object.keys(D.categories), size: 8, mode: "words" };
  }

  function load() {
    var base = S.newState(allIds.concat(phraseIds), Date.now());
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return base;
      saved.cards = saved.cards || {};
      saved.confusions = saved.confusions || {};
      saved.reviews = saved.reviews || { good: 0, again: 0 };
      saved.settings = saved.settings || {};
      if (!Array.isArray(saved.settings.fields) || !saved.settings.fields.length) {
        saved.settings.fields = Object.keys(D.categories);
      }
      if (!saved.settings.size) saved.settings.size = 8;
      if (saved.settings.mode !== "phrases") saved.settings.mode = "words";
      allIds.concat(phraseIds).forEach(function (id) {
        if (!saved.cards[id]) saved.cards[id] = S.newCard(id, Date.now());
      });
      return saved;
    } catch (err) {
      return base;
    }
  }

  function save() {
    if (DEMO) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  /* -------------------------------------------------------------- speech */

  var voice = null;
  var hasTTS = "speechSynthesis" in window;

  function esVoices() {
    if (!hasTTS) return [];
    var voices = window.speechSynthesis.getVoices() || [];
    return voices.filter(function (v) {
      var lang = String(v.lang || "").toLowerCase();
      return lang.indexOf(LANG.code) === 0 || /spanish|español|espanol/i.test(v.name || "");
    });
  }

  function pickVoice() {
    if (!hasTTS) return;
    var voices = esVoices();
    voice = voices[0] || null;
    updateAudioChip();
  setTimeout(updateAudioChip, 1600);
  setTimeout(updateAudioChip, 4000);
  }

  /* Audio is a bonus, not a dependency: if the device has no Spanish voice the
   * whole app still works, and it says so instead of failing silently. */
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
    var es = esVoices();
    if (es.length) return { state: "ok", text: es.length + " Spanish voice" + (es.length > 1 ? "s" : "") };
    return { state: "no-es", text: "no Spanish voice" };
  }

  function updateAudioChip() {
    var chip = $("audio-chip");
    if (!chip) return;
    var st = audioStatus();
    chip.textContent = (st.state === "ok" ? "🔊 " : "🔇 ") + st.text;
    chip.classList.toggle("warn", st.state !== "ok");
    chip.title = st.state === "ok"
      ? "Tap to hear a test word"
      : "No usable speech voice here. The demo is fully usable without audio.";
  }

  if (hasTTS) {
    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
    try { window.speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (err) { /* older engines */ }
  }

  var bundled = window.SEMA_AUDIO || null;
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
      if (!hasBundled() && !esVoices().length && !synth.speaking && !warnedNoVoice && audioStatus().state === "none") {
        warnedNoVoice = true;
        toast("No speech voice on this device — everything else still works.");
      }
      if (synth.paused) synth.resume();

      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = LANG.locale;
      u.rate = 0.9;
      u.pitch = 1;
      if (voice) u.voice = voice;

      if (btn) {
        btn.classList.add("is-playing");
        u.onend = function () { btn.classList.remove("is-playing"); };
        u.onerror = function () { btn.classList.remove("is-playing"); };
      }

      var busy = synth.speaking || synth.pending;
      if (busy) synth.cancel();
      var go = function () {
        try { synth.speak(u); } catch (err) { /* engine refused */ }
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

  var VIEWS = ["today", "session", "map", "stats"];
  var currentView = "today";
  var mapBuilt = false;

  function show(view) {
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
    if (view === "today") renderToday();
    if (view === "stats") renderStats();
    if (view === "map" && !mapBuilt) { buildMap(); mapBuilt = true; }
    if (view === "map") {
      refreshMapState();
      /* on a phone the map pans; open it on the middle, where the clusters meet */
      var panel = document.querySelector(".map-panel");
      if (panel) panel.scrollLeft = (panel.scrollWidth - panel.clientWidth) / 2;
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

    var mode = sessionMode();
    Array.prototype.forEach.call(document.querySelectorAll(".mode"), function (b) {
      var on = b.getAttribute("data-mode") === mode;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    box.style.display = mode === "phrases" ? "none" : "flex";
    /* a scene sets its own length */
    var sizes = document.querySelector(".size-pick");
    if (sizes) sizes.style.visibility = mode === "phrases" && SCENES.length ? "hidden" : "";

    var pool = mode === "phrases" ? phraseIds : allIds.filter(function (id) {
      return inFields(id, fields);
    });
    var due = S.dueList(state, Date.now()).filter(function (id) {
      return pool.indexOf(id) !== -1 && state.cards[id].last !== null;
    }).length;

    var note = $("builder-note");
    var scene = mode === "phrases" && nextScene();
    if (note && scene) {
      note.textContent = "next: " + scene.emoji + " " + scene.title + " · " +
        scene.lines.length + " lines · " + due + " due";
    } else if (note) {
      note.textContent = lessonSize() + " cards · " + pool.length +
        (mode === "phrases" ? " phrases" : " concepts") + " · " + due + " due";
    }
  }

  function renderToday() {
    renderBuilder();

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
        '<span class="row-pic" aria-hidden="true">' + it.emoji + "</span>" +
        '<span class="row-body">' +
          '<span class="row-main">' + (it.article ? '<span class="art">' + esc(it.article) + "</span> " : "") + esc(it.text) + "</span>" +
          '<span class="row-meta">' + (due <= now ? "Now" : capital(whenFrom(due - now))) + "</span>" +
        "</span></div>";
    }).join("");
  }

  function capital(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
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
  function itemOf(id) {
    var p = phraseById[id];
    if (p) {
      return { id: p.id, emoji: p.emoji, article: "", text: p.text, sub: p.sub || "", kind: "phrase" };
    }
    var c = conceptById[id];
    if (!c) return { id: id, emoji: "❓", article: "", text: id, sub: "", kind: "word" };
    return { id: c.id, emoji: c.emoji, article: c.article, text: c.word, sub: c.sentence, kind: "word" };
  }

  function poolFor(mode) {
    return mode === "phrases" ? phraseIds.slice() : allIds.slice();
  }

  function distractorsFor(id, count) {
    var it = itemOf(id);
    if (it.kind === "phrase") return S.pickDistractors(id, phraseIds, [], count, Math.random);
    return S.pickDistractors(id, allIds, neighboursOf(id), count, Math.random);
  }

  function wordsHTML(it) {
    var art = it.article ? '<span class="art">' + esc(it.article) + "</span>" : "";
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

  function sessionMode() {
    return (state.settings && state.settings.mode) || "words";
  }

  function inFields(id, fields) {
    var c = conceptById[id];
    return !!c && fields.indexOf(c.cat) !== -1;
  }

  /* The new concepts of the next lesson are drawn once and kept until it
   * starts, so the stack on the Today view shows the cards that will
   * actually be taught, not a different random draw. */
  var planned = null;

  function lessonPlan(mode, size, now) {
    var fields = selectedFields();
    var pool = mode === "phrases"
      ? phraseIds.slice()
      : allIds.filter(function (id) { return inFields(id, fields); });

    var due = S.dueList(state, now).filter(function (id) {
      return pool.indexOf(id) !== -1 && state.cards[id].last !== null;
    }).slice(0, size);

    var key = mode + "|" + size + "|" + pool.join(",");
    if (!planned || planned.key !== key) {
      var freshCap = Math.max(1, Math.min(6, Math.round(size / 2)));
      planned = {
        key: key,
        fresh: S.shuffle(pool.filter(function (id) {
          return state.cards[id].last === null;
        }), Math.random).slice(0, freshCap)
      };
    }
    return { pool: pool, due: due, fresh: planned.fresh };
  }

  /* The lesson card shows the pictures the next lesson opens with, and
   * returns its name and a line saying what is in it. */
  function renderNextStack() {
    var box = $("next-stack");
    var ids, title, caption;
    var scene = sessionMode() === "phrases" && nextScene();
    if (scene) {
      ids = scene.lines;
      title = scene.title;
      caption = scene.lines.length + " lines of one conversation";
    } else {
      var plan = lessonPlan(sessionMode(), lessonSize(), Date.now());
      /* new cards are always taught; reviews can be trimmed to the lesson size */
      ids = plan.fresh.concat(plan.due);
      title = lessonTitle(plan);
      caption = [plan.fresh.length ? plan.fresh.length + " new word" + (plan.fresh.length === 1 ? "" : "s") : "",
        plan.due.length ? plan.due.length + " to review" : ""].filter(Boolean).join(", ");
    }
    if (box) {
      box.innerHTML = ids.slice(0, 5).map(function (id) {
        return '<span class="pic">' + itemOf(id).emoji + "</span>";
      }).join("");
    }
    return { title: title, caption: caption };
  }

  /* Named after the field its new words come from, the way a course names a unit. */
  function lessonTitle(plan) {
    if (sessionMode() === "phrases") return "Phrases";
    if (!plan.fresh.length) return plan.due.length ? "Review" : "Practice";
    var cats = plan.fresh.map(function (id) { return conceptById[id] && conceptById[id].cat; });
    var same = cats.every(function (c) { return c === cats[0]; });
    return same && D.categories[cats[0]] ? D.categories[cats[0]].label : "New words";
  }

  function startSession(opts) {
    var o = opts || {};
    var mode = o.mode || sessionMode();
    var size = o.size || lessonSize();
    var now = Date.now();

    if (mode === "phrases" && SCENES.length) { startScene(nextScene()); return; }

    var plan = lessonPlan(mode, size, now);
    var pool = plan.pool, due = plan.due, fresh = plan.fresh;
    planned = null;

    var quiz = S.shuffle(due.concat(fresh), Math.random).slice(0, size);

    if (!quiz.length) {
      quiz = S.shuffle(pool.length ? pool : allIds, Math.random).slice(0, size);
      toast("Nothing due here — free practice.");
    }

    session = newSession(mode, fresh, quiz);
    show("session");
    if (session.study.length) renderStudy();
    else renderQuiz();
  }

  /* Reviews first, as in a word lesson: the scene with the most lines due,
   * then the first scene still holding a new line, then whichever is due soonest. */
  function nextScene() {
    var now = Date.now();
    var best = null, bestDue = 0;
    SCENES.forEach(function (s) {
      var due = s.lines.filter(function (id) {
        var c = state.cards[id];
        return c.last !== null && c.due <= now;
      }).length;
      if (due > bestDue) { best = s; bestDue = due; }
    });
    if (best) return best;
    var fresh = SCENES.filter(function (s) {
      return s.lines.some(function (id) { return state.cards[id].last === null; });
    })[0];
    if (fresh) return fresh;
    return SCENES.slice().sort(function (a, b) { return soonestDue(a) - soonestDue(b); })[0];
  }

  function soonestDue(scene) {
    return Math.min.apply(null, scene.lines.map(function (id) { return state.cards[id].due; }));
  }

  function startScene(scene) {
    var fresh = scene.lines.filter(function (id) { return state.cards[id].last === null; });
    session = newSession("phrases", fresh, scene.lines.slice());
    session.scene = scene;
    show("session");
    if (fresh.length) renderStudy();
    else renderQuiz();
  }

  /* The thread of the exchange above the card. Lines already through show
   * their scene emoji; the current one shows it only when the card does,
   * so the strip never gives away a "find the picture" answer. */
  function sceneHTML(id, reveal) {
    var s = session && session.scene;
    if (!s) return "";
    var at = s.lines.indexOf(id);
    var steps = s.lines.map(function (lid, i) {
      var done = session.phase === "study" ? i < at : !!session.answered[lid] && lid !== id;
      var now = i === at;
      var face = done || (now && reveal) ? itemOf(lid).emoji : now ? "?" : "";
      return '<li class="' + (done ? "done" : now ? "now" : "") + '">' + face + "</li>";
    }).join("");
    return '<div class="scene">' +
      '<span class="scene-title">' + s.emoji + " " + esc(s.title) + "</span>" +
      '<ol class="scene-steps" aria-label="line ' + (at + 1) + " of " + s.lines.length + '">' + steps + "</ol>" +
    "</div>";
  }

  function markScene(id, reveal) {
    var html = sceneHTML(id, reveal);
    if (html) $("stage").insertAdjacentHTML("afterbegin", html);
  }

  function startDemo() {
    var ids = DEMO_IDS.filter(function (id) { return conceptById[id]; });
    session = newSession("words", ids, S.shuffle(ids, Math.random));
    session.types = DEMO_TYPES;
    show("session");
    var hint = $("kbd-hint");
    hint.classList.add("is-demo");
    hint.innerHTML = 'demo · miss one, it comes back<span class="keys"> · Enter → next · 1–4 → answer</span>';
    renderStudy();
    toast("Demo — starts clean; saved progress is untouched.", 3200);
  }

  function startQuizOnly() {
    var pool = poolFor(sessionMode());
    session = newSession(sessionMode(), [], S.shuffle(pool, Math.random).slice(0, 6));
    show("session");
    renderQuiz();
  }

  function reviewMistakes() {
    var ids = allIds.concat(phraseIds).filter(function (id) {
      return state.cards[id] && state.cards[id].lapses > 0;
    }).sort(function (a, b) {
      return state.cards[b].lapses - state.cards[a].lapses;
    });

    if (!ids.length) {
      ids = S.topConfusions(state, 12).map(function (r) { return r.target; });
    }
    if (!ids.length) {
      toast("No mistakes recorded yet — do a lesson first.");
      return;
    }

    var mode = phraseById[ids[0]] ? "phrases" : "words";
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
      scene: null,
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
    return session.study.length + Math.max(session.unique, session.quiz.length);
  }

  function doneSteps() {
    if (session.phase === "study") return session.si;
    return session.study.length + session.qi;
  }

  function setProgress() {
    var n = Math.max(totalSteps(), 1);
    var done = Math.min(doneSteps(), n);
    $("counter").textContent = Math.min(done + 1, n) + " of " + n;
    $("bar-fill").style.width = Math.round((done / n) * 100) + "%";
  }

  function clearCard() {
    $("stage").innerHTML = "";
    $("actions").innerHTML = "";
    $("card").classList.remove("is-summary");
    var f = $("feedback");
    f.textContent = "";
    f.className = "feedback";
  }

  /* ---- phase 1: form the association, both halves visible at once -------- */

  function renderStudy() {
    setProgress();
    clearCard();

    var it = itemOf(session.study[session.si]);
    var last = session.si === session.study.length - 1;

    $("stage").innerHTML =
      '<p class="prompt">Learn the pair · ' + (session.si + 1) + " of " + session.study.length +
        (it.kind === "phrase" ? " · phrase" : "") + "</p>" +
      figureHTML(it, "Hear it") +
      wordsHTML(it) +
      contextHTML(it);
    markScene(it.id, true);

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
    if (card.last === null) return "pick-word";
    if (SR && i % 2 === 1) return "say";
    return "pick-picture";
  }

  function renderQuiz() {
    if (session.qi >= session.quiz.length) { finishSession(); return; }
    setProgress();
    clearCard();

    var id = session.quiz[session.qi];
    var card = state.cards[id];
    if (!session.answered[id]) {
      session.answered[id] = true;
      session.unique += 1;
    }

    session.qStart = Date.now();
    var type = quizType(card, session.qi);
    if (type === "pick-word") renderPickWord(id);
    else if (type === "say") renderSay(id);
    else renderPickPicture(id);
    markScene(id, type !== "pick-picture");
  }

  /* The number on each option is also its key: 1–4 answer from the keyboard. */
  function optionHTML(id, i) {
    var it = itemOf(id);
    /* phrases share one size, so four options never look like four fonts */
    var long = it.kind === "phrase" ? " phrase" : it.text.length > 16 ? " long" : "";
    return '<button class="option-word' + long + '" data-id="' + esc(id) + '">' +
      '<span class="key" aria-hidden="true">' + (i + 1) + "</span>" +
      '<span class="opt-text">' +
        (it.article ? '<span class="art">' + esc(it.article) + "</span> " : "") +
        esc(it.text) + "</span></button>";
  }

  function markChoices(cls, targetId) {
    Array.prototype.forEach.call($("stage").querySelectorAll(cls), function (b) {
      b.disabled = true;
      if (b.getAttribute("data-id") === targetId) b.classList.add("pick-correct");
    });
  }

  function renderPickWord(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Which one is this?</p>' +
      figureHTML(it, "Hear it") +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>";

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

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

  function renderPickPicture(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Find the picture</p>' +
      wordsHTML(it) +
      '<div class="options">' + set.map(function (o) {
        return '<button class="option" data-id="' + esc(o) + '" aria-label="Choose this picture">' +
          '<span aria-hidden="true">' + itemOf(o).emoji + "</span></button>";
      }).join("") + "</div>" +
      '<button class="speak-btn" id="hear-btn">' + ICON.speaker + 'Hear it</button>';

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

    Array.prototype.forEach.call($("stage").querySelectorAll(".option"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        var ok = picked === id;
        btn.classList.add(ok ? "pick-correct" : "pick-wrong");
        markChoices(".option", id);
        answer(ok, ok ? null : picked);
      });
    });
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

  function showAnswer(ok, it) {
    $("stage").innerHTML =
      '<p class="prompt">' + (ok ? "Correct" : "Not quite") + "</p>" +
      figureHTML(it, "Hear it again") +
      wordsHTML(it) +
      contextHTML(it);
    markScene(it.id, true);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

    feedback(ok ? "got it" : "it comes back at the end", ok ? "good" : "bad");

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">Continue</button>';
    $("next").addEventListener("click", function () {
      session.qi += 1;
      renderQuiz();
    });
  }

  function finishSession() {
    state.sessions += 1;
    state.lastSession = Date.now();
    save();

    var now = Date.now();
    var total = session.unique || 1;
    var seen = Object.keys(session.answered);
    var missed = Object.keys(session.missed);
    var kept = seen.filter(function (id) { return !session.missed[id]; });

    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);

    var days = bumpStreak();
    save();

    /* This screen gets shown to other people, across a room: one number,
     * then what stuck and what is coming back. Nothing else competes. */
    var noun = session.mode === "phrases" ? "phrase" : "word";
    var secs = Math.max(1, Math.round((now - session.startedAt) / 1000));
    var took = secs < 120 ? secs + " second" + (secs === 1 ? "" : "s") : Math.round(secs / 60) + " minutes";

    $("card").classList.add("is-summary");
    $("stage").innerHTML =
      '<p class="prompt">' + (session.scene ? esc(session.scene.title) + " · " : "") + "Lesson done</p>" +
      '<p class="sum-big">' + total + "</p>" +
      '<p class="sum-line">' + noun + (total === 1 ? "" : "s") + " in " + took + "</p>" +
      '<div class="sum-cols">' +
        (kept.length ? sumGroup("kept", "Remembered · " + kept.length, kept, now) : "") +
        (missed.length ? sumGroup("back", "Comes back · " + missed.length, missed, now) : "") +
      "</div>" +
      '<p class="sum-meta">' + session.firstCorrect + " of " + total + " right the first time · " +
        days + "-day streak</p>";

    feedback("", "");
    $("actions").innerHTML =
      '<button class="btn btn-primary" id="back">Done</button>' +
      '<button class="btn btn-ghost" id="again">One more lesson</button>';

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

  function feedback(msg, kind) {
    var f = $("feedback");
    f.textContent = msg;
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

  $("start-btn").addEventListener("click", function () { startSession(); });
  $("build-start").addEventListener("click", function () { startSession(); });
  $("review-missed").addEventListener("click", reviewMistakes);
  Array.prototype.forEach.call(document.querySelectorAll(".mode"), function (b) {
    b.addEventListener("click", function () {
      state.settings.mode = b.getAttribute("data-mode");
      save();
      renderToday();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".size"), function (b) {
    b.addEventListener("click", function () {
      state.settings.size = Number(b.getAttribute("data-size"));
      save();
      renderToday();
    });
  });
  $("quit-btn").addEventListener("click", function () { session = null; show("today"); });
  $("map-practice").addEventListener("click", function () { startSession(); });

  document.addEventListener("keydown", function (ev) {
    if (currentView !== "session" || !session) return;
    if (ev.key === "Escape") { session = null; show("today"); return; }
    if (ev.key === "Enter") {
      /* a focused button already gets its own click from Enter */
      var t = ev.target;
      if (t && t.closest && t.closest("button, [role=button]") && t.id !== "next") return;
      var next = $("next");
      if (next) { ev.preventDefault(); next.click(); }
      return;
    }
    if (["1", "2", "3", "4"].indexOf(ev.key) !== -1) {
      var opts = document.querySelectorAll("#stage .option-word, #stage .option");
      var idx = Number(ev.key) - 1;
      if (opts[idx] && !opts[idx].disabled) { ev.preventDefault(); opts[idx].click(); }
    }
  });

  /* Deep links: #map, #stats and #practice are shareable — useful for a demo,
   * and they let the views be driven without a click. */
  $("audio-chip").addEventListener("click", function () {
    sayItem(itemOf("noche"));
    toast(audioStatus().state === "ok"
      ? "That was the synthesized voice — if you heard nothing, check the system volume."
      : "No Spanish voice on this device; the demo still works without audio.");
  });
  updateAudioChip();

  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (initial === "phrases") { state.settings.mode = "phrases"; save(); startSession(); }
  else if (initial === "quiz") startQuizOnly();
  else if (DEMO) startDemo();
  else if (VIEWS.indexOf(initial) !== -1 && initial !== "today") show(initial);
})();
