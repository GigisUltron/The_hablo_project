/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "человек", es: "Здравствуйте! Как вы поживаете?", expects: ["хорошо", "здравствуйте"], item: "ph-ru-hello", reply: "Хорошо, спасибо.", gloss: "Hello! How are you?", audio: "ph-ru-hello" },
        { speaker: "человек", es: "Как вас зовут?", expects: ["зовут"], item: "ph-ru-my-name-is", reply: "Меня зовут…", gloss: "What's your name?", audio: "ph-ru-my-name-is" },
        { speaker: "человек", es: "Откуда вы?", expects: ["из", "откуда"], item: "ph-ru-where-from", reply: "Я из…", gloss: "Where are you from?", audio: "ph-ru-where-from" },
        { speaker: "человек", es: "Какой у вас любимый цвет?", expects: ["цвет", "синий"], item: "ph-ru-colour", reply: "Мой любимый цвет — синий.", gloss: "What's your favourite colour?", audio: "ph-ru-colour" },
        { speaker: "человек", es: "Вы говорите по-английски?", expects: ["да", "нет"], item: "ph-ru-speak-english", reply: "Да, немного.", gloss: "Do you speak English?", audio: "ph-ru-speak-english" },
        { speaker: "человек", es: "До завтра.", expects: [], item: "ph-ru-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-ru-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("ru", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
