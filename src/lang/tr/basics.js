/* sema — Turkish grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-tr-ben", text: "ben", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-tr-sen", text: "sen", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-tr-o", text: "o", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-tr-o-she", text: "o", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-tr-biz", text: "biz", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-tr-onlar", text: "onlar", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-tr-gidiyorum", text: "gidiyorum", gloss: "I go", kind: "verb", person: "1s", of: "gitmek" },
    { id: "b-tr-gidiyorsun", text: "gidiyorsun", gloss: "you go", kind: "verb", person: "2s", of: "gitmek" },
    { id: "b-tr-gidiyor", text: "gidiyor", gloss: "he / she goes", kind: "verb", person: "3s", of: "gitmek" },
    { id: "b-tr-gidiyoruz", text: "gidiyoruz", gloss: "we go", kind: "verb", person: "1p", of: "gitmek" },
    { id: "b-tr-gidiyorlar", text: "gidiyorlar", gloss: "they go", kind: "verb", person: "3p", of: "gitmek" },
    { id: "b-tr-istiyorum", text: "istiyorum", gloss: "I want", kind: "verb", person: "1s", of: "istemek" },
    { id: "b-tr-istiyorsun", text: "istiyorsun", gloss: "you want", kind: "verb", person: "2s", of: "istemek" },
    { id: "b-tr-istiyor", text: "istiyor", gloss: "he / she wants", kind: "verb", person: "3s", of: "istemek" },
    { id: "b-tr-istiyoruz", text: "istiyoruz", gloss: "we want", kind: "verb", person: "1p", of: "istemek" },
    { id: "b-tr-istiyorlar", text: "istiyorlar", gloss: "they want", kind: "verb", person: "3p", of: "istemek" },
  ],
  rows: [
    { verb: "gitmek", gloss: "to go", forms: ["gidiyorum", "gidiyorsun", "gidiyor", "gidiyoruz", "gidiyorlar"] },
    { verb: "istemek", gloss: "to want", forms: ["istiyorum", "istiyorsun", "istiyor", "istiyoruz", "istiyorlar"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("tr", "basics", SEMA_BASICS);
}
