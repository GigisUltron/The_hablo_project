/* The alphabet — the first lesson nobody ships.
 *
 * Letters are not vocabulary: there is no picture for "h" and no translation
 * that helps. Each entry is taught by its Spanish name, a sound hint, and a
 * word from the decks that contains it, so the letter is anchored to something
 * already learned.
 *
 * `hint` is English on purpose: it is instruction about pronunciation, not a
 * gloss of meaning.
 */
var SEMA_ALPHABET = {
  letters: [
    { letter: "a", name: "a", hint: "open 'ah', as in father", example: "casa" },
    { letter: "b", name: "be", hint: "soft, lips together; barely there between vowels", example: "beber" },
    { letter: "c", name: "ce", hint: "'k' before a/o/u, 'th' in Spain before e/i", example: "casa" },
    { letter: "d", name: "de", hint: "soft 'th' between vowels, hard at the start", example: "día" },
    { letter: "e", name: "e", hint: "short 'eh', as in bet", example: "escuchar" },
    { letter: "f", name: "efe", hint: "as in English", example: "flor" },
    { letter: "g", name: "ge", hint: "hard 'g' before a/o/u, throaty 'h' before e/i", example: "gato" },
    { letter: "h", name: "hache", hint: "always silent", example: "hablar" },
    { letter: "i", name: "i", hint: "'ee', as in see", example: "lluvia" },
    { letter: "j", name: "jota", hint: "throaty 'h', like the Scottish loch", example: "ojo" },
    { letter: "k", name: "ka", hint: "'k'; rare, mostly loanwords", example: "kilómetro" },
    { letter: "l", name: "ele", hint: "clear 'l', tongue at the front", example: "leche" },
    { letter: "m", name: "eme", hint: "as in English", example: "mano" },
    { letter: "n", name: "ene", hint: "as in English", example: "noche" },
    { letter: "ñ", name: "eñe", hint: "'ny', as in canyon — a separate letter", example: "montaña" },
    { letter: "o", name: "o", hint: "round 'oh', shorter than English", example: "ojo" },
    { letter: "p", name: "pe", hint: "soft, little puff of air", example: "pan" },
    { letter: "q", name: "cu", hint: "always 'k' before ue/ui, the u is silent", example: "quizá" },
    { letter: "r", name: "erre", hint: "single tap, like the tt in butter", example: "mar" },
    { letter: "rr", name: "erre doble", hint: "rolled, several taps — always strong", example: "correr" },
    { letter: "s", name: "ese", hint: "as in English", example: "sol" },
    { letter: "t", name: "te", hint: "soft, no puff of air", example: "tren" },
    { letter: "u", name: "u", hint: "'oo', as in food; silent in que/gui", example: "luna" },
    { letter: "v", name: "uve", hint: "sounds exactly like b", example: "ventana" },
    { letter: "w", name: "uve doble", hint: "'w' or 'b'; loanwords only", example: "wifi" },
    { letter: "x", name: "equis", hint: "'ks', sometimes 'h' as in México", example: "éxito" },
    { letter: "y", name: "ye", hint: "'y' alone, 'ee' as a word (and = y)", example: "ya" },
    { letter: "z", name: "zeta", hint: "'th' in Spain, 's' in Latin America", example: "paz" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_ALPHABET;
if (typeof window !== "undefined") {
  window.SEMA_ALPHABET = SEMA_ALPHABET;
  if (window.SemaLangs) window.SemaLangs.define("es", "alphabet", SEMA_ALPHABET);
}
