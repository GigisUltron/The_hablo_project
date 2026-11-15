/* sema — a tiny, standard-library-only prediction model for conversation.
 *
 * It is not a neural network. It learns the words and sentences the pack
 * already carries, scores authored replies against the learner's line, and
 * uses word-level bigrams to produce a short continuation when no exact
 * retrieval fits. That is enough to keep an offline conversation moving
 * without pretending to be a general-purpose model.
 *
 * The predictor is deliberately conservative: it never echoes the learner,
 * never repeats a recent reply, never returns oversized text, and answers a
 * learner question only with an authored statement rather than an unrelated
 * question. An empty string is an honest "nothing to add".
 */
(function (root) {
  "use strict";

  function words(text) {
    var value = String(text == null ? "" : text).toLowerCase();
    var raw;
    try {
      raw = value.match(/[\p{L}\p{N}]+/gu) || [];
    } catch (err) {
      raw = value.match(/[a-z0-9\u00c0-\u024f\u0400-\u04ff\u0600-\u06ff\u0900-\u097f\u3040-\u30ff\u3400-\u9fff]+/g) || [];
    }
    var out = [];
    raw.forEach(function (token) {
      if (hasCjk(token)) {
        Array.from(token).forEach(function (ch) { out.push(ch); });
      } else {
        out.push(token);
      }
    });
    return out;
  }

  function hasCjk(text) {
    return /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(String(text || ""));
  }

  function sentences(text) {
    return String(text || "").split(/[.!?。！？؟]+/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* Comparison form for echo and repetition checks. Punctuation, spacing and
   * accents are not meaning, so "Me llamo Ana!" and "me llamo ana" are the same
   * line. Combining marks are removed for any script, not just Latin. */
  function normaliseLine(text) {
    var value = String(text == null ? "" : text).trim().toLowerCase();
    if (typeof value.normalize === "function") {
      try {
        value = value.normalize("NFD").replace(/\p{M}+/gu, "");
      } catch (err) {
        value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
    }
    return value
      .replace(/[.!?。！？؟…,;:¡¿"'“”«»]+/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  function isQuestionText(text) {
    return /[?？؟]\s*$/.test(String(text || "").trim());
  }

  function intent(text) {
    var lower = String(text == null ? "" : text).toLowerCase().trim();
    if (!lower) return "empty";
    if (/^(hi|hello|hey|hola|bonjour|ciao|hallo|olá|привет|merhaba|مرحبا|नमस्ते|こんにちは|你好)/i.test(lower)) return "greeting";
    if (/thank|thanks|gracias|merci|grazie|obrigad|спасибо|teşekk|شكر|धन्यवाद|ありがとう|谢谢/i.test(lower)) return "thanks";
    if (/^(yes|yeah|yep|no|nope|sí|si|oui|non|ja|nein|ja|nee|да|нет|evet|hayır|نعم|لا|हाँ|नहीं|はい|いいえ|是|不)[.!]?$/i.test(lower)) return "yesno";
    if (/my name is|me llamo|je m'appelle|ich heiße|ik heet|меня зовут|benim adım|اسمي|मेरा नाम|私の名前|我叫/i.test(lower)) return "name";
    if (/[?？؟]\s*$/.test(lower) || /^(where|what|who|when|why|how|dónde|qué|quién|cuándo|por qué|cómo|où|quoi|qui|quand|pourquoi|comment|wo|was|wer|wann|warum|wie|где|что|кто|когда|почему|как|nerede|ne|kim|ne zaman|neden|nasıl|أين|ماذا|من|متى|لماذا|كيف|कहाँ|क्या|कौन|कब|क्यों|कैसे|どこ|何|誰|いつ|なぜ|どう|哪里|什么|谁|什么时候|为什么|怎么)/i.test(lower)) return "question";
    return "statement";
  }

  function build(pack) {
    var candidates = [];
    var bigrams = {};
    var starts = [];
    var edges = [];

    function add(text, kind) {
      var clean = String(text == null ? "" : text).trim();
      if (!clean || clean.length < 2 || /___|____/.test(clean)) return;
      var tokens = words(clean);
      if (!tokens.length) return;
      if (candidates.some(function (c) { return c.text === clean; })) return;
      candidates.push({ text: clean, tokens: tokens, kind: kind || "line", question: /[?？؟]\s*$/.test(clean) });
      for (var i = 0; i < tokens.length - 1; i += 1) {
        var a = tokens[i], b = tokens[i + 1];
        if (!bigrams[a]) bigrams[a] = [];
        if (bigrams[a].indexOf(b) === -1) bigrams[a].push(b);
        if (i === 0 && starts.indexOf(a) === -1) starts.push(a);
      }
    }

    var phrases = (pack && pack.phrases && pack.phrases.phrases) || [];
    var terms = (pack && pack.terms && pack.terms.terms) || [];
    var basics = (pack && pack.basics && pack.basics.items) || [];
    var concepts = (pack && pack.concepts && pack.concepts.concepts) || [];
    var texts = (pack && pack.texts && pack.texts.texts) || [];
    var conv = (pack && pack.conv && pack.conv.dialogues) || [];

    conv.forEach(function (d) {
      var turns = (d && d.turns) || [];
      turns.forEach(function (t, i) {
        add(t.es, "dialogue");
        add(t.reply, "reply");
        if (i + 1 < turns.length && t.es && turns[i + 1].es) {
          edges.push({ from: words(t.es), to: turns[i + 1].es });
          (t.expects || []).forEach(function (expected) {
            edges.push({ from: words(expected), to: turns[i + 1].es });
          });
        }
      });
    });
    phrases.forEach(function (p) { add(p.text, "phrase"); });
    terms.forEach(function (t) { add(t.text, "term"); });
    basics.forEach(function (b) { add(b.text, "basic"); });
    concepts.forEach(function (c) { add(c.sentence || c.word, "concept"); });
    texts.forEach(function (t) {
      sentences((t && (t.title + ". " + t.body)) || "").forEach(function (s) { add(s, "text"); });
    });

    var last = "";

    function pick(list, rand) {
      var r = typeof rand === "function" ? rand : Math.random;
      if (!list.length) return "";
      var index = Math.floor(r() * list.length);
      if (!(index >= 0)) index = 0;
      if (index >= list.length) index = list.length - 1;
      return list[index];
    }

    function opening(opts) {
      var rand = opts && typeof opts.rand === "function" ? opts.rand : Math.random;
      var d = pick(conv, rand);
      if (d && d.turns && d.turns[0] && d.turns[0].es) return d.turns[0].es;
      var greeting = candidates.filter(function (c) {
        return /^(hello|hi|hey|hola|bonjour|ciao|hallo|olá|привет|merhaba|مرحبا|नमस्ते|こんにちは|你好)/i.test(c.text);
      })[0];
      return greeting ? greeting.text : (candidates[0] ? candidates[0].text : "");
    }

    function score(candidate, userTokens, contextTokens) {
      if (!userTokens.length && !contextTokens.length) return 0;
      var overlap = 0;
      userTokens.forEach(function (w) {
        if (candidate.tokens.indexOf(w) !== -1) overlap += 1;
      });
      var context = 0;
      contextTokens.forEach(function (w) {
        if (candidate.tokens.indexOf(w) !== -1) context += 1;
      });
      return overlap * 10 + context * 2 - Math.min(4, Math.floor(candidate.tokens.length / 8));
    }

    function generate(userTokens, rand) {
      var seed = userTokens.find(function (w) { return bigrams[w] && bigrams[w].length; });
      if (!seed) return "";
      var out = [seed];
      var current = seed;
      for (var i = 0; i < 10; i += 1) {
        var options = bigrams[current];
        if (!options || !options.length) break;
        current = pick(options, rand);
        out.push(current);
      }
      if (out.length < 3) return "";
      var text = out.join(" ");
      return hasCjk(text) ? "" : text;
    }

    function reply(text, opts) {
      var o = opts || {};
      var rand = typeof o.rand === "function" ? o.rand : Math.random;
      var userTokens = words(text);
      var contextTokens = words(o.context || "");
      var kindIntent = intent(text);
      var greeting = kindIntent === "greeting";
      var thanks = kindIntent === "thanks";
      var asksQuestion = kindIntent === "question";
      var ranked = candidates.slice().sort(function (a, b) {
        return score(b, userTokens, contextTokens) - score(a, userTokens, contextTokens);
      });
      var recent = (o.recent || []).map(function (x) { return String(x); });
      var recentKeys = recent.map(normaliseLine);
      var lastKey = normaliseLine(o.last || "");
      function fresh(c) {
        if (!c || c.text === (o.last || "")) return false;
        return recent.indexOf(c.text) === -1 && normaliseLine(c.text) !== lastKey &&
          recentKeys.indexOf(normaliseLine(c.text)) === -1;
      }
      var best = ranked.filter(function (c) { return score(c, userTokens, contextTokens) > 0; });
      var choice = "";
      /* Follow an authored dialogue turn when the learner's line clearly
       * matches it. This is retrieval, not invented dialogue. */
      if (userTokens.length) {
        var followed = edges.map(function (e) {
          return { edge: e, score: score({ tokens: e.from }, userTokens, contextTokens) };
        }).sort(function (a, b) { return b.score - a.score; })[0];
        if (followed && followed.score >= 10 && fresh({ text: followed.edge.to }) &&
            String(followed.edge.to || "").length <= 180 &&
            (!asksQuestion || !isQuestionText(followed.edge.to))) {
          choice = followed.edge.to;
        }
      }
      if (!choice) {
        if (best.length) {
          var pool = best.slice(0, Math.min(6, best.length)).filter(fresh);
          if (greeting) {
            var hello = pool.filter(function (c) { return /^(hi|hello|hey|hola|bonjour|ciao|hallo|olá|привет|merhaba|مرحبا|नमस्ते|こんにちは|你好)/i.test(c.text); });
            if (hello.length) pool = hello;
          }
          if (thanks) {
            var warm = pool.filter(function (c) { return !c.question; });
            if (warm.length) pool = warm;
          }
          if (asksQuestion) {
            /* A question deserves an authored answer, not another unrelated
             * question. If the pack only offers a question back, stay honest
             * and return nothing; the app has a visible "nothing to add" state. */
            pool = pool.filter(function (c) { return !c.question; });
          }
          choice = pool.length ? pick(pool, rand).text : "";
        } else if (userTokens.length && !asksQuestion) {
          var generated = generate(userTokens, rand);
          if (generated && fresh({ text: generated })) choice = generated;
        }
      }
      if (!choice && !asksQuestion) {
        var questions = candidates.filter(function (c) { return c.question && fresh(c); });
        if (questions.length) {
          choice = pick(questions, rand).text;
        } else {
          var freshCandidates = candidates.filter(fresh);
          choice = freshCandidates.length ? pick(freshCandidates, rand).text : "";
        }
      }
      var prompt = String(text || "").trim().toLowerCase();
      var promptKey = normaliseLine(text);
      function echoes(value) {
        var key = normaliseLine(value);
        return key !== "" && key === promptKey;
      }
      if (choice && (choice.trim().toLowerCase() === prompt || echoes(choice) || choice.length > 180)) choice = "";
      if (choice && !asksQuestion && !isQuestionText(choice) && rand() < 0.4) {
        var follow = candidates.filter(function (c) { return c.question && c.text !== choice && fresh(c); })
          .sort(function (a, b) {
            return score(b, userTokens, contextTokens) - score(a, userTokens, contextTokens);
          });
        if (follow.length && score(follow[0], userTokens, contextTokens) >= 2) {
          var joined = choice + " " + follow[0].text;
          if (joined.length <= 180) choice = joined;
        }
      }
      if (choice && (choice.trim().toLowerCase() === prompt || echoes(choice) || choice.length > 180)) choice = "";
      last = choice;
      return choice;
    }

    return { reply: reply, opening: opening, size: candidates.length };
  }

  var api = { build: build, words: words, intent: intent };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaMiniChat = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
