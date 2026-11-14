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
    { id: "tr-house", emoji: "🏠", word: "ev", article: "", cat: "home", sentence: "Evim deniz kenarında." },
    { id: "tr-door", emoji: "🚪", word: "kapı", article: "", cat: "home", sentence: "Kapı açık." },
    { id: "tr-water", emoji: "💧", word: "su", article: "", cat: "food", sentence: "Her gün su içerim." },
    { id: "tr-bread", emoji: "🍞", word: "ekmek", article: "", cat: "food", sentence: "Ekmek taze." },
    { id: "tr-apple", emoji: "🍎", word: "elma", article: "", cat: "food", sentence: "Elma kırmızı." },
    { id: "tr-coffee", emoji: "☕", word: "kahve", article: "", cat: "food", sentence: "Sabahları kahve içerim." },
    { id: "tr-sun", emoji: "☀️", word: "güneş", article: "", cat: "nature", sentence: "Güneş erken doğar." },
    { id: "tr-moon", emoji: "🌙", word: "ay", article: "", cat: "nature", sentence: "Ay bu gece dolunay." },
    { id: "tr-tree", emoji: "🌳", word: "ağaç", article: "", cat: "nature", sentence: "Ağaç çok uzun." },
    { id: "tr-sea", emoji: "🌊", word: "deniz", article: "", cat: "nature", sentence: "Deniz bugün sakin." },
    { id: "tr-dog", emoji: "🐕", word: "köpek", article: "", cat: "animals", sentence: "Köpek yerde uyuyor." },
    { id: "tr-cat", emoji: "🐈", word: "kedi", article: "", cat: "animals", sentence: "Kedi pencereden bakıyor." },
    { id: "tr-bird", emoji: "🐦", word: "kuş", article: "", cat: "animals", sentence: "Kuş ağaçta şarkı söylüyor." },
    { id: "tr-hand", emoji: "✋", word: "el", article: "", cat: "body", sentence: "Elimi kaldırıyorum." },
    { id: "tr-eye", emoji: "👁️", word: "göz", article: "", cat: "body", sentence: "Bir gözümü kapatıyorum." },
    { id: "tr-heart", emoji: "❤️", word: "kalp", article: "", cat: "body", sentence: "Kalp hızlı atıyor." },
    { id: "tr-city", emoji: "🏙️", word: "şehir", article: "", cat: "city", sentence: "Şehir büyük." },
    { id: "tr-car", emoji: "🚗", word: "araba", article: "", cat: "city", sentence: "Araba kırmızı." },
    { id: "tr-train", emoji: "🚆", word: "tren", article: "", cat: "city", sentence: "Tren geç kalıyor." },
    { id: "tr-street", emoji: "🛣️", word: "sokak", article: "", cat: "city", sentence: "Bu sokakta oturuyorum." },
    { id: "tr-night", emoji: "🌃", word: "gece", article: "", cat: "time", sentence: "Gece sessiz." },
    { id: "tr-day", emoji: "📅", word: "gün", article: "", cat: "time", sentence: "Gün uzun." },
    { id: "tr-love", emoji: "💗", word: "aşk", article: "", cat: "emotion", sentence: "Aşk açıklanamaz." },
    { id: "tr-eat", emoji: "🍽️", word: "yemek", article: "", cat: "action", sentence: "Bir şey yemek istiyorum." },
  ],

  edges: [
    { a: "tr-door", b: "tr-house", type: "part-of" },
    { a: "tr-tree", b: "tr-sea", type: "related" },
    { a: "tr-house", b: "tr-city", type: "part-of" },
    { a: "tr-street", b: "tr-city", type: "part-of" },
    { a: "tr-car", b: "tr-street", type: "related" },
    { a: "tr-train", b: "tr-city", type: "related" },
    { a: "tr-bread", b: "tr-eat", type: "used-for" },
    { a: "tr-water", b: "tr-eat", type: "used-with" },
    { a: "tr-apple", b: "tr-eat", type: "used-for" },
    { a: "tr-coffee", b: "tr-water", type: "related" },
    { a: "tr-sun", b: "tr-moon", type: "opposite" },
    { a: "tr-day", b: "tr-night", type: "opposite" },
    { a: "tr-day", b: "tr-sun", type: "related" },
    { a: "tr-night", b: "tr-moon", type: "related" },
    { a: "tr-bird", b: "tr-tree", type: "lives-in" },
    { a: "tr-cat", b: "tr-house", type: "lives-in" },
    { a: "tr-dog", b: "tr-house", type: "lives-in" },
    { a: "tr-dog", b: "tr-cat", type: "related" },
    { a: "tr-hand", b: "tr-heart", type: "part-of" },
    { a: "tr-eye", b: "tr-heart", type: "part-of" },
    { a: "tr-love", b: "tr-heart", type: "related" },
    { a: "tr-sea", b: "tr-water", type: "related" },
    { a: "tr-sun", b: "tr-sea", type: "related" },
    { a: "tr-car", b: "tr-train", type: "related" },
    { a: "tr-city", b: "tr-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("tr", "concepts", SEMA_DATA);
}
