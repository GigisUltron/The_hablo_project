/* sema — Portuguese concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "pt", name: "Portuguese", locale: "pt-PT" },

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
    { id: "house", emoji: "🏠", word: "casa", article: "a", cat: "home", sentence: "A minha casa é perto do mar." },
    { id: "door", emoji: "🚪", word: "porta", article: "a", cat: "home", sentence: "A porta está aberta." },
    { id: "water", emoji: "💧", word: "água", article: "a", cat: "food", sentence: "Eu bebo água todos os dias." },
    { id: "bread", emoji: "🍞", word: "pão", article: "o", cat: "food", sentence: "O pão está fresco." },
    { id: "apple", emoji: "🍎", word: "maçã", article: "a", cat: "food", sentence: "A maçã é vermelha." },
    { id: "coffee", emoji: "☕", word: "café", article: "o", cat: "food", sentence: "Eu tomo café pela manhã." },
    { id: "sun", emoji: "☀️", word: "sol", article: "o", cat: "nature", sentence: "O sol nasce cedo." },
    { id: "moon", emoji: "🌙", word: "lua", article: "a", cat: "nature", sentence: "A lua está cheia esta noite." },
    { id: "tree", emoji: "🌳", word: "árvore", article: "a", cat: "nature", sentence: "A árvore é muito alta." },
    { id: "sea", emoji: "🌊", word: "mar", article: "o", cat: "nature", sentence: "O mar está calmo hoje." },
    { id: "dog", emoji: "🐕", word: "cachorro", article: "o", cat: "animals", sentence: "O cachorro dorme no chão." },
    { id: "cat", emoji: "🐈", word: "gato", article: "o", cat: "animals", sentence: "O gato olha pela janela." },
    { id: "bird", emoji: "🐦", word: "pássaro", article: "o", cat: "animals", sentence: "O pássaro canta na árvore." },
    { id: "hand", emoji: "✋", word: "mão", article: "a", cat: "body", sentence: "Eu levanto a mão." },
    { id: "eye", emoji: "👁️", word: "olho", article: "o", cat: "body", sentence: "Eu fecho um olho." },
    { id: "heart", emoji: "❤️", word: "coração", article: "o", cat: "body", sentence: "O coração bate rápido." },
    { id: "city", emoji: "🏙️", word: "cidade", article: "a", cat: "city", sentence: "A cidade é grande." },
    { id: "car", emoji: "🚗", word: "carro", article: "o", cat: "city", sentence: "O carro é vermelho." },
    { id: "train", emoji: "🚆", word: "trem", article: "o", cat: "city", sentence: "O trem chega atrasado." },
    { id: "street", emoji: "🛣️", word: "rua", article: "a", cat: "city", sentence: "Eu moro nesta rua." },
    { id: "night", emoji: "🌃", word: "noite", article: "a", cat: "time", sentence: "A noite é tranquila." },
    { id: "day", emoji: "📅", word: "dia", article: "o", cat: "time", sentence: "O dia é longo." },
    { id: "love", emoji: "💗", word: "amor", article: "o", cat: "emotion", sentence: "O amor não se explica." },
    { id: "eat", emoji: "🍽️", word: "comer", article: "", cat: "action", sentence: "Eu quero comer pão." },
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
  if (window.SemaLangs) window.SemaLangs.define("pt", "concepts", SEMA_DATA);
}
