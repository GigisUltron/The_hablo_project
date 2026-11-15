/* sema — a tiny, standard-library-only prediction model for conversation.
 *
 * It is not a neural network. It learns the words and sentences the pack
 * already carries, scores authored replies against the learner's line, and
 * uses word-level bigrams to produce a short continuation when no exact
 * retrieval fits. That is enough to keep an offline conversation moving
 * without pretending to be a general-purpose model.
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

  function build(pack) {
    var candidates = [];
    var bigrams = {};
    var starts = [];

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
      ((d && d.turns) || []).forEach(function (t) {
        add(t.es, "dialogue");
        add(t.reply, "reply");
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

    function pick(list) {
      return list.length ? list[Math.floor(Math.random() * list.length)] : "";
    }

    function opening() {
      var d = pick(conv);
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

    function generate(userTokens) {
      var seed = userTokens.find(function (w) { return bigrams[w] && bigrams[w].length; });
      if (!seed) return "";
      var out = [seed];
      var current = seed;
      for (var i = 0; i < 10; i += 1) {
        var options = bigrams[current];
        if (!options || !options.length) break;
        current = pick(options);
        out.push(current);
      }
      if (out.length < 3) return "";
      var text = out.join(" ");
      return hasCjk(text) ? "" : text;
    }

    function reply(text, opts) {
      var o = opts || {};
      var userTokens = words(text);
      var contextTokens = words(o.context || "");
      var lower = String(text || "").toLowerCase();
      var greeting = /^(hi|hello|hey|hola|bonjour|ciao|hallo|olá|привет|merhaba|مرحبا|नमस्ते|こんにちは|你好)/i.test(lower);
      var thanks = /thank|thanks|gracias|merci|grazie|obrigad|спасибо|teşekk|شكر|धन्यवाद|ありがとう|谢谢/i.test(lower);
      var ranked = candidates.slice().sort(function (a, b) {
        return score(b, userTokens, contextTokens) - score(a, userTokens, contextTokens);
      });
      var best = ranked.filter(function (c) { return score(c, userTokens, contextTokens) > 0; });
      var choice = "";
      if (best.length) {
        var pool = best.slice(0, Math.min(4, best.length)).filter(function (c) { return c.text !== (o.last || ""); });
        if (greeting) {
          var hello = pool.filter(function (c) { return /^(hi|hello|hey|hola|bonjour|ciao|hallo|olá|привет|merhaba|مرحبا|नमस्ते|こんにちは|你好)/i.test(c.text); });
          if (hello.length) pool = hello;
        }
        if (thanks) {
          var warm = pool.filter(function (c) { return !c.question; });
          if (warm.length) pool = warm;
        }
        choice = (pool.length ? pick(pool) : best[0]).text;
      } else if (userTokens.length) {
        choice = generate(userTokens);
      }
      if (!choice) {
        var questions = candidates.filter(function (c) { return c.question && c.text !== (o.last || ""); });
        choice = questions.length ? pick(questions).text : (candidates.length ? pick(candidates).text : "");
      }
      if (choice && !/[?？؟]\s*$/.test(choice) && Math.random() < 0.4) {
        var follow = candidates.filter(function (c) { return c.question && c.text !== choice; })
          .sort(function (a, b) {
            return score(b, userTokens, contextTokens) - score(a, userTokens, contextTokens);
          });
        if (follow.length && score(follow[0], userTokens, contextTokens) >= 2) {
          choice += " " + follow[0].text;
        }
      }
      last = choice;
      return choice;
    }

    return { reply: reply, opening: opening, size: candidates.length };
  }

  var api = { build: build, words: words };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaMiniChat = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
