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
    { id: "ja-house", emoji: "🏠", word: "家", article: "", cat: "home", sentence: "私の家は海の近くにあります。", synonyms: ["住宅", "住まい"] },
    { id: "ja-door", emoji: "🚪", word: "ドア", article: "", cat: "home", sentence: "ドアは開いています。" },
    { id: "ja-water", emoji: "💧", word: "水", article: "", cat: "food", sentence: "毎日、水を飲みます。" },
    { id: "ja-bread", emoji: "🍞", word: "パン", article: "", cat: "food", sentence: "パンは焼きたてです。" },
    { id: "ja-apple", emoji: "🍎", word: "りんご", article: "", cat: "food", sentence: "りんごは赤いです。" },
    { id: "ja-coffee", emoji: "☕", word: "コーヒー", article: "", cat: "food", sentence: "朝、コーヒーを飲みます。" },
    { id: "ja-sun", emoji: "☀️", word: "太陽", article: "", cat: "nature", sentence: "太陽は早く昇ります。" },
    { id: "ja-moon", emoji: "🌙", word: "月", article: "", cat: "nature", sentence: "今夜は月が満月です。" },
    { id: "ja-tree", emoji: "🌳", word: "木", article: "", cat: "nature", sentence: "木はとても高いです。" },
    { id: "ja-sea", emoji: "🌊", word: "海", article: "", cat: "nature", sentence: "今日は海が静かです。" },
    { id: "ja-dog", emoji: "🐕", word: "犬", article: "", cat: "animals", sentence: "犬は床で寝ています。" },
    { id: "ja-cat", emoji: "🐈", word: "猫", article: "", cat: "animals", sentence: "猫は窓の外を見ています。" },
    { id: "ja-bird", emoji: "🐦", word: "鳥", article: "", cat: "animals", sentence: "鳥は木で歌っています。" },
    { id: "ja-hand", emoji: "✋", word: "手", article: "", cat: "body", sentence: "手を上げます。" },
    { id: "ja-eye", emoji: "👁️", word: "目", article: "", cat: "body", sentence: "片目を閉じます。" },
    { id: "ja-heart", emoji: "❤️", word: "心臓", article: "", cat: "body", sentence: "心臓が速く鼓動しています。" },
    { id: "ja-city", emoji: "🏙️", word: "町", article: "", cat: "city", sentence: "町は大きいです。" },
    { id: "ja-car", emoji: "🚗", word: "車", article: "", cat: "city", sentence: "車は赤いです。", synonyms: ["自動車", "乗り物"] },
    { id: "ja-train", emoji: "🚆", word: "電車", article: "", cat: "city", sentence: "電車は遅れています。" },
    { id: "ja-street", emoji: "🛣️", word: "通り", article: "", cat: "city", sentence: "私はこの通りに住んでいます。" },
    { id: "ja-night", emoji: "🌃", word: "夜", article: "", cat: "time", sentence: "夜は静かです。" },
    { id: "ja-day", emoji: "📅", word: "日", article: "", cat: "time", sentence: "日は長いです。" },
    { id: "ja-love", emoji: "💗", word: "愛", article: "", cat: "emotion", sentence: "愛は説明できません。" },
    { id: "ja-eat", emoji: "🍽️", word: "食べる", article: "", cat: "action", sentence: "パンを食べたいです。" },
  ],

  edges: [
    { a: "ja-door", b: "ja-house", type: "part-of" },
    { a: "ja-tree", b: "ja-sea", type: "related" },
    { a: "ja-house", b: "ja-city", type: "part-of" },
    { a: "ja-street", b: "ja-city", type: "part-of" },
    { a: "ja-car", b: "ja-street", type: "related" },
    { a: "ja-train", b: "ja-city", type: "related" },
    { a: "ja-bread", b: "ja-eat", type: "used-for" },
    { a: "ja-water", b: "ja-eat", type: "used-with" },
    { a: "ja-apple", b: "ja-eat", type: "used-for" },
    { a: "ja-coffee", b: "ja-water", type: "related" },
    { a: "ja-sun", b: "ja-moon", type: "opposite" },
    { a: "ja-day", b: "ja-night", type: "opposite" },
    { a: "ja-day", b: "ja-sun", type: "related" },
    { a: "ja-night", b: "ja-moon", type: "related" },
    { a: "ja-bird", b: "ja-tree", type: "lives-in" },
    { a: "ja-cat", b: "ja-house", type: "lives-in" },
    { a: "ja-dog", b: "ja-house", type: "lives-in" },
    { a: "ja-dog", b: "ja-cat", type: "related" },
    { a: "ja-hand", b: "ja-heart", type: "part-of" },
    { a: "ja-eye", b: "ja-heart", type: "part-of" },
    { a: "ja-love", b: "ja-heart", type: "related" },
    { a: "ja-sea", b: "ja-water", type: "related" },
    { a: "ja-sun", b: "ja-sea", type: "related" },
    { a: "ja-car", b: "ja-train", type: "related" },
    { a: "ja-city", b: "ja-house", type: "related" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("ja", "concepts", SEMA_DATA);
}
