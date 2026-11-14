/* sema — Portuguese connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-pt-already", text: "já", gloss: "already", schema: "clock",
      frame: "____ terminei o trabalho.", contrast: "t-pt-not-yet" },
    { id: "t-pt-not-yet", text: "ainda não", gloss: "not yet", schema: "clock",
      frame: "____ terminei o trabalho.", contrast: "t-pt-already" },
    { id: "t-pt-always", text: "sempre", gloss: "always", schema: "repeat",
      frame: "____ tomo café de manhã.", contrast: "t-pt-never" },
    { id: "t-pt-never", text: "nunca", gloss: "never", schema: "repeat",
      frame: "Eu ____ fui lá.", contrast: "t-pt-always" },
    { id: "t-pt-before", text: "antes", gloss: "before", schema: "left",
      frame: "____ eu morava em outra cidade.", contrast: "t-pt-after" },
    { id: "t-pt-after", text: "depois", gloss: "afterwards", schema: "right",
      frame: "Primeiro ele come e ____ dorme.", contrast: "t-pt-before" },
    { id: "t-pt-maybe", text: "talvez", gloss: "maybe", schema: "question",
      frame: "____ ele venha amanhã.", contrast: null },
    { id: "t-pt-however", text: "no entanto", gloss: "however", schema: "balance",
      frame: "É caro; ____, eu compro.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("pt", "terms", SEMA_TERMS);
}
