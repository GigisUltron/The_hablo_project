/* sema — Arabic phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "مرحباً!", sub: "Marhaban!", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "صباح الخير.", sub: "Sabah al-khayr.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "ليلة سعيدة.", sub: "Layla sa'ida.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "مع السلامة.", sub: "Ma'a as-salama.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "شكراً جزيلاً.", sub: "Shukran jazilan.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "من فضلك.", sub: "Min fadlik.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "عفواً.", sub: "Afwan.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "كيف حالك؟", sub: "Kayfa haluk?", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "اسمي…", sub: "Ismi…", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "ما اسمك؟", sub: "Ma ismuk?", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "لا أفهم.", sub: "La afham.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "هل يمكنك التكرار؟", sub: "Hal yumkinuk at-tikrar?", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "هل يمكنك التحدث ببطء؟", sub: "Hal yumkinuk at-tahadduth bi-but'?", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "كم يكلف هذا؟", sub: "Kam yukallif hadha?", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "أين الحمام؟", sub: "Ayna al-hammam?", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "أين محطة القطار؟", sub: "Ayna mahattat al-qitar?", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "قهوة، من فضلك.", sub: "Qahwa, min fadlik.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "الحساب، من فضلك.", sub: "Al-hisab, min fadlik.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "ماء، من فضلك.", sub: "Ma', min fadlik.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "أحتاج إلى مساعدة.", sub: "Ahtaj ila musa'ada.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "أحتاج إلى طبيب.", sub: "Ahtaj ila tabib.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "أنا تائه.", sub: "Ana ta'ih.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "هل تتحدث الإنجليزية؟", sub: "Hal tatahaddath al-injliziyya?", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "لا أتحدث العربية.", sub: "La atahaddath al-arabiyya.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "تشرفت بلقائك.", sub: "Tasharraftu biliqa'ik.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "أراك غداً.", sub: "Araka ghadan.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "نعم.", sub: "Na'am.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "لا.", sub: "La.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "هذا، من فضلك.", sub: "Hadha, min fadlik.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "أين الفندق؟", sub: "Ayna al-funduq?", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("ar", "phrases", SEMA_PHRASES);
}
