/* sema — Turkish reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-tr-pazar",
      title: "Cumartesi pazarı",
      level: 1,
      body: "Cumartesi sabahı mahalledeki pazar saat yedide açılır. Annem ekmek, meyve ve kahve alır. Ben su alırım ve kahvaltı için bir elma götürürüm. Tezgâhtaki adam gülümser ve «Günaydın» der. Ödeme yaparız ve eve yürüyerek döneriz. Evde birlikte kahve içeriz. Sonra ben kitap okurum, annem bahçede çalışır.",
      questions: [
        { q: "Annem ne alır?", options: ["ekmek, meyve ve kahve", "su ve bir elma", "çiçek ve süt"], answer: 0 },
        { q: "Eve nasıl dönerler?", options: ["otobüsle", "yürüyerek", "arabayla"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("tr", "texts", SEMA_TEXTS);
}
