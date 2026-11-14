/* sema — Dutch concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "nl", name: "Dutch", locale: "nl-NL" },

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
    { id: "house", emoji: "🏠", word: "huis", article: "het", cat: "home", sentence: "Mijn huis staat dicht bij de zee." },
    { id: "door", emoji: "🚪", word: "deur", article: "de", cat: "home", sentence: "De deur is open." },
    { id: "water", emoji: "💧", word: "water", article: "het", cat: "food", sentence: "Ik drink elke dag water." },
    { id: "bread", emoji: "🍞", word: "brood", article: "het", cat: "food", sentence: "Het brood is vers." },
    { id: "apple", emoji: "🍎", word: "appel", article: "de", cat: "food", sentence: "De appel is rood." },
    { id: "coffee", emoji: "☕", word: "koffie", article: "de", cat: "food", sentence: "Ik drink 's ochtends koffie." },
    { id: "sun", emoji: "☀️", word: "zon", article: "de", cat: "nature", sentence: "De zon komt vroeg op." },
    { id: "moon", emoji: "🌙", word: "maan", article: "de", cat: "nature", sentence: "De maan is vol vannacht." },
    { id: "tree", emoji: "🌳", word: "boom", article: "de", cat: "nature", sentence: "De boom is heel hoog." },
    { id: "sea", emoji: "🌊", word: "zee", article: "de", cat: "nature", sentence: "De zee is vandaag rustig." },
    { id: "dog", emoji: "🐕", word: "hond", article: "de", cat: "animals", sentence: "De hond slaapt op de grond." },
    { id: "cat", emoji: "🐈", word: "kat", article: "de", cat: "animals", sentence: "De kat kijkt uit het raam." },
    { id: "bird", emoji: "🐦", word: "vogel", article: "de", cat: "animals", sentence: "De vogel zingt in de boom." },
    { id: "hand", emoji: "✋", word: "hand", article: "de", cat: "body", sentence: "Ik steek mijn hand op." },
    { id: "eye", emoji: "👁️", word: "oog", article: "het", cat: "body", sentence: "Ik doe één oog dicht." },
    { id: "heart", emoji: "❤️", word: "hart", article: "het", cat: "body", sentence: "Het hart klopt snel." },
    { id: "city", emoji: "🏙️", word: "stad", article: "de", cat: "city", sentence: "De stad is groot." },
    { id: "car", emoji: "🚗", word: "auto", article: "de", cat: "city", sentence: "De auto is rood." },
    { id: "train", emoji: "🚆", word: "trein", article: "de", cat: "city", sentence: "De trein komt te laat." },
    { id: "street", emoji: "🛣️", word: "straat", article: "de", cat: "city", sentence: "Ik woon in deze straat." },
    { id: "night", emoji: "🌃", word: "nacht", article: "de", cat: "time", sentence: "De nacht is rustig." },
    { id: "day", emoji: "📅", word: "dag", article: "de", cat: "time", sentence: "De dag is lang." },
    { id: "love", emoji: "💗", word: "liefde", article: "de", cat: "emotion", sentence: "Liefde valt niet uit te leggen." },
    { id: "eat", emoji: "🍽️", word: "eten", article: "", cat: "action", sentence: "Ik wil brood eten." },
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
  if (window.SemaLangs) window.SemaLangs.define("nl", "concepts", SEMA_DATA);
}
