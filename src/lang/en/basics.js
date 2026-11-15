/* sema — English grammar deck: pronouns and the two verbs every sentence
 * leans on.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-en-i", text: "I", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-en-you", text: "you", gloss: "you", kind: "pronoun", person: "2s" },
    { id: "b-en-he", text: "he", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-en-she", text: "she", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-en-we", text: "we", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-en-they", text: "they", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-en-am", text: "I am", gloss: "the verb be", kind: "verb", person: "1s", of: "to be" },
    { id: "b-en-are", text: "you are", gloss: "the verb be", kind: "verb", person: "2s", of: "to be" },
    { id: "b-en-is", text: "he / she is", gloss: "the verb be", kind: "verb", person: "3s", of: "to be" },
    { id: "b-en-are-we", text: "we are", gloss: "the verb be", kind: "verb", person: "1p", of: "to be" },
    { id: "b-en-are-they", text: "they are", gloss: "the verb be", kind: "verb", person: "3p", of: "to be" },
    { id: "b-en-have", text: "I have", gloss: "the verb have", kind: "verb", person: "1s", of: "to have" },
    { id: "b-en-have-you", text: "you have", gloss: "the verb have", kind: "verb", person: "2s", of: "to have" },
    { id: "b-en-has", text: "he / she has", gloss: "the verb have", kind: "verb", person: "3s", of: "to have" },
    { id: "b-en-have-we", text: "we have", gloss: "the verb have", kind: "verb", person: "1p", of: "to have" },
    { id: "b-en-have-they", text: "they have", gloss: "the verb have", kind: "verb", person: "3p", of: "to have" },
  ],
  rows: [
    { verb: "to be", gloss: "to be", forms: ["am", "are", "is", "are", "are"] },
    { verb: "to have", gloss: "to have", forms: ["have", "have", "has", "have", "have"] },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("en", "basics", SEMA_BASICS);
}
