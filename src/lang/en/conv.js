/* Conversations — English, for a learner whose first language is not English. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "Hi! How's it going?", expects: ["good", "fine", "not bad"], item: "ph-en-greetings-1", reply: "Good, thanks." },
        { es: "What's your name?", expects: ["my name", "i'm called"], item: "ph-en-introductions-1", reply: "My name is…" },
        { es: "Where are you from?", expects: ["from"], item: "ph-en-introductions-4", reply: "I'm from…" },
        { es: "Nice to meet you. See you tomorrow.", expects: [], item: "ph-en-greetings-4", reply: "" }
      ]
    }
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
    if (window.SemaLangs) window.SemaLangs.define("en", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
