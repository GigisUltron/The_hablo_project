/* Conversations — Hindi. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { es: "नमस्ते! आप कैसे हैं?", expects: ["ठीक", "अच्छा"], reply: "मैं ठीक हूँ, धन्यवाद।" },
        { es: "आपका नाम क्या है?", expects: ["नाम"], reply: "मेरा नाम… है।" },
        { es: "आप कहाँ से हैं?", expects: ["से"], reply: "मैं… से हूँ।" },
        { es: "आपसे मिलकर खुशी हुई। कल मिलते हैं।", expects: [], reply: "" },
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
    if (window.SemaLangs) window.SemaLangs.define("hi", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
