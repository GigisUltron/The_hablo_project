/* hi alphabet — letters are not vocabulary. Each entry pairs the shape with
 * its name, an English sound hint, and a word the learner already meets in
 * this pack. `note` says what the writing system actually is. */
var SEMA_ALPHABET = {
  note: "Devanagari is an abugida: a consonant carries an inherent 'a' vowel, and vowel signs attach to it. Letters with no example word in this deck are omitted.",

  letters: [
    { letter: "अ", name: "a", hint: "short 'a' as in about", example: "अच्छा" },
    { letter: "आ", name: "aa", hint: "long 'aa' as in father", example: "आप" },
    { letter: "इ", name: "i", hint: "short 'i' as in sit", example: "इस" },
    { letter: "ई", name: "ii", hint: "long 'ee' as in see", example: "नहीं" },
    { letter: "उ", name: "u", hint: "short 'u' as in put", example: "उठाता" },
    { letter: "ऊ", name: "uu", hint: "long 'oo' as in food", example: "ऊँचा" },
    { letter: "ए", name: "e", hint: "long 'ay' as in say", example: "एक" },
    { letter: "क", name: "ka", hint: "k as in kite", example: "कुत्ता" },
    { letter: "ख", name: "kha", hint: "kh as in loch", example: "खाना" },
    { letter: "ग", name: "ga", hint: "g as in go", example: "गाड़ी" },
    { letter: "घ", name: "gha", hint: "gh as in ghost, with breath", example: "घर" },
    { letter: "च", name: "cha", hint: "ch as in church", example: "चाँद" },
    { letter: "ज", name: "ja", hint: "j as in jam", example: "सूरज" },
    { letter: "ट", name: "ta (retroflex)", hint: "t with the tongue curled back", example: "ट्रेन" },
    { letter: "ठ", name: "tha (retroflex)", hint: "retroflex t with breath", example: "ठीक" },
    { letter: "ड़", name: "da (flapped)", hint: "a flapped d with the tongue curled back", example: "पेड़" },
    { letter: "त", name: "ta (dental)", hint: "t with the tongue at the teeth", example: "ताज़ी" },
    { letter: "थ", name: "tha (dental)", hint: "dental t with breath", example: "हाथ" },
    { letter: "द", name: "da (dental)", hint: "d with the tongue at the teeth", example: "दिन" },
    { letter: "ध", name: "dha (dental)", hint: "dental d with breath", example: "धड़कता" },
    { letter: "न", name: "na", hint: "n as in night", example: "नाम" },
    { letter: "प", name: "pa", hint: "p as in pen", example: "पानी" },
    { letter: "फ", name: "pha", hint: "ph as in phone", example: "फ़र्श" },
    { letter: "ब", name: "ba", hint: "b as in book", example: "बिल्ली" },
    { letter: "भ", name: "bha", hint: "b with breath", example: "भूल" },
    { letter: "म", name: "ma", hint: "m as in moon", example: "मैं" },
    { letter: "य", name: "ya", hint: "y as in yes", example: "प्यार" },
    { letter: "र", name: "ra", hint: "r with a light tap", example: "रात" },
    { letter: "ल", name: "la", hint: "l as in lamp", example: "लाल" },
    { letter: "व", name: "va", hint: "v as in van", example: "वहाँ" },
    { letter: "श", name: "sha", hint: "sh as in shop", example: "शहर" },
    { letter: "स", name: "sa", hint: "s as in sun", example: "सड़क" },
    { letter: "ह", name: "ha", hint: "h as in hello", example: "हाथ" },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("hi", "alphabet", SEMA_ALPHABET);
}
