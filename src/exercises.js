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

  /* The harder kind for this card, or null. At most one card in four is hard;
   * the two kinds alternate between those slots so a session is not a wall of
   * the same exercise. */
  function extraKind(index, buildable, listenable) {
    if (index % SPREAD !== LISTEN_SLOT) return null;
    var turn = Math.floor(index / SPREAD) % 2;
    if (turn === 0) return listenable ? "listen" : buildable ? "build" : null;
    return buildable ? "build" : listenable ? "listen" : null;
  }

  var api = {
    MIN_WORDS: MIN_WORDS,
    words: words,
    canBuild: canBuild,
    canListen: canListen,
    sameOrder: sameOrder,
    extraKind: extraKind
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaExercises = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
