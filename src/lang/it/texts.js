/* sema — Italian reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-it-mercato",
      title: "Il mercato del sabato",
      level: 1,
      body: "Il sabato mattina il mercato del quartiere apre alle sette. Mia madre compra pane, frutta e caffè. Io compro acqua e prendo una mela per colazione. Il signore del banco sorride e dice: «Buongiorno». Paghiamo e torniamo a casa a piedi. A casa beviamo il caffè insieme. Poi io leggo e mia madre lavora in giardino.",
      questions: [
        { q: "Che cosa compra la madre?", options: ["pane, frutta e caffè", "acqua e una mela", "fiori e latte"], answer: 0 },
        { q: "Come tornano a casa?", options: ["in autobus", "a piedi", "in macchina"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("it", "texts", SEMA_TEXTS);
}
