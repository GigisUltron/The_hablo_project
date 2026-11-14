/* zh alphabet — letters are not vocabulary. Each entry pairs the shape with
 * its name, an English sound hint, and a word the learner already meets in
 * this pack. `note` says what the writing system actually is. */
var SEMA_ALPHABET = {
  note: "Chinese is written with Han characters, not an alphabet. This is the pinyin sound system: initials and finals, with tone marks. Han characters are learned as whole words.",

  letters: [
    { letter: "b", name: "bō", hint: "b as in book, unaspirated", example: "不" },
    { letter: "p", name: "pō", hint: "p as in pen, with a puff", example: "苹果" },
    { letter: "m", name: "mō", hint: "m as in moon", example: "面包" },
    { letter: "f", name: "fō", hint: "f as in fish", example: "房子" },
    { letter: "d", name: "dē", hint: "d as in door, unaspirated", example: "大" },
    { letter: "t", name: "tē", hint: "t as in table, with a puff", example: "太阳" },
    { letter: "n", name: "nē", hint: "n as in night", example: "你" },
    { letter: "l", name: "lē", hint: "l as in lamp", example: "路" },
    { letter: "g", name: "gē", hint: "g as in go, unaspirated", example: "狗" },
    { letter: "k", name: "kē", hint: "k as in kite, with a puff", example: "咖啡" },
    { letter: "h", name: "hē", hint: "h as in hello, from the throat", example: "海" },
    { letter: "j", name: "jī", hint: "j as in jeep, unaspirated", example: "街道" },
    { letter: "q", name: "qī", hint: "ch as in cheap, with a puff", example: "请" },
    { letter: "x", name: "xī", hint: "sh as in sheep, but lighter", example: "心" },
    { letter: "zh", name: "zhī", hint: "j as in jump, tongue curled back", example: "中文" },
    { letter: "ch", name: "chī", hint: "ch as in church, tongue curled back", example: "吃" },
    { letter: "sh", name: "shī", hint: "sh as in shop, tongue curled back", example: "水" },
    { letter: "r", name: "rī", hint: "r as in run, tongue curled back", example: "认识" },
    { letter: "z", name: "zī", hint: "ds as in reads", example: "再见" },
    { letter: "c", name: "cī", hint: "ts as in cats", example: "城市" },
    { letter: "s", name: "sī", hint: "s as in sun", example: "红色" },
    { letter: "y", name: "yī", hint: "y as in yes", example: "月亮" },
    { letter: "w", name: "wū", hint: "w as in water", example: "我" },
    { letter: "a", name: "a", hint: "open 'ah' as in father", example: "大" },
    { letter: "o", name: "o", hint: "round 'oh'", example: "我" },
    { letter: "e", name: "e", hint: "uh as in about", example: "喝" },
    { letter: "i", name: "i", hint: "ee as in see", example: "你" },
    { letter: "u", name: "u", hint: "oo as in food", example: "不" },
    { letter: "ai", name: "ai", hint: "eye as in my", example: "海" },
    { letter: "ei", name: "ei", hint: "ay as in say", example: "咖啡" },
    { letter: "ao", name: "ao", hint: "ow as in cow", example: "好" },
    { letter: "ou", name: "ou", hint: "oh as in go", example: "以后" },
    { letter: "an", name: "an", hint: "an as in barn", example: "看" },
    { letter: "en", name: "en", hint: "un as in under", example: "很" },
    { letter: "ang", name: "ang", hint: "ah with a nasal ending", example: "房" },
    { letter: "ong", name: "ong", hint: "o with a nasal ending", example: "红" },
    { letter: "ia", name: "ia", hint: "ya as in yard", example: "家" },
    { letter: "ie", name: "ie", hint: "ye as in yes", example: "街" },
    { letter: "uo", name: "uo", hint: "wa as in water", example: "说" },
    { letter: "üe", name: "üe", hint: "ü plus eh; written ue after j/q/x/y", example: "月" },
    { letter: "iao", name: "iao", hint: "ee-ow as in meow", example: "叫" },
    { letter: "iu", name: "iu", hint: "ee-oh as in yo-yo", example: "酒" },
    { letter: "ian", name: "ian", hint: "ee-en as in see-en", example: "天" },
    { letter: "in", name: "in", hint: "een as in seen", example: "心" },
    { letter: "iang", name: "iang", hint: "ee-ah-ng, as in see-ah-ng", example: "想" },
    { letter: "ing", name: "ing", hint: "ing as in sing", example: "请" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("zh", "alphabet", SEMA_ALPHABET);
}
