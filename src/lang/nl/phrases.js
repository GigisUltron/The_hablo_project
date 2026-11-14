/* sema — Dutch phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "Hallo!", sub: "Als je ergens binnenkomt.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "Goedemorgen.", sub: "In de ochtend.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "Goedenacht.", sub: "Voor het slapen.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "Tot ziens.", sub: "Bij het weggaan.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "Dank je wel.", sub: "Als je iets krijgt.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "Alstublieft.", sub: "Als je iets vraagt.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "Pardon.", sub: "Om erlangs te gaan.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "Hoe gaat het?", sub: "Als je een bekende ziet.", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "Ik heet…", sub: "Bij het voorstellen.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "Hoe heet jij?", sub: "Om de naam te vragen.", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "Ik begrijp het niet.", sub: "Als iets niet duidelijk is.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "Kun je dat herhalen?", sub: "Als je het niet hoorde.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "Kun je langzamer praten?", sub: "Als iemand snel praat.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "Hoeveel kost dit?", sub: "Bij een product.", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "Waar is het toilet?", sub: "In een bar of winkel.", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "Waar is het station?", sub: "Als je de trein zoekt.", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "Een koffie, alstublieft.", sub: "Aan de balie bestellen.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "De rekening, alstublieft.", sub: "Aan het einde van de maaltijd.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "Water, alstublieft.", sub: "Om te drinken.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "Ik heb hulp nodig.", sub: "Als er iets misgaat.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "Ik heb een dokter nodig.", sub: "Als je je niet goed voelt.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "Ik ben verdwaald.", sub: "Als je de weg niet vindt.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "Spreek je Engels?", sub: "Naar talen vragen.", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "Ik spreek geen Nederlands.", sub: "De taal uitleggen.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "Aangenaam.", sub: "Bij het kennismaken.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "Tot morgen.", sub: "Bij het afscheid.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "Ja.", sub: "Instemmen.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "Nee.", sub: "Weigeren.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "Dit, alstublieft.", sub: "Naar iets wijzen.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "Waar is het hotel?", sub: "Een onderkomen zoeken.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("nl", "phrases", SEMA_PHRASES);
}
