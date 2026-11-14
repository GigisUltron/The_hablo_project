/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "相手", es: "こんにちは！お元気ですか。", expects: ["元気", "はい"], item: "ph-ja-hello", reply: "元気です。", gloss: "Hello! How are you?", audio: "ph-ja-hello" },
        { speaker: "相手", es: "お名前は何ですか。", expects: ["名前"], item: "ph-ja-my-name-is", reply: "私の名前は…です。", gloss: "What's your name?", audio: "ph-ja-my-name-is" },
        { speaker: "相手", es: "ご出身はどちらですか。", expects: ["から"], item: "ph-ja-where-from", reply: "…から来ました。", gloss: "Where are you from?", audio: "ph-ja-where-from" },
        { speaker: "相手", es: "好きな色は何ですか。", expects: ["色", "青"], item: "ph-ja-colour", reply: "好きな色は青です。", gloss: "What's your favourite colour?", audio: "ph-ja-colour" },
        { speaker: "相手", es: "英語を話せますか。", expects: ["はい", "いいえ"], item: "ph-ja-speak-english", reply: "はい、少し。", gloss: "Do you speak English?", audio: "ph-ja-speak-english" },
        { speaker: "相手", es: "また明日。", expects: [], item: "ph-ja-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-ja-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("ja", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
