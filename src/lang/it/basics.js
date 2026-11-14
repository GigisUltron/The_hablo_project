/* sema — Italian grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-it-io", text: "io", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-it-tu", text: "tu", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-it-lui", text: "lui", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-it-lei", text: "lei", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-it-noi", text: "noi", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-it-loro", text: "loro", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-it-sono", text: "sono", gloss: "I am", kind: "verb", person: "1s", of: "essere" },
    { id: "b-it-sei", text: "sei", gloss: "you are", kind: "verb", person: "2s", of: "essere" },
    { id: "b-it-e", text: "è", gloss: "he / she is", kind: "verb", person: "3s", of: "essere" },
    { id: "b-it-siamo", text: "siamo", gloss: "we are", kind: "verb", person: "1p", of: "essere" },
    { id: "b-it-sono-3p", text: "sono", gloss: "they are", kind: "verb", person: "3p", of: "essere" },
    { id: "b-it-ho", text: "ho", gloss: "I have", kind: "verb", person: "1s", of: "avere" },
    { id: "b-it-hai", text: "hai", gloss: "you have", kind: "verb", person: "2s", of: "avere" },
    { id: "b-it-ha", text: "ha", gloss: "he / she has", kind: "verb", person: "3s", of: "avere" },
    { id: "b-it-abbiamo", text: "abbiamo", gloss: "we have", kind: "verb", person: "1p", of: "avere" },
    { id: "b-it-hanno", text: "hanno", gloss: "they have", kind: "verb", person: "3p", of: "avere" },
  ],
  rows: [
    { verb: "essere", gloss: "to be", forms: ["sono", "sei", "è", "siamo", "sono"] },
    { verb: "avere", gloss: "to have", forms: ["ho", "hai", "ha", "abbiamo", "hanno"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("it", "basics", SEMA_BASICS);
}
