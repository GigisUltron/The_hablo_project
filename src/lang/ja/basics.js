/* sema — Japanese grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-ja-watashi", text: "私", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-ja-anata", text: "あなた", gloss: "you", kind: "pronoun", person: "2s" },
    { id: "b-ja-kare", text: "彼", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-ja-kanojo", text: "彼女", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-ja-watashitachi", text: "私たち", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-ja-karera", text: "彼ら", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-ja-desu", text: "です", gloss: "to be (polite)", kind: "verb", of: "です" },
    { id: "b-ja-dewa-nai", text: "ではありません", gloss: "to not be (polite)", kind: "verb", of: "です" },
  ],
  rows: [
    { verb: "です", gloss: "to be (polite)", forms: ["です", "ではありません"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("ja", "basics", SEMA_BASICS);
}
