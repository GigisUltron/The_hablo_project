/* sema — Chinese phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "你好！", sub: "Nǐ hǎo!", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "早上好。", sub: "Zǎoshang hǎo.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "晚安。", sub: "Wǎn'ān.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "再见。", sub: "Zàijiàn.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "非常感谢。", sub: "Fēicháng gǎnxiè.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "请。", sub: "Qǐng.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "不好意思。", sub: "Bù hǎoyìsi.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "你好吗？", sub: "Nǐ hǎo ma?", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "我叫……", sub: "Wǒ jiào...", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "你叫什么名字？", sub: "Nǐ jiào shénme míngzi?", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "我不懂。", sub: "Wǒ bù dǒng.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "请再说一遍。", sub: "Qǐng zài shuō yí biàn.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "请说慢一点。", sub: "Qǐng shuō màn yìdiǎn.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "这个多少钱？", sub: "Zhège duōshao qián?", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "洗手间在哪里？", sub: "Xǐshǒujiān zài nǎlǐ?", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "车站在哪里？", sub: "Chēzhàn zài nǎlǐ?", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "请给我一杯咖啡。", sub: "Qǐng gěi wǒ yì bēi kāfēi.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "请结账。", sub: "Qǐng jiézhàng.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "请给我水。", sub: "Qǐng gěi wǒ shuǐ.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "我需要帮助。", sub: "Wǒ xūyào bāngzhù.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "我需要医生。", sub: "Wǒ xūyào yīshēng.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "我迷路了。", sub: "Wǒ mílù le.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "你会说英语吗？", sub: "Nǐ huì shuō Yīngyǔ ma?", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "我不会说中文。", sub: "Wǒ bú huì shuō Zhōngwén.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "很高兴认识你。", sub: "Hěn gāoxìng rènshi nǐ.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "明天见。", sub: "Míngtiān jiàn.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "是。", sub: "Shì.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "不。", sub: "Bù.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "请给我这个。", sub: "Qǐng gěi wǒ zhège.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "酒店在哪里？", sub: "Jiǔdiàn zài nǎlǐ?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("zh", "phrases", SEMA_PHRASES);
}
