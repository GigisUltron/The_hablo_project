/* sema — Dutch phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-nl-hello", "ph-nl-how-are-you", "ph-nl-colour", "ph-nl-where-from"],
  phrases: [
    { id: "ph-nl-hello", emoji: "👋", text: "Hallo!", sub: "Als je ergens binnenkomt.", cat: "phrase" },
    { id: "ph-nl-good-morning", emoji: "🌅", text: "Goedemorgen.", sub: "In de ochtend.", cat: "phrase" },
    { id: "ph-nl-good-night", emoji: "🌙", text: "Goedenacht.", sub: "Voor het slapen.", cat: "phrase" },
    { id: "ph-nl-goodbye", emoji: "✌️", text: "Tot ziens.", sub: "Bij het weggaan.", cat: "phrase" },
    { id: "ph-nl-thank-you", emoji: "🙌", text: "Dank je wel.", sub: "Als je iets krijgt.", cat: "phrase" },
    { id: "ph-nl-please", emoji: "🙏", text: "Alstublieft.", sub: "Als je iets vraagt.", cat: "phrase" },
    { id: "ph-nl-excuse-me", emoji: "🙇", text: "Pardon.", sub: "Om erlangs te gaan.", cat: "phrase" },
    { id: "ph-nl-how-are-you", emoji: "😊", text: "Hoe gaat het?", sub: "Als je een bekende ziet.", cat: "phrase" },
    { id: "ph-nl-my-name-is", emoji: "🙋", text: "Ik heet…", sub: "Bij het voorstellen.", cat: "phrase" },
    { id: "ph-nl-what-is-your-name", emoji: "❓", text: "Hoe heet jij?", sub: "Om de naam te vragen.", cat: "phrase" },
    { id: "ph-nl-dont-understand", emoji: "🤷", text: "Ik begrijp het niet.", sub: "Als iets niet duidelijk is.", cat: "phrase" },
    { id: "ph-nl-repeat", emoji: "🔁", text: "Kun je dat herhalen?", sub: "Als je het niet hoorde.", cat: "phrase" },
    { id: "ph-nl-speak-slower", emoji: "🐢", text: "Kun je langzamer praten?", sub: "Als iemand snel praat.", cat: "phrase" },
    { id: "ph-nl-how-much", emoji: "🏷️", text: "Hoeveel kost dit?", sub: "Bij een product.", cat: "phrase" },
    { id: "ph-nl-where-bathroom", emoji: "🚻", text: "Waar is het toilet?", sub: "In een bar of winkel.", cat: "phrase" },
    { id: "ph-nl-where-station", emoji: "🚉", text: "Waar is het station?", sub: "Als je de trein zoekt.", cat: "phrase" },
    { id: "ph-nl-coffee", emoji: "☕", text: "Een koffie, alstublieft.", sub: "Aan de balie bestellen.", cat: "phrase" },
    { id: "ph-nl-bill", emoji: "🧾", text: "De rekening, alstublieft.", sub: "Aan het einde van de maaltijd.", cat: "phrase" },
    { id: "ph-nl-water", emoji: "💧", text: "Water, alstublieft.", sub: "Om te drinken.", cat: "phrase" },
    { id: "ph-nl-need-help", emoji: "🆘", text: "Ik heb hulp nodig.", sub: "Als er iets misgaat.", cat: "phrase" },
    { id: "ph-nl-need-doctor", emoji: "🏥", text: "Ik heb een dokter nodig.", sub: "Als je je niet goed voelt.", cat: "phrase" },
    { id: "ph-nl-lost", emoji: "🧭", text: "Ik ben verdwaald.", sub: "Als je de weg niet vindt.", cat: "phrase" },
    { id: "ph-nl-speak-english", emoji: "💬", text: "Spreek je Engels?", sub: "Naar talen vragen.", cat: "phrase" },
    { id: "ph-nl-dont-speak", emoji: "🗣️", text: "Ik spreek geen Nederlands.", sub: "De taal uitleggen.", cat: "phrase" },
    { id: "ph-nl-nice-to-meet", emoji: "🤝", text: "Aangenaam.", sub: "Bij het kennismaken.", cat: "phrase" },
    { id: "ph-nl-see-you", emoji: "🫡", text: "Tot morgen.", sub: "Bij het afscheid.", cat: "phrase" },
    { id: "ph-nl-yes", emoji: "✅", text: "Ja.", sub: "Instemmen.", cat: "phrase" },
    { id: "ph-nl-no", emoji: "❌", text: "Nee.", sub: "Weigeren.", cat: "phrase" },
    { id: "ph-nl-this-please", emoji: "👉", text: "Dit, alstublieft.", sub: "Naar iets wijzen.", cat: "phrase" },
    { id: "ph-nl-hotel", emoji: "🛎️", text: "Waar is het hotel?", sub: "Een onderkomen zoeken.", cat: "phrase" },
    { id: "ph-nl-colour", emoji: "🎨", text: "Wat is je lievelingskleur?", sub: "Bij het kennismaken.", cat: "phrase" },
    { id: "ph-nl-where-from", emoji: "🏳️", text: "Waar kom je vandaan?", sub: "Naar de herkomst vragen.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("nl", "phrases", SEMA_PHRASES);
}
