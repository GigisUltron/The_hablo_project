/* Two harder exercise kinds, and the rule that keeps them rare.
 *
 * BUILD THE SENTENCE needs a phrase of three or more words; LISTEN AND PICK
 * needs a clip (a bundled one, or a device voice). Both are gated on the data
 * the pack actually has, never on a language code, so a deck without either
 * simply never sees these cards.
 *
 * Pure, no DOM: the app asks these questions, the tests ask them too.
 */
(function (root) {
  "use strict";

  var MIN_WORDS = 3;

  function words(text) {
    return String(text == null ? "" : text).trim().split(/\s+/).filter(Boolean);
  }

  function canBuild(text) {
    return words(text).length >= MIN_WORDS;
  }

  /* A bundled clip is the good case; a device voice is the fallback. With
   * neither, the speaker would be dead, so the exercise does not exist. */
  function canListen(audio, id, hasTTS) {
    if (audio && Object.prototype.hasOwnProperty.call(audio, id)) return true;
    return !!hasTTS;
  }

  /* Exact order, after collapsing whitespace: "Hola , qué tal ?" is the same
   * sentence as "Hola, qué tal ?" only when the words line up in place. */
  function sameOrder(attempt, target) {
    return words(attempt).join(" ") === words(target).join(" ");
  }

  var LISTEN_SLOT = 2;   // one card in four is a harder one
  var SPREAD = 4;
  var HARD = ["listen", "build", "gap"];

  /* Production means the learner generated the target, not picked it out of
   * a line-up. This drives an honest "can produce" count; it does not change
   * the SRS interval or the scheduling. */
  function isProduction(type) {
    return ["write", "type-translation", "translate-out", "listen-type", "say", "build", "message", "gap"]
      .indexOf(String(type || "")) !== -1;
  }

  /* The harder kind for this card, or null. At most one card in four is hard;
   * the three kinds rotate through those slots so a session is not a wall of
   * the same exercise, and a kind the data cannot support is passed over. */
  function extraKind(index, available) {
    if (index % SPREAD !== LISTEN_SLOT) return null;
    var a = available || {};
    var turn = Math.floor(index / SPREAD);
    for (var i = 0; i < HARD.length; i += 1) {
      var kind = HARD[(turn + i) % HARD.length];
      if (a[kind]) return kind;
    }
    return null;
  }

  /* Fill the gap: one word of a sentence is removed and four words are offered.
   * A phrase needs three words and a context line; a text sentence only has to
   * contain the word being asked for. */
  function gapPhrase(text, context) {
    var list = words(text);
    if (list.length < MIN_WORDS || !context) return null;
    var answer = list.slice().sort(function (a, b) { return b.length - a.length; })[0];
    return { answer: answer, sentence: blank(text, answer) };
  }

  function gapWord(sentence, word) {
    var text = String(sentence || "");
    var target = String(word || "");
    if (!target || words(text).length < MIN_WORDS) return null;
    var at = text.toLowerCase().indexOf(target.toLowerCase());
    if (at === -1) return null;
    return { answer: text.slice(at, at + target.length), sentence: blank(text, target) };
  }

  function blank(sentence, word) {
    var text = String(sentence || "");
    var at = text.toLowerCase().indexOf(String(word).toLowerCase());
    if (at === -1) return text;
    return text.slice(0, at) + "___" + text.slice(at + String(word).length);
  }

  function gradeGap(answer, expected) {
    return sameOrder(answer, expected);
  }

  var api = {
    MIN_WORDS: MIN_WORDS,
    words: words,
    canBuild: canBuild,
    canListen: canListen,
    sameOrder: sameOrder,
    gapPhrase: gapPhrase,
    gapWord: gapWord,
    blank: blank,
    gradeGap: gradeGap,
    extraKind: extraKind,
    isProduction: isProduction
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaExercises = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
