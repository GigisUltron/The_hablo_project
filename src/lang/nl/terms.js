/* sema — Dutch connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-nl-already", text: "al", gloss: "already", schema: "clock",
      frame: "Ik heb het werk ____ afgemaakt.", contrast: "t-nl-not-yet" },
    { id: "t-nl-not-yet", text: "nog niet", gloss: "not yet", schema: "clock",
      frame: "Ik heb het werk ____ afgemaakt.", contrast: "t-nl-already" },
    { id: "t-nl-always", text: "altijd", gloss: "always", schema: "repeat",
      frame: "Ik drink ____ koffie in de ochtend.", contrast: "t-nl-never" },
    { id: "t-nl-never", text: "nooit", gloss: "never", schema: "repeat",
      frame: "Ik ben ____ daar geweest.", contrast: "t-nl-always" },
    { id: "t-nl-before", text: "eerder", gloss: "before", schema: "left",
      frame: "____ woonde ik in een andere stad.", contrast: "t-nl-after" },
    { id: "t-nl-after", text: "daarna", gloss: "afterwards", schema: "right",
      frame: "Eerst eet hij, ____ slaapt hij.", contrast: "t-nl-before" },
    { id: "t-nl-maybe", text: "misschien", gloss: "maybe", schema: "question",
      frame: "____ komt hij morgen.", contrast: null },
    { id: "t-nl-however", text: "echter", gloss: "however", schema: "balance",
      frame: "Het is duur; ____, ik koop het.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("nl", "terms", SEMA_TERMS);
}
