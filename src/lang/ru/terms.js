/* sema — Russian connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-already", text: "уже", gloss: "already", schema: "clock",
      frame: "Я ____ закончил работу.", contrast: "t-not-yet" },
    { id: "t-not-yet", text: "ещё не", gloss: "not yet", schema: "clock",
      frame: "Я ____ закончил работу.", contrast: "t-already" },
    { id: "t-always", text: "всегда", gloss: "always", schema: "repeat",
      frame: "Я ____ пью кофе утром.", contrast: "t-never" },
    { id: "t-never", text: "никогда", gloss: "never", schema: "repeat",
      frame: "Я ____ там не был.", contrast: "t-always" },
    { id: "t-before", text: "раньше", gloss: "before", schema: "left",
      frame: "____ я жил в другом городе.", contrast: "t-after" },
    { id: "t-after", text: "потом", gloss: "afterwards", schema: "right",
      frame: "Сначала он ест, ____ спит.", contrast: "t-before" },
    { id: "t-maybe", text: "может быть", gloss: "maybe", schema: "question",
      frame: "____ он придёт завтра.", contrast: null },
    { id: "t-however", text: "однако", gloss: "however", schema: "balance",
      frame: "Это дорого; ____, я покупаю.", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("ru", "terms", SEMA_TERMS);
}
