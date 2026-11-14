/* sema — Italian concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "it", name: "Italian", locale: "it-IT" },

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
    { id: "house", emoji: "🏠", word: "casa", article: "la", cat: "home", sentence: "La mia casa è vicino al mare." },
    { id: "door", emoji: "🚪", word: "porta", article: "la", cat: "home", sentence: "La porta è aperta." },
    { id: "water", emoji: "💧", word: "acqua", article: "l'", cat: "food", sentence: "Bevo acqua tutti i giorni." },
    { id: "bread", emoji: "🍞", word: "pane", article: "il", cat: "food", sentence: "Il pane è fresco." },
    { id: "apple", emoji: "🍎", word: "mela", article: "la", cat: "food", sentence: "La mela è rossa." },
    { id: "coffee", emoji: "☕", word: "caffè", article: "il", cat: "food", sentence: "Bevo il caffè la mattina." },
    { id: "sun", emoji: "☀️", word: "sole", article: "il", cat: "nature", sentence: "Il sole sorge presto." },
    { id: "moon", emoji: "🌙", word: "luna", article: "la", cat: "nature", sentence: "La luna è piena stasera." },
    { id: "tree", emoji: "🌳", word: "albero", article: "l'", cat: "nature", sentence: "L'albero è molto alto." },
    { id: "sea", emoji: "🌊", word: "mare", article: "il", cat: "nature", sentence: "Il mare è calmo oggi." },
    { id: "dog", emoji: "🐕", word: "cane", article: "il", cat: "animals", sentence: "Il cane dorme per terra." },
    { id: "cat", emoji: "🐈", word: "gatto", article: "il", cat: "animals", sentence: "Il gatto guarda dalla finestra." },
    { id: "bird", emoji: "🐦", word: "uccello", article: "l'", cat: "animals", sentence: "L'uccello canta sull'albero." },
    { id: "hand", emoji: "✋", word: "mano", article: "la", cat: "body", sentence: "Alzo la mano." },
    { id: "eye", emoji: "👁️", word: "occhio", article: "l'", cat: "body", sentence: "Chiudo un occhio." },
    { id: "heart", emoji: "❤️", word: "cuore", article: "il", cat: "body", sentence: "Il cuore batte forte." },
    { id: "city", emoji: "🏙️", word: "città", article: "la", cat: "city", sentence: "La città è grande." },
    { id: "car", emoji: "🚗", word: "macchina", article: "la", cat: "city", sentence: "La macchina è rossa." },
    { id: "train", emoji: "🚆", word: "treno", article: "il", cat: "city", sentence: "Il treno arriva in ritardo." },
    { id: "street", emoji: "🛣️", word: "strada", article: "la", cat: "city", sentence: "Abito in questa strada." },
    { id: "night", emoji: "🌃", word: "notte", article: "la", cat: "time", sentence: "La notte è tranquilla." },
    { id: "day", emoji: "📅", word: "giorno", article: "il", cat: "time", sentence: "Il giorno è lungo." },
    { id: "love", emoji: "💗", word: "amore", article: "l'", cat: "emotion", sentence: "L'amore non si spiega." },
    { id: "eat", emoji: "🍽️", word: "mangiare", article: "", cat: "action", sentence: "Voglio mangiare del pane." },
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
  if (window.SemaLangs) window.SemaLangs.define("it", "concepts", SEMA_DATA);
}
