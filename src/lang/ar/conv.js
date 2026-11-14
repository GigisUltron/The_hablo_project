/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "شخص", es: "مرحباً! كيف حالك؟", expects: ["بخير", "مرحبا"], item: "ph-ar-hello", reply: "بخير، شكراً.", gloss: "Hello! How are you?", audio: "ph-ar-hello" },
        { speaker: "شخص", es: "ما اسمك؟", expects: ["اسمي"], item: "ph-ar-my-name-is", reply: "اسمي…", gloss: "What's your name?", audio: "ph-ar-my-name-is" },
        { speaker: "شخص", es: "من أين أنت؟", expects: ["من"], item: "ph-ar-where-from", reply: "أنا من…", gloss: "Where are you from?", audio: "ph-ar-where-from" },
        { speaker: "شخص", es: "ما لونك المفضل؟", expects: ["لون", "أزرق"], item: "ph-ar-colour", reply: "لوني المفضل هو الأزرق.", gloss: "What's your favourite colour?", audio: "ph-ar-colour" },
        { speaker: "شخص", es: "هل تتحدث الإنجليزية؟", expects: ["نعم", "لا"], item: "ph-ar-speak-english", reply: "نعم، قليلاً.", gloss: "Do you speak English?", audio: "ph-ar-speak-english" },
        { speaker: "شخص", es: "أراك غداً.", expects: [], item: "ph-ar-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-ar-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("ar", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
