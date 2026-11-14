/* sema — German phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-de-hello", "ph-de-how-are-you", "ph-de-colour", "ph-de-where-from"],
  phrases: [
    { id: "ph-de-hello", emoji: "👋", text: "Hallo!", sub: "Wenn man irgendwo hineingeht.", cat: "phrase" },
    { id: "ph-de-good-morning", emoji: "🌅", text: "Guten Morgen.", sub: "Am Morgen.", cat: "phrase" },
    { id: "ph-de-good-night", emoji: "🌙", text: "Gute Nacht.", sub: "Vor dem Schlafen.", cat: "phrase" },
    { id: "ph-de-goodbye", emoji: "✌️", text: "Tschüss.", sub: "Beim Gehen.", cat: "phrase" },
    { id: "ph-de-thank-you", emoji: "🙌", text: "Vielen Dank.", sub: "Wenn man etwas bekommt.", cat: "phrase" },
    { id: "ph-de-please", emoji: "🙏", text: "Bitte.", sub: "Wenn man etwas verlangt.", cat: "phrase" },
    { id: "ph-de-excuse-me", emoji: "🙇", text: "Entschuldigung.", sub: "Um vorbeizukommen.", cat: "phrase" },
    { id: "ph-de-how-are-you", emoji: "😊", text: "Wie geht es dir?", sub: "Wenn man einen Bekannten trifft.", cat: "phrase" },
    { id: "ph-de-my-name-is", emoji: "🙋", text: "Ich heiße…", sub: "Bei der Vorstellung.", cat: "phrase" },
    { id: "ph-de-what-is-your-name", emoji: "❓", text: "Wie heißt du?", sub: "Um den Namen zu fragen.", cat: "phrase" },
    { id: "ph-de-dont-understand", emoji: "🤷", text: "Ich verstehe nicht.", sub: "Wenn etwas unklar ist.", cat: "phrase" },
    { id: "ph-de-repeat", emoji: "🔁", text: "Kannst du das wiederholen?", sub: "Wenn du nicht gehört hast.", cat: "phrase" },
    { id: "ph-de-speak-slower", emoji: "🐢", text: "Kannst du langsamer sprechen?", sub: "Wenn jemand schnell spricht.", cat: "phrase" },
    { id: "ph-de-how-much", emoji: "🏷️", text: "Wie viel kostet das?", sub: "Vor einem Produkt.", cat: "phrase" },
    { id: "ph-de-where-bathroom", emoji: "🚻", text: "Wo ist die Toilette?", sub: "In einer Bar oder einem Laden.", cat: "phrase" },
    { id: "ph-de-where-station", emoji: "🚉", text: "Wo ist der Bahnhof?", sub: "Wenn du den Zug suchst.", cat: "phrase" },
    { id: "ph-de-coffee", emoji: "☕", text: "Einen Kaffee, bitte.", sub: "An der Theke bestellen.", cat: "phrase" },
    { id: "ph-de-bill", emoji: "🧾", text: "Die Rechnung, bitte.", sub: "Am Ende des Essens.", cat: "phrase" },
    { id: "ph-de-water", emoji: "💧", text: "Wasser, bitte.", sub: "Zum Trinken.", cat: "phrase" },
    { id: "ph-de-need-help", emoji: "🆘", text: "Ich brauche Hilfe.", sub: "Wenn etwas schiefgeht.", cat: "phrase" },
    { id: "ph-de-need-doctor", emoji: "🏥", text: "Ich brauche einen Arzt.", sub: "Wenn es dir nicht gut geht.", cat: "phrase" },
    { id: "ph-de-lost", emoji: "🧭", text: "Ich habe mich verlaufen.", sub: "Wenn du den Weg nicht findest.", cat: "phrase" },
    { id: "ph-de-speak-english", emoji: "💬", text: "Sprichst du Englisch?", sub: "Nach Sprachen fragen.", cat: "phrase" },
    { id: "ph-de-dont-speak", emoji: "🗣️", text: "Ich spreche kein Deutsch.", sub: "Die Sprache erklären.", cat: "phrase" },
    { id: "ph-de-nice-to-meet", emoji: "🤝", text: "Freut mich.", sub: "Beim Kennenlernen.", cat: "phrase" },
    { id: "ph-de-see-you", emoji: "🫡", text: "Bis morgen.", sub: "Beim Abschied.", cat: "phrase" },
    { id: "ph-de-yes", emoji: "✅", text: "Ja.", sub: "Zustimmen.", cat: "phrase" },
    { id: "ph-de-no", emoji: "❌", text: "Nein.", sub: "Ablehnen.", cat: "phrase" },
    { id: "ph-de-this-please", emoji: "👉", text: "Das hier, bitte.", sub: "Auf etwas zeigen.", cat: "phrase" },
    { id: "ph-de-hotel", emoji: "🛎️", text: "Wo ist das Hotel?", sub: "Eine Unterkunft suchen.", cat: "phrase" },
    { id: "ph-de-colour", emoji: "🎨", text: "Was ist deine Lieblingsfarbe?", sub: "Beim Kennenlernen.", cat: "phrase" },
    { id: "ph-de-where-from", emoji: "🏳️", text: "Woher kommst du?", sub: "Nach der Herkunft fragen.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("de", "phrases", SEMA_PHRASES);
}
