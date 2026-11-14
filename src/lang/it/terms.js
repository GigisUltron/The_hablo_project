/* sema — Italian connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-already", text: "già", gloss: "already", schema: "clock",
      frame: "Ho ____ finito il lavoro.", contrast: "t-not-yet" },
    { id: "t-not-yet", text: "non ancora", gloss: "not yet", schema: "clock",
      frame: "____ ho finito il lavoro.", contrast: "t-already" },
    { id: "t-always", text: "sempre", gloss: "always", schema: "repeat",
      frame: "____ bevo caffè la mattina.", contrast: "t-never" },
    { id: "t-never", text: "mai", gloss: "never", schema: "repeat",
      frame: "Non sono ____ andato là.", contrast: "t-always" },
    { id: "t-before", text: "prima", gloss: "before", schema: "left",
      frame: "____ vivevo in un'altra città.", contrast: "t-after" },
    { id: "t-after", text: "dopo", gloss: "afterwards", schema: "right",
      frame: "Prima mangia e ____ dorme.", contrast: "t-before" },
    { id: "t-maybe", text: "forse", gloss: "maybe", schema: "question",
      frame: "____ verrà domani.", contrast: null },
    { id: "t-however", text: "tuttavia", gloss: "however", schema: "balance",
      frame: "È caro; ____, lo compro.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("it", "terms", SEMA_TERMS);
}
