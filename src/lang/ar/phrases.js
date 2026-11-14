/* sema — Arabic phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-ar-hello", "ph-ar-how-are-you", "ph-ar-colour", "ph-ar-where-from"],
  phrases: [
    { id: "ph-ar-hello", emoji: "👋", text: "مرحباً!", sub: "Marhaban!", cat: "phrase" },
    { id: "ph-ar-good-morning", emoji: "🌅", text: "صباح الخير.", sub: "Sabah al-khayr.", cat: "phrase" },
    { id: "ph-ar-good-night", emoji: "🌙", text: "ليلة سعيدة.", sub: "Layla sa'ida.", cat: "phrase" },
    { id: "ph-ar-goodbye", emoji: "✌️", text: "مع السلامة.", sub: "Ma'a as-salama.", cat: "phrase" },
    { id: "ph-ar-thank-you", emoji: "🙌", text: "شكراً جزيلاً.", sub: "Shukran jazilan.", cat: "phrase" },
    { id: "ph-ar-please", emoji: "🙏", text: "من فضلك.", sub: "Min fadlik.", cat: "phrase" },
    { id: "ph-ar-excuse-me", emoji: "🙇", text: "عفواً.", sub: "Afwan.", cat: "phrase" },
    { id: "ph-ar-how-are-you", emoji: "😊", text: "كيف حالك؟", sub: "Kayfa haluk?", cat: "phrase" },
    { id: "ph-ar-my-name-is", emoji: "🙋", text: "اسمي…", sub: "Ismi…", cat: "phrase" },
    { id: "ph-ar-what-is-your-name", emoji: "❓", text: "ما اسمك؟", sub: "Ma ismuk?", cat: "phrase" },
    { id: "ph-ar-dont-understand", emoji: "🤷", text: "لا أفهم.", sub: "La afham.", cat: "phrase" },
    { id: "ph-ar-repeat", emoji: "🔁", text: "هل يمكنك التكرار؟", sub: "Hal yumkinuk at-tikrar?", cat: "phrase" },
    { id: "ph-ar-speak-slower", emoji: "🐢", text: "هل يمكنك التحدث ببطء؟", sub: "Hal yumkinuk at-tahadduth bi-but'?", cat: "phrase" },
    { id: "ph-ar-how-much", emoji: "🏷️", text: "كم يكلف هذا؟", sub: "Kam yukallif hadha?", cat: "phrase" },
    { id: "ph-ar-where-bathroom", emoji: "🚻", text: "أين الحمام؟", sub: "Ayna al-hammam?", cat: "phrase" },
    { id: "ph-ar-where-station", emoji: "🚉", text: "أين محطة القطار؟", sub: "Ayna mahattat al-qitar?", cat: "phrase" },
    { id: "ph-ar-coffee", emoji: "☕", text: "قهوة، من فضلك.", sub: "Qahwa, min fadlik.", cat: "phrase" },
    { id: "ph-ar-bill", emoji: "🧾", text: "الحساب، من فضلك.", sub: "Al-hisab, min fadlik.", cat: "phrase" },
    { id: "ph-ar-water", emoji: "💧", text: "ماء، من فضلك.", sub: "Ma', min fadlik.", cat: "phrase" },
    { id: "ph-ar-need-help", emoji: "🆘", text: "أحتاج إلى مساعدة.", sub: "Ahtaj ila musa'ada.", cat: "phrase" },
    { id: "ph-ar-need-doctor", emoji: "🏥", text: "أحتاج إلى طبيب.", sub: "Ahtaj ila tabib.", cat: "phrase" },
    { id: "ph-ar-lost", emoji: "🧭", text: "أنا تائه.", sub: "Ana ta'ih.", cat: "phrase" },
    { id: "ph-ar-speak-english", emoji: "💬", text: "هل تتحدث الإنجليزية؟", sub: "Hal tatahaddath al-injliziyya?", cat: "phrase" },
    { id: "ph-ar-dont-speak", emoji: "🗣️", text: "لا أتحدث العربية.", sub: "La atahaddath al-arabiyya.", cat: "phrase" },
    { id: "ph-ar-nice-to-meet", emoji: "🤝", text: "تشرفت بلقائك.", sub: "Tasharraftu biliqa'ik.", cat: "phrase" },
    { id: "ph-ar-see-you", emoji: "🫡", text: "أراك غداً.", sub: "Araka ghadan.", cat: "phrase" },
    { id: "ph-ar-yes", emoji: "✅", text: "نعم.", sub: "Na'am.", cat: "phrase" },
    { id: "ph-ar-no", emoji: "❌", text: "لا.", sub: "La.", cat: "phrase" },
    { id: "ph-ar-this-please", emoji: "👉", text: "هذا، من فضلك.", sub: "Hadha, min fadlik.", cat: "phrase" },
    { id: "ph-ar-hotel", emoji: "🛎️", text: "أين الفندق؟", sub: "Ayna al-funduq?", cat: "phrase" },
    { id: "ph-ar-colour", emoji: "🎨", text: "ما لونك المفضل؟", sub: "Ma lawnuka al-mufaddal?", cat: "phrase" },
    { id: "ph-ar-where-from", emoji: "🏳️", text: "من أين أنت؟", sub: "Min ayna anta?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("ar", "phrases", SEMA_PHRASES);
}
