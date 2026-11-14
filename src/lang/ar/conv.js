/* Conversations — Arabic. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "مرحباً! كيف حالك؟", expects: ["بخير", "مرحبا"], reply: "بخير، شكراً." },
        { es: "ما اسمك؟", expects: ["اسمي"], reply: "اسمي…" },
        { es: "من أين أنت؟", expects: ["من"], reply: "أنا من…" },
        { es: "تشرفت بلقائك. أراك غداً.", expects: [], reply: "" },
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
    if (window.SemaLangs) window.SemaLangs.define("ar", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
