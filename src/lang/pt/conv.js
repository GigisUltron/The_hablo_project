/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "uma pessoa", es: "Olá! Como está?", expects: ["bem", "olá"], item: "ph-pt-hello", reply: "Bem, obrigado.", gloss: "Hello! How are you?", audio: "ph-pt-hello" },
        { speaker: "uma pessoa", es: "Como se chama?", expects: ["chamo", "nome"], item: "ph-pt-my-name-is", reply: "Chamo-me…", gloss: "What's your name?", audio: "ph-pt-my-name-is" },
        { speaker: "uma pessoa", es: "De onde é?", expects: ["sou de", "de"], item: "ph-pt-where-from", reply: "Sou de…", gloss: "Where are you from?", audio: "ph-pt-where-from" },
        { speaker: "uma pessoa", es: "Qual é a sua cor preferida?", expects: ["cor", "azul"], item: "ph-pt-colour", reply: "A minha cor preferida é o azul.", gloss: "What's your favourite colour?", audio: "ph-pt-colour" },
        { speaker: "uma pessoa", es: "Fala inglês?", expects: ["sim", "não"], item: "ph-pt-speak-english", reply: "Sim, um pouco.", gloss: "Do you speak English?", audio: "ph-pt-speak-english" },
        { speaker: "uma pessoa", es: "Até amanhã.", expects: [], item: "ph-pt-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-pt-see-you" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "empregado", es: "Boa tarde! O que deseja?", expects: ["café"], item: "ph-pt-coffee", reply: "Um café, por favor.", gloss: "Good afternoon! What would you like?", audio: "ph-pt-coffee" },
        { speaker: "empregado", es: "Mais alguma coisa?", expects: ["conta", "não"], item: "ph-pt-bill", reply: "Não, obrigado. A conta, por favor.", gloss: "Anything else?", audio: "ph-pt-bill" },
        { speaker: "empregado", es: "São três euros.", expects: ["obrigado"], item: "ph-pt-thank-you", reply: "Obrigado, aqui está.", gloss: "That's three euros.", audio: "ph-pt-thank-you" },
        { speaker: "empregado", es: "Quer também água?", expects: ["água", "não"], item: "ph-pt-water", reply: "Água, por favor.", gloss: "Would you like water too?", audio: "ph-pt-water" },
        { speaker: "empregado", es: "Aqui está o seu café.", expects: ["obrigad"], item: "ph-pt-thank-you", reply: "Obrigado.", gloss: "Here is your coffee.", audio: "ph-pt-thank-you" },
        { speaker: "empregado", es: "Até logo!", expects: ["até logo", "adeus"], item: "ph-pt-goodbye", reply: "Até logo!", gloss: "Goodbye!", audio: "ph-pt-goodbye" },
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
    if (window.SemaLangs) window.SemaLangs.define("pt", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
