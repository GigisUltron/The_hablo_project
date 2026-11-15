/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-tr-pazar",
      title: "Cumartesi pazarı",
      level: 1,
      band: "A1",
      body: "Cumartesi sabahı mahalledeki pazar saat yedide açılır. Annem ekmek, meyve ve kahve alır. Ben su alırım ve kahvaltı için bir elma götürürüm. Tezgâhtaki adam gülümser ve «Günaydın» der. Ödeme yaparız ve eve yürüyerek döneriz. Evde birlikte kahve içeriz. Sonra ben kitap okurum, annem bahçede çalışır. Akşam olunca komşular pazara geri döner, bir şeyler içer ve tezgâhlar kapanana kadar haftayı konuşur. Pazar akşamı mahallenin buluşma yeridir ve herkes burada birbirini görür. Bu yüzden pazar sadece alışveriş yeri değildir. Pazar mahallenin kalbidir.",
      questions: [
        {"q": "Annem ne alır?", "options": ["ekmek, meyve ve kahve", "su ve bir elma", "çiçek ve süt"], "answer": 0, "why": ["", "bunu anlatıcı alıyor", "çiçek ve süt metinde yok"]},
        {"q": "Eve nasıl dönerler?", "options": ["otobüsle", "yürüyerek", "arabayla"], "answer": 1, "why": ["metin yürüdüklerini söylüyor", "", "arabadan söz edilmiyor"]},
        {"q": "Pazar saat kaçta açılır?", "options": ["yedide", "dokuzda", "öğlen"], "answer": 0, "why": ["", "metin yedi diyor", "öğlen geçmiyor"]},
      ]
    },
    {
      id: "tx-tr-tren",
      title: "Altı treni",
      level: 2,
      band: "A2",
      body: "Altı treni merkez garından kalkar. O sabah bir dakika geç kaldım: kapılar çoktan kapanmıştı. Peronda koştum, ama tren hareket etmeye başladı. Bir görevli bir sonrakini beklememi söyledi. Bir kahve içtim ve yolcuları izledim. Sonraki tren sekizde geldi. Bindim, pencerenin yanında bir yer buldum ve rahatladım. Gecikme bana bir saate mal oldu, ama bana bir kitap ve bir kahve verdi. Sonunda artık acelem yoktu ve pencereden dışarı baktım. Kitap ve kahve, gecikmenin küçük bir armağanıydı. Bazen geç kalmak insana zaman verir.",
      questions: [
        {"q": "Anlatıcı treni neden kaçırdı?", "options": ["bir dakika geç kaldı", "tren erken kalktı", "yanlış perondaydı"], "answer": 0, "why": ["", "metin erken kalktığını söylemiyor", "doğru perondaydı"]},
        {"q": "Beklerken ne yaptı?", "options": ["kahve içti ve yolcuları izledi", "eve döndü", "işini aradı"], "answer": 0, "why": ["", "istasyonda kaldı", "metinde telefon yok"]},
        {"q": "Sonunda nasıl hissediyor?", "options": ["görevliye kızgın", "gecikmeye rağmen rahatlamış", "hemen gitmek için sabırsız"], "answer": 1, "why": ["görevliyi eleştirmiyor", "", "az önce oturup rahatladı"]},
      ]
    },
    {
      id: "tx-tr-firin",
      title: "Kapanan fırın",
      level: 3,
      band: "B1",
      body: "Köşedeki fırın ilkbaharda kapandı. Sahibi emekli olmak istedi ve işi kimse devralmadı. O günden beri sabahlar daha sessiz: insanlar süpermarkete kadar yürümek zorunda, orada ekmek daha kötü ve kuyruklar daha uzun. Komşular bir dükkân açmaktan söz ediyor, ama kira çok yüksek. Geçen hafta genç bir kadın geldi. Vitrine baktı, fotoğraflar çekti ve kiranın fiyatını sordu. Kimse geri dönüp dönmeyeceğini bilmiyor. Şimdilik fırın kapalı ve herkes umut ediyor. Ekmek kokusu sabahın bir parçasıydı. Herkes o kokuyu özlüyor. Belki bir gün geri gelir.",
      questions: [
        {"q": "Fırın neden kapandı?", "options": ["sahibi emekli oluyordu", "ekmek kötüydü", "kira çok düşüktü"], "answer": 0, "why": ["", "ekmek iyiydi", "metin yüksek kiradan söz ediyor"]},
        {"q": "Komşular şimdi ne yapıyor?", "options": ["süpermarkete gidiyorlar", "kendi ekmeklerini yapıyorlar", "bir dükkân açtılar"], "answer": 0, "why": ["", "bu yazılmamış", "sadece konuşuyorlar"]},
        {"q": "Genç kadının ziyareti neyi düşündürüyor?", "options": ["belki dükkânı devralmak istiyor", "yeni fırıncı o", "fotoğrafları satın almak istiyor"], "answer": 0, "why": ["", "geri dönüp dönmeyeceği bilinmiyor", "vitrinin fotoğraflarını çekti"]},
      ]
    },
    {
      id: "tx-tr-yagmur",
      title: "Yağmurlu sabah",
      level: 2,
      band: "A2",
      body: "Sabah uyandığımda yağmur yağıyordu. Şemsiyemi bulamadım, bu yüzden ince bir ceket giyip sokağa çıktım. Durakta üç kişi bekliyordu ve hepsi ıslanmıştı. Otobüs on dakika geç geldi. İçeride sıcak bir koku vardı: taze ekmek gibi. Şoför bize gülümsedi ve «Bugün geç kalmak sorun değil» dedi. İşe vardığımda ayakkabılarım tamamen ıslaktı ama moralim yerindeydi. Öğleden sonra yağmur durdu. Eve dönerken aynı fırından ekmek aldım ve ertesi gün için yeni bir şemsiye aldım.",
      questions: [
        {"q": "Anlatıcı neden ıslandı?", "options": ["şemsiyesini bulamadığı için", "otobüsü kaçırdığı için", "yağmur durduğu için"], "answer": 0, "why": ["", "otobüse bindi, sadece geç geldi", "yağmur durunca insan ıslanmaz"]},
        {"q": "Otobüste ne kokusu vardı?", "options": ["taze ekmek", "kahve", "ıslak toprak"], "answer": 0, "why": ["", "kahveden söz edilmiyor", "metin ekmek kokusunu söylüyor"]},
        {"q": "Eve dönerken ne yaptı?", "options": ["ekmek ve şemsiye aldı", "işe geri döndü", "arkadaşına uğradı"], "answer": 0, "why": ["", "işten eve dönüyordu", "arkadaştan söz edilmiyor"]},
      ]
    },
    {
      id: "tx-tr-vapur",
      title: "Sabah vapuru",
      level: 3,
      band: "B1",
      body: "Her sabah aynı vapura biniyorum. Deniz sakin olduğunda insanlar güverteye çıkıyor, martılara simit atıyor. Geçen hafta yanımdaki adama kitabımı sordum; meğer aynı yazarı seviyormuşuz. Konuşmaya başladık ve yol bitmek bilmedi. Bana çocukken babasıyla balığa çıktığını, sonra yıllarca şehirden uzakta çalıştığını anlattı. İndiğimizde birbirimize telefon numarası vermedik, çünkü ikimiz de aynı iskelede her sabah buluşacağımızı biliyorduk. Ertesi gün gerçekten oradaydı. Artık kitap ödünç alıyoruz ve bazen birbirimize yeni yazarlar öneriyoruz. Vapur yolculuğu kısa, ama sabahın en güzel yeri.",
      questions: [
        {"q": "Anlatıcı her sabah neye biniyor?", "options": ["vapura", "trene", "otobüse"], "answer": 0, "why": ["", "trenden söz edilmiyor", "otobüsten söz edilmiyor"]},
        {"q": "Adam neyi anlattı?", "options": ["çocukken balığa çıktığını", "üniversitede öğretmen olduğunu", "yeni bir kitap yazdığını"], "answer": 0, "why": ["", "öğretmenlikten söz edilmiyor", "kitap yazdığı söylenmiyor"]},
        {"q": "Neden telefon numarası vermediler?", "options": ["her sabah aynı iskelede buluşacaklarını bildikleri için", "telefonları bozuk olduğu için", "numaraları unuttukları için"], "answer": 0, "why": ["", "telefonlarının bozuk olduğu yazmıyor", "unuttukları söylenmiyor"]},
      ]
    },
    {
      "id": "tx-tr-komsuluk",
      "title": "Komşuluk",
      "level": 3,
      "band": "B1",
      "body": "Bizim sokakta herkes birbirini çok iyi tanır. Geçen kış, yaşlı komşumuz hastalandı. Mahalleli her gün ona yemek götürdü ve alışverişini yaptı. Ben de onun köpeğini gezdirdim. Komşumuz iyileşince hepimizi eve davet etti. Sofrada çay içtik, eski fotoğraflara baktık ve çok güldük. Şimdi her cumartesi birkaç komşu birlikte kahvaltı yapıyor. Büyük şehirde insanların yalnız olduğunu söylerler; bizim sokakta bu doğru değil.",
      "questions": [
        {
          "q": "Kışın komşuya ne oldu?",
          "options": [
            "hastalandı",
            "taşındı",
            "iş buldu"
          ],
          "answer": 0,
          "why": [
            "",
            "metinde taşınmaktan söz edilmiyor",
            "metinde iş bulmaktan söz edilmiyor"
          ]
        },
        {
          "q": "Anlatıcı ne yaptı?",
          "options": [
            "köpeği gezdirdi",
            "yemek pişirdi",
            "temizlik yaptı"
          ],
          "answer": 0,
          "why": [
            "",
            "yemeği mahalleli götürdü",
            "temizlikten söz edilmiyor"
          ]
        },
        {
          "q": "Şimdi cumarteleri ne yapıyorlar?",
          "options": [
            "kahvaltı yapıyorlar",
            "sinemaya gidiyorlar",
            "alışveriş yapıyorlar"
          ],
          "answer": 0,
          "why": [
            "",
            "sinemadan söz edilmiyor",
            "alışveriş kışın yapıldı"
          ]
        }
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("tr", "texts", SEMA_TEXTS);
}
