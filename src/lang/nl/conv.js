/* Conversations — Dutch. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "Hallo! Hoe gaat het?", expects: ["goed", "hallo"], reply: "Goed, dank je." },
        { es: "Hoe heet je?", expects: ["heet", "naam"], reply: "Ik heet…" },
        { es: "Waar kom je vandaan?", expects: ["kom uit", "uit"], reply: "Ik kom uit…" },
        { es: "Aangenaam. Tot morgen.", expects: [], reply: "" },
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
    if (window.SemaLangs) window.SemaLangs.define("nl", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
