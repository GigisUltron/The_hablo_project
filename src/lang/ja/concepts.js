/* sema — Japanese concept dataset.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_DATA = {
  language: { code: "ja", name: "Japanese", locale: "ja-JP" },

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
    { id: "house", emoji: "🏠", word: "家", article: "", cat: "home", sentence: "私の家は海の近くにあります。" },
    { id: "door", emoji: "🚪", word: "ドア", article: "", cat: "home", sentence: "ドアは開いています。" },
    { id: "water", emoji: "💧", word: "水", article: "", cat: "food", sentence: "毎日、水を飲みます。" },
    { id: "bread", emoji: "🍞", word: "パン", article: "", cat: "food", sentence: "パンは焼きたてです。" },
    { id: "apple", emoji: "🍎", word: "りんご", article: "", cat: "food", sentence: "りんごは赤いです。" },
    { id: "coffee", emoji: "☕", word: "コーヒー", article: "", cat: "food", sentence: "朝、コーヒーを飲みます。" },
    { id: "sun", emoji: "☀️", word: "太陽", article: "", cat: "nature", sentence: "太陽は早く昇ります。" },
    { id: "moon", emoji: "🌙", word: "月", article: "", cat: "nature", sentence: "今夜は月が満月です。" },
    { id: "tree", emoji: "🌳", word: "木", article: "", cat: "nature", sentence: "木はとても高いです。" },
    { id: "sea", emoji: "🌊", word: "海", article: "", cat: "nature", sentence: "今日は海が静かです。" },
    { id: "dog", emoji: "🐕", word: "犬", article: "", cat: "animals", sentence: "犬は床で寝ています。" },
    { id: "cat", emoji: "🐈", word: "猫", article: "", cat: "animals", sentence: "猫は窓の外を見ています。" },
    { id: "bird", emoji: "🐦", word: "鳥", article: "", cat: "animals", sentence: "鳥は木で歌っています。" },
    { id: "hand", emoji: "✋", word: "手", article: "", cat: "body", sentence: "手を上げます。" },
    { id: "eye", emoji: "👁️", word: "目", article: "", cat: "body", sentence: "片目を閉じます。" },
    { id: "heart", emoji: "❤️", word: "心臓", article: "", cat: "body", sentence: "心臓が速く鼓動しています。" },
    { id: "city", emoji: "🏙️", word: "町", article: "", cat: "city", sentence: "町は大きいです。" },
    { id: "car", emoji: "🚗", word: "車", article: "", cat: "city", sentence: "車は赤いです。" },
    { id: "train", emoji: "🚆", word: "電車", article: "", cat: "city", sentence: "電車は遅れています。" },
    { id: "street", emoji: "🛣️", word: "通り", article: "", cat: "city", sentence: "私はこの通りに住んでいます。" },
    { id: "night", emoji: "🌃", word: "夜", article: "", cat: "time", sentence: "夜は静かです。" },
    { id: "day", emoji: "📅", word: "日", article: "", cat: "time", sentence: "日は長いです。" },
    { id: "love", emoji: "💗", word: "愛", article: "", cat: "emotion", sentence: "愛は説明できません。" },
    { id: "eat", emoji: "🍽️", word: "食べる", article: "", cat: "action", sentence: "パンを食べたいです。" },
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
  if (window.SemaLangs) window.SemaLangs.define("ja", "concepts", SEMA_DATA);
}
