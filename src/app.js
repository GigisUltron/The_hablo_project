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

  function load() {
    var base = S.newState(allIds, Date.now());
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return base;
      saved.cards = saved.cards || {};
      saved.confusions = saved.confusions || {};
      saved.reviews = saved.reviews || { good: 0, again: 0 };
      allIds.forEach(function (id) {
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

  var speakTimer = null;

  var warnedNoVoice = false;

  function speak(text, btn) {
    if (!hasTTS) { toast("This browser has no speech synthesis."); return; }
    var synth = window.speechSynthesis;
    try {
      if (!voice) pickVoice();
      if (!esVoices().length && !synth.speaking && !warnedNoVoice && audioStatus().state === "none") {
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
    if (view === "map") refreshMapState();
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------------------------------------------------------- today */

  function renderToday() {
    var due = S.dueList(state, Date.now()).filter(function (id) {
      return state.cards[id].last !== null;
    }).length;
    var young = allIds.filter(function (id) { return state.cards[id].last === null; }).length;
    var ret = S.retention(state);

    $("stat-due").textContent = due;
    $("stat-learned").textContent = S.learnedCount(state);
    $("stat-total").textContent = allIds.length;
    $("retention-num").textContent = ret === null ? "—" : Math.round(ret * 100) + "%";

    var pct = ret === null ? 0 : ret;
    var len = 477.5;
    $("ring-value").setAttribute("stroke-dashoffset", String(len - len * pct));

    $("ring-caption").textContent = ret === null
      ? "Your first session sets the baseline."
      : Math.round(ret * 100) + "% of recalls needed no retry, across " +
        S.learnedCount(state) + " of " + allIds.length + " concepts.";

    $("start-label").textContent = due > 0 ? "Start session · " + due + " due" : "Start session";
    $("start-btn").setAttribute("aria-label",
      due > 0 ? "Start a session, " + due + " cards due" : "Start a new session");
    if (young === 0 && due === 0) {
      $("start-label").textContent = "Quiz me";
    }
  }

  /* -------------------------------------------------------------- session */

  var session = null;

  function startSession() {
    var now = Date.now();
    var due = S.dueList(state, now).filter(function (id) {
      return state.cards[id].last !== null;   // seen before, including lapses
    });
    var fresh = S.shuffle(allIds.filter(function (id) {
      return state.cards[id].last === null;   // genuinely new
    }), Math.random).slice(0, 4);

    if (!due.length && !fresh.length) {
      due = S.shuffle(allIds, Math.random).slice(0, 6);
    }

    session = newSession(fresh, S.shuffle(due.concat(fresh), Math.random));
    show("session");
    if (session.study.length) renderStudy();
    else renderQuiz();
  }

  /* Shareable "just quiz me" link (#quiz): no teaching, straight to questions. */
  function startQuizOnly() {
    session = newSession([], S.shuffle(allIds, Math.random).slice(0, 6));
    show("session");
    renderQuiz();
  }

  function newSession(study, quiz) {
    return {
      phase: "study",
      study: study,
      si: 0,
      quiz: quiz,
      qi: 0,
      requeued: {},
      missed: {},
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
    $("counter").textContent = Math.min(done + 1, n) + "/" + n;
    $("bar-fill").style.width = Math.round((done / n) * 100) + "%";
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

    var c = conceptById[session.study[session.si]];
    var last = session.si === session.study.length - 1;

    $("stage").innerHTML =
      '<p class="prompt">Learn the pair · ' + (session.si + 1) + " of " + session.study.length + "</p>" +
      '<div class="tile" aria-hidden="true">' + c.emoji + "</div>" +
      '<div class="word study">' +
        (c.article ? '<span class="art">' + esc(c.article) + "</span>" : "") + esc(c.word) +
      "</div>" +
      '<p class="sentence">' + highlightSentence(c) + "</p>" +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>';

    speak(c.word);
    $("hear-btn").addEventListener("click", function () { speak(c.word, this); });

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
    if (card.last === null) return "pick-word";
    if (SR && i % 2 === 1) return "say";
    return "pick-picture";
  }

  function renderQuiz() {
    if (session.qi >= session.quiz.length) { finishSession(); return; }
    setProgress();
    clearCard();

    var id = session.quiz[session.qi];
    var c = conceptById[id];
    var card = state.cards[id];

    if (!session.answered[id]) {
      session.answered[id] = true;
      session.unique += 1;
    }

    var type = quizType(card, session.qi);
    if (type === "pick-word") renderPickWord(c);
    else if (type === "say" && SR) renderSay(c);
    else renderPickPicture(c);
  }

  function optionWord(id) {
    var o = conceptById[id];
    return '<button class="option-word" data-id="' + esc(id) + '">' +
      (o.article ? '<span class="art">' + esc(o.article) + "</span>" : "") +
      esc(o.word) + "</button>";
  }

  function renderPickWord(c) {
    var near = S.pickDistractors(c.id, allIds, neighboursOf(c.id), 3, Math.random);
    var set = S.shuffle([c.id].concat(near), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Which word is this?</p>' +
      '<div class="tile" aria-hidden="true">' + c.emoji + "</div>" +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it</button>' +
      '<div class="word-options">' + set.map(optionWord).join("") + "</div>";

    speak(c.word);
    $("hear-btn").addEventListener("click", function () { speak(c.word, this); });

    Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        var ok = picked === c.id;
        if (ok) btn.classList.add("pick-correct");
        else btn.classList.add("pick-wrong");
        Array.prototype.forEach.call($("stage").querySelectorAll(".option-word"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-id") === c.id) b.classList.add("pick-correct");
        });
        answer(ok, ok ? null : picked);
      });
    });
  }

  function renderPickPicture(c) {
    var near = S.pickDistractors(c.id, allIds, neighboursOf(c.id), 3, Math.random);
    var set = S.shuffle([c.id].concat(near), Math.random);

    $("stage").innerHTML =
      '<p class="prompt">Find the picture</p>' +
      '<div class="word small">' +
        (c.article ? '<span class="art">' + esc(c.article) + "</span>" : "") + esc(c.word) +
      "</div>" +
      '<div class="options">' + set.map(function (id) {
        return '<button class="option" data-id="' + esc(id) + '" aria-label="Choose this picture">' +
          '<span aria-hidden="true">' + conceptById[id].emoji + "</span></button>";
      }).join("") + "</div>" +
      '<button class="speak-btn" id="hear-btn">🔊 Hear the word</button>';

    speak(c.word);
    $("hear-btn").addEventListener("click", function () { speak(c.word, this); });

    Array.prototype.forEach.call($("stage").querySelectorAll(".option"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        var ok = picked === c.id;
        if (ok) btn.classList.add("pick-correct");
        else btn.classList.add("pick-wrong");
        Array.prototype.forEach.call($("stage").querySelectorAll(".option"), function (b) {
          b.disabled = true;
          if (b.getAttribute("data-id") === c.id) b.classList.add("reveal-right");
        });
        answer(ok, ok ? null : picked);
      });
    });
  }

  function renderSay(c) {
    $("stage").innerHTML =
      '<p class="prompt">Say it in ' + esc(LANG.name) + "</p>" +
      '<div class="tile" aria-hidden="true">' + c.emoji + "</div>" +
      '<button class="mic" id="mic-btn">🎙 Say it aloud</button>' +
      '<button class="speak-btn" id="hear-btn">🔊 Hear the word</button>' +
      '<p class="score" id="score"></p>';

    $("hear-btn").addEventListener("click", function () { speak(c.word, this); });

    var mic = $("mic-btn");
    mic.addEventListener("click", function () {
      var btn = this;
      var started = listen(c.word, function (score, said) {
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

  /* One answer, one scheduling update, one step forward. A miss is pushed to
   * the back of the same quiz instead of being forgotten until tomorrow. */
  function answer(ok, chosenId) {
    var id = session.quiz[session.qi];
    var c = conceptById[id];

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
    showAnswer(ok, c);
  }

  function showAnswer(ok, c) {
    $("stage").innerHTML =
      '<p class="prompt">' + (ok ? "Correct" : "Not quite") + "</p>" +
      '<div class="tile sm" aria-hidden="true">' + c.emoji + "</div>" +
      '<div class="word">' +
        (c.article ? '<span class="art">' + esc(c.article) + "</span>" : "") + esc(c.word) +
      "</div>" +
      '<p class="sentence">' + highlightSentence(c) + "</p>" +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it in a sentence</button>';

    speak(c.sentence);
    $("hear-btn").addEventListener("click", function () { speak(c.sentence, this); });

    feedback(ok ? "got it" : "it comes back at the end of the quiz", ok ? "good" : "bad");

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

    $("bar-fill").style.width = "100%";
    $("counter").textContent = String(total);

    $("stage").innerHTML =
      '<p class="prompt">Quiz complete</p>' +
      '<div class="word">' + acc + "%</div>" +
      '<p class="sentence">' + session.firstCorrect + " of " + total +
        " right on the first try. The rest will come back sooner, and everything " +
        "you got right is scheduled further out.</p>";

    feedback("", "");
    $("actions").innerHTML =
      '<button class="btn btn-primary" id="back">Back to today</button>' +
      '<button class="btn btn-ghost" id="again">Another round</button>';

    $("back").addEventListener("click", function () { session = null; show("today"); });
    $("again").addEventListener("click", function () { startSession(); });
  }

  function feedback(msg, kind) {
    var f = $("feedback");
    f.textContent = msg;
    f.className = "feedback" + (kind ? " " + kind : "");
  }

  function highlightSentence(c) {
    var txt = esc(c.sentence);
    var w = esc(c.word);
    return txt.replace(new RegExp("\\b(" + w + ")\\b", "i"), "<b>$1</b>");
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
    speak(c.word);
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
        '<div class="hint">' + highlightSentence(c) + "</div>" +
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

  $("start-btn").addEventListener("click", startSession);
  $("quit-btn").addEventListener("click", function () { session = null; show("today"); });
  $("map-practice").addEventListener("click", startSession);

  document.addEventListener("keydown", function (ev) {
    if (currentView !== "session" || !session) return;
    if (ev.key === "Escape") { session = null; show("today"); return; }
    if (ev.key === "Enter") {
      var next = $("next");
      if (next) { ev.preventDefault(); next.click(); }
    }
  });

  /* Deep links: #map, #stats and #practice are shareable — useful for a demo,
   * and they let the views be driven without a click. */
  $("audio-chip").addEventListener("click", function () {
    speak(conceptById["noche"] ? conceptById["noche"].word : "hola");
    toast(audioStatus().state === "ok"
      ? "That was the synthesized voice — if you heard nothing, check the system volume."
      : "No Spanish voice on this device; the demo still works without audio.");
  });
  updateAudioChip();

  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (initial === "quiz") startQuizOnly();
  else if (VIEWS.indexOf(initial) !== -1 && initial !== "today") show(initial);
})();
