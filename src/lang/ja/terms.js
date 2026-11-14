/* sema — Japanese connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-ja-already", text: "もう", gloss: "already", schema: "clock",
      frame: "仕事は____終わりました。", contrast: "t-ja-not-yet" },
    { id: "t-ja-not-yet", text: "まだ", gloss: "not yet", schema: "clock",
      frame: "仕事は____終わっていません。", contrast: "t-ja-already" },
    { id: "t-ja-always", text: "いつも", gloss: "always", schema: "repeat",
      frame: "____朝コーヒーを飲みます。", contrast: "t-ja-never" },
    { id: "t-ja-never", text: "決して", gloss: "never", schema: "repeat",
      frame: "そんなことは____しません。", contrast: "t-ja-always" },
    { id: "t-ja-before", text: "前に", gloss: "before", schema: "left",
      frame: "____別の町に住んでいました。", contrast: "t-ja-after" },
    { id: "t-ja-after", text: "後で", gloss: "afterwards", schema: "right",
      frame: "まず食べて、____寝ます。", contrast: "t-ja-before" },
    { id: "t-ja-maybe", text: "たぶん", gloss: "maybe", schema: "question",
      frame: "____明日来ます。", contrast: null },
    { id: "t-ja-however", text: "しかし", gloss: "however", schema: "balance",
      frame: "高いです。____、買います。", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("ja", "terms", SEMA_TERMS);
}
