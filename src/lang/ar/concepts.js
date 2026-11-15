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
    { id: "ar-house", emoji: "🏠", word: "بيت", article: "", cat: "home", sentence: "بيتي قريب من البحر.", synonyms: ["منزل"] },
    { id: "ar-door", emoji: "🚪", word: "باب", article: "", cat: "home", sentence: "الباب مفتوح." },
    { id: "ar-water", emoji: "💧", word: "ماء", article: "", cat: "food", sentence: "أشرب الماء كل يوم." },
    { id: "ar-bread", emoji: "🍞", word: "خبز", article: "", cat: "food", sentence: "الخبز طازج." },
    { id: "ar-apple", emoji: "🍎", word: "تفاحة", article: "", cat: "food", sentence: "التفاحة حمراء." },
    { id: "ar-coffee", emoji: "☕", word: "قهوة", article: "", cat: "food", sentence: "أشرب القهوة في الصباح." },
    { id: "ar-sun", emoji: "☀️", word: "شمس", article: "", cat: "nature", sentence: "تشرق الشمس مبكراً." },
    { id: "ar-moon", emoji: "🌙", word: "قمر", article: "", cat: "nature", sentence: "القمر مكتمل الليلة." },
    { id: "ar-tree", emoji: "🌳", word: "شجرة", article: "", cat: "nature", sentence: "الشجرة عالية جداً." },
    { id: "ar-sea", emoji: "🌊", word: "بحر", article: "", cat: "nature", sentence: "البحر هادئ اليوم." },
    { id: "ar-dog", emoji: "🐕", word: "كلب", article: "", cat: "animals", sentence: "الكلب ينام على الأرض." },
    { id: "ar-cat", emoji: "🐈", word: "قطة", article: "", cat: "animals", sentence: "القطة تنظر من النافذة." },
    { id: "ar-bird", emoji: "🐦", word: "طائر", article: "", cat: "animals", sentence: "الطائر يغني على الشجرة." },
    { id: "ar-hand", emoji: "✋", word: "يد", article: "", cat: "body", sentence: "أرفع يدي." },
    { id: "ar-eye", emoji: "👁️", word: "عين", article: "", cat: "body", sentence: "أغمض عيناً واحدة." },
    { id: "ar-heart", emoji: "❤️", word: "قلب", article: "", cat: "body", sentence: "ينبض القلب بسرعة." },
    { id: "ar-city", emoji: "🏙️", word: "مدينة", article: "", cat: "city", sentence: "المدينة كبيرة." },
    { id: "ar-car", emoji: "🚗", word: "سيارة", article: "", cat: "city", sentence: "السيارة حمراء.", synonyms: ["مركبة"] },
    { id: "ar-train", emoji: "🚆", word: "قطار", article: "", cat: "city", sentence: "القطار متأخر." },
    { id: "ar-street", emoji: "🛣️", word: "شارع", article: "", cat: "city", sentence: "أسكن في هذا الشارع." },
    { id: "ar-night", emoji: "🌃", word: "ليلة", article: "", cat: "time", sentence: "الليلة هادئة." },
    { id: "ar-day", emoji: "📅", word: "يوم", article: "", cat: "time", sentence: "اليوم طويل." },
    { id: "ar-love", emoji: "💗", word: "حب", article: "", cat: "emotion", sentence: "الحب لا يُشرح." },
    { id: "ar-eat", emoji: "🍽️", word: "يأكل", article: "", cat: "action", sentence: "أريد أن آكل." },
  ],

  edges: [
    { a: "ar-door", b: "ar-house", type: "part-of" },
    { a: "ar-tree", b: "ar-sea", type: "related" },
    { a: "ar-house", b: "ar-city", type: "part-of" },
    { a: "ar-street", b: "ar-city", type: "part-of" },
    { a: "ar-car", b: "ar-street", type: "related" },
    { a: "ar-train", b: "ar-city", type: "related" },
    { a: "ar-bread", b: "ar-eat", type: "used-for" },
    { a: "ar-water", b: "ar-eat", type: "used-with" },
    { a: "ar-apple", b: "ar-eat", type: "used-for" },
    { a: "ar-coffee", b: "ar-water", type: "related" },
    { a: "ar-sun", b: "ar-moon", type: "opposite" },
    { a: "ar-day", b: "ar-night", type: "opposite" },
    { a: "ar-day", b: "ar-sun", type: "related" },
    { a: "ar-night", b: "ar-moon", type: "related" },
    { a: "ar-bird", b: "ar-tree", type: "lives-in" },
    { a: "ar-cat", b: "ar-house", type: "lives-in" },
    { a: "ar-dog", b: "ar-house", type: "lives-in" },
    { a: "ar-dog", b: "ar-cat", type: "related" },
    { a: "ar-hand", b: "ar-heart", type: "part-of" },
    { a: "ar-eye", b: "ar-heart", type: "part-of" },
    { a: "ar-love", b: "ar-heart", type: "related" },
    { a: "ar-sea", b: "ar-water", type: "related" },
    { a: "ar-sun", b: "ar-sea", type: "related" },
    { a: "ar-car", b: "ar-train", type: "related" },
    { a: "ar-city", b: "ar-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("ar", "concepts", SEMA_DATA);
}
