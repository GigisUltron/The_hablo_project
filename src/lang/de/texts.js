/* sema — German reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-de-markt",
      title: "Der Samstagsmarkt",
      level: 1,
      body: "Am Samstagmorgen öffnet der Markt im Viertel um sieben Uhr. Meine Mutter kauft Brot, Obst und Kaffee. Ich kaufe Wasser und nehme einen Apfel für das Frühstück mit. Der Mann am Stand lächelt und sagt: «Guten Morgen». Wir bezahlen und gehen zu Fuß nach Hause. Zu Hause trinken wir zusammen Kaffee. Danach lese ich und meine Mutter arbeitet im Garten.",
      questions: [
        { q: "Was kauft die Mutter?", options: ["Brot, Obst und Kaffee", "Wasser und einen Apfel", "Blumen und Milch"], answer: 0 },
        { q: "Wie kommen sie nach Hause?", options: ["mit dem Bus", "zu Fuß", "mit dem Auto"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("de", "texts", SEMA_TEXTS);
}
