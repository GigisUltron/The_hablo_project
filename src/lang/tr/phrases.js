/* sema — Turkish phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "Merhaba!", sub: "Bir yere girerken.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "Günaydın.", sub: "Sabahları.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "İyi geceler.", sub: "Yatmadan önce.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "Hoşça kal.", sub: "Ayrılırken.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "Çok teşekkür ederim.", sub: "Bir şey alınca.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "Lütfen.", sub: "Bir şey isterken.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "Affedersiniz.", sub: "Yanından geçmek için.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "Nasılsınız?", sub: "Bir tanıdık görünce.", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "Benim adım…", sub: "Kendini tanıtırken.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "Adınız ne?", sub: "İsmi sormak için.", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "Anlamıyorum.", sub: "Bir şey net değilse.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "Tekrar edebilir misiniz?", sub: "Duymadıysanız.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "Daha yavaş konuşabilir misiniz?", sub: "Hızlı konuşurlarsa.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "Bu ne kadar?", sub: "Bir ürünün önünde.", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "Tuvalet nerede?", sub: "Bir barda veya dükkânda.", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "Tren istasyonu nerede?", sub: "Treni ararken.", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "Bir kahve, lütfen.", sub: "Tezgahta sipariş verirken.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "Hesap, lütfen.", sub: "Yemekten sonra.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "Su, lütfen.", sub: "İçmek için.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "Yardıma ihtiyacım var.", sub: "Bir şey ters giderse.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "Bir doktora ihtiyacım var.", sub: "Kendini iyi hissetmezsen.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "Kayboldum.", sub: "Yolu bulamazsan.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "İngilizce konuşuyor musunuz?", sub: "Dilleri sorarken.", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "Türkçe konuşmuyorum.", sub: "Dili açıklarken.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "Memnun oldum.", sub: "Tanışırken.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "Yarın görüşürüz.", sub: "Ayrılırken.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "Evet.", sub: "Kabul ederken.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "Hayır.", sub: "Reddederken.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "Bu, lütfen.", sub: "Bir şeyi gösterirken.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "Otel nerede?", sub: "Kalacak yer ararken.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("tr", "phrases", SEMA_PHRASES);
}
