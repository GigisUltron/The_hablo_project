/* sema — Russian phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-ru-hello", "ph-ru-how-are-you", "ph-ru-colour", "ph-ru-where-from"],
  phrases: [
    { id: "ph-ru-hello", emoji: "👋", text: "Здравствуйте!", sub: "Zdravstvuyte!", cat: "phrase" },
    { id: "ph-ru-good-morning", emoji: "🌅", text: "Доброе утро.", sub: "Dobroye utro.", cat: "phrase" },
    { id: "ph-ru-good-night", emoji: "🌙", text: "Спокойной ночи.", sub: "Spokoynoy nochi.", cat: "phrase" },
    { id: "ph-ru-goodbye", emoji: "✌️", text: "До свидания.", sub: "Do svidaniya.", cat: "phrase" },
    { id: "ph-ru-thank-you", emoji: "🙌", text: "Большое спасибо.", sub: "Bolshoye spasibo.", cat: "phrase" },
    { id: "ph-ru-please", emoji: "🙏", text: "Пожалуйста.", sub: "Pozhaluysta.", cat: "phrase" },
    { id: "ph-ru-excuse-me", emoji: "🙇", text: "Извините.", sub: "Izvinite.", cat: "phrase" },
    { id: "ph-ru-how-are-you", emoji: "😊", text: "Как вы поживаете?", sub: "Kak vy pozhivayete?", cat: "phrase" },
    { id: "ph-ru-my-name-is", emoji: "🙋", text: "Меня зовут…", sub: "Menya zovut…", cat: "phrase" },
    { id: "ph-ru-what-is-your-name", emoji: "❓", text: "Как вас зовут?", sub: "Kak vas zovut?", cat: "phrase" },
    { id: "ph-ru-dont-understand", emoji: "🤷", text: "Я не понимаю.", sub: "Ya ne ponimayu.", cat: "phrase" },
    { id: "ph-ru-repeat", emoji: "🔁", text: "Вы можете повторить?", sub: "Vy mozhete povtorit?", cat: "phrase" },
    { id: "ph-ru-speak-slower", emoji: "🐢", text: "Вы можете говорить медленнее?", sub: "Vy mozhete govorit medlenneye?", cat: "phrase" },
    { id: "ph-ru-how-much", emoji: "🏷️", text: "Сколько это стоит?", sub: "Skolko eto stoit?", cat: "phrase" },
    { id: "ph-ru-where-bathroom", emoji: "🚻", text: "Где туалет?", sub: "Gde tualet?", cat: "phrase" },
    { id: "ph-ru-where-station", emoji: "🚉", text: "Где вокзал?", sub: "Gde vokzal?", cat: "phrase" },
    { id: "ph-ru-coffee", emoji: "☕", text: "Кофе, пожалуйста.", sub: "Kofe, pozhaluysta.", cat: "phrase" },
    { id: "ph-ru-bill", emoji: "🧾", text: "Счёт, пожалуйста.", sub: "Schyot, pozhaluysta.", cat: "phrase" },
    { id: "ph-ru-water", emoji: "💧", text: "Воду, пожалуйста.", sub: "Vodu, pozhaluysta.", cat: "phrase" },
    { id: "ph-ru-need-help", emoji: "🆘", text: "Мне нужна помощь.", sub: "Mne nuzhna pomoshch.", cat: "phrase" },
    { id: "ph-ru-need-doctor", emoji: "🏥", text: "Мне нужен врач.", sub: "Mne nuzhen vrach.", cat: "phrase" },
    { id: "ph-ru-lost", emoji: "🧭", text: "Я заблудился.", sub: "Ya zabludilsya.", cat: "phrase" },
    { id: "ph-ru-speak-english", emoji: "💬", text: "Вы говорите по-английски?", sub: "Vy govorite po-angliyski?", cat: "phrase" },
    { id: "ph-ru-dont-speak", emoji: "🗣️", text: "Я не говорю по-русски.", sub: "Ya ne govoryu po-russki.", cat: "phrase" },
    { id: "ph-ru-nice-to-meet", emoji: "🤝", text: "Очень приятно.", sub: "Ochen priyatno.", cat: "phrase" },
    { id: "ph-ru-see-you", emoji: "🫡", text: "До завтра.", sub: "Do zavtra.", cat: "phrase" },
    { id: "ph-ru-yes", emoji: "✅", text: "Да.", sub: "Da.", cat: "phrase" },
    { id: "ph-ru-no", emoji: "❌", text: "Нет.", sub: "Net.", cat: "phrase" },
    { id: "ph-ru-this-please", emoji: "👉", text: "Это, пожалуйста.", sub: "Eto, pozhaluysta.", cat: "phrase" },
    { id: "ph-ru-hotel", emoji: "🛎️", text: "Где гостиница?", sub: "Gde gostinitsa?", cat: "phrase" },
    { id: "ph-ru-colour", emoji: "🎨", text: "Какой у вас любимый цвет?", sub: "Kakoy u vas lyubimyy tsvet?", cat: "phrase" },
    { id: "ph-ru-where-from", emoji: "🏳️", text: "Откуда вы?", sub: "Otkuda vy?", cat: "phrase" },
    { id: "ph-ru-reservation", emoji: "🏨", text: "У меня есть бронирование.", sub: "U menya yest bronirovaniye.", cat: "phrase" },
    { id: "ph-ru-train-time", emoji: "🚆", text: "Во сколько уходит поезд?", sub: "Vo skolko ukhodit poyezd?", cat: "phrase" },
    { id: "ph-ru-pharmacy", emoji: "💊", text: "Где находится аптека?", sub: "Gde nakhoditsya apteka?", cat: "phrase" },
    { id: "ph-ru-hurts-here", emoji: "🤕", text: "У меня здесь болит.", sub: "U menya zdes bolit.", cat: "phrase" },
    { id: "ph-ru-pizza", emoji: "🍕", text: "Я хочу пиццу.", sub: "V restorane.", cat: "phrase", topic: "restaurant" },
    { id: "ph-ru-vegetarian", emoji: "🥦", text: "Я вегетарианец.", sub: "V restorane.", cat: "phrase", topic: "restaurant" },
    { id: "ph-ru-cousin", emoji: "👨‍👩‍👧", text: "Это мой двоюродный брат.", sub: "Eto moy dvoyurodnyy brat.", cat: "phrase", topic: "family" },
    { id: "ph-ru-wedding", emoji: "💍", text: "Свадьба в субботу.", sub: "Svad'ba v subbotu.", cat: "phrase", topic: "family" },
    { id: "ph-ru-congratulations", emoji: "🎉", text: "Поздравляю!", sub: "Pozdravlyayu!", cat: "phrase", topic: "family" },
    { id: "ph-ru-family", emoji: "🏡", text: "Как твоя семья?", sub: "Kak tvoya sem'ya?", cat: "phrase", topic: "family" },
    { id: "ph-ru-arrived-wedding", emoji: "✈️", text: "Я приехал на свадьбу.", sub: "Ya priyekhal na svad'bu.", cat: "phrase", topic: "family" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("ru", "phrases", SEMA_PHRASES);
}
