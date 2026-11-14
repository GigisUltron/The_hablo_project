/* ar alphabet — letters are not vocabulary. Each entry pairs the shape with
 * its name, an English sound hint, and a word the learner already meets in
 * this pack. `note` says what the writing system actually is. */
var SEMA_ALPHABET = {
  note: "Arabic is written right to left, and letters change shape with their position. These are the isolated forms. ض and ظ are omitted because this deck has no word that uses them.",

  letters: [
    { letter: "ا", name: "alif", hint: "long 'aa' as in father", example: "أنا" },
    { letter: "ب", name: "ba", hint: "b as in book", example: "بيت" },
    { letter: "ت", name: "ta", hint: "t as in table", example: "تفاحة" },
    { letter: "ث", name: "tha", hint: "th as in think", example: "ثم" },
    { letter: "ج", name: "jim", hint: "j as in jam", example: "جزيلاً" },
    { letter: "ح", name: "ha", hint: "h from the throat, stronger than English h", example: "حب" },
    { letter: "خ", name: "kha", hint: "kh as in loch", example: "خبز" },
    { letter: "د", name: "dal", hint: "d as in door", example: "يد" },
    { letter: "ذ", name: "dhal", hint: "th as in this", example: "أذهب" },
    { letter: "ر", name: "ra", hint: "rolled r, as in Spanish", example: "بحر" },
    { letter: "ز", name: "zay", hint: "z as in zoo", example: "جزيلاً" },
    { letter: "س", name: "sin", hint: "s as in sun", example: "سيارة" },
    { letter: "ش", name: "shin", hint: "sh as in shop", example: "شمس" },
    { letter: "ص", name: "sad", hint: "heavy s, tongue low and back", example: "صباح" },
    { letter: "ط", name: "ta (emphatic)", hint: "heavy t, tongue low and back", example: "طائر" },
    { letter: "ع", name: "ayn", hint: "voiced sound from the throat; no English equivalent", example: "عين" },
    { letter: "غ", name: "ghayn", hint: "gh as in a French r", example: "غداً" },
    { letter: "ف", name: "fa", hint: "f as in fish", example: "تفاحة" },
    { letter: "ق", name: "qaf", hint: "k from deep in the throat", example: "قمر" },
    { letter: "ك", name: "kaf", hint: "k as in kite", example: "كلب" },
    { letter: "ل", name: "lam", hint: "l as in lamp", example: "ليلة" },
    { letter: "م", name: "mim", hint: "m as in moon", example: "ماء" },
    { letter: "ن", name: "nun", hint: "n as in night", example: "نعم" },
    { letter: "ه", name: "ha", hint: "h as in hello", example: "هو" },
    { letter: "و", name: "waw", hint: "w as in water; also long 'oo'", example: "هو" },
    { letter: "ي", name: "ya", hint: "y as in yes; also long 'ee'", example: "يد" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("ar", "alphabet", SEMA_ALPHABET);
}
