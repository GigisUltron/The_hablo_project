/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "一个人", es: "你好！你好吗？", expects: ["好", "你好"], item: "ph-zh-hello", reply: "我很好，谢谢。", gloss: "Hello! How are you?", audio: null },
        { speaker: "一个人", es: "你叫什么名字？", expects: ["叫"], item: "ph-zh-my-name-is", reply: "我叫…", gloss: "What's your name?", audio: null },
        { speaker: "一个人", es: "你是哪里人？", expects: ["从"], item: "ph-zh-where-from", reply: "我是…人。", gloss: "Where are you from?", audio: null },
        { speaker: "一个人", es: "你最喜欢什么颜色？", expects: ["颜色", "蓝"], item: "ph-zh-colour", reply: "我最喜欢的颜色是蓝色。", gloss: "What's your favourite colour?", audio: null },
        { speaker: "一个人", es: "你会说英语吗？", expects: ["会", "不会"], item: "ph-zh-speak-english", reply: "会一点。", gloss: "Do you speak English?", audio: null },
        { speaker: "一个人", es: "明天见。", expects: [], item: "ph-zh-see-you", reply: "", gloss: "See you tomorrow.", audio: null },
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
    if (window.SemaLangs) window.SemaLangs.define("zh", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
