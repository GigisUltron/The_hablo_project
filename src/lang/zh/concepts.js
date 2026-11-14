/* sema — Chinese concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "zh", name: "Chinese", locale: "zh-CN" },

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
    { id: "house", emoji: "🏠", word: "房子", article: "", cat: "home", sentence: "我的房子离海很近。" },
    { id: "door", emoji: "🚪", word: "门", article: "", cat: "home", sentence: "门开着。" },
    { id: "water", emoji: "💧", word: "水", article: "", cat: "food", sentence: "我每天喝水。" },
    { id: "bread", emoji: "🍞", word: "面包", article: "", cat: "food", sentence: "面包很新鲜。" },
    { id: "apple", emoji: "🍎", word: "苹果", article: "", cat: "food", sentence: "苹果是红色的。" },
    { id: "coffee", emoji: "☕", word: "咖啡", article: "", cat: "food", sentence: "我早上喝咖啡。" },
    { id: "sun", emoji: "☀️", word: "太阳", article: "", cat: "nature", sentence: "太阳升得很早。" },
    { id: "moon", emoji: "🌙", word: "月亮", article: "", cat: "nature", sentence: "今晚月亮很圆。" },
    { id: "tree", emoji: "🌳", word: "树", article: "", cat: "nature", sentence: "树很高。" },
    { id: "sea", emoji: "🌊", word: "海", article: "", cat: "nature", sentence: "今天海很平静。" },
    { id: "dog", emoji: "🐕", word: "狗", article: "", cat: "animals", sentence: "狗睡在地上。" },
    { id: "cat", emoji: "🐈", word: "猫", article: "", cat: "animals", sentence: "猫看着窗外。" },
    { id: "bird", emoji: "🐦", word: "鸟", article: "", cat: "animals", sentence: "鸟在树上唱歌。" },
    { id: "hand", emoji: "✋", word: "手", article: "", cat: "body", sentence: "我举起手。" },
    { id: "eye", emoji: "👁️", word: "眼睛", article: "", cat: "body", sentence: "我闭上一只眼睛。" },
    { id: "heart", emoji: "❤️", word: "心", article: "", cat: "body", sentence: "心在快速跳动。" },
    { id: "city", emoji: "🏙️", word: "城市", article: "", cat: "city", sentence: "城市很大。" },
    { id: "car", emoji: "🚗", word: "汽车", article: "", cat: "city", sentence: "汽车是红色的。" },
    { id: "train", emoji: "🚆", word: "火车", article: "", cat: "city", sentence: "火车晚点了。" },
    { id: "street", emoji: "🛣️", word: "街道", article: "", cat: "city", sentence: "我住在这条街上。" },
    { id: "night", emoji: "🌃", word: "夜晚", article: "", cat: "time", sentence: "夜晚很安静。" },
    { id: "day", emoji: "📅", word: "白天", article: "", cat: "time", sentence: "白天很长。" },
    { id: "love", emoji: "💗", word: "爱", article: "", cat: "emotion", sentence: "爱无法解释。" },
    { id: "eat", emoji: "🍽️", word: "吃", article: "", cat: "action", sentence: "我想吃面包。" },
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
  if (window.SemaLangs) window.SemaLangs.define("zh", "concepts", SEMA_DATA);
}
