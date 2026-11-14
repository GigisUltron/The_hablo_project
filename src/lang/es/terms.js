/* Terms — vocabulary that cannot be drawn.
 *
 * A picture works for "casa". It does not work for "aunque", "todavía" or
 * "sin embargo": those are relations, not objects. Teaching them with an icon
 * would be theatre, so each term is anchored three ways instead:
 *
 *   schema   a small schematic (arrows, a clock, a fork, a balance) that encodes
 *            the *shape* of the relation, not a picture of a thing
 *   frame    a sentence with the term removed — the meaning is the slot it fits
 *   contrast its opposite, or the term it is most often traded for
 *
 * Meaning by distribution: if you can say where a word goes, you know it.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-ya", text: "ya", gloss: "already", schema: "clock",
      frame: "____ he terminado el trabajo.", contrast: "t-todavia" },

    { id: "t-todavia", text: "todavía", gloss: "still / not yet", schema: "clock",
      frame: "____ no he terminado el trabajo.", contrast: "t-ya" },

    { id: "t-siempre", text: "siempre", gloss: "always", schema: "repeat",
      frame: "____ desayuno a las ocho.", contrast: "t-nunca" },

    { id: "t-nunca", text: "nunca", gloss: "never", schema: "repeat",
      frame: "____ he estado allí.", contrast: "t-siempre" },

    { id: "t-antes", text: "antes", gloss: "before / used to", schema: "left",
      frame: "____ vivía en otra ciudad.", contrast: "t-despues" },

    { id: "t-despues", text: "después", gloss: "afterwards", schema: "right",
      frame: "Primero come y ____ duerme.", contrast: "t-antes" },

    { id: "t-aunque", text: "aunque", gloss: "although / even if", schema: "fork",
      frame: "Voy a salir ____ llueva.", contrast: "t-por-eso" },

    { id: "t-sin-embargo", text: "sin embargo", gloss: "however", schema: "balance",
      frame: "Es caro; ____, lo compro.", contrast: "t-ademas" },

    { id: "t-mientras", text: "mientras", gloss: "while", schema: "parallel",
      frame: "Estudio ____ escucho música.", contrast: null },

    { id: "t-quiza", text: "quizá", gloss: "maybe", schema: "question",
      frame: "____ venga mañana.", contrast: null },

    { id: "t-ademas", text: "además", gloss: "moreover", schema: "plus",
      frame: "Es barato y, ____, está cerca.", contrast: "t-sin-embargo" },

    { id: "t-por-eso", text: "por eso", gloss: "that's why", schema: "chain",
      frame: "No dormí; ____ estoy cansado.", contrast: "t-aunque" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("es", "terms", SEMA_TERMS);
}
