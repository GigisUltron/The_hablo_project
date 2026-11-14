/* sema — Hindi phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "नमस्ते।", sub: "Namaste.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "सुप्रभात।", sub: "Suprabhat.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "शुभ रात्रि।", sub: "Shubh ratri.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "अलविदा।", sub: "Alvida.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "बहुत धन्यवाद।", sub: "Bahut dhanyavaad.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "कृपया।", sub: "Kripya.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "माफ़ कीजिए।", sub: "Maaf kijiye.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "आप कैसे हैं?", sub: "Aap kaise hain?", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "मेरा नाम … है।", sub: "Mera naam ... hai.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "आपका नाम क्या है?", sub: "Aapka naam kya hai?", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "मैं समझता नहीं हूँ।", sub: "Main samajhta nahin hoon.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "क्या आप दोहरा सकते हैं?", sub: "Kya aap dohra sakte hain?", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "क्या आप धीरे बोल सकते हैं?", sub: "Kya aap dheere bol sakte hain?", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "यह कितने का है?", sub: "Yeh kitne ka hai?", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "शौचालय कहाँ है?", sub: "Shauchalay kahan hai?", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "स्टेशन कहाँ है?", sub: "Station kahan hai?", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "एक कॉफ़ी, कृपया।", sub: "Ek coffee, kripya.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "बिल, कृपया।", sub: "Bill, kripya.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "पानी, कृपया।", sub: "Paani, kripya.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "मुझे मदद चाहिए।", sub: "Mujhe madad chahiye.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "मुझे डॉक्टर चाहिए।", sub: "Mujhe doctor chahiye.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "मैं रास्ता भूल गया हूँ।", sub: "Main raasta bhool gaya hoon.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "क्या आप अंग्रेज़ी बोलते हैं?", sub: "Kya aap angrezi bolte hain?", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "मैं हिंदी नहीं बोलता।", sub: "Main Hindi nahin bolta.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "आपसे मिलकर खुशी हुई।", sub: "Aapse milkar khushi hui.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "कल मिलते हैं।", sub: "Kal milte hain.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "हाँ।", sub: "Haan.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "नहीं।", sub: "Nahin.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "यह, कृपया।", sub: "Yeh, kripya.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "होटल कहाँ है?", sub: "Hotel kahan hai?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("hi", "phrases", SEMA_PHRASES);
}
