/* sema — Russian grammar deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_BASICS = {
  items: [
    { id: "b-ru-ya", text: "я", gloss: "I", kind: "pronoun", person: "1s" },
    { id: "b-ru-ty", text: "ты", gloss: "you (informal)", kind: "pronoun", person: "2s" },
    { id: "b-ru-on", text: "он", gloss: "he", kind: "pronoun", person: "3s" },
    { id: "b-ru-ona", text: "она", gloss: "she", kind: "pronoun", person: "3s" },
    { id: "b-ru-my", text: "мы", gloss: "we", kind: "pronoun", person: "1p" },
    { id: "b-ru-oni", text: "они", gloss: "they", kind: "pronoun", person: "3p" },
    { id: "b-ru-znayu", text: "знаю", gloss: "I know", kind: "verb", person: "1s", of: "знать" },
    { id: "b-ru-znaesh", text: "знаешь", gloss: "you know", kind: "verb", person: "2s", of: "знать" },
    { id: "b-ru-znaet", text: "знает", gloss: "he / she knows", kind: "verb", person: "3s", of: "знать" },
    { id: "b-ru-znaem", text: "знаем", gloss: "we know", kind: "verb", person: "1p", of: "знать" },
    { id: "b-ru-znayut", text: "знают", gloss: "they know", kind: "verb", person: "3p", of: "знать" },
    { id: "b-ru-govoryu", text: "говорю", gloss: "I speak", kind: "verb", person: "1s", of: "говорить" },
    { id: "b-ru-govorish", text: "говоришь", gloss: "you speak", kind: "verb", person: "2s", of: "говорить" },
    { id: "b-ru-govorit", text: "говорит", gloss: "he / she speaks", kind: "verb", person: "3s", of: "говорить" },
    { id: "b-ru-govorim", text: "говорим", gloss: "we speak", kind: "verb", person: "1p", of: "говорить" },
    { id: "b-ru-govoryat", text: "говорят", gloss: "they speak", kind: "verb", person: "3p", of: "говорить" },
  ],
  rows: [
    { verb: "знать", gloss: "to know", forms: ["знаю", "знаешь", "знает", "знаем", "знают"] },
    { verb: "говорить", gloss: "to speak", forms: ["говорю", "говоришь", "говорит", "говорим", "говорят"] },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_BASICS;
if (typeof window !== "undefined") {
  window.SEMA_BASICS = SEMA_BASICS;
  if (window.SemaLangs) window.SemaLangs.define("ru", "basics", SEMA_BASICS);
}
