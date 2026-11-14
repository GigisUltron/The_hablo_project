/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "bir kişi", es: "Merhaba! Nasılsınız?", expects: ["iyiyim", "merhaba"], item: "ph-tr-hello", reply: "İyiyim, teşekkürler.", gloss: "Hello! How are you?", audio: "ph-tr-hello" },
        { speaker: "bir kişi", es: "Adınız ne?", expects: ["adım"], item: "ph-tr-my-name-is", reply: "Benim adım…", gloss: "What's your name?", audio: "ph-tr-my-name-is" },
        { speaker: "bir kişi", es: "Nerelisiniz?", expects: ["liyim", "den", "dan"], item: "ph-tr-where-from", reply: "Ben…liyim.", gloss: "Where are you from?", audio: "ph-tr-where-from" },
        { speaker: "bir kişi", es: "En sevdiğiniz renk ne?", expects: ["renk", "mavi"], item: "ph-tr-colour", reply: "En sevdiğim renk mavi.", gloss: "What's your favourite colour?", audio: "ph-tr-colour" },
        { speaker: "bir kişi", es: "İngilizce konuşuyor musunuz?", expects: ["evet", "hayır"], item: "ph-tr-speak-english", reply: "Evet, biraz.", gloss: "Do you speak English?", audio: "ph-tr-speak-english" },
        { speaker: "bir kişi", es: "Yarın görüşürüz.", expects: [], item: "ph-tr-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-tr-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("tr", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
