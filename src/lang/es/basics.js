/* Grammar foundations: the layer under the phrases.
 *
 * These are not phrases and not pictures. A pronoun has no emoji, and "soy"
 * cannot be guessed from an apple. Each item names its part of speech, and verb
 * forms name their person, so the drill can ask "who is it talking about?"
 */
var SEMA_BASICS = {
  items: [
    { id: "b-yo", text: "yo", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-tu", text: "tú", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-el", text: "él", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-ella", text: "ella", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-nosotros", text: "nosotros", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-ellos", text: "ellos", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-soy", text: "soy", gloss: "I am", kind: "verb", of: "ser", person: "1s" },
    { id: "b-eres", text: "eres", gloss: "you are", kind: "verb", of: "ser", person: "2s" },
    { id: "b-es", text: "es", gloss: "he / she is", kind: "verb", of: "ser", person: "3s" },
    { id: "b-somos", text: "somos", gloss: "we are", kind: "verb", of: "ser", person: "1p" },
    { id: "b-son", text: "son", gloss: "they are", kind: "verb", of: "ser", person: "3p" },
    { id: "b-estoy", text: "estoy", gloss: "I am (right now)", kind: "verb", of: "estar", person: "1s" },
    { id: "b-estas", text: "estás", gloss: "you are (right now)", kind: "verb", of: "estar", person: "2s" },
    { id: "b-esta", text: "está", gloss: "he / she is (right now)", kind: "verb", of: "estar", person: "3s" },
    { id: "b-estamos", text: "estamos", gloss: "we are (right now)", kind: "verb", of: "estar", person: "1p" },
    { id: "b-estan", text: "están", gloss: "they are (right now)", kind: "verb", of: "estar", person: "3p" }
  ],
  rows: [
    { verb: "ser", gloss: "to be (identity)", forms: ["soy", "eres", "es", "somos", "son"] },
    { verb: "estar", gloss: "to be (state, place)", forms: ["estoy", "estás", "está", "estamos", "están"] }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("es", "basics", SEMA_BASICS);
}
