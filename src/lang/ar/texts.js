/* sema — Arabic reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-ar-suq",
      title: "سوق السبت",
      level: 1,
      body: "في صباح السبت يفتح سوق الحي في الساعة السابعة. تشتري أمي الخبز والفاكهة والقهوة. أشتري الماء وآخذ تفاحة للفطور. يبتسم الرجل عند البسطة ويقول: «صباح الخير». ندفع ونعود إلى البيت سيراً على الأقدام. في البيت نشرب القهوة معاً. بعد ذلك أقرأ وتعمل أمي في الحديقة.",
      questions: [
        { q: "ماذا تشتري الأم؟", options: ["الخبز والفاكهة والقهوة", "الماء والتفاحة", "الزهور والحليب"], answer: 0 },
        { q: "كيف يعودون إلى البيت؟", options: ["بالحافلة", "سيراً على الأقدام", "بالسيارة"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("ar", "texts", SEMA_TEXTS);
}
