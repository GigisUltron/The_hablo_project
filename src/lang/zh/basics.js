/* sema — Chinese grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-zh-wo", text: "我", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-zh-ni", text: "你", gloss: "you", kind: "pronoun", person: "2s" },
    { id: "b-zh-ta", text: "他", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-zh-ta-she", text: "她", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-zh-women", text: "我们", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-zh-tamen", text: "他们", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-zh-shi", text: "是", gloss: "to be", kind: "verb", of: "是" },
    { id: "b-zh-bushi", text: "不是", gloss: "to not be", kind: "verb", of: "是" },
    { id: "b-zh-chi", text: "吃", gloss: "to eat", kind: "verb", of: "吃" },
    { id: "b-zh-he", text: "喝", gloss: "to drink", kind: "verb", of: "喝" },
    { id: "b-zh-qu", text: "去", gloss: "to go", kind: "verb", of: "去" },
    { id: "b-zh-lai", text: "来", gloss: "to come", kind: "verb", of: "来" },
    { id: "b-zh-mai", text: "买", gloss: "to buy", kind: "verb", of: "买" },
  ],
  rows: [
    { verb: "是", gloss: "to be", forms: ["是", "不是"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("zh", "basics", SEMA_BASICS);
}
