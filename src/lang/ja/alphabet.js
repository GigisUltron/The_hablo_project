/* ja alphabet — letters are not vocabulary. Each entry pairs the shape with
 * its name, an English sound hint, and a word the learner already meets in
 * this pack. `note` says what the writing system actually is. */
var SEMA_ALPHABET = {
  note: "Japanese uses two kana syllabaries plus kanji. Kana are syllables, not letters; kanji are learned as whole words, not as an alphabet. This is hiragana.",

  letters: [
    { letter: "あ", name: "a", hint: "open 'a' as in father", example: "あります" },
    { letter: "い", name: "i", hint: "ee as in see", example: "おやすみなさい" },
    { letter: "う", name: "u", hint: "oo as in food, lips relaxed", example: "おはようございます" },
    { letter: "お", name: "o", hint: "o as in more", example: "おはよう" },
    { letter: "か", name: "ka", hint: "k as in kite", example: "わかりません" },
    { letter: "き", name: "ki", hint: "k with a short i", example: "大きい" },
    { letter: "く", name: "ku", hint: "k with a short u", example: "近く" },
    { letter: "け", name: "ke", hint: "k with a short e", example: "お会計" },
    { letter: "こ", name: "ko", hint: "k with a short o", example: "こんにちは" },
    { letter: "さ", name: "sa", hint: "s as in sun", example: "さようなら" },
    { letter: "し", name: "shi", hint: "sh as in ship", example: "はじめまして" },
    { letter: "す", name: "su", hint: "s with a short u", example: "すみません" },
    { letter: "た", name: "ta", hint: "t as in table", example: "ありがとう" },
    { letter: "ち", name: "chi", hint: "ch as in church", example: "こんにちは" },
    { letter: "つ", name: "tsu", hint: "ts as in cats", example: "いつも" },
    { letter: "て", name: "te", hint: "t as in table", example: "とても" },
    { letter: "と", name: "to", hint: "t with a short o", example: "とても" },
    { letter: "に", name: "ni", hint: "n with a short i", example: "こんにちは" },
    { letter: "の", name: "no", hint: "n with a short o", example: "私の" },
    { letter: "は", name: "ha", hint: "h as in hello", example: "こんにちは" },
    { letter: "ま", name: "ma", hint: "m as in moon", example: "また" },
    { letter: "み", name: "mi", hint: "m with a short i", example: "おやすみなさい" },
    { letter: "も", name: "mo", hint: "m with a short o", example: "とても" },
    { letter: "や", name: "ya", hint: "y as in yes", example: "おやすみなさい" },
    { letter: "ゆ", name: "yu", hint: "y with a short u", example: "ゆっくり" },
    { letter: "よ", name: "yo", hint: "y with a short o", example: "おはよう" },
    { letter: "ら", name: "ra", hint: "r with a light tap", example: "いくら" },
    { letter: "り", name: "ri", hint: "r with a short i", example: "りんご" },
    { letter: "る", name: "ru", hint: "r with a short u", example: "あります" },
    { letter: "れ", name: "re", hint: "r with a short e", example: "これ" },
    { letter: "わ", name: "wa", hint: "w as in water", example: "わかりません" },
    { letter: "を", name: "wo", hint: "o, used as the object marker", example: "水を飲みます" },
    { letter: "ん", name: "n", hint: "a nasal sound before a pause", example: "こんにちは" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("ja", "alphabet", SEMA_ALPHABET);
}
