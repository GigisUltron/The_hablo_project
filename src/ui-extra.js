/* Extra interface copy for the screens the original tables did not cover.
 *
 * One row per key, one value per locale, in CODES order. Keeping the new copy
 * in one table makes it obvious when a locale falls behind; the session and
 * progress screens are not English-only any more.
 */
var SEMA_UI_EXTRA = (function () {
  "use strict";

  var CODES = ["en", "es", "fr", "it", "pt", "de", "nl", "ru", "tr", "ar", "hi", "ja", "zh"];

  var VALUES = {
    "new": ["New", "Nuevo", "Nouveau", "Nuovo", "Novo", "Neu", "Nieuw", "Новое", "Yeni", "جديد", "नया", "新しい", "新"],
    "learnPair": ["Learn the pair", "Aprende el par", "Apprends la paire", "Impara la coppia", "Aprenda o par", "Lerne das Paar", "Leer het paar", "Учите пару", "Çifti öğren", "تعلّم الزوج", "जोड़ी सीखो", "ペアを覚える", "学习这一对"],
    "findPicture": ["Find the picture", "Encuentra la imagen", "Trouve l'image", "Trova l'immagine", "Encontre a imagem", "Finde das Bild", "Zoek de afbeelding", "Найдите картинку", "Resmi bul", "اعثر على الصورة", "चित्र खोजो", "絵を見つける", "找出图片"],
    "buildSentence": ["Build the sentence", "Construye la frase", "Construis la phrase", "Costruisci la frase", "Monte a frase", "Baue den Satz", "Maak de zin", "Соберите предложение", "Cümleyi kur", "ركّب الجملة", "वाक्य बनाओ", "文を組み立てる", "组成句子"],
    "fillGap": ["Fill the gap", "Completa el hueco", "Complète le trou", "Completa lo spazio", "Complete a lacuna", "Fülle die Lücke", "Vul de leemte in", "Заполните пропуск", "Boşluğu doldur", "املأ الفراغ", "खाली जगह भरो", "空所を埋める", "填空"],
    "listenPick": ["Listen and pick", "Escucha y elige", "Écoute et choisis", "Ascolta e scegli", "Ouça e escolha", "Höre und wähle", "Luister en kies", "Слушайте и выбирайте", "Dinle ve seç", "استمع واختر", "सुनो और चुनो", "聞いて選ぶ", "听并选择"],
    "whichFits": ["Which one fits?", "¿Cuál encaja?", "Lequel convient ?", "Quale si adatta?", "Qual se encaixa?", "Welches passt?", "Welke past?", "Что подходит?", "Hangisi uyar?", "أيها يناسب؟", "कौन सा फिट है?", "どれが合う?", "哪个合适？"],
    "howMuch": ["How much do you know?", "¿Cuánto sabes?", "Tu en sais quoi ?", "Quanto sai?", "Quanto você sabe?", "Wie viel weißt du?", "Hoeveel weet je?", "Сколько вы знаете?", "Ne kadar biliyorsun?", "كم تعرف؟", "आप कितना जानते हैं?", "どれくらい知ってる?", "你会多少？"],
    "lessonDone": ["Lesson done", "Lección terminada", "Leçon terminée", "Lezione finita", "Lição concluída", "Lektion geschafft", "Les klaar", "Урок завершён", "Ders bitti", "انتهى الدرس", "पाठ पूरा", "レッスン完了", "课程完成"],
    "remembered": ["Remembered", "Recordado", "Retenu", "Ricordato", "Lembrado", "Gemerkt", "Onthouden", "Запомнено", "Hatırlandı", "تذكّرته", "याद रहा", "覚えた", "记住了"],
    "comesBack": ["Comes back", "Vuelve", "Revient", "Torna", "Volta", "Kommt wieder", "Komt terug", "Вернётся", "Geri gelir", "يعود", "लौटेगा", "また出る", "会回来"],
    "rightFirst": ["right the first time", "bien a la primera", "juste du premier coup", "giusto al primo colpo", "certo de primeira", "richtig beim ersten Mal", "goed in één keer", "верно с первого раза", "ilk seferde doğru", "صحيح من أول مرة", "पहली बार सही", "一発で正解", "第一次就答对"],
    "skip": ["Skip", "Saltar", "Passer", "Salta", "Pular", "Überspringen", "Overslaan", "Пропустить", "Atla", "تخطَّ", "छोड़ो", "スキップ", "跳过"],
    "whichReading": ["Which reading?", "¿Qué lectura?", "Quelle lecture ?", "Quale lettura?", "Qual leitura?", "Welche Lesung?", "Welke lezing?", "Какое чтение?", "Hangi okunuş?", "أي قراءة؟", "कौन सा पाठ?", "どの読み?", "哪个读音？"],
    "writeIt": ["Write it", "Escríbelo", "Écris-le", "Scrivilo", "Escreva", "Schreib es", "Schrijf het", "Напишите", "Yaz", "اكتبه", "लिखो", "書く", "写出来"],
    "sayIt": ["Say it", "Dilo", "Dis-le", "Dillo", "Diga", "Sag es", "Zeg het", "Скажите", "Söyle", "قله", "बोलो", "言う", "说出来"],
    "wordsMet": ["words met", "palabras vistas", "mots rencontrés", "parole incontrate", "palavras vistas", "Wörter gesehen", "woorden gezien", "слов изучено", "görülen kelime", "كلمات تعلمتها", "शब्द सीखे", "覚えた単語", "学过的词"],
    "solid": ["solid", "sólidas", "solides", "solide", "sólidas", "gefestigt", "stevig", "закреплено", "sağlam", "راسخ", "पक्के", "定着", "牢固"],
    "dayStreak": ["day streak", "racha de días", "série de jours", "serie di giorni", "sequência de dias", "Tages-Serie", "dagreeks", "дней подряд", "gün serisi", "أيام متتالية", "दिन की लय", "連続日数", "连续天数"],
    "confusedPairs": ["Most confused pairs", "Pares más confundidos", "Paires les plus confondues", "Coppie più confuse", "Pares mais confundidos", "Häufigste Verwechslungen", "Meest verwarde paren", "Частые путаницы", "En çok karıştırılanlar", "أكثر الأزواج تشابهًا", "सबसे भ्रमित जोड़े", "よく混同するペア", "最容易混淆的词对"],
    "whatRemembers": ["What the app remembers", "Lo que recuerda la app", "Ce que l'app retient", "Cosa ricorda l'app", "O que o app lembra", "Was die App behält", "Wat de app onthoudt", "Что помнит приложение", "Uygulamanın hatırladıkları", "ما يتذكره التطبيق", "ऐप क्या याद रखता है", "アプリが覚えていること", "应用记住了什么"],
    "sessionHistory": ["Session history", "Historial de sesiones", "Historique des sessions", "Cronologia sessioni", "Histórico de sessões", "Sitzungsverlauf", "Sessiegeschiedenis", "История занятий", "Oturum geçmişi", "سجل الجلسات", "सत्र इतिहास", "セッション履歴", "课程记录"],
    "sentences": ["sentences", "frases", "phrases", "frasi", "frases", "Sätze", "zinnen", "фразы", "cümle", "جمل", "वाक्य", "文", "句子"],
    "accuracy": ["accuracy", "precisión", "précision", "precisione", "precisão", "Genauigkeit", "nauwkeurigheid", "точность", "doğruluk", "دقة", "सटीकता", "正答率", "准确率"],
    "daysWritten": ["days written", "días escritos", "jours écrits", "giorni scritti", "dias escritos", "Schreibtage", "geschreven dagen", "дней письма", "yazılan gün", "أيام الكتابة", "लिखे दिन", "書いた日数", "书写天数"],
    "sessions": ["sessions", "sesiones", "sessions", "sessioni", "sessões", "Sitzungen", "sessies", "занятий", "oturum", "جلسات", "सत्र", "セッション", "课程"],
    "recalled": ["recalled", "recordadas", "rappelées", "ricordate", "lembradas", "erinnert", "herinnerd", "вспомнено", "hatırlanan", "مسترجعة", "याद किए", "思い出した", "回忆"],
    "lapses": ["lapses", "fallos", "oublis", "lapsus", "falhas", "Fehler", "fouten", "промахи", "hatalar", "أخطاء", "चूक", "間違い", "失误"],
    "fullOnly": ["full A2/B1 course", "curso completo A2/B1", "cours complet A2/B1", "corso completo A2/B1", "curso completo A2/B1", "vollständiger A2/B1-Kurs", "volledige A2/B1-cursus", "полный курс A2/B1", "tam A2/B1 kursu", "دورة A2/B1 كاملة", "पूरा A2/B1 कोर्स", "A2/B1 フルコース", "完整 A2/B1 课程"],
    "nextLesson": ["Next lesson", "Próxima lección", "Prochaine leçon", "Prossima lezione", "Próxima lição", "Nächste Lektion", "Volgende les", "Следующий урок", "Sonraki ders", "الدرس التالي", "अगला पाठ", "次のレッスン", "下一课"],
    "session": ["Session", "Sesión", "Session", "Sessione", "Sessão", "Sitzung", "Sessie", "Занятие", "Oturum", "جلسة", "सत्र", "セッション", "课程"],
    "audio": ["Audio", "Audio", "Audio", "Audio", "Áudio", "Audio", "Audio", "Аудио", "Ses", "صوت", "ऑडियो", "音声", "音频"],
    "translations": ["Translations", "Traducciones", "Traductions", "Traduzioni", "Traduções", "Übersetzungen", "Vertalingen", "Переводы", "Çeviriler", "الترجمات", "अनुवाद", "翻訳", "翻译"],
    "pinyin": ["Pinyin", "Pinyin", "Pinyin", "Pinyin", "Pinyin", "Pinyin", "Pinyin", "Пиньинь", "Pinyin", "بينيين", "पिनयिन", "ピンイン", "拼音"],
    "privacy": ["No accounts, no tracking.", "Sin cuentas, sin rastreo.", "Sans compte, sans suivi.", "Nessun account, nessun tracciamento.", "Sem contas, sem rastreamento.", "Keine Konten, kein Tracking.", "Geen accounts, geen tracking.", "Без аккаунтов и слежки.", "Hesap yok, takip yok.", "لا حسابات ولا تتبع.", "कोई खाता नहीं, कोई ट्रैकिंग नहीं।", "アカウントなし、追跡なし。", "无账号，无追踪。"],
    "beforeStart": ["Before you start", "Antes de empezar", "Avant de commencer", "Prima di iniziare", "Antes de começar", "Bevor du beginnst", "Voordat je begint", "Перед началом", "Başlamadan önce", "قبل أن تبدأ", "शुरू करने से पहले", "始める前に", "开始之前"],
    "studiedBefore": ["Have you studied this language before?", "¿Has estudiado este idioma antes?", "As-tu déjà étudié cette langue ?", "Hai già studiato questa lingua?", "Já estudou este idioma?", "Hast du diese Sprache schon gelernt?", "Heb je deze taal eerder geleerd?", "Вы уже учили этот язык?", "Bu dili daha önce öğrendin mi?", "هل درست هذه اللغة من قبل؟", "क्या आपने यह भाषा पहले सीखी है?", "この言語を勉強したことはありますか？", "你以前学过这门语言吗？"],
    "imNew": ["I'm new", "Soy nuevo", "Je débute", "Sono nuovo", "Sou novo", "Ich bin neu", "Ik ben nieuw", "Я новичок", "Yeniyim", "أنا مبتدئ", "मैं नया हूँ", "初心者です", "我是新手"],
    "testMe": ["Test me", "Hazme una prueba", "Teste-moi", "Mettimi alla prova", "Teste-me", "Teste mich", "Test me", "Проверьте меня", "Beni test et", "اختبرني", "मुझे परखो", "テストする", "测试我"],
    "setupNote": ["Each language keeps its own deck, progress and audio.", "Cada idioma mantiene su propio mazo, progreso y audio.", "Chaque langue garde son propre paquet, sa progression et son audio.", "Ogni lingua ha il suo mazzo, i suoi progressi e il suo audio.", "Cada idioma tem seu próprio baralho, progresso e áudio.", "Jede Sprache hat ihr eigenes Deck, ihren Fortschritt und ihr Audio.", "Elke taal heeft zijn eigen set, voortgang en audio.", "У каждого языка своя колода, прогресс и озвучка.", "Her dilin kendi destesi, ilerlemesi ve sesi var.", "لكل لغة مجموعتها وتقدمها وصوتها.", "हर भाषा का अपना डेक, प्रगति और ऑडियो है।", "言語ごとにデッキ・進捗・音声があります。", "每种语言都有自己的卡组、进度和音频。"],
    "nothingDue": ["Nothing new or due. Practise anything.", "Nada nuevo ni pendiente. Practica lo que quieras.", "Rien de nouveau ni à revoir. Entraîne-toi librement.", "Niente di nuovo o in scadenza. Esercitati liberamente.", "Nada novo ou pendente. Pratique o que quiser.", "Nichts Neues oder Fälliges. Übe frei.", "Niets nieuws of te doen. Oefen vrij.", "Ничего нового или к повторению. Практикуйтесь свободно.", "Yeni veya bekleyen yok. Serbest çalış.", "لا جديد أو مستحق. تدرّب بحرية.", "कुछ नया या बाकी नहीं। जो चाहें अभ्यास करें।", "新しいものも復習もありません。自由に練習を。", "没有新内容或待复习。自由练习。"],
    "reviewEmpty": ["Words you learn come back here when they are due.", "Las palabras que aprendes vuelven aquí cuando toca.", "Les mots appris reviennent ici au bon moment.", "Le parole imparate tornano qui quando è ora.", "As palavras aprendidas voltam aqui na hora certa.", "Gelernte Wörter kommen hier zurück, wenn sie fällig sind.", "Geleerde woorden komen hier terug als ze aan de beurt zijn.", "Выученные слова возвращаются сюда вовремя.", "Öğrendiğin kelimeler zamanı gelince buraya döner.", "تعود الكلمات التي تعلمتها هنا في وقتها.", "सीखे शब्द समय पर यहाँ लौटते हैं।", "覚えた単語は復習の時にここへ戻ります。", "学过的词到期后会回到这里。"],
    "wordsKnown": ["words known", "palabras conocidas", "mots connus", "parole conosciute", "palavras conhecidas", "Wörter bekannt", "woorden bekend", "слов известно", "bilinen kelime", "كلمات معروفة", "शब्द ज्ञात", "覚えた単語", "已知单词"],
    "toReview": ["to review", "por repasar", "à revoir", "da ripassare", "para revisar", "zu wiederholen", "te herhalen", "повторить", "tekrar", "للمراجعة", "दोहराने के लिए", "復習", "待复习"],
    "phrase": ["phrase", "frase", "phrase", "frase", "frase", "Phrase", "zin", "фраза", "ifade", "جملة", "वाक्यांश", "フレーズ", "短语"],
    "warmup": ["Warm up", "Calentamiento", "Échauffement", "Riscaldamento", "Aquecimento", "Aufwärmen", "Opwarmen", "Разминка", "Isınma", "تسخين", "वार्म-अप", "ウォームアップ", "热身"],
    "learn": ["Learn", "Aprender", "Apprendre", "Impara", "Aprender", "Lernen", "Leren", "Учиться", "Öğren", "تعلّم", "सीखो", "学ぶ", "学习"],
    "quiz": ["Quiz", "Prueba", "Quiz", "Quiz", "Quiz", "Quiz", "Quiz", "Квиз", "Test", "اختبار", "प्रश्नोत्तरी", "クイズ", "测验"],
    "done": ["Done", "Listo", "Terminé", "Fatto", "Pronto", "Fertig", "Klaar", "Готово", "Bitti", "تم", "हो गया", "完了", "完成"],
    "writingDone": ["Writing done", "Escritura terminada", "Écriture terminée", "Scrittura finita", "Escrita concluída", "Schreiben geschafft", "Schrijven klaar", "Письмо завершено", "Yazma bitti", "انتهت الكتابة", "लिखाई पूरी", "書き取り完了", "书写完成"],
    "writeMore": ["Write more", "Escribe más", "Écris encore", "Scrivi ancora", "Escreva mais", "Mehr schreiben", "Meer schrijven", "Напишите ещё", "Daha yaz", "اكتب المزيد", "और लिखो", "もっと書く", "再写一些"],
    "writeCharacters": ["Write the characters", "Escribe los caracteres", "Écris les caractères", "Scrivi i caratteri", "Escreva os caracteres", "Schreibe die Zeichen", "Schrijf de tekens", "Напишите символы", "Karakterleri yaz", "اكتب الحروف", "अक्षर लिखो", "文字を書く", "写汉字"],
    "noConfusions": ["No confusions yet.", "Aún no hay confusiones.", "Pas encore de confusions.", "Ancora nessuna confusione.", "Ainda sem confusões.", "Noch keine Verwechslungen.", "Nog geen verwarring.", "Пока нет путаниц.", "Henüz karışıklık yok.", "لا خلط بعد.", "अभी कोई भ्रम नहीं।", "まだ混同はありません。", "还没有混淆。"],
    "noMemory": ["Nothing kept yet.", "Nada guardado aún.", "Rien de gardé.", "Niente salvato.", "Nada guardado.", "Noch nichts gespeichert.", "Nog niets bewaard.", "Пока ничего нет.", "Henüz bir şey yok.", "لم يُحفظ شيء.", "अभी कुछ नहीं।", "まだありません。", "还没有保存。"],
    "today": ["Today", "Hoy", "Aujourd'hui", "Oggi", "Hoje", "Heute", "Vandaag", "Сегодня", "Bugün", "اليوم", "आज", "今日", "今天"],
    "cards": ["cards", "tarjetas", "cartes", "carte", "cartões", "Karten", "kaarten", "карточки", "kart", "بطاقات", "कार्ड", "カード", "卡片"],
    "due": ["due", "pendientes", "à faire", "in scadenza", "pendentes", "fällig", "te doen", "к повторению", "bekleyen", "مستحقة", "बाकी", "期限", "待复习"],
    "chatWithModel": ["Chat with a local model", "Chat con un modelo local", "Discussion avec un modèle local", "Chat con un modello locale", "Conversa com um modelo local", "Chat mit lokalem Modell", "Chat met lokaal model", "Чат с локальной моделью", "Yerel modelle sohbet", "محادثة مع نموذج محلي", "स्थानीय मॉडल से चैट", "ローカルモデルと会話", "与本地模型对话"],
    "endpoint": ["Endpoint", "Endpoint", "Point d'accès", "Endpoint", "Endpoint", "Endpunkt", "Eindpunt", "Эндпоинт", "Uç nokta", "نقطة النهاية", "एंडपॉइंट", "エンドポイント", "端点"],
    "model": ["Model", "Modelo", "Modèle", "Modello", "Modelo", "Modell", "Model", "Модель", "Model", "نموذج", "मॉडल", "モデル", "模型"],
    "checkModel": ["Check model", "Comprobar modelo", "Vérifier le modèle", "Controlla modello", "Verificar modelo", "Modell prüfen", "Model controleren", "Проверить модель", "Modeli kontrol et", "تحقق من النموذج", "मॉडल जाँचो", "モデルを確認", "检查模型"],
    "notChecked": ["not checked yet", "sin comprobar", "pas encore vérifié", "non ancora controllato", "ainda não verificado", "noch nicht geprüft", "nog niet gecontroleerd", "ещё не проверено", "henüz kontrol edilmedi", "لم يُفحص بعد", "अभी जाँचा नहीं", "まだ確認していません", "尚未检查"],
    "goal": ["goal", "meta", "objectif", "obiettivo", "meta", "Ziel", "doel", "цель", "hedef", "هدف", "लक्ष्य", "目標", "目标"],
    "short": ["short", "corto", "court", "breve", "curto", "kurz", "kort", "коротко", "kısa", "قصير", "छोटा", "短い", "短"],
    "long": ["long", "largo", "long", "lungo", "longo", "lang", "lang", "долго", "uzun", "طويل", "लंबा", "長い", "长"],
    "on": ["on", "activado", "activé", "attivo", "ativado", "an", "aan", "вкл", "açık", "مفعّل", "चालू", "オン", "开"],
    "off": ["off", "desactivado", "désactivé", "disattivato", "desativado", "aus", "uit", "выкл", "kapalı", "معطّل", "बंद", "オフ", "关"],
    "startWithThese": ["Start with these", "Empezar con esto", "Commencer avec", "Inizia con questi", "Começar com estes", "Damit starten", "Hiermee starten", "Начать с этого", "Bunlarla başla", "ابدأ بهذه", "इनसे शुरू करो", "これで始める", "用这些开始"],
    "cat_home": ["Home", "Casa", "Maison", "Casa", "Casa", "Zuhause", "Huis", "Дом", "Ev", "المنزل", "घर", "家", "家"],
    "cat_food": ["Food", "Comida", "Cuisine", "Cibo", "Comida", "Essen", "Eten", "Еда", "Yemek", "طعام", "खाना", "食べ物", "食物"],
    "cat_nature": ["Nature", "Naturaleza", "Nature", "Natura", "Natureza", "Natur", "Natuur", "Природа", "Doğa", "طبيعة", "प्रकृति", "自然", "自然"],
    "cat_animals": ["Animals", "Animales", "Animaux", "Animali", "Animais", "Tiere", "Dieren", "Животные", "Hayvanlar", "حيوانات", "जानवर", "動物", "动物"],
    "cat_body": ["Body", "Cuerpo", "Corps", "Corpo", "Corpo", "Körper", "Lichaam", "Тело", "Vücut", "جسم", "शरीर", "体", "身体"],
    "cat_city": ["City", "Ciudad", "Ville", "Città", "Cidade", "Stadt", "Stad", "Город", "Şehir", "مدينة", "शहर", "街", "城市"],
    "cat_time": ["Time", "Tiempo", "Temps", "Tempo", "Tempo", "Zeit", "Tijd", "Время", "Zaman", "وقت", "समय", "時間", "时间"],
    "cat_emotion": ["Emotion", "Emociones", "Émotions", "Emozioni", "Emoções", "Gefühle", "Gevoelens", "Эмоции", "Duygular", "مشاعر", "भावनाएँ", "感情", "情感"],
    "cat_action": ["Action", "Acciones", "Actions", "Azioni", "Ações", "Handlungen", "Acties", "Действия", "Eylemler", "أفعال", "क्रियाएँ", "動作", "动作"],
    "cat_abstract": ["Abstract", "Abstracto", "Abstrait", "Astratto", "Abstrato", "Abstrakt", "Abstract", "Абстрактное", "Soyut", "مجرد", "अमूर्त", "抽象", "抽象"]
  };

  var out = {};
  CODES.forEach(function (code, i) {
    out[code] = {};
    Object.keys(VALUES).forEach(function (key) { out[code][key] = VALUES[key][i]; });
  });
  return out;
})();

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_UI_EXTRA;
if (typeof window !== "undefined") window.SEMA_UI_EXTRA = SEMA_UI_EXTRA;
