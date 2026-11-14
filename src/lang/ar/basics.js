/* sema — Arabic grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-ar-ana", text: "أنا", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-ar-anta", text: "أنت", gloss: "you (m.)", kind: "pronoun", person: "2s" },
    { id: "b-ar-huwa", text: "هو", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-ar-hiya", text: "هي", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-ar-nahnu", text: "نحن", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-ar-hum", text: "هم", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-ar-adhhab", text: "أذهب", gloss: "I go", kind: "verb", person: "1s", of: "ذهب" },
    { id: "b-ar-tadhhab", text: "تذهب", gloss: "you go", kind: "verb", person: "2s", of: "ذهب" },
    { id: "b-ar-yadhhab", text: "يذهب", gloss: "he goes", kind: "verb", person: "3s", of: "ذهب" },
    { id: "b-ar-nadhhab", text: "نذهب", gloss: "we go", kind: "verb", person: "1p", of: "ذهب" },
    { id: "b-ar-yadhhabun", text: "يذهبون", gloss: "they go", kind: "verb", person: "3p", of: "ذهب" },
    { id: "b-ar-urid", text: "أريد", gloss: "I want", kind: "verb", person: "1s", of: "أراد" },
    { id: "b-ar-turid", text: "تريد", gloss: "you want", kind: "verb", person: "2s", of: "أراد" },
    { id: "b-ar-yurid", text: "يريد", gloss: "he wants", kind: "verb", person: "3s", of: "أراد" },
    { id: "b-ar-nurid", text: "نريد", gloss: "we want", kind: "verb", person: "1p", of: "أراد" },
    { id: "b-ar-yuridun", text: "يريدون", gloss: "they want", kind: "verb", person: "3p", of: "أراد" },
  ],
  rows: [
    { verb: "ذهب", gloss: "to go", forms: ["أذهب", "تذهب", "يذهب", "نذهب", "يذهبون"] },
    { verb: "أراد", gloss: "to want", forms: ["أريد", "تريد", "يريد", "نريد", "يريدون"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("ar", "basics", SEMA_BASICS);
}
