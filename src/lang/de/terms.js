/* sema — German connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-de-already", text: "schon", gloss: "already", schema: "clock",
      frame: "Ich habe ____ die Arbeit beendet.", contrast: "t-de-not-yet" },
    { id: "t-de-not-yet", text: "noch nicht", gloss: "not yet", schema: "clock",
      frame: "Ich habe die Arbeit ____ beendet.", contrast: "t-de-already" },
    { id: "t-de-always", text: "immer", gloss: "always", schema: "repeat",
      frame: "Ich trinke ____ morgens Kaffee.", contrast: "t-de-never" },
    { id: "t-de-never", text: "nie", gloss: "never", schema: "repeat",
      frame: "Ich war ____ dort.", contrast: "t-de-always" },
    { id: "t-de-before", text: "vorher", gloss: "before", schema: "left",
      frame: "____ habe ich in einer anderen Stadt gewohnt.", contrast: "t-de-after" },
    { id: "t-de-after", text: "danach", gloss: "afterwards", schema: "right",
      frame: "Erst isst er, ____ schläft er.", contrast: "t-de-before" },
    { id: "t-de-maybe", text: "vielleicht", gloss: "maybe", schema: "question",
      frame: "____ kommt er morgen.", contrast: null },
    { id: "t-de-however", text: "jedoch", gloss: "however", schema: "balance",
      frame: "Es ist teuer; ____ kaufe ich es.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("de", "terms", SEMA_TERMS);
}
