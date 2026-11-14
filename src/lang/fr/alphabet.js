/* The French alphabet, anchored the same way as the Spanish one: the letter's
 * French name, an English pronunciation hint, and a word from the decks.
 * Accented letters and the ligature œ are separate entries because they change
 * both sound and spelling.
 */
var SEMA_ALPHABET = {
  letters: [
    { letter: "a", name: "a", hint: "open 'ah', shorter than in English", example: "maison" },
    { letter: "b", name: "bé", hint: "as in English, lips together", example: "boire" },
    { letter: "c", name: "cé", hint: "'s' before e/i, 'k' before a/o/u", example: "café" },
    { letter: "d", name: "dé", hint: "tongue at the teeth, no puff", example: "dormir" },
    { letter: "e", name: "e", hint: "'uh' in the middle of a word, often silent at the end", example: "mer" },
    { letter: "f", name: "effe", hint: "as in English", example: "fenêtre" },
    { letter: "g", name: "gé", hint: "'zh' before e/i, hard 'g' before a/o/u", example: "manger" },
    { letter: "h", name: "ache", hint: "always silent", example: "hôtel" },
    { letter: "i", name: "i", hint: "'ee', as in see", example: "lit" },
    { letter: "j", name: "ji", hint: "soft 'zh', like the s in measure", example: "jour" },
    { letter: "k", name: "ka", hint: "'k'; rare, mostly loanwords", example: "kilo" },
    { letter: "l", name: "elle", hint: "clear 'l', tongue at the front", example: "lune" },
    { letter: "m", name: "emme", hint: "as in English", example: "main" },
    { letter: "n", name: "enne", hint: "as in English", example: "nuit" },
    { letter: "o", name: "o", hint: "round 'oh', lips forward", example: "porte" },
    { letter: "p", name: "pé", hint: "as in English, little puff of air", example: "pain" },
    { letter: "q", name: "cu", hint: "'k'; qu is almost always 'k'", example: "quatre" },
    { letter: "r", name: "erre", hint: "throaty, from the back of the mouth", example: "rue" },
    { letter: "s", name: "esse", hint: "'s', or 'z' between two vowels", example: "soleil" },
    { letter: "t", name: "té", hint: "as in English, no puff", example: "temps" },
    { letter: "u", name: "u", hint: "rounded 'ee', lips pushed forward", example: "tu" },
    { letter: "v", name: "vé", hint: "as in English, bottom lip on teeth", example: "voiture" },
    { letter: "w", name: "double vé", hint: "'v' in wagon, 'w' in loanwords", example: "wagon" },
    { letter: "x", name: "ixe", hint: "'ks'; sometimes 'z'", example: "xylophone" },
    { letter: "y", name: "i grec", hint: "'ee' as a vowel, 'y' before a vowel", example: "yeux" },
    { letter: "z", name: "zède", hint: "as in English", example: "zéro" },
    { letter: "é", name: "e accent aigu", hint: "closed 'ay', as in café", example: "café" },
    { letter: "è", name: "e accent grave", hint: "open 'eh', as in père", example: "père" },
    { letter: "ê", name: "e accent circonflexe", hint: "open 'eh'; often marks a lost s", example: "fenêtre" },
    { letter: "ç", name: "c cédille", hint: "'s' before a/o/u, as in ça", example: "ça" },
    { letter: "œ", name: "e dans l'o", hint: "'uh' as in bird, or 'eh'", example: "cœur" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("fr", "alphabet", SEMA_ALPHABET);
}
