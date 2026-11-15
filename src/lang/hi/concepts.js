/* sema — Hindi concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "hi", name: "Hindi", locale: "hi-IN" },

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
    { id: "hi-house", emoji: "🏠", word: "घर", article: "", cat: "home", sentence: "मेरा घर समुद्र के पास है।", synonyms: ["मकान"] },
    { id: "hi-door", emoji: "🚪", word: "दरवाज़ा", article: "", cat: "home", sentence: "दरवाज़ा खुला है।" },
    { id: "hi-water", emoji: "💧", word: "पानी", article: "", cat: "food", sentence: "मैं हर दिन पानी पीता हूँ।", synonyms: ["जल"] },
    { id: "hi-bread", emoji: "🍞", word: "रोटी", article: "", cat: "food", sentence: "रोटी ताज़ी है।" },
    { id: "hi-apple", emoji: "🍎", word: "सेब", article: "", cat: "food", sentence: "सेब लाल है।" },
    { id: "hi-coffee", emoji: "☕", word: "कॉफ़ी", article: "", cat: "food", sentence: "मैं सुबह कॉफ़ी पीता हूँ।" },
    { id: "hi-sun", emoji: "☀️", word: "सूरज", article: "", cat: "nature", sentence: "सूरज जल्दी निकलता है।" },
    { id: "hi-moon", emoji: "🌙", word: "चाँद", article: "", cat: "nature", sentence: "आज रात चाँद पूरा है।" },
    { id: "hi-tree", emoji: "🌳", word: "पेड़", article: "", cat: "nature", sentence: "पेड़ बहुत ऊँचा है।" },
    { id: "hi-sea", emoji: "🌊", word: "समुद्र", article: "", cat: "nature", sentence: "आज समुद्र शांत है।" },
    { id: "hi-dog", emoji: "🐕", word: "कुत्ता", article: "", cat: "animals", sentence: "कुत्ता फ़र्श पर सोता है।" },
    { id: "hi-cat", emoji: "🐈", word: "बिल्ली", article: "", cat: "animals", sentence: "बिल्ली खिड़की से देखती है।" },
    { id: "hi-bird", emoji: "🐦", word: "पक्षी", article: "", cat: "animals", sentence: "पक्षी पेड़ पर गाता है।" },
    { id: "hi-hand", emoji: "✋", word: "हाथ", article: "", cat: "body", sentence: "मैं हाथ उठाता हूँ।" },
    { id: "hi-eye", emoji: "👁️", word: "आँख", article: "", cat: "body", sentence: "मैं एक आँख बंद करता हूँ।" },
    { id: "hi-heart", emoji: "❤️", word: "दिल", article: "", cat: "body", sentence: "दिल तेज़ धड़कता है।" },
    { id: "hi-city", emoji: "🏙️", word: "शहर", article: "", cat: "city", sentence: "शहर बड़ा है।" },
    { id: "hi-car", emoji: "🚗", word: "गाड़ी", article: "", cat: "city", sentence: "गाड़ी लाल है।" },
    { id: "hi-train", emoji: "🚆", word: "ट्रेन", article: "", cat: "city", sentence: "ट्रेन देर से आती है।" },
    { id: "hi-street", emoji: "🛣️", word: "सड़क", article: "", cat: "city", sentence: "मैं इस सड़क पर रहता हूँ।" },
    { id: "hi-night", emoji: "🌃", word: "रात", article: "", cat: "time", sentence: "रात शांत है।" },
    { id: "hi-day", emoji: "📅", word: "दिन", article: "", cat: "time", sentence: "दिन लंबा है।" },
    { id: "hi-love", emoji: "💗", word: "प्यार", article: "", cat: "emotion", sentence: "प्यार समझाया नहीं जा सकता।" },
    { id: "hi-eat", emoji: "🍽️", word: "खाना", article: "", cat: "action", sentence: "मैं खाना खाना चाहता हूँ।" },
  ],

  edges: [
    { a: "hi-door", b: "hi-house", type: "part-of" },
    { a: "hi-tree", b: "hi-sea", type: "related" },
    { a: "hi-house", b: "hi-city", type: "part-of" },
    { a: "hi-street", b: "hi-city", type: "part-of" },
    { a: "hi-car", b: "hi-street", type: "related" },
    { a: "hi-train", b: "hi-city", type: "related" },
    { a: "hi-bread", b: "hi-eat", type: "used-for" },
    { a: "hi-water", b: "hi-eat", type: "used-with" },
    { a: "hi-apple", b: "hi-eat", type: "used-for" },
    { a: "hi-coffee", b: "hi-water", type: "related" },
    { a: "hi-sun", b: "hi-moon", type: "opposite" },
    { a: "hi-day", b: "hi-night", type: "opposite" },
    { a: "hi-day", b: "hi-sun", type: "related" },
    { a: "hi-night", b: "hi-moon", type: "related" },
    { a: "hi-bird", b: "hi-tree", type: "lives-in" },
    { a: "hi-cat", b: "hi-house", type: "lives-in" },
    { a: "hi-dog", b: "hi-house", type: "lives-in" },
    { a: "hi-dog", b: "hi-cat", type: "related" },
    { a: "hi-hand", b: "hi-heart", type: "part-of" },
    { a: "hi-eye", b: "hi-heart", type: "part-of" },
    { a: "hi-love", b: "hi-heart", type: "related" },
    { a: "hi-sea", b: "hi-water", type: "related" },
    { a: "hi-sun", b: "hi-sea", type: "related" },
    { a: "hi-car", b: "hi-train", type: "related" },
    { a: "hi-city", b: "hi-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("hi", "concepts", SEMA_DATA);
}
