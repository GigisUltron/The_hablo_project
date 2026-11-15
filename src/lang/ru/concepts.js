/* sema — Russian concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "ru", name: "Russian", locale: "ru-RU" },

  categories: {
    "home": { label: "Home", hue: "#d93a1c" },
    "food": { label: "Food", hue: "#f2b705" },
    "nature": { label: "Nature", hue: "#5f7f24" },
    "animals": { label: "Animals", hue: "#c9721c" },
    "body": { label: "Body", hue: "#7a2e57" },
    "city": { label: "City", hue: "#ef5a2c" },
    "time": { label: "Time", hue: "#2f6f8f" },
    "emotion": { label: "Emotion", hue: "#c2185b" },
    "action": { label: "Action", hue: "#8d5a2b" },
    "abstract": { label: "Abstract", hue: "#6b5a49" },
  },

  relationTypes: {
    "part-of": { label: "part of", weight: 1 },
    "used-for": { label: "used for", weight: 1 },
    "used-with": { label: "used with", weight: 1 },
    "lives-in": { label: "lives in", weight: 1 },
    "grows-in": { label: "grows in", weight: 1 },
    "opposite": { label: "opposite of", weight: 2 },
    "leads-to": { label: "leads to", weight: 1 },
    "related": { label: "related to", weight: 0.5 },
  },

  concepts: [
    { id: "ru-house", emoji: "🏠", word: "дом", article: "", cat: "home", sentence: "Мой дом стоит у моря.", synonyms: ["жилище", "кров"] },
    { id: "ru-door", emoji: "🚪", word: "дверь", article: "", cat: "home", sentence: "Дверь открыта." },
    { id: "ru-water", emoji: "💧", word: "вода", article: "", cat: "food", sentence: "Я пью воду каждый день." },
    { id: "ru-bread", emoji: "🍞", word: "хлеб", article: "", cat: "food", sentence: "Хлеб свежий." },
    { id: "ru-apple", emoji: "🍎", word: "яблоко", article: "", cat: "food", sentence: "Яблоко красное." },
    { id: "ru-coffee", emoji: "☕", word: "кофе", article: "", cat: "food", sentence: "Я пью кофе утром." },
    { id: "ru-sun", emoji: "☀️", word: "солнце", article: "", cat: "nature", sentence: "Солнце встаёт рано." },
    { id: "ru-moon", emoji: "🌙", word: "луна", article: "", cat: "nature", sentence: "Луна сегодня полная." },
    { id: "ru-tree", emoji: "🌳", word: "дерево", article: "", cat: "nature", sentence: "Дерево очень высокое." },
    { id: "ru-sea", emoji: "🌊", word: "море", article: "", cat: "nature", sentence: "Сегодня море спокойное." },
    { id: "ru-dog", emoji: "🐕", word: "собака", article: "", cat: "animals", sentence: "Собака спит на полу." },
    { id: "ru-cat", emoji: "🐈", word: "кошка", article: "", cat: "animals", sentence: "Кошка смотрит в окно." },
    { id: "ru-bird", emoji: "🐦", word: "птица", article: "", cat: "animals", sentence: "Птица поёт на дереве." },
    { id: "ru-hand", emoji: "✋", word: "рука", article: "", cat: "body", sentence: "Я поднимаю руку." },
    { id: "ru-eye", emoji: "👁️", word: "глаз", article: "", cat: "body", sentence: "Я закрываю один глаз." },
    { id: "ru-heart", emoji: "❤️", word: "сердце", article: "", cat: "body", sentence: "Сердце бьётся быстро." },
    { id: "ru-city", emoji: "🏙️", word: "город", article: "", cat: "city", sentence: "Город большой." },
    { id: "ru-car", emoji: "🚗", word: "машина", article: "", cat: "city", sentence: "Машина красная.", synonyms: ["автомобиль", "авто"] },
    { id: "ru-train", emoji: "🚆", word: "поезд", article: "", cat: "city", sentence: "Поезд опаздывает." },
    { id: "ru-street", emoji: "🛣️", word: "улица", article: "", cat: "city", sentence: "Я живу на этой улице." },
    { id: "ru-night", emoji: "🌃", word: "ночь", article: "", cat: "time", sentence: "Ночь тихая." },
    { id: "ru-day", emoji: "📅", word: "день", article: "", cat: "time", sentence: "День длинный." },
    { id: "ru-love", emoji: "💗", word: "любовь", article: "", cat: "emotion", sentence: "Любовь не объяснить." },
    { id: "ru-eat", emoji: "🍽️", word: "есть", article: "", cat: "action", sentence: "Я хочу есть." },
  ],

  edges: [
    { a: "ru-door", b: "ru-house", type: "part-of" },
    { a: "ru-tree", b: "ru-sea", type: "related" },
    { a: "ru-house", b: "ru-city", type: "part-of" },
    { a: "ru-street", b: "ru-city", type: "part-of" },
    { a: "ru-car", b: "ru-street", type: "related" },
    { a: "ru-train", b: "ru-city", type: "related" },
    { a: "ru-bread", b: "ru-eat", type: "used-for" },
    { a: "ru-water", b: "ru-eat", type: "used-with" },
    { a: "ru-apple", b: "ru-eat", type: "used-for" },
    { a: "ru-coffee", b: "ru-water", type: "related" },
    { a: "ru-sun", b: "ru-moon", type: "opposite" },
    { a: "ru-day", b: "ru-night", type: "opposite" },
    { a: "ru-day", b: "ru-sun", type: "related" },
    { a: "ru-night", b: "ru-moon", type: "related" },
    { a: "ru-bird", b: "ru-tree", type: "lives-in" },
    { a: "ru-cat", b: "ru-house", type: "lives-in" },
    { a: "ru-dog", b: "ru-house", type: "lives-in" },
    { a: "ru-dog", b: "ru-cat", type: "related" },
    { a: "ru-hand", b: "ru-heart", type: "part-of" },
    { a: "ru-eye", b: "ru-heart", type: "part-of" },
    { a: "ru-love", b: "ru-heart", type: "related" },
    { a: "ru-sea", b: "ru-water", type: "related" },
    { a: "ru-sun", b: "ru-sea", type: "related" },
    { a: "ru-car", b: "ru-train", type: "related" },
    { a: "ru-city", b: "ru-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("ru", "concepts", SEMA_DATA);
}
