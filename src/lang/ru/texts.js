/* sema — Russian reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-ru-rynok",
      title: "Субботний рынок",
      level: 1,
      body: "В субботу утром рынок в районе открывается в семь часов. Моя мама покупает хлеб, фрукты и кофе. Я покупаю воду и беру яблоко на завтрак. Продавец улыбается и говорит: «Доброе утро». Мы платим и идём домой пешком. Дома мы вместе пьём кофе. Потом я читаю, а мама работает в саду.",
      questions: [
        { q: "Что покупает мама?", options: ["хлеб, фрукты и кофе", "воду и яблоко", "цветы и молоко"], answer: 0 },
        { q: "Как они возвращаются домой?", options: ["на автобусе", "пешком", "на машине"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("ru", "texts", SEMA_TEXTS);
}
