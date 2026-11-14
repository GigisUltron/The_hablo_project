/* ru alphabet — letters are not vocabulary. Each entry pairs the shape with
 * its name, an English sound hint, and a word the learner already meets in
 * this pack. `note` says what the writing system actually is. */
var SEMA_ALPHABET = {
  note: "Cyrillic has 33 letters. ь is a soft sign and has no sound of its own; ъ is omitted because this deck has no word that uses it.",

  letters: [
    { letter: "а", name: "a", hint: "open 'ah', as in father", example: "мама" },
    { letter: "б", name: "be", hint: "b as in book", example: "хлеб" },
    { letter: "в", name: "ve", hint: "v as in voice", example: "вода" },
    { letter: "г", name: "ge", hint: "hard g as in go", example: "город" },
    { letter: "д", name: "de", hint: "d as in door", example: "дом" },
    { letter: "е", name: "ye", hint: "ye as in yes, or e after a consonant", example: "есть" },
    { letter: "ё", name: "yo", hint: "yo as in yonder; always stressed", example: "поёт" },
    { letter: "ж", name: "zhe", hint: "zh like the s in measure", example: "уже" },
    { letter: "з", name: "ze", hint: "z as in zoo", example: "знаю" },
    { letter: "и", name: "i", hint: "ee as in see", example: "идём" },
    { letter: "й", name: "i kratkoye", hint: "short y as in boy", example: "мой" },
    { letter: "к", name: "ka", hint: "k as in cat", example: "кофе" },
    { letter: "л", name: "el", hint: "l as in lamp", example: "луна" },
    { letter: "м", name: "em", hint: "m as in moon", example: "море" },
    { letter: "н", name: "en", hint: "n as in night", example: "ночь" },
    { letter: "о", name: "o", hint: "o as in more, rounded", example: "он" },
    { letter: "п", name: "pe", hint: "p as in pen", example: "поезд" },
    { letter: "р", name: "er", hint: "rolled r, tongue tip vibrating", example: "рука" },
    { letter: "с", name: "es", hint: "s as in sun", example: "солнце" },
    { letter: "т", name: "te", hint: "t as in table", example: "ты" },
    { letter: "у", name: "u", hint: "oo as in food", example: "улица" },
    { letter: "ф", name: "ef", hint: "f as in fish", example: "кофе" },
    { letter: "х", name: "kha", hint: "h as in loch, throaty", example: "хлеб" },
    { letter: "ц", name: "tse", hint: "ts as in cats", example: "птица" },
    { letter: "ч", name: "che", hint: "ch as in church", example: "ночь" },
    { letter: "ш", name: "sha", hint: "sh as in shop", example: "машина" },
    { letter: "щ", name: "shcha", hint: "soft sh, longer than ш", example: "ещё" },
    { letter: "ы", name: "y", hint: "i with the tongue pulled back", example: "ты" },
    { letter: "ь", name: "myagkiy znak", hint: "soft sign: no sound, softens the consonant", example: "дверь" },
    { letter: "э", name: "e", hint: "e as in bed", example: "это" },
    { letter: "ю", name: "yu", hint: "yu as in universe", example: "любовь" },
    { letter: "я", name: "ya", hint: "ya as in yard", example: "яблоко" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("ru", "alphabet", SEMA_ALPHABET);
}
