/* sema — Portuguese grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-pt-eu", text: "eu", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-pt-tu", text: "tu", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-pt-ele", text: "ele", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-pt-ela", text: "ela", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-pt-nos", text: "nós", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-pt-eles", text: "eles", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-pt-sou", text: "sou", gloss: "I am", kind: "verb", person: "1s", of: "ser" },
    { id: "b-pt-es", text: "és", gloss: "you are", kind: "verb", person: "2s", of: "ser" },
    { id: "b-pt-e", text: "é", gloss: "he / she is", kind: "verb", person: "3s", of: "ser" },
    { id: "b-pt-somos", text: "somos", gloss: "we are", kind: "verb", person: "1p", of: "ser" },
    { id: "b-pt-sao", text: "são", gloss: "they are", kind: "verb", person: "3p", of: "ser" },
    { id: "b-pt-tenho", text: "tenho", gloss: "I have", kind: "verb", person: "1s", of: "ter" },
    { id: "b-pt-tens", text: "tens", gloss: "you have", kind: "verb", person: "2s", of: "ter" },
    { id: "b-pt-tem", text: "tem", gloss: "he / she has", kind: "verb", person: "3s", of: "ter" },
    { id: "b-pt-temos", text: "temos", gloss: "we have", kind: "verb", person: "1p", of: "ter" },
    { id: "b-pt-tem-3p", text: "têm", gloss: "they have", kind: "verb", person: "3p", of: "ter" },
  ],
  rows: [
    { verb: "ser", gloss: "to be", forms: ["sou", "és", "é", "somos", "são"] },
    { verb: "ter", gloss: "to have", forms: ["tenho", "tens", "tem", "temos", "têm"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("pt", "basics", SEMA_BASICS);
}
