/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "una persona", es: "¡Hola! ¿Qué tal?", expects: ["bien", "genial", "asi asi"], item: "ph-hola", reply: "Bien, gracias.", gloss: "Hi! How's it going?", audio: "ph-hola" },
        { speaker: "una persona", es: "¿Cómo te llamas?", expects: ["me llamo"], item: "ph-tu-nombre", reply: "Me llamo…", gloss: "What's your name?", audio: "ph-tu-nombre" },
        { speaker: "una persona", es: "¿De dónde eres?", expects: ["soy de"], item: "ph-de-donde", reply: "Soy de…", gloss: "Where are you from?", audio: "ph-de-donde" },
        { speaker: "una persona", es: "¿Cuál es tu color favorito?", expects: ["color favorito", "mi color"], item: "ph-color", reply: "Mi color favorito es el azul.", gloss: "What's your favourite colour?", audio: "ph-color" },
        { speaker: "una persona", es: "¿Qué haces los fines de semana?", expects: ["descanso", "leo", "trabajo"], item: "ph-es-weekend", reply: "Descanso y leo.", gloss: "What do you do at weekends?", audio: "ph-es-weekend" },
        { speaker: "una persona", es: "¡Encantado! Nos vemos mañana.", expects: [], item: "ph-nos-vemos", reply: "", gloss: "Nice to meet you! See you tomorrow.", audio: "ph-nos-vemos" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "camarero", es: "Buenas tardes. ¿Qué le pongo?", expects: ["café", "agua"], item: "ph-cafe", reply: "Un café, por favor.", gloss: "Good afternoon. What can I get you?", audio: "ph-cafe" },
        { speaker: "camarero", es: "¿Con leche?", expects: ["leche", "solo", "sin"], item: "ph-cafe", reply: "Solo, por favor.", gloss: "With milk?", audio: "ph-cafe" },
        { speaker: "camarero", es: "¿Algo más?", expects: ["no", "nada", "cuenta"], item: "ph-cuenta", reply: "No, gracias.", gloss: "Anything else?", audio: "ph-cuenta" },
        { speaker: "camarero", es: "Son dos euros.", expects: ["ecco", "efectivo", "tarjeta"], item: "ph-tarjeta", reply: "Con tarjeta.", gloss: "That's two euros.", audio: "ph-tarjeta" },
        { speaker: "camarero", es: "¿Quiere el recibo?", expects: ["sí", "no"], item: "ph-cuenta", reply: "Sí, gracias.", gloss: "Would you like the receipt?", audio: "ph-cuenta" },
        { speaker: "camarero", es: "Gracias, hasta luego.", expects: [], item: "ph-adios", reply: "", gloss: "Thank you, see you later.", audio: "ph-adios" },
      ]
    },
    {
      id: "cv-at-the-station",
      title: "At the station",
      turns: [
        { speaker: "empleado", es: "Buenos días, ¿en qué puedo ayudarle?", expects: ["billete", "tren"], item: "ph-billete", reply: "Quiero un billete.", gloss: "Good morning, how can I help?", audio: "ph-billete" },
        { speaker: "empleado", es: "¿A dónde va?", expects: ["centro", "ciudad"], item: "ph-centro", reply: "Al centro.", gloss: "Where are you going?", audio: "ph-centro" },
        { speaker: "empleado", es: "¿Ida o ida y vuelta?", expects: ["ida", "vuelta"], item: "ph-billete", reply: "Solo ida.", gloss: "One way or return?", audio: "ph-billete" },
        { speaker: "empleado", es: "¿A qué hora sale?", expects: ["ocho", "nueve"], item: "ph-hora", reply: "A las ocho.", gloss: "What time does it leave?", audio: "ph-hora" },
        { speaker: "empleado", es: "Son tres euros.", expects: ["ecco", "tarjeta"], item: "ph-tarjeta", reply: "Ecco.", gloss: "That's three euros.", audio: "ph-tarjeta" },
        { speaker: "empleado", es: "El andén es el dos.", expects: ["gracias"], item: "ph-anden", reply: "Gracias.", gloss: "The platform is number two.", audio: "ph-anden" },
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
    if (window.SemaLangs) window.SemaLangs.define("es", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
