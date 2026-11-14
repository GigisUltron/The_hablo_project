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
    { id: "house", emoji: "🏠", word: "Haus", article: "das", cat: "home", sentence: "Mein Haus ist nah am Meer." },
    { id: "door", emoji: "🚪", word: "Tür", article: "die", cat: "home", sentence: "Die Tür ist offen." },
    { id: "water", emoji: "💧", word: "Wasser", article: "das", cat: "food", sentence: "Ich trinke jeden Tag Wasser." },
    { id: "bread", emoji: "🍞", word: "Brot", article: "das", cat: "food", sentence: "Das Brot ist frisch." },
    { id: "apple", emoji: "🍎", word: "Apfel", article: "der", cat: "food", sentence: "Der Apfel ist rot." },
    { id: "coffee", emoji: "☕", word: "Kaffee", article: "der", cat: "food", sentence: "Ich trinke morgens Kaffee." },
    { id: "sun", emoji: "☀️", word: "Sonne", article: "die", cat: "nature", sentence: "Die Sonne geht früh auf." },
    { id: "moon", emoji: "🌙", word: "Mond", article: "der", cat: "nature", sentence: "Der Mond ist heute Nacht voll." },
    { id: "tree", emoji: "🌳", word: "Baum", article: "der", cat: "nature", sentence: "Der Baum ist sehr hoch." },
    { id: "sea", emoji: "🌊", word: "Meer", article: "das", cat: "nature", sentence: "Das Meer ist heute ruhig." },
    { id: "dog", emoji: "🐕", word: "Hund", article: "der", cat: "animals", sentence: "Der Hund schläft auf dem Boden." },
    { id: "cat", emoji: "🐈", word: "Katze", article: "die", cat: "animals", sentence: "Die Katze schaut aus dem Fenster." },
    { id: "bird", emoji: "🐦", word: "Vogel", article: "der", cat: "animals", sentence: "Der Vogel singt im Baum." },
    { id: "hand", emoji: "✋", word: "Hand", article: "die", cat: "body", sentence: "Ich hebe die Hand." },
    { id: "eye", emoji: "👁️", word: "Auge", article: "das", cat: "body", sentence: "Ich schließe ein Auge." },
    { id: "heart", emoji: "❤️", word: "Herz", article: "das", cat: "body", sentence: "Das Herz schlägt schnell." },
    { id: "city", emoji: "🏙️", word: "Stadt", article: "die", cat: "city", sentence: "Die Stadt ist groß." },
    { id: "car", emoji: "🚗", word: "Auto", article: "das", cat: "city", sentence: "Das Auto ist rot." },
    { id: "train", emoji: "🚆", word: "Zug", article: "der", cat: "city", sentence: "Der Zug kommt zu spät." },
    { id: "street", emoji: "🛣️", word: "Straße", article: "die", cat: "city", sentence: "Ich wohne in dieser Straße." },
    { id: "night", emoji: "🌃", word: "Nacht", article: "die", cat: "time", sentence: "Die Nacht ist ruhig." },
    { id: "day", emoji: "📅", word: "Tag", article: "der", cat: "time", sentence: "Der Tag ist lang." },
    { id: "love", emoji: "💗", word: "Liebe", article: "die", cat: "emotion", sentence: "Liebe lässt sich nicht erklären." },
    { id: "eat", emoji: "🍽️", word: "essen", article: "", cat: "action", sentence: "Ich möchte Brot essen." },
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
  if (window.SemaLangs) window.SemaLangs.define("de", "concepts", SEMA_DATA);
}
