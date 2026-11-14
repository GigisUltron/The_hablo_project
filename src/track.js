/* The track: a visible curriculum instead of an endless deck.
 *
 * Each unit is a lesson with a stable key, a mode and a scope, unlocked by how
 * many cards are solid (interval >= 6 days). A unit carries no display string:
 * its title is resolved from the language being learned, so a learner of
 * Chinese never reads a unit named after Spanish. Pure: pass the count in, get
 * the map back.
 */
var SEMA_TRACK = {
  units: [
    { id: "u1", key: "u1", mode: "phrases", fields: null, need: 0 },
    /* only shown for a pack whose script is not Latin; see unitList(). It sits
     * after the first greeting so it is the current lesson at zero solid, and
     * steps aside once real progress unlocks the next unit. */
    { id: "script", key: "script", mode: "script", fields: null, need: 0 },
    { id: "u2", key: "u2", mode: "words", fields: ["home", "food"], need: 6 },
    { id: "u3", key: "u3", mode: "words", fields: ["nature", "animals", "body"], need: 14 },
    { id: "u4", key: "u4", mode: "words", fields: ["city", "time"], need: 22 },
    { id: "u5", key: "u5", mode: "terms", fields: null, need: 30 },
    { id: "u6", key: "u6", mode: "read", fields: null, need: 40 }
  ],

  /* One key, one title per language. A pack overrides any of these by shipping
   * its own `titles` map, so the track never has to be edited for a language.
   * No title names a language: "Read", never "Read in Spanish". */
  titles: {
    en: { u1: "Say hello", u2: "First words", u3: "Around you", u4: "Out in the city", u5: "Connect ideas", u6: "Read", script: "Alphabet" },
    es: { u1: "Saludar", u2: "Primeras palabras", u3: "A tu alrededor", u4: "En la ciudad", u5: "Conectar ideas", u6: "Leer", script: "Alfabeto" },
    de: { u1: "Begrüßen", u2: "Erste Wörter", u3: "Um dich herum", u4: "In der Stadt", u5: "Ideen verbinden", u6: "Lesen", script: "Alphabet" },
    fr: { u1: "Saluer", u2: "Premiers mots", u3: "Autour de toi", u4: "En ville", u5: "Relier les idées", u6: "Lire", script: "Alphabet" },
    it: { u1: "Salutare", u2: "Prime parole", u3: "Intorno a te", u4: "In città", u5: "Collegare le idee", u6: "Leggere", script: "Alfabeto" },
    nl: { u1: "Groeten", u2: "Eerste woorden", u3: "Om je heen", u4: "In de stad", u5: "Ideeën verbinden", u6: "Lezen", script: "Alfabet" },
    pt: { u1: "Cumprimentar", u2: "Primeiras palavras", u3: "Ao teu redor", u4: "Na cidade", u5: "Ligar ideias", u6: "Ler", script: "Alfabeto" },
    tr: { u1: "Selamlaşma", u2: "İlk kelimeler", u3: "Çevrende", u4: "Şehirde", u5: "Fikirleri bağla", u6: "Okuma", script: "Alfabe" },
    ru: { u1: "Приветствие", u2: "Первые слова", u3: "Вокруг тебя", u4: "В городе", u5: "Связывать идеи", u6: "Чтение", script: "Алфавит" },
    ar: { u1: "التحية", u2: "أول الكلمات", u3: "حولك", u4: "في المدينة", u5: "ربط الأفكار", u6: "القراءة", script: "الأبجدية" },
    hi: { u1: "अभिवादन", u2: "पहले शब्द", u3: "तुम्हारे आसपास", u4: "शहर में", u5: "विचार जोड़ो", u6: "पढ़ना", script: "वर्णमाला" },
    ja: { u1: "あいさつ", u2: "最初の単語", u3: "まわり", u4: "街で", u5: "つなぐ", u6: "読む", script: "文字" },
    zh: { u1: "打招呼", u2: "第一批词", u3: "身边", u4: "城市里", u5: "连接想法", u6: "阅读", script: "字母" }
  }
};

(function (root) {
  var T = SEMA_TRACK;

  /* The order a learner meets the units. A pack with a non-Latin script also
   * gets the alphabet, right after the first greeting unit: it is the current
   * lesson until six cards are solid. */
  function unitList(script) {
    return T.units.filter(function (u) { return script || u.mode !== "script"; });
  }

  /* The title for one unit key: the pack's own string first, then the table for
   * the language being learned, then a generic English title. */
  function title(key, opts) {
    var o = opts || {};
    var supplied = o.titles && o.titles[key];
    if (supplied) return String(supplied);
    var table = T.titles[o.lang];
    if (table && table[key]) return table[key];
    return T.titles.en[key] || key;
  }

  /* Does a set of letters need a script lesson? A declared script wins; Latin
   * never needs one, so an alphabet part on a Latin deck is not a lesson. */
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
        id: u.id, key: u.key, title: title(u.key, o), mode: u.mode, fields: u.fields, need: u.need,
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
