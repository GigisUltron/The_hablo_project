/* sema — Turkish phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-tr-hello", "ph-tr-how-are-you", "ph-tr-colour", "ph-tr-where-from"],
  phrases: [
    { id: "ph-tr-hello", emoji: "👋", text: "Merhaba!", sub: "Bir yere girerken.", cat: "phrase" },
    { id: "ph-tr-good-morning", emoji: "🌅", text: "Günaydın.", sub: "Sabahları.", cat: "phrase" },
    { id: "ph-tr-good-night", emoji: "🌙", text: "İyi geceler.", sub: "Yatmadan önce.", cat: "phrase" },
    { id: "ph-tr-goodbye", emoji: "✌️", text: "Hoşça kal.", sub: "Ayrılırken.", cat: "phrase" },
    { id: "ph-tr-thank-you", emoji: "🙌", text: "Çok teşekkür ederim.", sub: "Bir şey alınca.", cat: "phrase" },
    { id: "ph-tr-please", emoji: "🙏", text: "Lütfen.", sub: "Bir şey isterken.", cat: "phrase" },
    { id: "ph-tr-excuse-me", emoji: "🙇", text: "Affedersiniz.", sub: "Yanından geçmek için.", cat: "phrase" },
    { id: "ph-tr-how-are-you", emoji: "😊", text: "Nasılsınız?", sub: "Bir tanıdık görünce.", cat: "phrase" },
    { id: "ph-tr-my-name-is", emoji: "🙋", text: "Benim adım…", sub: "Kendini tanıtırken.", cat: "phrase" },
    { id: "ph-tr-what-is-your-name", emoji: "❓", text: "Adınız ne?", sub: "İsmi sormak için.", cat: "phrase" },
    { id: "ph-tr-dont-understand", emoji: "🤷", text: "Anlamıyorum.", sub: "Bir şey net değilse.", cat: "phrase" },
    { id: "ph-tr-repeat", emoji: "🔁", text: "Tekrar edebilir misiniz?", sub: "Duymadıysanız.", cat: "phrase" },
    { id: "ph-tr-speak-slower", emoji: "🐢", text: "Daha yavaş konuşabilir misiniz?", sub: "Hızlı konuşurlarsa.", cat: "phrase" },
    { id: "ph-tr-how-much", emoji: "🏷️", text: "Bu ne kadar?", sub: "Bir ürünün önünde.", cat: "phrase" },
    { id: "ph-tr-where-bathroom", emoji: "🚻", text: "Tuvalet nerede?", sub: "Bir barda veya dükkânda.", cat: "phrase" },
    { id: "ph-tr-where-station", emoji: "🚉", text: "Tren istasyonu nerede?", sub: "Treni ararken.", cat: "phrase" },
    { id: "ph-tr-coffee", emoji: "☕", text: "Bir kahve, lütfen.", sub: "Tezgahta sipariş verirken.", cat: "phrase" },
    { id: "ph-tr-bill", emoji: "🧾", text: "Hesap, lütfen.", sub: "Yemekten sonra.", cat: "phrase" },
    { id: "ph-tr-water", emoji: "💧", text: "Su, lütfen.", sub: "İçmek için.", cat: "phrase" },
    { id: "ph-tr-need-help", emoji: "🆘", text: "Yardıma ihtiyacım var.", sub: "Bir şey ters giderse.", cat: "phrase" },
    { id: "ph-tr-need-doctor", emoji: "🏥", text: "Bir doktora ihtiyacım var.", sub: "Kendini iyi hissetmezsen.", cat: "phrase" },
    { id: "ph-tr-lost", emoji: "🧭", text: "Kayboldum.", sub: "Yolu bulamazsan.", cat: "phrase" },
    { id: "ph-tr-speak-english", emoji: "💬", text: "İngilizce konuşuyor musunuz?", sub: "Dilleri sorarken.", cat: "phrase" },
    { id: "ph-tr-dont-speak", emoji: "🗣️", text: "Türkçe konuşmuyorum.", sub: "Dili açıklarken.", cat: "phrase" },
    { id: "ph-tr-nice-to-meet", emoji: "🤝", text: "Memnun oldum.", sub: "Tanışırken.", cat: "phrase" },
    { id: "ph-tr-see-you", emoji: "🫡", text: "Yarın görüşürüz.", sub: "Ayrılırken.", cat: "phrase" },
    { id: "ph-tr-yes", emoji: "✅", text: "Evet.", sub: "Kabul ederken.", cat: "phrase" },
    { id: "ph-tr-no", emoji: "❌", text: "Hayır.", sub: "Reddederken.", cat: "phrase" },
    { id: "ph-tr-this-please", emoji: "👉", text: "Bu, lütfen.", sub: "Bir şeyi gösterirken.", cat: "phrase" },
    { id: "ph-tr-hotel", emoji: "🛎️", text: "Otel nerede?", sub: "Kalacak yer ararken.", cat: "phrase" },
    { id: "ph-tr-colour", emoji: "🎨", text: "En sevdiğiniz renk ne?", sub: "Tanışırken.", cat: "phrase" },
    { id: "ph-tr-where-from", emoji: "🏳️", text: "Nerelisiniz?", sub: "Nereli olduğunu sormak için.", cat: "phrase" },
    { id: "ph-tr-reservation", emoji: "🏨", text: "Rezervasyonum var.", sub: "Otele giriş yaparken.", cat: "phrase" },
    { id: "ph-tr-train-time", emoji: "🚆", text: "Tren saat kaçta kalkıyor?", sub: "Kalkış saatini sorarken.", cat: "phrase" },
    { id: "ph-tr-pharmacy", emoji: "💊", text: "Eczane nerede?", sub: "Eczane ararken.", cat: "phrase" },
    { id: "ph-tr-hurts-here", emoji: "🤕", text: "Burası ağrıyor.", sub: "Doktora ağrıyan yeri gösterirken.", cat: "phrase" },
    { id: "ph-tr-pizza", emoji: "🍕", text: "Bir pizza istiyorum.", sub: "Restoranda.", cat: "phrase", topic: "restaurant" },
    { id: "ph-tr-vegetarian", emoji: "🥦", text: "Ben vejetaryenim.", sub: "Restoranda.", cat: "phrase", topic: "restaurant" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("tr", "phrases", SEMA_PHRASES);
}
