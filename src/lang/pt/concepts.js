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
    { id: "pt-house", emoji: "🏠", word: "casa", article: "a", cat: "home", sentence: "A minha casa é perto do mar.", synonyms: ["moradia", "lar"] },
    { id: "pt-door", emoji: "🚪", word: "porta", article: "a", cat: "home", sentence: "A porta está aberta." },
    { id: "pt-water", emoji: "💧", word: "água", article: "a", cat: "food", sentence: "Eu bebo água todos os dias." },
    { id: "pt-bread", emoji: "🍞", word: "pão", article: "o", cat: "food", sentence: "O pão está fresco." },
    { id: "pt-apple", emoji: "🍎", word: "maçã", article: "a", cat: "food", sentence: "A maçã é vermelha." },
    { id: "pt-coffee", emoji: "☕", word: "café", article: "o", cat: "food", sentence: "Eu tomo café pela manhã." },
    { id: "pt-sun", emoji: "☀️", word: "sol", article: "o", cat: "nature", sentence: "O sol nasce cedo." },
    { id: "pt-moon", emoji: "🌙", word: "lua", article: "a", cat: "nature", sentence: "A lua está cheia esta noite." },
    { id: "pt-tree", emoji: "🌳", word: "árvore", article: "a", cat: "nature", sentence: "A árvore é muito alta." },
    { id: "pt-sea", emoji: "🌊", word: "mar", article: "o", cat: "nature", sentence: "O mar está calmo hoje." },
    { id: "pt-dog", emoji: "🐕", word: "cachorro", article: "o", cat: "animals", sentence: "O cachorro dorme no chão." },
    { id: "pt-cat", emoji: "🐈", word: "gato", article: "o", cat: "animals", sentence: "O gato olha pela janela." },
    { id: "pt-bird", emoji: "🐦", word: "pássaro", article: "o", cat: "animals", sentence: "O pássaro canta na árvore." },
    { id: "pt-hand", emoji: "✋", word: "mão", article: "a", cat: "body", sentence: "Eu levanto a mão." },
    { id: "pt-eye", emoji: "👁️", word: "olho", article: "o", cat: "body", sentence: "Eu fecho um olho." },
    { id: "pt-heart", emoji: "❤️", word: "coração", article: "o", cat: "body", sentence: "O coração bate rápido." },
    { id: "pt-city", emoji: "🏙️", word: "cidade", article: "a", cat: "city", sentence: "A cidade é grande." },
    { id: "pt-car", emoji: "🚗", word: "carro", article: "o", cat: "city", sentence: "O carro é vermelho.", synonyms: ["automóvel", "auto"] },
    { id: "pt-train", emoji: "🚆", word: "trem", article: "o", cat: "city", sentence: "O trem chega atrasado." },
    { id: "pt-street", emoji: "🛣️", word: "rua", article: "a", cat: "city", sentence: "Eu moro nesta rua." },
    { id: "pt-night", emoji: "🌃", word: "noite", article: "a", cat: "time", sentence: "A noite é tranquila." },
    { id: "pt-day", emoji: "📅", word: "dia", article: "o", cat: "time", sentence: "O dia é longo." },
    { id: "pt-love", emoji: "💗", word: "amor", article: "o", cat: "emotion", sentence: "O amor não se explica." },
    { id: "pt-eat", emoji: "🍽️", word: "comer", article: "", cat: "action", sentence: "Eu quero comer pão." },
  ],

  edges: [
    { a: "pt-door", b: "pt-house", type: "part-of" },
    { a: "pt-tree", b: "pt-sea", type: "related" },
    { a: "pt-house", b: "pt-city", type: "part-of" },
    { a: "pt-street", b: "pt-city", type: "part-of" },
    { a: "pt-car", b: "pt-street", type: "related" },
    { a: "pt-train", b: "pt-city", type: "related" },
    { a: "pt-bread", b: "pt-eat", type: "used-for" },
    { a: "pt-water", b: "pt-eat", type: "used-with" },
    { a: "pt-apple", b: "pt-eat", type: "used-for" },
    { a: "pt-coffee", b: "pt-water", type: "related" },
    { a: "pt-sun", b: "pt-moon", type: "opposite" },
    { a: "pt-day", b: "pt-night", type: "opposite" },
    { a: "pt-day", b: "pt-sun", type: "related" },
    { a: "pt-night", b: "pt-moon", type: "related" },
    { a: "pt-bird", b: "pt-tree", type: "lives-in" },
    { a: "pt-cat", b: "pt-house", type: "lives-in" },
    { a: "pt-dog", b: "pt-house", type: "lives-in" },
    { a: "pt-dog", b: "pt-cat", type: "related" },
    { a: "pt-hand", b: "pt-heart", type: "part-of" },
    { a: "pt-eye", b: "pt-heart", type: "part-of" },
    { a: "pt-love", b: "pt-heart", type: "related" },
    { a: "pt-sea", b: "pt-water", type: "related" },
    { a: "pt-sun", b: "pt-sea", type: "related" },
    { a: "pt-car", b: "pt-train", type: "related" },
    { a: "pt-city", b: "pt-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("pt", "concepts", SEMA_DATA);
}
