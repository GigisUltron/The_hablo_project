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
    { id: "house", emoji: "🏠", word: "дом", article: "", cat: "home", sentence: "Мой дом стоит у моря." },
    { id: "door", emoji: "🚪", word: "дверь", article: "", cat: "home", sentence: "Дверь открыта." },
    { id: "water", emoji: "💧", word: "вода", article: "", cat: "food", sentence: "Я пью воду каждый день." },
    { id: "bread", emoji: "🍞", word: "хлеб", article: "", cat: "food", sentence: "Хлеб свежий." },
    { id: "apple", emoji: "🍎", word: "яблоко", article: "", cat: "food", sentence: "Яблоко красное." },
    { id: "coffee", emoji: "☕", word: "кофе", article: "", cat: "food", sentence: "Я пью кофе утром." },
    { id: "sun", emoji: "☀️", word: "солнце", article: "", cat: "nature", sentence: "Солнце встаёт рано." },
    { id: "moon", emoji: "🌙", word: "луна", article: "", cat: "nature", sentence: "Луна сегодня полная." },
    { id: "tree", emoji: "🌳", word: "дерево", article: "", cat: "nature", sentence: "Дерево очень высокое." },
    { id: "sea", emoji: "🌊", word: "море", article: "", cat: "nature", sentence: "Сегодня море спокойное." },
    { id: "dog", emoji: "🐕", word: "собака", article: "", cat: "animals", sentence: "Собака спит на полу." },
    { id: "cat", emoji: "🐈", word: "кошка", article: "", cat: "animals", sentence: "Кошка смотрит в окно." },
    { id: "bird", emoji: "🐦", word: "птица", article: "", cat: "animals", sentence: "Птица поёт на дереве." },
    { id: "hand", emoji: "✋", word: "рука", article: "", cat: "body", sentence: "Я поднимаю руку." },
    { id: "eye", emoji: "👁️", word: "глаз", article: "", cat: "body", sentence: "Я закрываю один глаз." },
    { id: "heart", emoji: "❤️", word: "сердце", article: "", cat: "body", sentence: "Сердце бьётся быстро." },
    { id: "city", emoji: "🏙️", word: "город", article: "", cat: "city", sentence: "Город большой." },
    { id: "car", emoji: "🚗", word: "машина", article: "", cat: "city", sentence: "Машина красная." },
    { id: "train", emoji: "🚆", word: "поезд", article: "", cat: "city", sentence: "Поезд опаздывает." },
    { id: "street", emoji: "🛣️", word: "улица", article: "", cat: "city", sentence: "Я живу на этой улице." },
    { id: "night", emoji: "🌃", word: "ночь", article: "", cat: "time", sentence: "Ночь тихая." },
    { id: "day", emoji: "📅", word: "день", article: "", cat: "time", sentence: "День длинный." },
    { id: "love", emoji: "💗", word: "любовь", article: "", cat: "emotion", sentence: "Любовь не объяснить." },
    { id: "eat", emoji: "🍽️", word: "есть", article: "", cat: "action", sentence: "Я хочу есть." },
  ],

  edges: [
    { a: "door", b: "house", type: "part-of" },
    { a: "tree", b: "sea", type: "related" },
    { a: "house", b: "city", type: "part-of" },
    { a: "street", b: "city", type: "part-of" },
    { a: "car", b: "street", type: "related" },
    { a: "train", b: "city", type: "related" },
    { a: "bread", b: "eat", type: "used-for" },
    { a: "water", b: "eat", type: "used-with" },
    { a: "apple", b: "eat", type: "used-for" },
    { a: "coffee", b: "water", type: "related" },
    { a: "sun", b: "moon", type: "opposite" },
    { a: "day", b: "night", type: "opposite" },
    { a: "day", b: "sun", type: "related" },
    { a: "night", b: "moon", type: "related" },
    { a: "bird", b: "tree", type: "lives-in" },
    { a: "cat", b: "house", type: "lives-in" },
    { a: "dog", b: "house", type: "lives-in" },
    { a: "dog", b: "cat", type: "related" },
    { a: "hand", b: "heart", type: "part-of" },
    { a: "eye", b: "heart", type: "part-of" },
    { a: "love", b: "heart", type: "related" },
    { a: "sea", b: "water", type: "related" },
    { a: "sun", b: "sea", type: "related" },
    { a: "car", b: "train", type: "related" },
    { a: "city", b: "house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("ru", "concepts", SEMA_DATA);
}
