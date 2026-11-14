/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "een persoon", es: "Hallo! Hoe gaat het?", expects: ["goed", "hallo"], item: "ph-nl-hello", reply: "Goed, dank je.", gloss: "Hello! How are you?", audio: "ph-nl-hello" },
        { speaker: "een persoon", es: "Hoe heet je?", expects: ["heet", "naam"], item: "ph-nl-my-name-is", reply: "Ik heet…", gloss: "What's your name?", audio: "ph-nl-my-name-is" },
        { speaker: "een persoon", es: "Waar kom je vandaan?", expects: ["kom uit", "uit"], item: "ph-nl-where-from", reply: "Ik kom uit…", gloss: "Where are you from?", audio: "ph-nl-where-from" },
        { speaker: "een persoon", es: "Wat is je lievelingskleur?", expects: ["kleur", "blauw"], item: "ph-nl-colour", reply: "Mijn lievelingskleur is blauw.", gloss: "What's your favourite colour?", audio: "ph-nl-colour" },
        { speaker: "een persoon", es: "Spreek je Engels?", expects: ["ja", "nee"], item: "ph-nl-speak-english", reply: "Ja, een beetje.", gloss: "Do you speak English?", audio: "ph-nl-speak-english" },
        { speaker: "een persoon", es: "Tot morgen.", expects: [], item: "ph-nl-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-nl-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("nl", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
