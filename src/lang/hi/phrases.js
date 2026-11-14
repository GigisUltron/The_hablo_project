/* sema — Hindi phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hi-hello", emoji: "👋", text: "नमस्ते।", sub: "Namaste.", cat: "phrase" },
    { id: "ph-hi-good-morning", emoji: "🌅", text: "सुप्रभात।", sub: "Suprabhat.", cat: "phrase" },
    { id: "ph-hi-good-night", emoji: "🌙", text: "शुभ रात्रि।", sub: "Shubh ratri.", cat: "phrase" },
    { id: "ph-hi-goodbye", emoji: "✌️", text: "अलविदा।", sub: "Alvida.", cat: "phrase" },
    { id: "ph-hi-thank-you", emoji: "🙌", text: "बहुत धन्यवाद।", sub: "Bahut dhanyavaad.", cat: "phrase" },
    { id: "ph-hi-please", emoji: "🙏", text: "कृपया।", sub: "Kripya.", cat: "phrase" },
    { id: "ph-hi-excuse-me", emoji: "🙇", text: "माफ़ कीजिए।", sub: "Maaf kijiye.", cat: "phrase" },
    { id: "ph-hi-how-are-you", emoji: "😊", text: "आप कैसे हैं?", sub: "Aap kaise hain?", cat: "phrase" },
    { id: "ph-hi-my-name-is", emoji: "🙋", text: "मेरा नाम … है।", sub: "Mera naam ... hai.", cat: "phrase" },
    { id: "ph-hi-what-is-your-name", emoji: "❓", text: "आपका नाम क्या है?", sub: "Aapka naam kya hai?", cat: "phrase" },
    { id: "ph-hi-dont-understand", emoji: "🤷", text: "मैं समझता नहीं हूँ।", sub: "Main samajhta nahin hoon.", cat: "phrase" },
    { id: "ph-hi-repeat", emoji: "🔁", text: "क्या आप दोहरा सकते हैं?", sub: "Kya aap dohra sakte hain?", cat: "phrase" },
    { id: "ph-hi-speak-slower", emoji: "🐢", text: "क्या आप धीरे बोल सकते हैं?", sub: "Kya aap dheere bol sakte hain?", cat: "phrase" },
    { id: "ph-hi-how-much", emoji: "🏷️", text: "यह कितने का है?", sub: "Yeh kitne ka hai?", cat: "phrase" },
    { id: "ph-hi-where-bathroom", emoji: "🚻", text: "शौचालय कहाँ है?", sub: "Shauchalay kahan hai?", cat: "phrase" },
    { id: "ph-hi-where-station", emoji: "🚉", text: "स्टेशन कहाँ है?", sub: "Station kahan hai?", cat: "phrase" },
    { id: "ph-hi-coffee", emoji: "☕", text: "एक कॉफ़ी, कृपया।", sub: "Ek coffee, kripya.", cat: "phrase" },
    { id: "ph-hi-bill", emoji: "🧾", text: "बिल, कृपया।", sub: "Bill, kripya.", cat: "phrase" },
    { id: "ph-hi-water", emoji: "💧", text: "पानी, कृपया।", sub: "Paani, kripya.", cat: "phrase" },
    { id: "ph-hi-need-help", emoji: "🆘", text: "मुझे मदद चाहिए।", sub: "Mujhe madad chahiye.", cat: "phrase" },
    { id: "ph-hi-need-doctor", emoji: "🏥", text: "मुझे डॉक्टर चाहिए।", sub: "Mujhe doctor chahiye.", cat: "phrase" },
    { id: "ph-hi-lost", emoji: "🧭", text: "मैं रास्ता भूल गया हूँ।", sub: "Main raasta bhool gaya hoon.", cat: "phrase" },
    { id: "ph-hi-speak-english", emoji: "💬", text: "क्या आप अंग्रेज़ी बोलते हैं?", sub: "Kya aap angrezi bolte hain?", cat: "phrase" },
    { id: "ph-hi-dont-speak", emoji: "🗣️", text: "मैं हिंदी नहीं बोलता।", sub: "Main Hindi nahin bolta.", cat: "phrase" },
    { id: "ph-hi-nice-to-meet", emoji: "🤝", text: "आपसे मिलकर खुशी हुई।", sub: "Aapse milkar khushi hui.", cat: "phrase" },
    { id: "ph-hi-see-you", emoji: "🫡", text: "कल मिलते हैं।", sub: "Kal milte hain.", cat: "phrase" },
    { id: "ph-hi-yes", emoji: "✅", text: "हाँ।", sub: "Haan.", cat: "phrase" },
    { id: "ph-hi-no", emoji: "❌", text: "नहीं।", sub: "Nahin.", cat: "phrase" },
    { id: "ph-hi-this-please", emoji: "👉", text: "यह, कृपया।", sub: "Yeh, kripya.", cat: "phrase" },
    { id: "ph-hi-hotel", emoji: "🛎️", text: "होटल कहाँ है?", sub: "Hotel kahan hai?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("hi", "phrases", SEMA_PHRASES);
}
