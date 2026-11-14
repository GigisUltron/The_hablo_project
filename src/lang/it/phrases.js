/* sema — Italian phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "Ciao!", sub: "Entrando in un posto.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "Buongiorno.", sub: "La mattina.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "Buonanotte.", sub: "Andando a dormire.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "Arrivederci.", sub: "Congedandosi.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "Grazie mille.", sub: "Ricevendo qualcosa.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "Per favore.", sub: "Chiedendo qualcosa.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "Mi scusi.", sub: "Per passare o attirare l'attenzione.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "Come stai?", sub: "Vedendo un conoscente.", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "Mi chiamo…", sub: "Presentandosi.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "Come ti chiami?", sub: "Per sapere il nome.", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "Non capisco.", sub: "Quando qualcosa non è chiaro.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "Puoi ripetere?", sub: "Quando non hai sentito bene.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "Puoi parlare più lentamente?", sub: "Quando parlano veloce.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "Quanto costa?", sub: "Davanti a un prodotto.", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "Dov'è il bagno?", sub: "In un bar o negozio.", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "Dov'è la stazione?", sub: "Cercando il treno.", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "Un caffè, per favore.", sub: "Ordinando al banco.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "Il conto, per favore.", sub: "A fine pasto.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "Acqua, per favore.", sub: "Chiedendo da bere.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "Ho bisogno di aiuto.", sub: "Quando qualcosa va storto.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "Ho bisogno di un medico.", sub: "Quando non ti senti bene.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "Mi sono perso.", sub: "Quando non trovi la strada.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "Parli inglese?", sub: "Chiedendo delle lingue.", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "Non parlo italiano.", sub: "Spiegando la lingua.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "Piacere.", sub: "Conoscendo qualcuno.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "A domani.", sub: "Congedandosi.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "Sì.", sub: "Concordando.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "No.", sub: "Negando.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "Questo, per favore.", sub: "Indicando un oggetto.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "Dov'è l'hotel?", sub: "Cercando un alloggio.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("it", "phrases", SEMA_PHRASES);
}
