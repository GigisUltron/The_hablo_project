/* Interface languages.
 *
 * The chrome is not the deck: a learner of Chinese whose phone is in German
 * wants German buttons. `src/ui-strings.js` holds the original en/es table and
 * the keys the drill needs; this file holds the same table for every other
 * language the app ships, and the keys the reading and alphabet screens added.
 *
 * One locale is one array, in KEYS order. The language's own name is an
 * endonym: a picker that says "French" to a French speaker is doing it wrong.
 * No chrome string names a language: "Read", never "Read in Spanish".
 */
var SEMA_UI_LANGS = (function () {
  var KEYS = [
    "start", "review", "place", "read", "converse", "settings", "done", "reset",
    "translationsOn", "translationsOff", "oneMore", "leave", "gotit", "glossShow",
    "explain", "mix", "glossHide", "whichOne", "notQuite", "hearit",
    "tabToday", "tabMap", "tabProgress", "settingsTitle", "interfaceLang", "deckLang",
    "yourPath", "upForReview", "yourWords", "aboutMinute", "theScript", "nextLetter",
    "finish", "letters", "nextText", "readAgain", "textFinished", "questions",
    "continue", "check"
  ];

  var tables = {
    en: ["Start lesson", "Review my mistakes", "Place me", "Read a text",
      "Have a conversation", "Settings", "Done", "Reset progress",
      "translations on request", "translations off", "One more", "done for now",
      "Got it", "show translation", "why?", "you mix these up",
      "hide translation", "Which one is this?", "Not quite", "Hear it",
      "Today", "Map", "Progress", "Settings", "Interface", "Language",
      "Your path", "Up for review", "Your words", "about 1 min", "The script",
      "Next letter", "Finish", "letters", "Next text", "Read it again",
      "Text finished", "Questions", "Continue", "Check"],

    es: ["Empezar lección", "Repasar mis errores", "Hazme una prueba", "Leer un texto",
      "Tener una conversación", "Ajustes", "Listo", "Borrar progreso",
      "traducciones a petición", "traducciones desactivadas", "Una más", "por ahora no",
      "Entendido", "ver traducción", "¿por qué?", "confundes estas dos",
      "ocultar traducción", "¿Cuál es?", "Casi", "Escucharlo",
      "Hoy", "Mapa", "Progreso", "Ajustes", "Interfaz", "Idioma",
      "Tu camino", "Para repasar", "Tus palabras", "unos 2 min", "La escritura",
      "Siguiente letra", "Terminar", "letras", "Siguiente texto", "Leerlo otra vez",
      "Texto terminado", "Preguntas", "Continuar", "Comprobar"],

    de: ["Lektion starten", "Meine Fehler wiederholen", "Einstufen", "Einen Text lesen",
      "Ein Gespräch führen", "Einstellungen", "Fertig", "Fortschritt löschen",
      "Übersetzungen auf Anfrage", "Übersetzungen aus", "Noch eine", "für jetzt genug",
      "Verstanden", "Übersetzung zeigen", "warum?", "du verwechselst diese",
      "Übersetzung verbergen", "Welches ist es?", "Nicht ganz", "Anhören",
      "Heute", "Karte", "Fortschritt", "Einstellungen", "Oberfläche", "Sprache",
      "Dein Weg", "Zu wiederholen", "Deine Wörter", "etwa 1 Min.", "Die Schrift",
      "Nächster Buchstabe", "Fertig", "Buchstaben", "Nächster Text", "Nochmal lesen",
      "Text geschafft", "Fragen", "Weiter", "Prüfen"],

    fr: ["Commencer la leçon", "Revoir mes erreurs", "Me situer", "Lire un texte",
      "Avoir une conversation", "Réglages", "Terminé", "Effacer la progression",
      "traductions sur demande", "traductions désactivées", "Encore une", "assez pour maintenant",
      "Compris", "voir la traduction", "pourquoi ?", "tu confonds ces deux",
      "masquer la traduction", "Lequel est-ce ?", "Pas tout à fait", "Écouter",
      "Aujourd'hui", "Carte", "Progrès", "Réglages", "Interface", "Langue",
      "Ton parcours", "À revoir", "Tes mots", "environ 1 min", "L'écriture",
      "Lettre suivante", "Terminer", "lettres", "Texte suivant", "Relire",
      "Texte terminé", "Questions", "Continuer", "Vérifier"],

    it: ["Inizia la lezione", "Ripassa i miei errori", "Dimmi il mio livello", "Leggi un testo",
      "Fai una conversazione", "Impostazioni", "Fatto", "Cancella i progressi",
      "traduzioni su richiesta", "traduzioni disattivate", "Un'altra", "basta per ora",
      "Capito", "mostra la traduzione", "perché?", "confondi queste due",
      "nascondi la traduzione", "Qual è?", "Quasi", "Ascolta",
      "Oggi", "Mappa", "Progressi", "Impostazioni", "Interfaccia", "Lingua",
      "Il tuo percorso", "Da ripassare", "Le tue parole", "circa 1 min", "La scrittura",
      "Lettera successiva", "Finisci", "lettere", "Testo successivo", "Rileggi",
      "Testo finito", "Domande", "Continua", "Controlla"],

    nl: ["Les starten", "Mijn fouten herhalen", "Mijn niveau bepalen", "Een tekst lezen",
      "Een gesprek voeren", "Instellingen", "Klaar", "Voortgang wissen",
      "vertalingen op verzoek", "vertalingen uit", "Nog een", "voor nu genoeg",
      "Begrepen", "vertaling tonen", "waarom?", "je haalt deze door elkaar",
      "vertaling verbergen", "Welke is dit?", "Bijna", "Luister",
      "Vandaag", "Kaart", "Voortgang", "Instellingen", "Interface", "Taal",
      "Jouw pad", "Te herhalen", "Jouw woorden", "ongeveer 1 min", "Het schrift",
      "Volgende letter", "Klaar", "letters", "Volgende tekst", "Opnieuw lezen",
      "Tekst klaar", "Vragen", "Verder", "Controleer"],

    pt: ["Começar a lição", "Rever os meus erros", "Avaliar-me", "Ler um texto",
      "Ter uma conversa", "Definições", "Concluído", "Apagar progresso",
      "traduções a pedido", "traduções desligadas", "Mais uma", "por agora chega",
      "Entendido", "ver tradução", "porquê?", "confundes estas duas",
      "esconder tradução", "Qual é este?", "Quase", "Ouvir",
      "Hoje", "Mapa", "Progresso", "Definições", "Interface", "Idioma",
      "O teu caminho", "Para rever", "As tuas palavras", "cerca de 1 min", "A escrita",
      "Próxima letra", "Terminar", "letras", "Próximo texto", "Ler outra vez",
      "Texto terminado", "Perguntas", "Continuar", "Verificar"],

    tr: ["Dersi başlat", "Hatalarımı tekrarla", "Seviyemi ölç", "Bir metin oku",
      "Sohbet et", "Ayarlar", "Bitti", "İlerlemeyi sil",
      "çeviriler istek üzerine", "çeviriler kapalı", "Bir tane daha", "şimdilik yeter",
      "Anladım", "çeviriyi göster", "neden?", "bunları karıştırıyorsun",
      "çeviriyi gizle", "Hangisi?", "Neredeyse", "Dinle",
      "Bugün", "Harita", "İlerleme", "Ayarlar", "Arayüz", "Dil",
      "Yolun", "Tekrar edilecek", "Kelimelerin", "yaklaşık 1 dk", "Yazı",
      "Sonraki harf", "Bitir", "harf", "Sonraki metin", "Yeniden oku",
      "Metin bitti", "Sorular", "Devam", "Denetle"],

    ru: ["Начать урок", "Повторить мои ошибки", "Определить уровень", "Прочитать текст",
      "Поговорить", "Настройки", "Готово", "Сбросить прогресс",
      "перевод по запросу", "перевод выключен", "Ещё один", "на сегодня хватит",
      "Понятно", "показать перевод", "почему?", "ты путаешь эти два",
      "скрыть перевод", "Какое это?", "Почти", "Послушать",
      "Сегодня", "Карта", "Прогресс", "Настройки", "Интерфейс", "Язык",
      "Твой путь", "Повторить", "Твои слова", "около 1 мин", "Письменность",
      "Следующая буква", "Готово", "буквы", "Следующий текст", "Прочитать снова",
      "Текст пройден", "Вопросы", "Далее", "Проверить"],

    ar: ["ابدأ الدرس", "راجع أخطائي", "حدّد مستواي", "اقرأ نصًا",
      "تحدّث", "الإعدادات", "تم", "امسح التقدم",
      "الترجمة عند الطلب", "الترجمة متوقفة", "مرة أخرى", "يكفي الآن",
      "فهمت", "أظهر الترجمة", "لماذا؟", "تخلط بين هذين",
      "أخفِ الترجمة", "أي واحد؟", "ليس تمامًا", "اسمع",
      "اليوم", "الخريطة", "التقدم", "الإعدادات", "الواجهة", "اللغة",
      "مسارك", "للمراجعة", "كلماتك", "دقيقة تقريبًا", "الكتابة",
      "الحرف التالي", "إنهاء", "أحرف", "النص التالي", "اقرأه مرة أخرى",
      "انتهى النص", "أسئلة", "متابعة", "تحقق"],

    hi: ["पाठ शुरू करो", "मेरी गलतियाँ दोहराओ", "मेरा स्तर जानो", "एक पाठ पढ़ो",
      "बातचीत करो", "सेटिंग्स", "हो गया", "प्रगति मिटाओ",
      "अनुवाद अनुरोध पर", "अनुवाद बंद", "एक और", "अभी के लिए बस",
      "समझ गया", "अनुवाद दिखाओ", "क्यों?", "तुम इन दो को मिलाते हो",
      "अनुवाद छिपाओ", "कौन सा है?", "लगभग", "सुनो",
      "आज", "नक्शा", "प्रगति", "सेटिंग्स", "इंटरफ़ेस", "भाषा",
      "तुम्हारा रास्ता", "दोहराने के लिए", "तुम्हारे शब्द", "लगभग 1 मिनट", "लिपि",
      "अगला अक्षर", "समाप्त", "अक्षर", "अगला पाठ", "फिर से पढ़ो",
      "पाठ पूरा", "सवाल", "आगे", "जाँचो"],

    ja: ["レッスンを始める", "間違いを復習", "レベルを測る", "テキストを読む",
      "会話する", "設定", "完了", "進捗を消す",
      "翻訳を表示", "翻訳なし", "もう一回", "今日はここまで",
      "わかった", "翻訳を見る", "なぜ?", "この二つを混同しています",
      "翻訳を隠す", "どれ?", "おしい", "聞く",
      "今日", "マップ", "進捗", "設定", "表示言語", "言語",
      "あなたの道", "復習すること", "あなたの単語", "約1分", "文字",
      "次の文字", "完了", "文字", "次のテキスト", "もう一度読む",
      "テキスト完了", "質問", "次へ", "確認"],

    zh: ["开始课程", "复习我的错误", "测试我的水平", "读一段文字",
      "聊天", "设置", "完成", "清除进度",
      "按需显示翻译", "翻译已关闭", "再来一次", "今天到此为止",
      "知道了", "看翻译", "为什么？", "你把这两个弄混了",
      "隐藏翻译", "是哪个？", "差一点", "听一听",
      "今天", "地图", "进度", "设置", "界面", "语言",
      "你的路径", "待复习", "你的单词", "约1分钟", "文字",
      "下一个字", "完成", "个字", "下一篇", "再读一次",
      "读完了", "问题", "继续", "检查"]
  };

  var names = {
    en: "English", es: "Español", de: "Deutsch", fr: "Français", it: "Italiano",
    nl: "Nederlands", pt: "Português", tr: "Türkçe", ru: "Русский",
    ar: "العربية", hi: "हिन्दी", ja: "日本語", zh: "中文"
  };

  var out = {};
  Object.keys(tables).forEach(function (code) {
    var values = tables[code];
    if (values.length !== KEYS.length) {
      throw new Error("sema: interface table " + code + " has " + values.length + " of " + KEYS.length + " strings");
    }
    var table = { name: names[code] || code.toUpperCase() };
    KEYS.forEach(function (key, i) { table[key] = values[i]; });
    out[code] = table;
  });
  out.keys = KEYS;
  return out;
})();

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_UI_LANGS;
if (typeof window !== "undefined") window.SEMA_UI_LANGS = SEMA_UI_LANGS;
