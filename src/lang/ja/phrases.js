/* sema — Japanese phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "こんにちは。", sub: "Konnichiwa.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "おはようございます。", sub: "Ohayou gozaimasu.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "おやすみなさい。", sub: "Oyasuminasai.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "さようなら。", sub: "Sayounara.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "ありがとうございます。", sub: "Arigatou gozaimasu.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "お願いします。", sub: "Onegai shimasu.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "すみません。", sub: "Sumimasen.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "お元気ですか。", sub: "O-genki desu ka.", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "私の名前は…です。", sub: "Watashi no namae wa ... desu.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "お名前は何ですか。", sub: "O-namae wa nan desu ka.", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "わかりません。", sub: "Wakarimasen.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "もう一度言ってください。", sub: "Mou ichido itte kudasai.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "もう少しゆっくり話してください。", sub: "Mou sukoshi yukkuri hanashite kudasai.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "これはいくらですか。", sub: "Kore wa ikura desu ka.", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "トイレはどこですか。", sub: "Toire wa doko desu ka.", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "駅はどこですか。", sub: "Eki wa doko desu ka.", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "コーヒーをお願いします。", sub: "Koohii o onegai shimasu.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "お会計をお願いします。", sub: "O-kaikei o onegai shimasu.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "お水をお願いします。", sub: "O-mizu o onegai shimasu.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "助けてください。", sub: "Tasukete kudasai.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "医者が必要です。", sub: "Isha ga hitsuyou desu.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "道に迷いました。", sub: "Michi ni mayoimashita.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "英語を話せますか。", sub: "Eigo o hanasemasu ka.", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "日本語は話せません。", sub: "Nihongo wa hanasemasen.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "はじめまして。", sub: "Hajimemashite.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "また明日。", sub: "Mata ashita.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "はい。", sub: "Hai.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "いいえ。", sub: "Iie.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "これをください。", sub: "Kore o kudasai.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "ホテルはどこですか。", sub: "Hoteru wa doko desu ka.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("ja", "phrases", SEMA_PHRASES);
}
