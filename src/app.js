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

  function pickVoice() {
    if (!hasTTS) return;
    var voices = window.speechSynthesis.getVoices() || [];
    voice = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(LANG.code) === 0; })[0] || null;
  }
  if (hasTTS) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, btn) {
    if (!hasTTS) { toast("This browser has no speech synthesis."); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = LANG.locale;
      u.rate = 0.92;
      u.pitch = 1;
      if (voice) u.voice = voice;
      if (btn) {
        btn.classList.add("is-playing");
        u.onend = function () { btn.classList.remove("is-playing"); };
        u.onerror = function () { btn.classList.remove("is-playing"); };
      }
      window.speechSynthesis.speak(u);
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
      return state.cards[id].reps > 0;
    }).length;
    var young = allIds.filter(function (id) { return state.cards[id].reps === 0; }).length;
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
      $("start-label").textContent = "Free practice";
    }
  }

  /* -------------------------------------------------------------- session */

  var session = null;

  function startSession() {
    var queue = S.buildQueue(state, Date.now(), { maxItems: 8, newLimit: 4 });
    if (!queue.length) {
      queue = S.shuffle(allIds, Math.random).slice(0, 5);
      toast("Nothing due — free practice with 5 concepts.");
    }
    session = { queue: queue, index: 0, results: [] };
    show("session");
    renderCard();
  }

  function setProgress() {
    var n = session.queue.length;
    $("counter").textContent = Math.min(session.index + 1, n) + "/" + n;
    $("bar-fill").style.width = Math.round((session.index / n) * 100) + "%";
  }

  function clearCard() {
    $("stage").innerHTML = "";
    $("actions").innerHTML = "";
    var f = $("feedback");
    f.textContent = "";
    f.className = "feedback";
  }

  function renderCard() {
    if (!session) return;
    if (session.index >= session.queue.length) { finishSession(); return; }
    setProgress();
    clearCard();

    var id = session.queue[session.index];
    var concept = conceptById[id];
    var card = state.cards[id];
    if (card.reps === 0) renderReceptive(concept);
    else renderProductive(concept);
  }

  /* Step 1 for a brand-new concept: hear the word, choose the picture.
   * Text appears nowhere in this step — that is the whole point. */
  function renderReceptive(concept) {
    var stage = $("stage");
    var options = S.pickDistractors(concept.id, allIds, neighboursOf(concept.id), 3, Math.random);
    var set = S.shuffle([concept.id].concat(options), Math.random);

    options = set.map(function (id) {
      var c = conceptById[id];
      return '<button class="option" data-id="' + esc(id) + '" aria-label="Choose this picture">' +
        '<span aria-hidden="true">' + c.emoji + "</span></button>";
    }).join("");

    stage.innerHTML =
      '<p class="prompt">Which picture is it?</p>' +
      '<div class="options">' + options + "</div>" +
      '<button class="speak-btn" id="replay">🔊 Hear it again</button>';

    speak(concept.word);
    $("replay").addEventListener("click", function () { speak(concept.word, this); });

    Array.prototype.forEach.call(stage.querySelectorAll(".option"), function (btn) {
      btn.addEventListener("click", function () {
        var picked = btn.getAttribute("data-id");
        if (picked === concept.id) {
          btn.classList.add("pick-correct");
          feedback("That's it.", "good");
          speak(concept.word);
          lockOptions(stage);
          setTimeout(function () { renderProductive(concept); }, 750);
        } else {
          S.recordConfusion(state, concept.id, picked);
          save();
          btn.classList.add("pick-wrong");
          Array.prototype.forEach.call(stage.querySelectorAll(".option"), function (o) {
            if (o.getAttribute("data-id") === concept.id) o.classList.add("reveal-right");
          });
          feedback("Not that one — " + concept.emoji + " is “" + concept.word + "”.", "bad");
          speak(concept.word);
          lockOptions(stage);
          setTimeout(function () { renderProductive(concept); }, 1500);
        }
      });
    });
  }

  function lockOptions(stage) {
    Array.prototype.forEach.call(stage.querySelectorAll(".option"), function (b) {
      b.disabled = true;
      b.style.pointerEvents = "none";
    });
  }

  /* Step 2: picture only. Recall, then produce. The written word is the last
   * thing revealed, after the recall attempt — never before it. */
  function renderProductive(concept) {
    var stage = $("stage");
    feedback("", "");
    $("actions").innerHTML = "";
    stage.innerHTML =
      '<p class="prompt">Say it in ' + esc(LANG.name) + "</p>" +
      '<div class="tile" aria-hidden="true">' + concept.emoji + "</div>" +
      '<button class="mic" id="mic-btn">🎙 Say it aloud</button>' +
      '<button class="speak-btn" id="hear-btn">🔊 Hear the word</button>' +
      '<p class="score" id="score"></p>';

    $("hear-btn").addEventListener("click", function () { speak(concept.word, this); });

    var mic = $("mic-btn");
    if (!SR) {
      mic.textContent = "🎙 Not available in this browser";
      mic.disabled = true;
      mic.style.opacity = "0.5";
    }
    mic.addEventListener("click", function () {
      var btn = this;
      var started = listen(concept.word, function (score, said) {
        var pct = Math.round(score * 100);
        var el = $("score");
        if (!el) return;
        el.textContent = "heard “" + said + "” · match " + pct + "%";
        if (score > 0.75) feedback("Good — that would be understood.", "good");
        else if (score > 0.45) feedback("Close. Listen once more, then try again.", "");
        else feedback("Not recognisable yet — hear it, then retry.", "bad");
        beat(function () { revealWord(concept); });
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

    var actions = $("actions");
    actions.innerHTML = '<button class="btn btn-ghost" id="reveal">Show the word</button>';
    $("reveal").addEventListener("click", function () { revealWord(concept); });
  }

  var beatTimer = null;
  function beat(fn, ms) {
    clearTimeout(beatTimer);
    beatTimer = setTimeout(fn, ms || 1400);
  }

  function revealWord(concept) {
    clearTimeout(beatTimer);
    var stage = $("stage");
    stage.innerHTML =
      '<div class="tile sm" aria-hidden="true">' + concept.emoji + "</div>" +
      '<p class="word">' +
        (concept.article ? '<span class="art">' + esc(concept.article) + "</span>" : "") +
        esc(concept.word) +
      "</p>" +
      '<p class="sentence">' + highlightSentence(concept) + "</p>" +
      '<button class="speak-btn" id="hear-btn">🔊 Hear it in a sentence</button>';

    speak(concept.sentence);
    $("hear-btn").addEventListener("click", function () { speak(concept.sentence, this); });

    var actions = $("actions");
    actions.innerHTML =
      '<button class="grade" data-grade="0">Again<small>didn\u2019t come</small></button>' +
      '<button class="grade" data-grade="2">Good<small>recalled it</small></button>' +
      '<button class="grade" data-grade="3">Easy<small>instant</small></button>';

    Array.prototype.forEach.call(actions.querySelectorAll(".grade"), function (b) {
      b.addEventListener("click", function () { grade(concept, Number(b.getAttribute("data-grade"))); });
    });
  }

  function highlightSentence(concept) {
    var txt = esc(concept.sentence);
    var w = esc(concept.word);
    return txt.replace(new RegExp("\\b(" + w + ")\\b", "i"), "<b>$1</b>");
  }

  function grade(concept, g) {
    S.review(state, concept.id, g, Date.now());
    session.results.push({ id: concept.id, grade: g });
    save();
    session.index += 1;
    renderCard();
  }

  function finishSession() {
    state.sessions += 1;
    state.lastSession = Date.now();
    save();

    var good = session.results.filter(function (r) { return r.grade >= 2; }).length;
    var total = session.results.length || 1;

    $("bar-fill").style.width = "100%";
    $("counter").textContent = total + "/" + total;

    $("stage").innerHTML =
      '<p class="prompt">Session complete</p>' +
      '<div class="ring-wrap" style="padding:0">' +
        '<div class="ring-label" style="position:static">' +
          "<b>" + Math.round((good / total) * 100) + "%</b>" +
          "<span>recalled</span>" +
        "</div>" +
      "</div>" +
      '<p class="sentence">' + good + " of " + total + " concepts came back without help. " +
        "The ones that didn\u2019t are scheduled to return in this session." + "</p>";

    $("feedback").textContent = "";
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

  /* ------------------------------------------------------------------ map */

  var positions = {};

  function layout() {
    var cats = Object.keys(D.categories);
    var cx = 450, cy = 320, rx = 330, ry = 248;
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
      var spread = ids.length > 1 ? 30 + ids.length * 6 : 0;

      ids.forEach(function (id, i) {
        var a = (i / Math.max(ids.length, 1)) * Math.PI * 2 - Math.PI / 2;
        var r = ids.length > 1 ? spread : 0;
        positions[id] = {
          x: gx + Math.cos(a) * r,
          y: gy + Math.sin(a) * r,
          cat: cat
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
      halo.setAttribute("r", 23);
      g.appendChild(halo);

      var glyph = document.createElementNS(svgNS, "text");
      glyph.setAttribute("class", "glyph");
      glyph.setAttribute("x", p.x);
      glyph.setAttribute("y", p.y);
      glyph.textContent = c.emoji;
      g.appendChild(glyph);

      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", p.x);
      label.setAttribute("y", p.y + 38);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "9.5");
      label.setAttribute("fill", "rgba(255,255,255,0.42)");
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
      var hue = (D.categories[conceptById[id].cat] || {}).hue || "#8b5cf6";
      if (learned) {
        halo.setAttribute("fill", hue + "33");
        halo.setAttribute("stroke", hue);
      } else {
        halo.removeAttribute("fill");
        halo.setAttribute("fill", "rgba(255,255,255,0.03)");
        halo.setAttribute("stroke", "rgba(255,255,255,0.14)");
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
        '<span class="track" style="background:' + hue + '1f"><span class="fill" style="width:' + r.pct + "%;background:" + hue + '"></span></span>' +
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
    var gradeBtns = document.querySelectorAll("#actions .grade");
    if (gradeBtns.length && ["1", "2", "3"].indexOf(ev.key) !== -1) {
      var idx = Number(ev.key) - 1;
      if (gradeBtns[idx]) gradeBtns[idx].click();
    }
  });

  /* Deep links: #map, #stats and #practice are shareable — useful for a demo,
   * and they let the views be driven without a click. */
  var initial = String(window.location.hash || "").replace("#", "");
  renderToday();
  if (initial === "practice") startSession();
  else if (VIEWS.indexOf(initial) !== -1 && initial !== "today") show(initial);
})();
