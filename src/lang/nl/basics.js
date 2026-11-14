/* sema — Dutch grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-nl-ik", text: "ik", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-nl-jij", text: "jij", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-nl-hij", text: "hij", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-nl-zij", text: "zij", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-nl-wij", text: "wij", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-nl-zij-3p", text: "zij", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-nl-ben", text: "ben", gloss: "I am", kind: "verb", person: "1s", of: "zijn" },
    { id: "b-nl-bent", text: "bent", gloss: "you are", kind: "verb", person: "2s", of: "zijn" },
    { id: "b-nl-is", text: "is", gloss: "he / she is", kind: "verb", person: "3s", of: "zijn" },
    { id: "b-nl-zijn", text: "zijn", gloss: "we are", kind: "verb", person: "1p", of: "zijn" },
    { id: "b-nl-zijn-3p", text: "zijn", gloss: "they are", kind: "verb", person: "3p", of: "zijn" },
    { id: "b-nl-heb", text: "heb", gloss: "I have", kind: "verb", person: "1s", of: "hebben" },
    { id: "b-nl-hebt", text: "hebt", gloss: "you have", kind: "verb", person: "2s", of: "hebben" },
    { id: "b-nl-heeft", text: "heeft", gloss: "he / she has", kind: "verb", person: "3s", of: "hebben" },
    { id: "b-nl-hebben", text: "hebben", gloss: "we have", kind: "verb", person: "1p", of: "hebben" },
    { id: "b-nl-hebben-3p", text: "hebben", gloss: "they have", kind: "verb", person: "3p", of: "hebben" },
  ],
  rows: [
    { verb: "zijn", gloss: "to be", forms: ["ben", "bent", "is", "zijn", "zijn"] },
    { verb: "hebben", gloss: "to have", forms: ["heb", "hebt", "heeft", "hebben", "hebben"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("nl", "basics", SEMA_BASICS);
}
