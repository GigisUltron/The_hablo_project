/* A simulated conversation partner.
 *
 * Not a language model: a small responder that tracks which topics have been
 * covered and chooses the next one. It keeps its side of a first-meeting chat
 * for a dozen turns, and says something honest when it does not understand.
 */
(function (root) {
  var TOPICS = [
    { id: "greet", ask: "¡Hola! ¿Qué tal?", accept: ["bien", "mal", "asi asi", "regular", "genial"], after: "Me alegro." },
    { id: "name", ask: "¿Cómo te llamas?", accept: ["me llamo", "soy "], after: "Encantado." },
    { id: "origin", ask: "¿De dónde eres?", accept: ["soy de", "vivo en"], after: "Qué bien." },
    { id: "color", ask: "¿Cuál es tu color favorito?", accept: ["color", "azul", "rojo", "verde", "negro", "blanco"], after: "Buen gusto." },
    { id: "work", ask: "¿A qué te dedicas?", accept: ["trabajo", "estudio", "soy "], after: "Suena interesante." },
    { id: "bye", ask: "¡Nos vemos! Hasta luego.", accept: [], after: "" }
  ];

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function start() { return { turn: 0, misses: 0, topics: TOPICS.map(function (t) { return t.id; }) }; }

  /* One reply from the partner, given what the learner just said. */
  function respond(chat, text) {
    var topic = TOPICS[chat.turn];
    if (!topic) return { reply: "¡Hasta pronto!", done: true };

    var said = fold(text);
    if (!said) { chat.misses += 1; return { reply: "No he entendido. " + topic.ask, done: false, retry: true }; }

    var fits = !topic.accept.length || topic.accept.some(function (a) { return said.indexOf(fold(a)) !== -1; });
    if (!fits) {
      chat.misses += 1;
      return { reply: "No te he entendido. " + topic.ask, done: false, retry: true };
    }

    chat.turn += 1;
    var next = TOPICS[chat.turn];
    return {
      reply: topic.after,
      next: next ? next.ask : null,
      done: !next,
      topic: topic.id
    };
  }

  var api = { topics: TOPICS, start: start, respond: respond, fold: fold };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaChat = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
