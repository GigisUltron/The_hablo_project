/* sema — Dutch reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-nl-markt",
      title: "De zaterdagmarkt",
      level: 1,
      body: "Op zaterdagochtend opent de markt in de buurt om zeven uur. Mijn moeder koopt brood, fruit en koffie. Ik koop water en neem een appel mee voor het ontbijt. De man aan de kraam lacht en zegt: «Goedemorgen». We betalen en lopen naar huis. Thuis drinken we samen koffie. Daarna lees ik en mijn moeder werkt in de tuin.",
      questions: [
        { q: "Wat koopt de moeder?", options: ["brood, fruit en koffie", "water en een appel", "bloemen en melk"], answer: 0 },
        { q: "Hoe gaan ze naar huis?", options: ["met de bus", "te voet", "met de auto"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("nl", "texts", SEMA_TEXTS);
}
