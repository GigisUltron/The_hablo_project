/* Terms — it vocabulary that cannot be drawn. */
var SEMA_TERMS = {
  terms: [
    { id: "t-it-already", text: "già", gloss: "already", schema: "clock",
      frame: "Ho ____ finito il lavoro.", contrast: "t-it-not-yet" },
    { id: "t-it-not-yet", text: "non ancora", gloss: "not yet", schema: "clock",
      frame: "____ ho finito il lavoro.", contrast: "t-it-already" },
    { id: "t-it-always", text: "sempre", gloss: "always", schema: "repeat",
      frame: "____ bevo caffè la mattina.", contrast: "t-it-never" },
    { id: "t-it-never", text: "mai", gloss: "never", schema: "repeat",
      frame: "Non sono ____ andato là.", contrast: "t-it-always" },
    { id: "t-it-before", text: "prima", gloss: "before", schema: "left",
      frame: "____ vivevo in un'altra città.", contrast: "t-it-after" },
    { id: "t-it-after", text: "dopo", gloss: "afterwards", schema: "right",
      frame: "Prima mangia e ____ dorme.", contrast: "t-it-before" },
    { id: "t-it-maybe", text: "forse", gloss: "maybe", schema: "question",
      frame: "____ verrà domani.", contrast: null },
    { id: "t-it-however", text: "tuttavia", gloss: "however", schema: "balance",
      frame: "È caro; ____, lo compro.", contrast: null },
    { id: "t-it-benche", text: "benché", gloss: "although", schema: "fork",
      frame: "____ piova, esco.", contrast: null },
    { id: "t-it-affinche", text: "affinché", gloss: "so that", schema: "chain",
      frame: "Parlo lentamente ____ tu capisca.", contrast: null },
    { id: "t-it-purche", text: "purché", gloss: "provided that", schema: "fork",
      frame: "Vengo ____ tu ci sia.", contrast: null },
    { id: "t-it-appena", text: "appena", gloss: "as soon as", schema: "clock",
      frame: "____ arriva, partiamo.", contrast: null },
    { id: "t-it-nel-caso", text: "nel caso in cui", gloss: "in case", schema: "question",
      frame: "Prendi l'ombrello ____ piova.", contrast: null },
    { id: "t-it-avrei-fatto", text: "avrei fatto", gloss: "I would have done", schema: "chain",
      frame: "____ diversamente, ma non ho potuto.", contrast: null },
    { id: "t-it-se-avessi", text: "se avessi saputo", gloss: "if I had known", schema: "fork",
      frame: "____, sarei venuto.", contrast: null },
    { id: "t-it-nonostante", text: "nonostante", gloss: "despite", schema: "balance",
      frame: "____ la pioggia, usciamo.", contrast: null },
    { id: "t-it-invece", text: "invece", gloss: "instead", schema: "balance",
      frame: "Non bevo caffè; bevo tè ____.", contrast: null },
    { id: "t-it-inoltre", text: "inoltre", gloss: "moreover", schema: "plus",
      frame: "È economico e, ____, è vicino.", contrast: null },
    { id: "t-it-quindi", text: "quindi", gloss: "therefore", schema: "chain",
      frame: "Non ho dormito; ____ sono stanco.", contrast: null },
    { id: "t-it-mentre", text: "mentre", gloss: "while", schema: "parallel",
      frame: "Studio ____ ascolto musica.", contrast: null },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("it", "terms", SEMA_TERMS);
}
