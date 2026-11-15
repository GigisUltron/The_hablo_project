/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "une personne", es: "Salut, ça va ?", expects: ["bien", "ça va"], item: "ph-salut", reply: "Bien, merci.", gloss: "Hi, how's it going?", audio: "ph-salut" },
        { speaker: "une personne", es: "Comment tu t'appelles ?", expects: ["je m'appelle", "m'appelle"], item: "ph-ton-nom", reply: "Je m'appelle…", gloss: "What's your name?", audio: "ph-ton-nom" },
        { speaker: "une personne", es: "Tu viens d'où ?", expects: ["je viens de", "viens de"], item: "ph-d-ou-viens", reply: "Je viens de…", gloss: "Where are you from?", audio: "ph-d-ou-viens" },
        { speaker: "une personne", es: "Quelle est ta couleur préférée ?", expects: ["couleur", "préférée"], item: "ph-couleur", reply: "Le bleu.", gloss: "What's your favourite colour?", audio: "ph-couleur" },
        { speaker: "une personne", es: "Qu'est-ce que tu fais le week-end ?", expects: ["je lis", "je me repose", "je travaille"], item: "ph-fr-weekend", reply: "Je lis et je me repose.", gloss: "What do you do at weekends?", audio: "ph-fr-weekend" },
        { speaker: "une personne", es: "Enchanté ! À demain.", expects: [], item: "ph-a-demain", reply: "", gloss: "Nice to meet you! See you tomorrow.", audio: "ph-a-demain" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "serveur", es: "Bonjour, qu'est-ce que je vous sers ?", expects: ["café", "eau"], item: "ph-cafe", reply: "Un café, s'il vous plaît.", gloss: "Hello, what can I get you?", audio: "ph-cafe" },
        { speaker: "serveur", es: "Avec du lait ?", expects: ["lait", "non", "noir"], item: "ph-cafe", reply: "Non, merci.", gloss: "With milk?", audio: "ph-cafe" },
        { speaker: "serveur", es: "Et avec ceci ?", expects: ["non", "rien", "addition"], item: "ph-addition", reply: "Non, merci.", gloss: "Anything else?", audio: "ph-addition" },
        { speaker: "serveur", es: "Ça fait deux euros.", expects: ["carte", "espèces"], item: "ph-par-carte", reply: "Par carte.", gloss: "That's two euros.", audio: "ph-par-carte" },
        { speaker: "serveur", es: "Vous voulez le ticket ?", expects: ["oui", "non"], item: "ph-addition", reply: "Oui, merci.", gloss: "Would you like the receipt?", audio: "ph-addition" },
        { speaker: "serveur", es: "Merci, à bientôt.", expects: [], item: "ph-a-plus-tard", reply: "", gloss: "Thank you, see you soon.", audio: "ph-a-plus-tard" },
      ]
    },
    {
      id: "cv-at-the-station",
      title: "At the station",
      turns: [
        { speaker: "employé", es: "Bonjour, je peux vous aider ?", expects: ["billet", "train"], item: "ph-aller-simple", reply: "Je voudrais un billet.", gloss: "Hello, can I help you?", audio: "ph-aller-simple" },
        { speaker: "employé", es: "Vous allez où ?", expects: ["centre", "ville"], item: "ph-centre-ville", reply: "Au centre-ville.", gloss: "Where are you going?", audio: "ph-centre-ville" },
        { speaker: "employé", es: "Aller simple ou aller-retour ?", expects: ["aller simple", "aller-retour"], item: "ph-aller-simple", reply: "Aller simple.", gloss: "One way or return?", audio: "ph-aller-simple" },
        { speaker: "employé", es: "Il part à huit heures.", expects: ["merci"], item: "ph-heure", reply: "Merci.", gloss: "It leaves at eight.", audio: "ph-heure" },
        { speaker: "employé", es: "Ça fait trois euros.", expects: ["carte", "espèces"], item: "ph-par-carte", reply: "Par carte.", gloss: "That's three euros.", audio: "ph-par-carte" },
        { speaker: "employé", es: "Le quai est le deux.", expects: ["merci"], item: "ph-quai", reply: "Merci.", gloss: "The platform is number two.", audio: "ph-quai" },
      ]
    },
  ];

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").trim();
  }

  function fits(reply, turn) {
    var needs = (turn && turn.expects) || [];
    if (!needs.length) return true;
    var said = fold(reply);
    if (!said) return false;
    return needs.some(function (n) { return said.indexOf(fold(n)) !== -1; });
  }

  function start(id) {
    var d = DIALOGUES.filter(function (x) { return x.id === id; })[0] || DIALOGUES[0];
    return { dialogue: d, turn: 0, misses: 0 };
  }

  var api = { dialogues: DIALOGUES, start: start, fits: fits, fold: fold };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") {
    window.SemaConv = api;
    if (window.SemaLangs) window.SemaLangs.define("fr", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
