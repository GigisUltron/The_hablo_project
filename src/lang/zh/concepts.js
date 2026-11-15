/* sema — Chinese concept dataset.
 *
 * The `sub` field is Hanyu Pinyin with tone marks, one syllable per Han
 * character: the spacing is the ruby alignment data. It is not an English gloss.
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
    { id: "zh-house", emoji: "🏠", word: "房子", article: "", cat: "home", sentence: "我的房子离海很近。", sub: "fáng zi", synonyms: ["家", "住宅"] },
    { id: "zh-door", emoji: "🚪", word: "门", article: "", cat: "home", sentence: "门开着。", sub: "mén" },
    { id: "zh-water", emoji: "💧", word: "水", article: "", cat: "food", sentence: "我每天喝水。", sub: "shuǐ" },
    { id: "zh-bread", emoji: "🍞", word: "面包", article: "", cat: "food", sentence: "面包很新鲜。", sub: "miàn bāo" },
    { id: "zh-apple", emoji: "🍎", word: "苹果", article: "", cat: "food", sentence: "苹果是红色的。", sub: "píng guǒ" },
    { id: "zh-coffee", emoji: "☕", word: "咖啡", article: "", cat: "food", sentence: "我早上喝咖啡。", sub: "kā fēi" },
    { id: "zh-sun", emoji: "☀️", word: "太阳", article: "", cat: "nature", sentence: "太阳升得很早。", sub: "tài yáng" },
    { id: "zh-moon", emoji: "🌙", word: "月亮", article: "", cat: "nature", sentence: "今晚月亮很圆。", sub: "yuè liang" },
    { id: "zh-tree", emoji: "🌳", word: "树", article: "", cat: "nature", sentence: "树很高。", sub: "shù" },
    { id: "zh-sea", emoji: "🌊", word: "海", article: "", cat: "nature", sentence: "今天海很平静。", sub: "hǎi" },
    { id: "zh-dog", emoji: "🐕", word: "狗", article: "", cat: "animals", sentence: "狗睡在地上。", sub: "gǒu" },
    { id: "zh-cat", emoji: "🐈", word: "猫", article: "", cat: "animals", sentence: "猫看着窗外。", sub: "māo" },
    { id: "zh-bird", emoji: "🐦", word: "鸟", article: "", cat: "animals", sentence: "鸟在树上唱歌。", sub: "niǎo" },
    { id: "zh-hand", emoji: "✋", word: "手", article: "", cat: "body", sentence: "我举起手。", sub: "shǒu" },
    { id: "zh-eye", emoji: "👁️", word: "眼睛", article: "", cat: "body", sentence: "我闭上一只眼睛。", sub: "yǎn jing" },
    { id: "zh-heart", emoji: "❤️", word: "心", article: "", cat: "body", sentence: "心在快速跳动。", sub: "xīn" },
    { id: "zh-city", emoji: "🏙️", word: "城市", article: "", cat: "city", sentence: "城市很大。", sub: "chéng shì" },
    { id: "zh-car", emoji: "🚗", word: "汽车", article: "", cat: "city", sentence: "汽车是红色的。", sub: "qì chē", synonyms: ["车", "轿车"] },
    { id: "zh-train", emoji: "🚆", word: "火车", article: "", cat: "city", sentence: "火车晚点了。", sub: "huǒ chē" },
    { id: "zh-street", emoji: "🛣️", word: "街道", article: "", cat: "city", sentence: "我住在这条街上。", sub: "jiē dào" },
    { id: "zh-night", emoji: "🌃", word: "夜晚", article: "", cat: "time", sentence: "夜晚很安静。", sub: "yè wǎn" },
    { id: "zh-day", emoji: "📅", word: "白天", article: "", cat: "time", sentence: "白天很长。", sub: "bái tiān" },
    { id: "zh-love", emoji: "💗", word: "爱", article: "", cat: "emotion", sentence: "爱无法解释。", sub: "ài" },
    { id: "zh-eat", emoji: "🍽️", word: "吃", article: "", cat: "action", sentence: "我想吃面包。", sub: "chī" },
    { id: "zh-decision", emoji: "⚖️", word: "决定", article: "", cat: "abstract", sentence: "我做出了一个艰难的决定。", sub: "jué dìng", synonyms: ["选择"] },
    { id: "zh-purpose", emoji: "🎯", word: "目的", article: "", cat: "abstract", sentence: "我的目的是学习中文。", sub: "mù dì", synonyms: ["目标"] },
    { id: "zh-challenge", emoji: "🧗", word: "挑战", article: "", cat: "abstract", sentence: "挑战很大，但有可能。", sub: "tiǎo zhàn", synonyms: ["难题"] },
    { id: "zh-achievement", emoji: "🏆", word: "成就", article: "", cat: "abstract", sentence: "我们庆祝你的成就。", sub: "chéng jiù", synonyms: ["成果"] },
    { id: "zh-risk", emoji: "⚠️", word: "风险", article: "", cat: "abstract", sentence: "有一个小风险。", sub: "fēng xiǎn", synonyms: ["危险"] },
  ],

  edges: [
    { a: "zh-door", b: "zh-house", type: "part-of" },
    { a: "zh-tree", b: "zh-sea", type: "related" },
    { a: "zh-house", b: "zh-city", type: "part-of" },
    { a: "zh-street", b: "zh-city", type: "part-of" },
    { a: "zh-car", b: "zh-street", type: "related" },
    { a: "zh-train", b: "zh-city", type: "related" },
    { a: "zh-bread", b: "zh-eat", type: "used-for" },
    { a: "zh-water", b: "zh-eat", type: "used-with" },
    { a: "zh-apple", b: "zh-eat", type: "used-for" },
    { a: "zh-coffee", b: "zh-water", type: "related" },
    { a: "zh-sun", b: "zh-moon", type: "opposite" },
    { a: "zh-day", b: "zh-night", type: "opposite" },
    { a: "zh-day", b: "zh-sun", type: "related" },
    { a: "zh-night", b: "zh-moon", type: "related" },
    { a: "zh-bird", b: "zh-tree", type: "lives-in" },
    { a: "zh-cat", b: "zh-house", type: "lives-in" },
    { a: "zh-dog", b: "zh-house", type: "lives-in" },
    { a: "zh-dog", b: "zh-cat", type: "related" },
    { a: "zh-hand", b: "zh-heart", type: "part-of" },
    { a: "zh-eye", b: "zh-heart", type: "part-of" },
    { a: "zh-love", b: "zh-heart", type: "related" },
    { a: "zh-sea", b: "zh-water", type: "related" },
    { a: "zh-sun", b: "zh-sea", type: "related" },
    { a: "zh-car", b: "zh-train", type: "related" },
    { a: "zh-city", b: "zh-house", type: "related" },
    { a: "zh-decision", b: "zh-risk", type: "related" },
    { a: "zh-purpose", b: "zh-achievement", type: "related" },
    { a: "zh-challenge", b: "zh-decision", type: "related" },
    { a: "zh-achievement", b: "zh-risk", type: "related" },
    { a: "zh-risk", b: "zh-purpose", type: "related" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("zh", "concepts", SEMA_DATA);
}
