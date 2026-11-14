/* sema — Japanese reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-ja-ichiba",
      title: "土曜日の市場",
      level: 1,
      body: "土曜日の朝、町の市場は七時に開きます。母はパンと果物とコーヒーを買います。私は水を買い、朝ごはんにりんごを一つ持ちます。店の人は笑って「おはようございます」と言います。私たちはお金を払って、歩いて家に帰ります。家で一緒にコーヒーを飲みます。それから私は本を読み、母は庭で仕事をします。",
      questions: [
        { q: "母は何を買いますか。", options: ["パンと果物とコーヒー", "水とりんご", "花と牛乳"], answer: 0 },
        { q: "二人はどうやって家に帰りますか。", options: ["バスで", "歩いて", "車で"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("ja", "texts", SEMA_TEXTS);
}
