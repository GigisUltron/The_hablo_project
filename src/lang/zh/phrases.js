/* sema — Chinese phrase deck.
 *
 * `sub` is Hanyu Pinyin with tone marks, one syllable per Han character and
 * single spaces between tokens: the spacing is the ruby alignment data.
 */
var SEMA_PHRASES = {
  openers: ["ph-zh-hello", "ph-zh-how-are-you", "ph-zh-colour", "ph-zh-where-from"],
  phrases: [
    { id: "ph-zh-hello", emoji: "👋", text: "你好！", sub: "nǐ hǎo", cat: "phrase" },
    { id: "ph-zh-good-morning", emoji: "🌅", text: "早上好。", sub: "zǎo shang hǎo", cat: "phrase" },
    { id: "ph-zh-good-night", emoji: "🌙", text: "晚安。", sub: "wǎn ān", cat: "phrase" },
    { id: "ph-zh-goodbye", emoji: "✌️", text: "再见。", sub: "zài jiàn", cat: "phrase" },
    { id: "ph-zh-thank-you", emoji: "🙌", text: "非常感谢。", sub: "fēi cháng gǎn xiè", cat: "phrase" },
    { id: "ph-zh-please", emoji: "🙏", text: "请。", sub: "qǐng", cat: "phrase" },
    { id: "ph-zh-excuse-me", emoji: "🙇", text: "不好意思。", sub: "bù hǎo yì si", cat: "phrase" },
    { id: "ph-zh-how-are-you", emoji: "😊", text: "你好吗？", sub: "nǐ hǎo ma", cat: "phrase" },
    { id: "ph-zh-my-name-is", emoji: "🙋", text: "我叫……", sub: "wǒ jiào", cat: "phrase" },
    { id: "ph-zh-what-is-your-name", emoji: "❓", text: "你叫什么名字？", sub: "nǐ jiào shén me míng zi", cat: "phrase" },
    { id: "ph-zh-dont-understand", emoji: "🤷", text: "我不懂。", sub: "wǒ bù dǒng", cat: "phrase" },
    { id: "ph-zh-repeat", emoji: "🔁", text: "请再说一遍。", sub: "qǐng zài shuō yí biàn", cat: "phrase" },
    { id: "ph-zh-speak-slower", emoji: "🐢", text: "请说慢一点。", sub: "qǐng shuō màn yì diǎn", cat: "phrase" },
    { id: "ph-zh-how-much", emoji: "🏷️", text: "这个多少钱？", sub: "zhè ge duō shao qián", cat: "phrase" },
    { id: "ph-zh-where-bathroom", emoji: "🚻", text: "洗手间在哪里？", sub: "xǐ shǒu jiān zài nǎ lǐ", cat: "phrase" },
    { id: "ph-zh-where-station", emoji: "🚉", text: "车站在哪里？", sub: "chē zhàn zài nǎ lǐ", cat: "phrase" },
    { id: "ph-zh-coffee", emoji: "☕", text: "请给我一杯咖啡。", sub: "qǐng gěi wǒ yì bēi kā fēi", cat: "phrase" },
    { id: "ph-zh-bill", emoji: "🧾", text: "请结账。", sub: "qǐng jié zhàng", cat: "phrase" },
    { id: "ph-zh-water", emoji: "💧", text: "请给我水。", sub: "qǐng gěi wǒ shuǐ", cat: "phrase" },
    { id: "ph-zh-need-help", emoji: "🆘", text: "我需要帮助。", sub: "wǒ xū yào bāng zhù", cat: "phrase" },
    { id: "ph-zh-need-doctor", emoji: "🏥", text: "我需要医生。", sub: "wǒ xū yào yī shēng", cat: "phrase" },
    { id: "ph-zh-lost", emoji: "🧭", text: "我迷路了。", sub: "wǒ mí lù le", cat: "phrase" },
    { id: "ph-zh-speak-english", emoji: "💬", text: "你会说英语吗？", sub: "nǐ huì shuō yīng yǔ ma", cat: "phrase" },
    { id: "ph-zh-dont-speak", emoji: "🗣️", text: "我不会说中文。", sub: "wǒ bú huì shuō zhōng wén", cat: "phrase" },
    { id: "ph-zh-nice-to-meet", emoji: "🤝", text: "很高兴认识你。", sub: "hěn gāo xìng rèn shi nǐ", cat: "phrase" },
    { id: "ph-zh-see-you", emoji: "🫡", text: "明天见。", sub: "míng tiān jiàn", cat: "phrase" },
    { id: "ph-zh-yes", emoji: "✅", text: "是。", sub: "shì", cat: "phrase" },
    { id: "ph-zh-no", emoji: "❌", text: "不。", sub: "bù", cat: "phrase" },
    { id: "ph-zh-this-please", emoji: "👉", text: "请给我这个。", sub: "qǐng gěi wǒ zhè ge", cat: "phrase" },
    { id: "ph-zh-hotel", emoji: "🛎️", text: "酒店在哪里？", sub: "jiǔ diàn zài nǎ lǐ", cat: "phrase" },
    { id: "ph-zh-colour", emoji: "🎨", text: "你最喜欢什么颜色？", sub: "nǐ zuì xǐ huan shén me yán sè", cat: "phrase" },
    { id: "ph-zh-where-from", emoji: "🏳️", text: "你是哪里人？", sub: "nǐ shì nǎ lǐ rén", cat: "phrase" },
    { id: "ph-zh-reservation", emoji: "🏨", text: "我有预订。", sub: "wǒ yǒu yù dìng", cat: "phrase" },
    { id: "ph-zh-train-time", emoji: "🚆", text: "火车几点出发？", sub: "huǒ chē jǐ diǎn chū fā", cat: "phrase" },
    { id: "ph-zh-pharmacy", emoji: "💊", text: "药店在哪里？", sub: "yào diàn zài nǎ lǐ", cat: "phrase" },
    { id: "ph-zh-hurts-here", emoji: "🤕", text: "这里疼。", sub: "zhè lǐ téng", cat: "phrase" },
    { id: "ph-zh-pizza", emoji: "🍕", text: "我想要披萨。", sub: "wǒ xiǎng yào pī sà", cat: "phrase", topic: "restaurant" },
    { id: "ph-zh-vegetarian", emoji: "🥦", text: "我是素食者。", sub: "wǒ shì sù shí zhě", cat: "phrase", topic: "restaurant" },
    { id: "ph-zh-cold-fever", emoji: "🤒", text: "我感冒了，有点发烧。", sub: "wǒ gǎn mào le yǒu diǎn fā shāo", cat: "phrase", topic: "doctor" },
    { id: "ph-zh-book-room", emoji: "🛏️", text: "我想订一间明天晚上的房间。", sub: "wǒ xiǎng dìng yì jiān míng tiān wǎn shang de fáng jiān", cat: "phrase", topic: "hotel" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("zh", "phrases", SEMA_PHRASES);
}
