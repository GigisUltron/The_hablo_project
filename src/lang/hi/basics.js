/* sema — Hindi grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-hi-main", text: "मैं", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-hi-tum", text: "तुम", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-hi-vah", text: "वह", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-hi-vah-she", text: "वह", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-hi-ham", text: "हम", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-hi-ve", text: "वे", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-hi-jata-hoon", text: "जाता हूँ", gloss: "I go", kind: "verb", person: "1s", of: "जाना" },
    { id: "b-hi-jate-ho", text: "जाते हो", gloss: "you go", kind: "verb", person: "2s", of: "जाना" },
    { id: "b-hi-jata-hai", text: "जाता है", gloss: "he goes", kind: "verb", person: "3s", of: "जाना" },
    { id: "b-hi-jate-hain", text: "जाते हैं", gloss: "we go", kind: "verb", person: "1p", of: "जाना" },
    { id: "b-hi-jate-hain-3p", text: "जाते हैं", gloss: "they go", kind: "verb", person: "3p", of: "जाना" },
    { id: "b-hi-khata-hoon", text: "खाता हूँ", gloss: "I eat", kind: "verb", person: "1s", of: "खाना" },
    { id: "b-hi-khate-ho", text: "खाते हो", gloss: "you eat", kind: "verb", person: "2s", of: "खाना" },
    { id: "b-hi-khata-hai", text: "खाता है", gloss: "he eats", kind: "verb", person: "3s", of: "खाना" },
    { id: "b-hi-khate-hain", text: "खाते हैं", gloss: "we eat", kind: "verb", person: "1p", of: "खाना" },
    { id: "b-hi-khate-hain-3p", text: "खाते हैं", gloss: "they eat", kind: "verb", person: "3p", of: "खाना" },
  ],
  rows: [
    { verb: "जाना", gloss: "to go", forms: ["जाता हूँ", "जाते हो", "जाता है", "जाते हैं", "जाते हैं"] },
    { verb: "खाना", gloss: "to eat", forms: ["खाता हूँ", "खाते हो", "खाता है", "खाते हैं", "खाते हैं"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("hi", "basics", SEMA_BASICS);
}
