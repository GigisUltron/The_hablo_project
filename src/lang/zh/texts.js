/* sema — Chinese reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-zh-shichang",
      title: "星期六的市场",
      level: 1,
      body: "星期六早上，社区的市场七点开门。妈妈买面包、水果和咖啡。我买水，还带一个苹果当早饭。摊主笑着说：「早上好。」我们付了钱，走路回家。在家里我们一起喝咖啡。然后我看书，妈妈在花园里干活。",
      questions: [
        { q: "妈妈买什么？", options: ["面包、水果和咖啡", "水和一个苹果", "花和牛奶"], answer: 0 },
        { q: "他们怎么回家？", options: ["坐公共汽车", "走路", "开车"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("zh", "texts", SEMA_TEXTS);
}
