/* sema — Arabic connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-already", text: "بالفعل", gloss: "already", schema: "clock",
      frame: "لقد ____ أنهيت العمل.", contrast: "t-not-yet" },
    { id: "t-not-yet", text: "لم ينتهِ بعد", gloss: "not yet", schema: "clock",
      frame: "العمل ____.", contrast: "t-already" },
    { id: "t-always", text: "دائماً", gloss: "always", schema: "repeat",
      frame: "أشرب القهوة ____ في الصباح.", contrast: "t-never" },
    { id: "t-never", text: "أبداً", gloss: "never", schema: "repeat",
      frame: "لم أذهب إلى هناك ____.", contrast: "t-always" },
    { id: "t-before", text: "قبل", gloss: "before", schema: "left",
      frame: "____ كنت أعيش في مدينة أخرى.", contrast: "t-after" },
    { id: "t-after", text: "بعد", gloss: "afterwards", schema: "right",
      frame: "يأكل أولاً ثم ____ ينام.", contrast: "t-before" },
    { id: "t-maybe", text: "ربما", gloss: "maybe", schema: "question",
      frame: "____ سيأتي غداً.", contrast: null },
    { id: "t-however", text: "لكن", gloss: "however", schema: "balance",
      frame: "هذا غالٍ؛ ____، سأشتريه.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("ar", "terms", SEMA_TERMS);
}
