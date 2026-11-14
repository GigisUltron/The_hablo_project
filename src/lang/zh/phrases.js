/* sema — Chinese phrase deck.
 *
 * `sub` is Hanyu Pinyin with tone marks, one word per space, no punctuation:
 * the reading a learner needs before the characters are familiar.
 */
var SEMA_PHRASES = {
  openers: ["ph-zh-hello", "ph-zh-how-are-you", "ph-zh-colour", "ph-zh-where-from"],
  phrases: [
    { id: "ph-zh-hello", emoji: "👋", text: "你好！", sub: "nǐ hǎo", cat: "phrase" },
    { id: "ph-zh-good-morning", emoji: "🌅", text: "早上好。", sub: "zǎoshang hǎo", cat: "phrase" },
    { id: "ph-zh-good-night", emoji: "🌙", text: "晚安。", sub: "wǎn ān", cat: "phrase" },
    { id: "ph-zh-goodbye", emoji: "✌️", text: "再见。", sub: "zàijiàn", cat: "phrase" },
    { id: "ph-zh-thank-you", emoji: "🙌", text: "非常感谢。", sub: "fēicháng gǎnxiè", cat: "phrase" },
    { id: "ph-zh-please", emoji: "🙏", text: "请。", sub: "qǐng", cat: "phrase" },
    { id: "ph-zh-excuse-me", emoji: "🙇", text: "不好意思。", sub: "bù hǎoyìsi", cat: "phrase" },
    { id: "ph-zh-how-are-you", emoji: "😊", text: "你好吗？", sub: "nǐ hǎo ma", cat: "phrase" },
    { id: "ph-zh-my-name-is", emoji: "🙋", text: "我叫……", sub: "wǒ jiào", cat: "phrase" },
    { id: "ph-zh-what-is-your-name", emoji: "❓", text: "你叫什么名字？", sub: "nǐ jiào shénme míngzi", cat: "phrase" },
    { id: "ph-zh-dont-understand", emoji: "🤷", text: "我不懂。", sub: "wǒ bù dǒng", cat: "phrase" },
    { id: "ph-zh-repeat", emoji: "🔁", text: "请再说一遍。", sub: "qǐng zài shuō yí biàn", cat: "phrase" },
    { id: "ph-zh-speak-slower", emoji: "🐢", text: "请说慢一点。", sub: "qǐng shuō màn yìdiǎn", cat: "phrase" },
    { id: "ph-zh-how-much", emoji: "🏷️", text: "这个多少钱？", sub: "zhège duōshao qián", cat: "phrase" },
    { id: "ph-zh-where-bathroom", emoji: "🚻", text: "洗手间在哪里？", sub: "xǐshǒujiān zài nǎlǐ", cat: "phrase" },
    { id: "ph-zh-where-station", emoji: "🚉", text: "车站在哪里？", sub: "chēzhàn zài nǎlǐ", cat: "phrase" },
    { id: "ph-zh-coffee", emoji: "☕", text: "请给我一杯咖啡。", sub: "qǐng gěi wǒ yì bēi kāfēi", cat: "phrase" },
    { id: "ph-zh-bill", emoji: "🧾", text: "请结账。", sub: "qǐng jiézhàng", cat: "phrase" },
    { id: "ph-zh-water", emoji: "💧", text: "请给我水。", sub: "qǐng gěi wǒ shuǐ", cat: "phrase" },
    { id: "ph-zh-need-help", emoji: "🆘", text: "我需要帮助。", sub: "wǒ xūyào bāngzhù", cat: "phrase" },
    { id: "ph-zh-need-doctor", emoji: "🏥", text: "我需要医生。", sub: "wǒ xūyào yīshēng", cat: "phrase" },
    { id: "ph-zh-lost", emoji: "🧭", text: "我迷路了。", sub: "wǒ mílù le", cat: "phrase" },
    { id: "ph-zh-speak-english", emoji: "💬", text: "你会说英语吗？", sub: "nǐ huì shuō yīngyǔ ma", cat: "phrase" },
    { id: "ph-zh-dont-speak", emoji: "🗣️", text: "我不会说中文。", sub: "wǒ bú huì shuō zhōngwén", cat: "phrase" },
    { id: "ph-zh-nice-to-meet", emoji: "🤝", text: "很高兴认识你。", sub: "hěn gāoxìng rènshi nǐ", cat: "phrase" },
    { id: "ph-zh-see-you", emoji: "🫡", text: "明天见。", sub: "míngtiān jiàn", cat: "phrase" },
    { id: "ph-zh-yes", emoji: "✅", text: "是。", sub: "shì", cat: "phrase" },
    { id: "ph-zh-no", emoji: "❌", text: "不。", sub: "bù", cat: "phrase" },
    { id: "ph-zh-this-please", emoji: "👉", text: "请给我这个。", sub: "qǐng gěi wǒ zhège", cat: "phrase" },
    { id: "ph-zh-hotel", emoji: "🛎️", text: "酒店在哪里？", sub: "jiǔdiàn zài nǎlǐ", cat: "phrase" },
    { id: "ph-zh-colour", emoji: "🎨", text: "你最喜欢什么颜色？", sub: "Nǐ zuì xǐhuan shénme yánsè", cat: "phrase" },
    { id: "ph-zh-where-from", emoji: "🏳️", text: "你是哪里人？", sub: "Nǐ shì nǎlǐ rén", cat: "phrase" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("zh", "phrases", SEMA_PHRASES);
}
