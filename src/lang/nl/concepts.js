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
    { id: "nl-house", emoji: "🏠", word: "huis", article: "het", cat: "home", sentence: "Mijn huis staat dicht bij de zee." },
    { id: "nl-door", emoji: "🚪", word: "deur", article: "de", cat: "home", sentence: "De deur is open." },
    { id: "nl-water", emoji: "💧", word: "water", article: "het", cat: "food", sentence: "Ik drink elke dag water." },
    { id: "nl-bread", emoji: "🍞", word: "brood", article: "het", cat: "food", sentence: "Het brood is vers." },
    { id: "nl-apple", emoji: "🍎", word: "appel", article: "de", cat: "food", sentence: "De appel is rood." },
    { id: "nl-coffee", emoji: "☕", word: "koffie", article: "de", cat: "food", sentence: "Ik drink 's ochtends koffie." },
    { id: "nl-sun", emoji: "☀️", word: "zon", article: "de", cat: "nature", sentence: "De zon komt vroeg op." },
    { id: "nl-moon", emoji: "🌙", word: "maan", article: "de", cat: "nature", sentence: "De maan is vol vannacht." },
    { id: "nl-tree", emoji: "🌳", word: "boom", article: "de", cat: "nature", sentence: "De boom is heel hoog." },
    { id: "nl-sea", emoji: "🌊", word: "zee", article: "de", cat: "nature", sentence: "De zee is vandaag rustig." },
    { id: "nl-dog", emoji: "🐕", word: "hond", article: "de", cat: "animals", sentence: "De hond slaapt op de grond." },
    { id: "nl-cat", emoji: "🐈", word: "kat", article: "de", cat: "animals", sentence: "De kat kijkt uit het raam." },
    { id: "nl-bird", emoji: "🐦", word: "vogel", article: "de", cat: "animals", sentence: "De vogel zingt in de boom." },
    { id: "nl-hand", emoji: "✋", word: "hand", article: "de", cat: "body", sentence: "Ik steek mijn hand op." },
    { id: "nl-eye", emoji: "👁️", word: "oog", article: "het", cat: "body", sentence: "Ik doe één oog dicht." },
    { id: "nl-heart", emoji: "❤️", word: "hart", article: "het", cat: "body", sentence: "Het hart klopt snel." },
    { id: "nl-city", emoji: "🏙️", word: "stad", article: "de", cat: "city", sentence: "De stad is groot." },
    { id: "nl-car", emoji: "🚗", word: "auto", article: "de", cat: "city", sentence: "De auto is rood." },
    { id: "nl-train", emoji: "🚆", word: "trein", article: "de", cat: "city", sentence: "De trein komt te laat." },
    { id: "nl-street", emoji: "🛣️", word: "straat", article: "de", cat: "city", sentence: "Ik woon in deze straat." },
    { id: "nl-night", emoji: "🌃", word: "nacht", article: "de", cat: "time", sentence: "De nacht is rustig." },
    { id: "nl-day", emoji: "📅", word: "dag", article: "de", cat: "time", sentence: "De dag is lang." },
    { id: "nl-love", emoji: "💗", word: "liefde", article: "de", cat: "emotion", sentence: "Liefde valt niet uit te leggen." },
    { id: "nl-eat", emoji: "🍽️", word: "eten", article: "", cat: "action", sentence: "Ik wil brood eten." },
  ],

  edges: [
    { a: "nl-door", b: "nl-house", type: "part-of" },
    { a: "nl-tree", b: "nl-sea", type: "related" },
    { a: "nl-house", b: "nl-city", type: "part-of" },
    { a: "nl-street", b: "nl-city", type: "part-of" },
    { a: "nl-car", b: "nl-street", type: "related" },
    { a: "nl-train", b: "nl-city", type: "related" },
    { a: "nl-bread", b: "nl-eat", type: "used-for" },
    { a: "nl-water", b: "nl-eat", type: "used-with" },
    { a: "nl-apple", b: "nl-eat", type: "used-for" },
    { a: "nl-coffee", b: "nl-water", type: "related" },
    { a: "nl-sun", b: "nl-moon", type: "opposite" },
    { a: "nl-day", b: "nl-night", type: "opposite" },
    { a: "nl-day", b: "nl-sun", type: "related" },
    { a: "nl-night", b: "nl-moon", type: "related" },
    { a: "nl-bird", b: "nl-tree", type: "lives-in" },
    { a: "nl-cat", b: "nl-house", type: "lives-in" },
    { a: "nl-dog", b: "nl-house", type: "lives-in" },
    { a: "nl-dog", b: "nl-cat", type: "related" },
    { a: "nl-hand", b: "nl-heart", type: "part-of" },
    { a: "nl-eye", b: "nl-heart", type: "part-of" },
    { a: "nl-love", b: "nl-heart", type: "related" },
    { a: "nl-sea", b: "nl-water", type: "related" },
    { a: "nl-sun", b: "nl-sea", type: "related" },
    { a: "nl-car", b: "nl-train", type: "related" },
    { a: "nl-city", b: "nl-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("nl", "concepts", SEMA_DATA);
}
