/* sema — Arabic concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "ar", name: "Arabic", locale: "ar-SA" },

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
    { id: "house", emoji: "🏠", word: "بيت", article: "", cat: "home", sentence: "بيتي قريب من البحر." },
    { id: "door", emoji: "🚪", word: "باب", article: "", cat: "home", sentence: "الباب مفتوح." },
    { id: "water", emoji: "💧", word: "ماء", article: "", cat: "food", sentence: "أشرب الماء كل يوم." },
    { id: "bread", emoji: "🍞", word: "خبز", article: "", cat: "food", sentence: "الخبز طازج." },
    { id: "apple", emoji: "🍎", word: "تفاحة", article: "", cat: "food", sentence: "التفاحة حمراء." },
    { id: "coffee", emoji: "☕", word: "قهوة", article: "", cat: "food", sentence: "أشرب القهوة في الصباح." },
    { id: "sun", emoji: "☀️", word: "شمس", article: "", cat: "nature", sentence: "تشرق الشمس مبكراً." },
    { id: "moon", emoji: "🌙", word: "قمر", article: "", cat: "nature", sentence: "القمر مكتمل الليلة." },
    { id: "tree", emoji: "🌳", word: "شجرة", article: "", cat: "nature", sentence: "الشجرة عالية جداً." },
    { id: "sea", emoji: "🌊", word: "بحر", article: "", cat: "nature", sentence: "البحر هادئ اليوم." },
    { id: "dog", emoji: "🐕", word: "كلب", article: "", cat: "animals", sentence: "الكلب ينام على الأرض." },
    { id: "cat", emoji: "🐈", word: "قطة", article: "", cat: "animals", sentence: "القطة تنظر من النافذة." },
    { id: "bird", emoji: "🐦", word: "طائر", article: "", cat: "animals", sentence: "الطائر يغني على الشجرة." },
    { id: "hand", emoji: "✋", word: "يد", article: "", cat: "body", sentence: "أرفع يدي." },
    { id: "eye", emoji: "👁️", word: "عين", article: "", cat: "body", sentence: "أغمض عيناً واحدة." },
    { id: "heart", emoji: "❤️", word: "قلب", article: "", cat: "body", sentence: "ينبض القلب بسرعة." },
    { id: "city", emoji: "🏙️", word: "مدينة", article: "", cat: "city", sentence: "المدينة كبيرة." },
    { id: "car", emoji: "🚗", word: "سيارة", article: "", cat: "city", sentence: "السيارة حمراء." },
    { id: "train", emoji: "🚆", word: "قطار", article: "", cat: "city", sentence: "القطار متأخر." },
    { id: "street", emoji: "🛣️", word: "شارع", article: "", cat: "city", sentence: "أسكن في هذا الشارع." },
    { id: "night", emoji: "🌃", word: "ليلة", article: "", cat: "time", sentence: "الليلة هادئة." },
    { id: "day", emoji: "📅", word: "يوم", article: "", cat: "time", sentence: "اليوم طويل." },
    { id: "love", emoji: "💗", word: "حب", article: "", cat: "emotion", sentence: "الحب لا يُشرح." },
    { id: "eat", emoji: "🍽️", word: "يأكل", article: "", cat: "action", sentence: "أريد أن آكل." },
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
  if (window.SemaLangs) window.SemaLangs.define("ar", "concepts", SEMA_DATA);
}
