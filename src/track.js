/* The track: a tutor's sequence, not an endless deck.
 *
 * Twelve lessons move from first contact to a B1 bridge. Each lesson has a
 * communicative goal, a phrase-topic scope and a vocabulary-field scope. The
 * path unlocks on cards met, so a learner reaches the next lesson after a
 * session rather than after six days of spaced repetition.
 */
var SEMA_TRACK = {
  units: [
    {
      id: "c1", key: "c1", mode: "phrases", fields: null,
      topics: ["greetings", "introductions", "courtesy"],
      need: 0, openers: true,
      goal: "Greet someone, introduce yourself, and say where you are from.",
      focus: "hello · my name is · nice to meet you"
    },
    /* only shown for a pack whose script is not Latin; see unitList(). */
    { id: "script", key: "script", mode: "script", fields: null, need: 0, goal: "Learn to read the script.", focus: "letters · sounds" },
    {
      id: "c2", key: "c2", mode: "words", fields: ["food"],
      topics: ["café", "restaurant", "money"],
      need: 6,
      goal: "Order a drink or a meal politely and ask for the bill.",
      focus: "please · I would like · how much"
    },
    {
      id: "c3", key: "c3", mode: "words", fields: ["city"],
      topics: ["city", "directions", "station", "tickets"],
      need: 12,
      goal: "Ask where places are, understand directions, and buy a ticket.",
      focus: "where is · left and right · one ticket"
    },
    {
      id: "c4", key: "c4", mode: "words", fields: ["time"],
      topics: ["airport", "hotel", "money"],
      need: 18,
      goal: "Check in, catch a train or flight, and handle money.",
      focus: "I have a reservation · what time · card or cash"
    },
    {
      id: "c5", key: "c5", mode: "words", fields: ["body"],
      topics: ["doctor", "emergency", "pharmacy"],
      need: 24,
      goal: "Ask for help, describe a problem, and talk to a doctor or pharmacist.",
      focus: "I need help · it hurts · is there a pharmacy"
    },
    {
      id: "c6", key: "c6", mode: "words", fields: ["home"],
      topics: ["shopping", "clothes", "market"],
      need: 32,
      goal: "Shop for clothes, food, and gifts; ask about price and size.",
      focus: "how much is it · too expensive · a different size"
    },
    {
      id: "c7", key: "c7", mode: "words", fields: ["action", "time"],
      topics: ["work", "study", "home", "hobbies"],
      need: 40,
      goal: "Talk about your work, study, home, and free time.",
      focus: "I work · I study · in my free time"
    },
    {
      id: "c8", key: "c8", mode: "words", fields: ["time"],
      topics: ["plans", "phone", "messages"],
      need: 48,
      goal: "Make plans, leave a message, and arrange a time.",
      focus: "are you free · let's meet · call me later"
    },
    {
      id: "c9", key: "c9", mode: "words", fields: ["nature", "animals"],
      topics: ["past", "weather"],
      need: 56,
      goal: "Talk about what happened yesterday and describe the weather.",
      focus: "yesterday I went · it was raining · last week"
    },
    {
      id: "c10", key: "c10", mode: "words", fields: ["emotion"],
      topics: ["opinions", "small-talk", "feelings"],
      need: 64,
      goal: "Give opinions, agree and disagree, and keep a conversation going.",
      focus: "I think · I agree · in my opinion"
    },
    {
      id: "c11", key: "c11", mode: "terms", fields: ["abstract"],
      topics: ["opinions", "past", "feelings"],
      need: 72,
      goal: "Connect ideas with because, although, however, and therefore.",
      focus: "because · although · however · therefore"
    },
    {
      id: "c12", key: "c12", mode: "read", fields: null,
      topics: ["past", "opinions", "feelings"],
      need: 76,
      goal: "Read and tell a short story; hold a longer conversation.",
      focus: "first · then · in the end"
    },
  ],

  /* One key, one title per language. A pack overrides any of these by shipping
   * its own `titles` map, so the track never has to be edited for a language. */
  titles: {
    en: { c1: "First contact", c2: "Café & restaurant", c3: "Getting around", c4: "Travel", c5: "Help & health", c6: "Shopping", c7: "Daily life", c8: "Plans & messages", c9: "Past & weather", c10: "Opinions", c11: "Connect ideas", c12: "Tell a story", script: "Alphabet" },
    es: { c1: "Primer contacto", c2: "Café y restaurante", c3: "Moverse", c4: "Viajar", c5: "Ayuda y salud", c6: "Compras", c7: "Vida diaria", c8: "Planes y mensajes", c9: "Pasado y tiempo", c10: "Opiniones", c11: "Conectar ideas", c12: "Contar una historia", script: "Alfabeto" },
    fr: { c1: "Premier contact", c2: "Café et restaurant", c3: "Se déplacer", c4: "Voyager", c5: "Aide et santé", c6: "Achats", c7: "Vie quotidienne", c8: "Projets et messages", c9: "Passé et météo", c10: "Opinions", c11: "Relier les idées", c12: "Raconter une histoire", script: "Alphabet" },
    it: { c1: "Primo contatto", c2: "Caffè e ristorante", c3: "Muoversi", c4: "Viaggiare", c5: "Aiuto e salute", c6: "Acquisti", c7: "Vita quotidiana", c8: "Progetti e messaggi", c9: "Passato e meteo", c10: "Opinioni", c11: "Collegare le idee", c12: "Raccontare una storia", script: "Alfabeto" },
    pt: { c1: "Primeiro contato", c2: "Café e restaurante", c3: "Locomoção", c4: "Viagens", c5: "Ajuda e saúde", c6: "Compras", c7: "Vida diária", c8: "Planos e mensagens", c9: "Passado e clima", c10: "Opiniões", c11: "Ligar ideias", c12: "Contar uma história", script: "Alfabeto" },
    de: { c1: "Erster Kontakt", c2: "Café & Restaurant", c3: "Unterwegs", c4: "Reisen", c5: "Hilfe & Gesundheit", c6: "Einkaufen", c7: "Alltag", c8: "Pläne & Nachrichten", c9: "Vergangenheit & Wetter", c10: "Meinungen", c11: "Ideen verbinden", c12: "Eine Geschichte erzählen", script: "Alphabet" },
    nl: { c1: "Eerste contact", c2: "Café & restaurant", c3: "Onderweg", c4: "Reizen", c5: "Hulp & gezondheid", c6: "Winkelen", c7: "Dagelijks leven", c8: "Plannen & berichten", c9: "Verleden & weer", c10: "Meningen", c11: "Ideeën verbinden", c12: "Een verhaal vertellen", script: "Alfabet" },
    ru: { c1: "Первый контакт", c2: "Кафе и ресторан", c3: "В пути", c4: "Путешествия", c5: "Помощь и здоровье", c6: "Покупки", c7: "Повседневность", c8: "Планы и сообщения", c9: "Прошлое и погода", c10: "Мнения", c11: "Связывать идеи", c12: "Рассказать историю", script: "Алфавит" },
    tr: { c1: "İlk temas", c2: "Kafe ve restoran", c3: "Yolda", c4: "Seyahat", c5: "Yardım ve sağlık", c6: "Alışveriş", c7: "Günlük hayat", c8: "Planlar ve mesajlar", c9: "Geçmiş ve hava", c10: "Görüşler", c11: "Fikirleri bağla", c12: "Bir hikâye anlat", script: "Alfabe" },
    ar: { c1: "أول تواصل", c2: "المقهى والمطعم", c3: "التنقل", c4: "السفر", c5: "المساعدة والصحة", c6: "التسوق", c7: "الحياة اليومية", c8: "الخطط والرسائل", c9: "الماضي والطقس", c10: "الآراء", c11: "ربط الأفكار", c12: "احكِ قصة", script: "الأبجدية" },
    hi: { c1: "पहला संपर्क", c2: "कैफ़े और रेस्तरां", c3: "आना-जाना", c4: "यात्रा", c5: "मदद और सेहत", c6: "खरीदारी", c7: "रोज़मर्रा", c8: "योजनाएँ और संदेश", c9: "अतीत और मौसम", c10: "विचार", c11: "विचार जोड़ो", c12: "कहानी सुनाओ", script: "वर्णमाला" },
    ja: { c1: "はじめての会話", c2: "カフェとレストラン", c3: "移動", c4: "旅行", c5: "助けと健康", c6: "買い物", c7: "毎日の生活", c8: "予定とメッセージ", c9: "過去と天気", c10: "意見", c11: "つなぐ", c12: "物語を話す", script: "文字" },
    zh: { c1: "初次见面", c2: "咖啡馆和餐厅", c3: "出行", c4: "旅行", c5: "求助与健康", c6: "购物", c7: "日常生活", c8: "计划与消息", c9: "过去与天气", c10: "观点", c11: "连接想法", c12: "讲故事", script: "字母" }
  }
};

(function (root) {
  var T = SEMA_TRACK;

  function unitList(script) {
    return T.units.filter(function (u) { return script || u.mode !== "script"; });
  }

  function title(key, opts) {
    var o = opts || {};
    var supplied = o.titles && o.titles[key];
    if (supplied) return String(supplied);
    var table = T.titles[o.lang];
    if (table && table[key]) return table[key];
    return T.titles.en[key] || key;
  }

  function scriptNeeded(letters, declared) {
    if (!letters || !letters.length) return false;
    if (declared) return String(declared).toLowerCase() !== "latin";
    return !letters.every(function (l) { return isLatinLetter(l.letter); });
  }

  function isLatinLetter(ch) {
    var text = String(ch == null ? "" : ch);
    if (!text) return true;
    try { return /^[\p{Script=Latin}\p{M}]+$/u.test(text); }
    catch (err) { return /^[A-Za-z\u00c0-\u024f]+$/.test(text); }
  }

  function map(solid, opts) {
    var n = Number(solid) || 0;
    var o = opts || {};
    var units = unitList(!!o.script);
    var current = -1;
    units.forEach(function (u, i) { if (n >= u.need) current = i; });
    return units.map(function (u, i) {
      return {
        id: u.id, key: u.key, title: title(u.key, o), mode: u.mode, fields: u.fields,
        topics: u.topics, goal: u.goal, focus: u.focus, openers: !!u.openers, need: u.need,
        index: i,
        unlocked: n >= u.need,
        current: i === current,
        remaining: Math.max(0, u.need - n)
      };
    });
  }

  function currentUnit(solid, opts) {
    var rows = map(solid, opts);
    for (var i = 0; i < rows.length; i += 1) if (rows[i].current) return rows[i];
    return rows[0];
  }

  var api = {
    units: T.units, titles: T.titles, title: title, unitList: unitList,
    scriptNeeded: scriptNeeded, isLatinLetter: isLatinLetter,
    map: map, currentUnit: currentUnit
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaTrack = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
