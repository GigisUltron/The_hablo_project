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
    { id: "it-house", emoji: "🏠", word: "casa", article: "la", cat: "home", sentence: "La mia casa è vicino al mare.", synonyms: ["abitazione"] },
    { id: "it-door", emoji: "🚪", word: "porta", article: "la", cat: "home", sentence: "La porta è aperta." },
    { id: "it-water", emoji: "💧", word: "acqua", article: "l'", cat: "food", sentence: "Bevo acqua tutti i giorni." },
    { id: "it-bread", emoji: "🍞", word: "pane", article: "il", cat: "food", sentence: "Il pane è fresco." },
    { id: "it-apple", emoji: "🍎", word: "mela", article: "la", cat: "food", sentence: "La mela è rossa." },
    { id: "it-coffee", emoji: "☕", word: "caffè", article: "il", cat: "food", sentence: "Bevo il caffè la mattina." },
    { id: "it-sun", emoji: "☀️", word: "sole", article: "il", cat: "nature", sentence: "Il sole sorge presto." },
    { id: "it-moon", emoji: "🌙", word: "luna", article: "la", cat: "nature", sentence: "La luna è piena stasera." },
    { id: "it-tree", emoji: "🌳", word: "albero", article: "l'", cat: "nature", sentence: "L'albero è molto alto." },
    { id: "it-sea", emoji: "🌊", word: "mare", article: "il", cat: "nature", sentence: "Il mare è calmo oggi." },
    { id: "it-dog", emoji: "🐕", word: "cane", article: "il", cat: "animals", sentence: "Il cane dorme per terra." },
    { id: "it-cat", emoji: "🐈", word: "gatto", article: "il", cat: "animals", sentence: "Il gatto guarda dalla finestra." },
    { id: "it-bird", emoji: "🐦", word: "uccello", article: "l'", cat: "animals", sentence: "L'uccello canta sull'albero." },
    { id: "it-hand", emoji: "✋", word: "mano", article: "la", cat: "body", sentence: "Alzo la mano." },
    { id: "it-eye", emoji: "👁️", word: "occhio", article: "l'", cat: "body", sentence: "Chiudo un occhio." },
    { id: "it-heart", emoji: "❤️", word: "cuore", article: "il", cat: "body", sentence: "Il cuore batte forte." },
    { id: "it-city", emoji: "🏙️", word: "città", article: "la", cat: "city", sentence: "La città è grande." },
    { id: "it-car", emoji: "🚗", word: "macchina", article: "la", cat: "city", sentence: "La macchina è rossa.", synonyms: ["auto"] },
    { id: "it-train", emoji: "🚆", word: "treno", article: "il", cat: "city", sentence: "Il treno arriva in ritardo." },
    { id: "it-street", emoji: "🛣️", word: "strada", article: "la", cat: "city", sentence: "Abito in questa strada." },
    { id: "it-night", emoji: "🌃", word: "notte", article: "la", cat: "time", sentence: "La notte è tranquilla." },
    { id: "it-day", emoji: "📅", word: "giorno", article: "il", cat: "time", sentence: "Il giorno è lungo." },
    { id: "it-love", emoji: "💗", word: "amore", article: "l'", cat: "emotion", sentence: "L'amore non si spiega." },
    { id: "it-eat", emoji: "🍽️", word: "mangiare", article: "", cat: "action", sentence: "Voglio mangiare del pane." },
  ],

  edges: [
    { a: "it-door", b: "it-house", type: "part-of" },
    { a: "it-tree", b: "it-sea", type: "related" },
    { a: "it-house", b: "it-city", type: "part-of" },
    { a: "it-street", b: "it-city", type: "part-of" },
    { a: "it-car", b: "it-street", type: "related" },
    { a: "it-train", b: "it-city", type: "related" },
    { a: "it-bread", b: "it-eat", type: "used-for" },
    { a: "it-water", b: "it-eat", type: "used-with" },
    { a: "it-apple", b: "it-eat", type: "used-for" },
    { a: "it-coffee", b: "it-water", type: "related" },
    { a: "it-sun", b: "it-moon", type: "opposite" },
    { a: "it-day", b: "it-night", type: "opposite" },
    { a: "it-day", b: "it-sun", type: "related" },
    { a: "it-night", b: "it-moon", type: "related" },
    { a: "it-bird", b: "it-tree", type: "lives-in" },
    { a: "it-cat", b: "it-house", type: "lives-in" },
    { a: "it-dog", b: "it-house", type: "lives-in" },
    { a: "it-dog", b: "it-cat", type: "related" },
    { a: "it-hand", b: "it-heart", type: "part-of" },
    { a: "it-eye", b: "it-heart", type: "part-of" },
    { a: "it-love", b: "it-heart", type: "related" },
    { a: "it-sea", b: "it-water", type: "related" },
    { a: "it-sun", b: "it-sea", type: "related" },
    { a: "it-car", b: "it-train", type: "related" },
    { a: "it-city", b: "it-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("it", "concepts", SEMA_DATA);
}
