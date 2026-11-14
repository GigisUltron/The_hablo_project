/* Conversations — the shape a tutor actually teaches in.
 *
 * Each turn is a line in Spanish and what a fitting reply must contain. The
 * judgement is "does the reply carry the expected element", not "does it match
 * a string", so "me llamo Ana" and "me llamo Pedro" both pass.
 */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "¡Hola! ¿Qué tal?", expects: ["bien", "genial", "asi asi"], item: "ph-hola", reply: "Bien, gracias." },
        { es: "¿Cómo te llamas?", expects: ["me llamo"], item: "ph-tu-nombre", reply: "Me llamo…" },
        { es: "¿De dónde eres?", expects: ["soy de"], item: "ph-de-donde", reply: "Soy de…" },
        { es: "¿Cuál es tu color favorito?", expects: ["color favorito", "mi color"], item: "ph-color", reply: "Mi color favorito es el azul." },
        { es: "¡Encantado! Nos vemos mañana.", expects: [], item: "ph-nos-vemos", reply: "" }
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the cafe",
      turns: [
        { es: "Buenas tardes. ¿Qué le pongo?", expects: ["cafe", "café", "agua"], reply: "Un café, por favor." },
        { es: "¿Con leche?", expects: ["leche", "solo", "sin"], reply: "Solo, por favor." },
        { es: "¿Algo más?", expects: ["no", "nada", "cuenta"], reply: "No, gracias." },
        { es: "Son dos euros. ¿Efectivo o tarjeta?" , expects: ["tarjeta", "efectivo"], reply: "Con tarjeta." }
      ]
    }
  ];

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  /* Does this reply fit the turn? Any expected phrase present is enough. */
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
