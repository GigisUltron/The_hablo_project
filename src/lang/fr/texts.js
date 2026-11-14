/* A first reading for French: short, concrete, and answerable from the text. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-fr-cafe",
      title: "Le café du coin",
      level: 2,
      body: "Le café du coin ouvre à sept heures. La patronne, Mme Rocher, connaît tous ses clients par leur prénom. Le matin, les ouvriers prennent un café debout au comptoir ; l'après-midi, les étudiants s'installent près de la fenêtre pour travailler. Depuis janvier, le café propose aussi des tartines le midi. Ça marche bien : à midi, il n'y a plus de place.",
      questions: [
        { q: "Pourquoi le café marche mieux ?", options: ["il a ouvert plus tôt", "il sert à manger le midi", "il est plus grand"], answer: 1, why: ["il ouvre à sept heures depuis toujours", "", "le texte ne parle pas de la taille"] },
        { q: "Qui travaille près de la fenêtre ?", options: ["les ouvriers", "les étudiants", "Mme Rocher"], answer: 1, why: ["les ouvriers sont au comptoir le matin", "", "elle est la patronne"] }
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("fr", "texts", SEMA_TEXTS);
}
