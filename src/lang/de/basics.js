/* sema — German grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-de-ich", text: "ich", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-de-du", text: "du", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-de-er", text: "er", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-de-sie", text: "sie", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-de-wir", text: "wir", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-de-sie-3p", text: "sie", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-de-bin", text: "bin", gloss: "I am", kind: "verb", person: "1s", of: "sein" },
    { id: "b-de-bist", text: "bist", gloss: "you are", kind: "verb", person: "2s", of: "sein" },
    { id: "b-de-ist", text: "ist", gloss: "he / she is", kind: "verb", person: "3s", of: "sein" },
    { id: "b-de-sind", text: "sind", gloss: "we are", kind: "verb", person: "1p", of: "sein" },
    { id: "b-de-sind-3p", text: "sind", gloss: "they are", kind: "verb", person: "3p", of: "sein" },
    { id: "b-de-habe", text: "habe", gloss: "I have", kind: "verb", person: "1s", of: "haben" },
    { id: "b-de-hast", text: "hast", gloss: "you have", kind: "verb", person: "2s", of: "haben" },
    { id: "b-de-hat", text: "hat", gloss: "he / she has", kind: "verb", person: "3s", of: "haben" },
    { id: "b-de-haben", text: "haben", gloss: "we have", kind: "verb", person: "1p", of: "haben" },
    { id: "b-de-haben-3p", text: "haben", gloss: "they have", kind: "verb", person: "3p", of: "haben" },
  ],
  rows: [
    { verb: "sein", gloss: "to be", forms: ["bin", "bist", "ist", "sind", "sind"] },
    { verb: "haben", gloss: "to have", forms: ["habe", "hast", "hat", "haben", "haben"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("de", "basics", SEMA_BASICS);
}
