/* sema — Russian phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "Здравствуйте!", sub: "Zdravstvuyte!", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "Доброе утро.", sub: "Dobroye utro.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "Спокойной ночи.", sub: "Spokoynoy nochi.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "До свидания.", sub: "Do svidaniya.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "Большое спасибо.", sub: "Bolshoye spasibo.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "Пожалуйста.", sub: "Pozhaluysta.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "Извините.", sub: "Izvinite.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "Как вы поживаете?", sub: "Kak vy pozhivayete?", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "Меня зовут…", sub: "Menya zovut…", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "Как вас зовут?", sub: "Kak vas zovut?", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "Я не понимаю.", sub: "Ya ne ponimayu.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "Вы можете повторить?", sub: "Vy mozhete povtorit?", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "Вы можете говорить медленнее?", sub: "Vy mozhete govorit medlenneye?", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "Сколько это стоит?", sub: "Skolko eto stoit?", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "Где туалет?", sub: "Gde tualet?", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "Где вокзал?", sub: "Gde vokzal?", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "Кофе, пожалуйста.", sub: "Kofe, pozhaluysta.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "Счёт, пожалуйста.", sub: "Schyot, pozhaluysta.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "Воду, пожалуйста.", sub: "Vodu, pozhaluysta.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "Мне нужна помощь.", sub: "Mne nuzhna pomoshch.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "Мне нужен врач.", sub: "Mne nuzhen vrach.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "Я заблудился.", sub: "Ya zabludilsya.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "Вы говорите по-английски?", sub: "Vy govorite po-angliyski?", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "Я не говорю по-русски.", sub: "Ya ne govoryu po-russki.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "Очень приятно.", sub: "Ochen priyatno.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "До завтра.", sub: "Do zavtra.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "Да.", sub: "Da.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "Нет.", sub: "Net.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "Это, пожалуйста.", sub: "Eto, pozhaluysta.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "Где гостиница?", sub: "Gde gostinitsa?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("ru", "phrases", SEMA_PHRASES);
}
