/* sema — Turkish connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-tr-already", text: "zaten", gloss: "already", schema: "clock",
      frame: "İşi ____ bitirdim.", contrast: "t-tr-not-yet" },
    { id: "t-tr-not-yet", text: "henüz", gloss: "not yet", schema: "clock",
      frame: "İşi ____ bitirmedim.", contrast: "t-tr-already" },
    { id: "t-tr-always", text: "her zaman", gloss: "always", schema: "repeat",
      frame: "____ sabahları kahve içerim.", contrast: "t-tr-never" },
    { id: "t-tr-never", text: "asla", gloss: "never", schema: "repeat",
      frame: "Oraya ____ gitmedim.", contrast: "t-tr-always" },
    { id: "t-tr-before", text: "önce", gloss: "before", schema: "left",
      frame: "____ başka bir şehirde yaşıyordum.", contrast: "t-tr-after" },
    { id: "t-tr-after", text: "sonra", gloss: "afterwards", schema: "right",
      frame: "Önce yer, ____ uyur.", contrast: "t-tr-before" },
    { id: "t-tr-maybe", text: "belki", gloss: "maybe", schema: "question",
      frame: "____ yarın gelir.", contrast: null },
    { id: "t-tr-however", text: "ancak", gloss: "however", schema: "balance",
      frame: "Pahalı; ____, alıyorum.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("tr", "terms", SEMA_TERMS);
}
