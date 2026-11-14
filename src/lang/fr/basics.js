/* Grammar foundations for French: the pronouns, and both verbs to be. */
var SEMA_BASICS = {
  items: [
    { id: "b-fr-je", text: "je", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-fr-tu", text: "tu", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-fr-il", text: "il", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-fr-elle", text: "elle", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-fr-nous", text: "nous", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-fr-ils", text: "ils", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-fr-suis", text: "suis", gloss: "I am", kind: "verb", of: "être", person: "1s" },
    { id: "b-fr-es", text: "es", gloss: "you are", kind: "verb", of: "être", person: "2s" },
    { id: "b-fr-est", text: "est", gloss: "he / she is", kind: "verb", of: "être", person: "3s" },
    { id: "b-fr-sommes", text: "sommes", gloss: "we are", kind: "verb", of: "être", person: "1p" },
    { id: "b-fr-sont", text: "sont", gloss: "they are", kind: "verb", of: "être", person: "3p" },
    { id: "b-fr-ai", text: "ai", gloss: "I have", kind: "verb", of: "avoir", person: "1s" },
    { id: "b-fr-as", text: "as", gloss: "you have", kind: "verb", of: "avoir", person: "2s" },
    { id: "b-fr-a", text: "a", gloss: "he / she has", kind: "verb", of: "avoir", person: "3s" },
    { id: "b-fr-avons", text: "avons", gloss: "we have", kind: "verb", of: "avoir", person: "1p" },
    { id: "b-fr-ont", text: "ont", gloss: "they have", kind: "verb", of: "avoir", person: "3p" }
  ],
  rows: [
    { verb: "être", gloss: "to be", forms: ["suis", "es", "est", "sommes", "sont"] },
    { verb: "avoir", gloss: "to have", forms: ["ai", "as", "a", "avons", "ont"] }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("fr", "basics", SEMA_BASICS);
}
