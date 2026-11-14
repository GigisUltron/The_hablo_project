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
  var MEM = window.SemaMemory;
  var TRACK = window.SemaTrack;
  var ADAPT = window.SemaAdaptive;
  var CORRECT = window.SemaCorrect;
  var CONV = window.SemaConv;
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

  /* term deck: vocabulary that cannot be drawn (see src/terms.js) */
  var TERMS = window.SEMA_TERMS || { terms: [] };
  var termById = {};
  var termIds = [];
  TERMS.terms.forEach(function (t) {
    termById[t.id] = t;
    termIds.push(t.id);
  });

  /* phrase deck: same shape as a concept once itemOf() normalises it */
  var P = window.SEMA_PHRASES || { phrases: [] };
  var phraseById = {};
  var phraseIds = [];
  P.phrases.forEach(function (p) {
    phraseById[p.id] = p;
    phraseIds.push(p.id);
  });

  /* ------------------------------------------------------------ utilities */

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

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

  var state = load();
  /* a fresh browser has no saved settings; every screen reads them */
  if (!state.settings) {
    state.settings = { fields: Object.keys(D.categories), size: 8, mode: "words", translations: "on" };
  }
  if (!state.memory) state.memory = MEM.empty();

  function load() {
    var base = S.newState(allIds.concat(phraseIds, termIds), Date.now());
    base.memory = MEM.empty();
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return base;
      saved.cards = saved.cards || {};
      saved.confusions = saved.confusions || {};
      saved.reviews = saved.reviews || { good: 0, again: 0 };
      if (!saved.memory || !Array.isArray(saved.memory.sentences)) saved.memory = MEM.empty();
      saved.settings = saved.settings || {};
      if (!Array.isArray(saved.settings.fields) || !saved.settings.fields.length) {
        saved.settings.fields = Object.keys(D.categories);
      }
      if (!saved.settings.size) saved.settings.size = 8;
      if (["words", "phrases", "terms"].indexOf(saved.settings.mode) === -1) saved.settings.mode = "words";
      if (saved.settings.translations !== "off") saved.settings.translations = "on";
      allIds.concat(phraseIds, termIds).forEach(function (id) {
        if (!saved.cards[id]) saved.cards[id] = S.newCard(id, Date.now());
      });
      return saved;
    } catch (err) {
      return base;
    }
  }

  function save() {
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
      : "No usable speech voice here. Everything still works without audio.";
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

  var VIEWS = ["today", "session", "reader", "conv", "settings", "map", "stats"];
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
    if (view === "today" || view === "settings") renderToday();
    if (view === "stats") renderStats();
    if (view === "map" && !mapBuilt) { buildMap(); mapBuilt = true; }
    if (view === "map") refreshMapState();
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
    box.style.display = mode === "words" ? "flex" : "none";

    /* a lesson is not a deck: words, phrases and terms together, scoped only
     * by the unit's fields. The mode picker narrows emphasis, not content. */
    var scopeWords = (unit && unit.fields)
      ? allIds.filter(function (id) { return inFields(id, unit.fields); })
      : allIds.slice();
    var pool = scopeWords.concat(phraseIds, termIds);

    var due = S.dueList(state, now).filter(function (id) {
      return pool.indexOf(id) !== -1 && state.cards[id].last !== null;
    }).slice(0, size);

    var freshCap = Math.max(0, Math.min(6, plan.fresh));
    var fresh = S.shuffle(pool.filter(function (id) {
      return state.cards[id].last === null;
    }), Math.random).slice(0, freshCap);

    var quiz = S.shuffle(due.concat(fresh), Math.random).slice(0, size);

    /* persistent memory, used: the pairs you keep trading come back first */
    var weak = MEM.weakItems(state, 6).filter(function (id) {
      return pool.indexOf(id) !== -1 && quiz.indexOf(id) === -1;
    }).slice(0, 2);
    if (weak.length) quiz = weak.concat(quiz);

    if (!quiz.length) {
      quiz = S.shuffle(pool.length ? pool : allIds, Math.random).slice(0, size);
      toast("Nothing due here — free practice.");
    }

    session = newSession(mode, fresh, quiz);
    session.plan = plan;

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
      '<p class="prompt">' + (ok ? "Correct" : "Not quite") + "</p>" +
      '<p class="personal-line">' + full + "</p>" +
      '<p class="sentence">your own words, from ' + esc(shortDate(p.sentence.created)) + "</p>";

    feedback(ok ? "that was yours" : "the word was “" + p.cloze.answer + "”", ok ? "good" : "bad");

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">Continue →</button>';
    $("next").addEventListener("click", function () {
      session.personal = null;
      if (session.study.length) renderStudy();
      else renderQuiz();
    });
  }

  function startQuizOnly() {
    var pool = poolFor(sessionMode());
    session = newSession(sessionMode(), [], S.shuffle(pool, Math.random).slice(0, 6));
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
    $("counter").textContent = Math.min(done + 1, n) + "/" + n;
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
      tileHTML(it) +
      wordsHTML(it) +
      contextHTML(it) +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>' +
      glossHTML(it.id);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    wireGloss();

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">' +
      (last ? "Start the quiz →" : "Next →") + "</button>";
    $("next").addEventListener("click", function () {
      session.si += 1;
      if (session.si < session.study.length) renderStudy();
      else { session.phase = "quiz"; renderQuiz(); }
    });
  }

  /* ---- phase 2: hide one half, ask for the other ------------------------ */

  function quizType(card, i) {
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
    if (itemOf(id).kind === "term") { renderPickFrame(id); return; }

    var type = quizType(card, session.qi);
    if (type === "pick-word") renderPickWord(id);
    else if (type === "write") renderWrite(id);
    else if (type === "say" && SR) renderSay(id);
    else renderPickPicture(id);
  }

  function optionHTML(id) {
    var it = itemOf(id);
    var long = it.text.length > 16 ? " long" : "";
    return '<button class="option-word' + long + '" data-id="' + esc(id) + '">' +
      (it.article ? '<span class="art">' + esc(it.article) + "</span>" : "") +
      esc(it.text) + "</button>";
  }

  function markChoices(cls, targetId) {
    Array.prototype.forEach.call($("stage").querySelectorAll(cls), function (b) {
      b.disabled = true;
      if (b.getAttribute("data-id") === targetId) b.classList.add("pick-correct");
    });
  }

  /* The only honest question for "aunque": which one fits this sentence. */
  function renderPickFrame(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(S.pickDistractors(id, termIds, [], 3, Math.random)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Which one fits?</p>' +
      '<p class="term-blank">' + esc(it.frame) + "</p>" +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>" +
      glossHTML(id);

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

  function renderPickWord(id) {
    var it = itemOf(id);
    var set = S.shuffle([id].concat(distractorsFor(id, 3)), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Which one is this?</p>' +
      tileHTML(it) +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>' +
      '<div class="word-options">' + set.map(optionHTML).join("") + "</div>" +
      glossHTML(it.id);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
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
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>' +
      glossHTML(it.id);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    wireGloss();

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
      '<button class="btn btn-primary" id="write-check">Check</button>' +
      glossHTML(id);

    wireGloss();
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
      tileHTML(it) +
      '<button class="mic" id="mic-btn">🎙 Say it aloud</button>' +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>' +
      '<p class="score" id="score"></p>';

    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });

    var mic = $("mic-btn");
    mic.addEventListener("click", function () {
      var btn = this;
      var started = listen(it.text, function (score, said) {
        var el = $("score");
        if (el) el.textContent = "heard “" + said + "” · match " + Math.round(score * 100) + "%";
        answer(score > 0.6, null);
      });
      if (started) {
        btn.classList.add("is-live");
        btn.textContent = "🎙 Listening…";
        var reset = setInterval(function () {
          if (!listening) {
            clearInterval(reset);
            btn.classList.remove("is-live");
            btn.textContent = "🎙 Say it aloud";
          }
        }, 400);
      }
    });

    $("actions").innerHTML = '<button class="btn btn-ghost" id="reveal">Show the answer</button>';
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
      tileHTML(it, true) +
      wordsHTML(it) +
      contextHTML(it) +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it again</button>' +
      glossHTML(it.id);

    sayItem(it);
    $("hear-btn").addEventListener("click", function () { sayItem(it, this); });
    wireGloss();

    feedback(ok ? "got it" : "it comes back at the end", ok ? "good" : "bad");

    $("actions").innerHTML = '<button class="btn btn-primary" id="next">Continue →</button>';
    $("next").addEventListener("click", function () {
      session.qi += 1;
      renderQuiz();
    });
  }

  function finishSession() {
    state.sessions += 1;
    state.lastSession = Date.now();
    save();

    var total = session.unique || 1;
    var acc = Math.round((session.firstCorrect / total) * 100);
    var missed = Object.keys(session.missed);

    renderSteps("done");
    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);

    var list = missed.length
      ? '<ul class="missed">' + missed.map(function (id) {
          var it = itemOf(id);
          return "<li>" + it.emoji + " " + esc(it.text) + "</li>";
        }).join("") + "</ul>"
      : "";

    var days = bumpStreak();
    save();

    var avg = session.times.length
      ? (session.times.reduce(function (a, b) { return a + b; }, 0) / session.times.length / 1000).toFixed(1)
      : null;

    $("stage").innerHTML =
      '<p class="prompt">Done</p>' +
      '<div class="word">' + acc + "%</div>" +
      '<p class="sentence">' + session.firstCorrect + " of " + total +
        " first try" + (avg ? " · " + avg + "s per answer" : "") +
        " · " + days + " day streak" +
      "</p>" + list;

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
      '<button class="btn btn-ghost" id="back">Done for now</button>';

    $("back").addEventListener("click", function () { session = null; show("today"); });
    $("again").addEventListener("click", function () { startSession(); });
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
      '<button class="speak-btn" id="info-hear" style="margin-left:auto">🔊 Again</button>';

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

    var peeks = state.memory.peeked || 0;
    $("mem-peeks").textContent = peeks
      ? peeks + (peeks === 1 ? " translation shown" : " translations shown")
      : "no translations used";

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
    startSession({ unit: TRACK.units[Math.min(TRACK.units.length - 1, placementFloor())] });
  });
  $("build-start").addEventListener("click", function () { startSession(); });
  $("review-missed").addEventListener("click", reviewMistakes);
  $("place-btn").addEventListener("click", startPlacement);
  $("read-btn").addEventListener("click", startReader);
  $("settings-btn").addEventListener("click", function () { show("settings"); });
  $("conv-btn").addEventListener("click", startConversation);
  $("conv-back").addEventListener("click", function () { conv = null; show("today"); });
  $("settings-back").addEventListener("click", function () { show("today"); });
  $("reader-back").addEventListener("click", function () { reader = null; show("today"); });
  $("gloss-toggle").addEventListener("click", function () {
    state.settings.translations = state.settings.translations === "off" ? "on" : "off";
    save();
    renderBuilder();
    toast(state.settings.translations === "off"
      ? "Translations off. Meanings come from pictures, schemas and sentences."
      : "Translations available on request.");
  });
  Array.prototype.forEach.call(document.querySelectorAll(".mode"), function (b) {
    b.addEventListener("click", function () {
      state.settings.mode = b.getAttribute("data-mode");
      save();
      renderBuilder();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".size"), function (b) {
    b.addEventListener("click", function () {
      state.settings.size = Number(b.getAttribute("data-size"));
      save();
      renderBuilder();
    });
  });
  $("quit-btn").addEventListener("click", function () { session = null; show("today"); });
  $("map-practice").addEventListener("click", function () { startSession(); });

  document.addEventListener("keydown", function (ev) {
    if (currentView !== "session" || !session) return;
    if (ev.key === "Escape") { session = null; show("today"); return; }
    if (ev.key === "Enter") {
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

  /* Deep links: #map, #stats and #practice are shareable — useful for sharing,
   * and they let the views be driven without a click. */
  $("audio-chip").addEventListener("click", function () {
    sayItem(itemOf("noche"));
    toast(audioStatus().state === "ok"
      ? "That was the synthesized voice — if you heard nothing, check the system volume."
      : "No Spanish voice on this device; everything still works without audio.");
  });
  updateAudioChip();

  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (initial === "phrases") { state.settings.mode = "phrases"; save(); startSession(); }
  else if (initial === "terms") { state.settings.mode = "terms"; save(); startSession(); }
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
  else if (VIEWS.indexOf(initial) !== -1 && initial !== "today") show(initial);
})();
