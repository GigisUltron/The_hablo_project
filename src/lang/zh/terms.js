/* sema — Chinese connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-already", text: "已经", gloss: "already", schema: "clock",
      frame: "我____做完工作了。", contrast: "t-not-yet" },
    { id: "t-not-yet", text: "还没", gloss: "not yet", schema: "clock",
      frame: "我____做完工作。", contrast: "t-already" },
    { id: "t-always", text: "总是", gloss: "always", schema: "repeat",
      frame: "我____早上喝咖啡。", contrast: "t-never" },
    { id: "t-never", text: "从不", gloss: "never", schema: "repeat",
      frame: "我____喝咖啡。", contrast: "t-always" },
    { id: "t-before", text: "以前", gloss: "before", schema: "left",
      frame: "____我住在另一个城市。", contrast: "t-after" },
    { id: "t-after", text: "以后", gloss: "afterwards", schema: "right",
      frame: "先吃饭，____睡觉。", contrast: "t-before" },
    { id: "t-maybe", text: "也许", gloss: "maybe", schema: "question",
      frame: "____他明天会来。", contrast: null },
    { id: "t-however", text: "但是", gloss: "however", schema: "balance",
      frame: "很贵；____，我还是买。", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("zh", "terms", SEMA_TERMS);
}
