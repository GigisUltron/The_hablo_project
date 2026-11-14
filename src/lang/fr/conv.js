/* Conversations — the shape a tutor actually teaches in.
 *
 * Each turn is a line in French and what a fitting reply must contain. The
 * judgement is "does the reply carry the expected element", not "does it match
 * a string", so "je m'appelle Anne" and "je m'appelle Paul" both pass.
 */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "Bonjour ! Comment ça va ?", expects: ["bien", "ça va"], item: "ph-salut", reply: "Bien, merci." },
        { es: "Comment tu t'appelles ?", expects: ["je m'appelle", "m'appelle"], item: "ph-ton-nom", reply: "Je m'appelle…" },
        { es: "Tu viens d'où ?", expects: ["je viens de", "viens de"], item: "ph-d-ou-viens", reply: "Je viens de…" },
        { es: "Enchanté. À demain.", expects: [], item: "ph-a-demain", reply: "" }
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the cafe",
      turns: [
        { es: "Bonjour. Qu'est-ce que je vous sers ?", expects: ["café", "thé", "eau"], reply: "Un café, s'il vous plaît." },
        { es: "Avec du lait ?", expects: ["lait", "non", "noir"], reply: "Non, merci." },
        { es: "Et avec ceci ?", expects: ["non", "rien", "addition"], reply: "Non, merci." },
        { es: "Ça fait trois euros. Vous payez comment ?", expects: ["carte", "espèces"], reply: "Par carte." }
      ]
    }
  ];

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
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
