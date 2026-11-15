/* sema — German concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "de", name: "German", locale: "de-DE" },

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
    { id: "de-house", emoji: "🏠", word: "Haus", article: "das", cat: "home", sentence: "Mein Haus ist nah am Meer.", synonyms: ["Zuhause"] },
    { id: "de-door", emoji: "🚪", word: "Tür", article: "die", cat: "home", sentence: "Die Tür ist offen." },
    { id: "de-water", emoji: "💧", word: "Wasser", article: "das", cat: "food", sentence: "Ich trinke jeden Tag Wasser." },
    { id: "de-bread", emoji: "🍞", word: "Brot", article: "das", cat: "food", sentence: "Das Brot ist frisch." },
    { id: "de-apple", emoji: "🍎", word: "Apfel", article: "der", cat: "food", sentence: "Der Apfel ist rot." },
    { id: "de-coffee", emoji: "☕", word: "Kaffee", article: "der", cat: "food", sentence: "Ich trinke morgens Kaffee." },
    { id: "de-sun", emoji: "☀️", word: "Sonne", article: "die", cat: "nature", sentence: "Die Sonne geht früh auf." },
    { id: "de-moon", emoji: "🌙", word: "Mond", article: "der", cat: "nature", sentence: "Der Mond ist heute Nacht voll." },
    { id: "de-tree", emoji: "🌳", word: "Baum", article: "der", cat: "nature", sentence: "Der Baum ist sehr hoch." },
    { id: "de-sea", emoji: "🌊", word: "Meer", article: "das", cat: "nature", sentence: "Das Meer ist heute ruhig." },
    { id: "de-dog", emoji: "🐕", word: "Hund", article: "der", cat: "animals", sentence: "Der Hund schläft auf dem Boden." },
    { id: "de-cat", emoji: "🐈", word: "Katze", article: "die", cat: "animals", sentence: "Die Katze schaut aus dem Fenster." },
    { id: "de-bird", emoji: "🐦", word: "Vogel", article: "der", cat: "animals", sentence: "Der Vogel singt im Baum." },
    { id: "de-hand", emoji: "✋", word: "Hand", article: "die", cat: "body", sentence: "Ich hebe die Hand." },
    { id: "de-eye", emoji: "👁️", word: "Auge", article: "das", cat: "body", sentence: "Ich schließe ein Auge." },
    { id: "de-heart", emoji: "❤️", word: "Herz", article: "das", cat: "body", sentence: "Das Herz schlägt schnell." },
    { id: "de-city", emoji: "🏙️", word: "Stadt", article: "die", cat: "city", sentence: "Die Stadt ist groß." },
    { id: "de-car", emoji: "🚗", word: "Auto", article: "das", cat: "city", sentence: "Das Auto ist rot.", synonyms: ["Wagen"] },
    { id: "de-train", emoji: "🚆", word: "Zug", article: "der", cat: "city", sentence: "Der Zug kommt zu spät." },
    { id: "de-street", emoji: "🛣️", word: "Straße", article: "die", cat: "city", sentence: "Ich wohne in dieser Straße." },
    { id: "de-night", emoji: "🌃", word: "Nacht", article: "die", cat: "time", sentence: "Die Nacht ist ruhig." },
    { id: "de-day", emoji: "📅", word: "Tag", article: "der", cat: "time", sentence: "Der Tag ist lang." },
    { id: "de-love", emoji: "💗", word: "Liebe", article: "die", cat: "emotion", sentence: "Liebe lässt sich nicht erklären." },
    { id: "de-eat", emoji: "🍽️", word: "essen", article: "", cat: "action", sentence: "Ich möchte Brot essen." },
  ],

  edges: [
    { a: "de-door", b: "de-house", type: "part-of" },
    { a: "de-tree", b: "de-sea", type: "related" },
    { a: "de-house", b: "de-city", type: "part-of" },
    { a: "de-street", b: "de-city", type: "part-of" },
    { a: "de-car", b: "de-street", type: "related" },
    { a: "de-train", b: "de-city", type: "related" },
    { a: "de-bread", b: "de-eat", type: "used-for" },
    { a: "de-water", b: "de-eat", type: "used-with" },
    { a: "de-apple", b: "de-eat", type: "used-for" },
    { a: "de-coffee", b: "de-water", type: "related" },
    { a: "de-sun", b: "de-moon", type: "opposite" },
    { a: "de-day", b: "de-night", type: "opposite" },
    { a: "de-day", b: "de-sun", type: "related" },
    { a: "de-night", b: "de-moon", type: "related" },
    { a: "de-bird", b: "de-tree", type: "lives-in" },
    { a: "de-cat", b: "de-house", type: "lives-in" },
    { a: "de-dog", b: "de-house", type: "lives-in" },
    { a: "de-dog", b: "de-cat", type: "related" },
    { a: "de-hand", b: "de-heart", type: "part-of" },
    { a: "de-eye", b: "de-heart", type: "part-of" },
    { a: "de-love", b: "de-heart", type: "related" },
    { a: "de-sea", b: "de-water", type: "related" },
    { a: "de-sun", b: "de-sea", type: "related" },
    { a: "de-car", b: "de-train", type: "related" },
    { a: "de-city", b: "de-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("de", "concepts", SEMA_DATA);
}
