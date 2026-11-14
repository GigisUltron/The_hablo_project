/* sema — Turkish concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "tr", name: "Turkish", locale: "tr-TR" },

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
    { id: "house", emoji: "🏠", word: "ev", article: "", cat: "home", sentence: "Evim deniz kenarında." },
    { id: "door", emoji: "🚪", word: "kapı", article: "", cat: "home", sentence: "Kapı açık." },
    { id: "water", emoji: "💧", word: "su", article: "", cat: "food", sentence: "Her gün su içerim." },
    { id: "bread", emoji: "🍞", word: "ekmek", article: "", cat: "food", sentence: "Ekmek taze." },
    { id: "apple", emoji: "🍎", word: "elma", article: "", cat: "food", sentence: "Elma kırmızı." },
    { id: "coffee", emoji: "☕", word: "kahve", article: "", cat: "food", sentence: "Sabahları kahve içerim." },
    { id: "sun", emoji: "☀️", word: "güneş", article: "", cat: "nature", sentence: "Güneş erken doğar." },
    { id: "moon", emoji: "🌙", word: "ay", article: "", cat: "nature", sentence: "Ay bu gece dolunay." },
    { id: "tree", emoji: "🌳", word: "ağaç", article: "", cat: "nature", sentence: "Ağaç çok uzun." },
    { id: "sea", emoji: "🌊", word: "deniz", article: "", cat: "nature", sentence: "Deniz bugün sakin." },
    { id: "dog", emoji: "🐕", word: "köpek", article: "", cat: "animals", sentence: "Köpek yerde uyuyor." },
    { id: "cat", emoji: "🐈", word: "kedi", article: "", cat: "animals", sentence: "Kedi pencereden bakıyor." },
    { id: "bird", emoji: "🐦", word: "kuş", article: "", cat: "animals", sentence: "Kuş ağaçta şarkı söylüyor." },
    { id: "hand", emoji: "✋", word: "el", article: "", cat: "body", sentence: "Elimi kaldırıyorum." },
    { id: "eye", emoji: "👁️", word: "göz", article: "", cat: "body", sentence: "Bir gözümü kapatıyorum." },
    { id: "heart", emoji: "❤️", word: "kalp", article: "", cat: "body", sentence: "Kalp hızlı atıyor." },
    { id: "city", emoji: "🏙️", word: "şehir", article: "", cat: "city", sentence: "Şehir büyük." },
    { id: "car", emoji: "🚗", word: "araba", article: "", cat: "city", sentence: "Araba kırmızı." },
    { id: "train", emoji: "🚆", word: "tren", article: "", cat: "city", sentence: "Tren geç kalıyor." },
    { id: "street", emoji: "🛣️", word: "sokak", article: "", cat: "city", sentence: "Bu sokakta oturuyorum." },
    { id: "night", emoji: "🌃", word: "gece", article: "", cat: "time", sentence: "Gece sessiz." },
    { id: "day", emoji: "📅", word: "gün", article: "", cat: "time", sentence: "Gün uzun." },
    { id: "love", emoji: "💗", word: "aşk", article: "", cat: "emotion", sentence: "Aşk açıklanamaz." },
    { id: "eat", emoji: "🍽️", word: "yemek", article: "", cat: "action", sentence: "Bir şey yemek istiyorum." },
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
  if (window.SemaLangs) window.SemaLangs.define("tr", "concepts", SEMA_DATA);
}
