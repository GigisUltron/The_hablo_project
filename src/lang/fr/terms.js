/* Terms — French vocabulary that cannot be drawn.
 *
 * Each term is anchored three ways: a schema for its shape, a frame with a
 * slot for its distribution, and a contrast to trade it against. A picture
 * would be theatre for "pourtant" or "déjà".
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-deja", text: "déjà", gloss: "already", schema: "clock",
      frame: "J'ai ____ fini le travail.", contrast: "t-pas-encore" },

    { id: "t-pas-encore", text: "pas encore", gloss: "not yet", schema: "clock",
      frame: "Je n'ai ____ fini le travail.", contrast: "t-deja" },

    { id: "t-toujours", text: "toujours", gloss: "always", schema: "repeat",
      frame: "Je prends ____ le petit-déjeuner à huit heures.", contrast: "t-jamais" },

    { id: "t-jamais", text: "jamais", gloss: "never", schema: "repeat",
      frame: "Je ne suis ____ allé là-bas.", contrast: "t-toujours" },

    { id: "t-avant", text: "avant", gloss: "before / used to", schema: "left",
      frame: "____, j'habitais dans une autre ville.", contrast: "t-apres" },

    { id: "t-apres", text: "après", gloss: "afterwards", schema: "right",
      frame: "D'abord il mange, ____ il dort.", contrast: "t-avant" },

    { id: "t-meme-si", text: "même si", gloss: "even if", schema: "fork",
      frame: "Je vais sortir ____ tu es fatigué.", contrast: "t-donc" },

    { id: "t-cependant", text: "cependant", gloss: "however", schema: "balance",
      frame: "C'est cher ; ____, je l'achète.", contrast: "t-en-plus" },

    { id: "t-pendant-que", text: "pendant que", gloss: "while", schema: "parallel",
      frame: "J'étudie ____ j'écoute de la musique.", contrast: null },

    { id: "t-peut-etre", text: "peut-être", gloss: "maybe", schema: "question",
      frame: "____ qu'il viendra demain.", contrast: null },

    { id: "t-en-plus", text: "en plus", gloss: "moreover", schema: "plus",
      frame: "C'est bon marché et, ____, c'est près.", contrast: "t-cependant" },

    { id: "t-donc", text: "donc", gloss: "so / that's why", schema: "chain",
      frame: "Je n'ai pas dormi ; ____ je suis fatigué.", contrast: "t-meme-si" },
    { id: "t-fr-bien-que", text: "bien que", gloss: "although", schema: "fork", frame: "____ il pleuve, je sors.", contrast: null },
    { id: "t-fr-pour-que", text: "pour que", gloss: "so that", schema: "chain", frame: "Je parle lentement ____ tu comprennes.", contrast: null },
    { id: "t-fr-a-condition", text: "à condition que", gloss: "provided that", schema: "fork", frame: "Viens ____ tu préviennes.", contrast: null },
    { id: "t-fr-des-que", text: "dès que", gloss: "as soon as", schema: "clock", frame: "____ il arrive, on part.", contrast: null },
    { id: "t-fr-au-cas-ou", text: "au cas où", gloss: "in case", schema: "fork", frame: "Prends un parapluie ____ il pleuvrait.", contrast: null },
    { id: "t-fr-j-aurais", text: "j'aurais fait", gloss: "I would have done", schema: "chain", frame: "____ autrement, mais je n'ai pas pu.", contrast: null },
    { id: "t-fr-si-j-avais", text: "si j'avais su", gloss: "if I had known", schema: "fork", frame: "____, je serais venu.", contrast: null },
    { id: "t-fr-malgre", text: "malgré", gloss: "despite", schema: "balance", frame: "____ la pluie, nous sortons.", contrast: null },
    { id: "t-fr-en-revanche", text: "en revanche", gloss: "on the other hand", schema: "balance", frame: "C'est cher ; ____, c'est solide.", contrast: null },
    { id: "t-fr-par-contre", text: "par contre", gloss: "by contrast", schema: "balance", frame: "Il est rapide ; ____, il est bavard.", contrast: null },
    { id: "t-fr-en-effet", text: "en effet", gloss: "indeed", schema: "chain", frame: "____, tu as raison.", contrast: null },
]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("fr", "terms", SEMA_TERMS);
}
