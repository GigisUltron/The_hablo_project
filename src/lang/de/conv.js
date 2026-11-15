/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "eine Person", es: "Hallo! Wie geht es dir?", expects: ["gut", "hallo"], item: "ph-de-hello", reply: "Gut, danke.", gloss: "Hello! How are you?", audio: "ph-de-hello" },
        { speaker: "eine Person", es: "Wie heißt du?", expects: ["heiße", "name"], item: "ph-de-my-name-is", reply: "Ich heiße…", gloss: "What's your name?", audio: "ph-de-my-name-is" },
        { speaker: "eine Person", es: "Woher kommst du?", expects: ["komme aus", "aus"], item: "ph-de-where-from", reply: "Ich komme aus…", gloss: "Where are you from?", audio: "ph-de-where-from" },
        { speaker: "eine Person", es: "Was ist deine Lieblingsfarbe?", expects: ["farbe", "blau"], item: "ph-de-colour", reply: "Meine Lieblingsfarbe ist Blau.", gloss: "What's your favourite colour?", audio: "ph-de-colour" },
        { speaker: "eine Person", es: "Sprichst du Englisch?", expects: ["ja", "nein"], item: "ph-de-speak-english", reply: "Ja, ein wenig.", gloss: "Do you speak English?", audio: "ph-de-speak-english" },
        { speaker: "eine Person", es: "Bis morgen.", expects: [], item: "ph-de-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-de-see-you" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "Kellner", es: "Guten Tag! Was möchten Sie?", expects: ["kaffee"], item: "ph-de-coffee", reply: "Einen Kaffee, bitte.", gloss: "Good afternoon! What would you like?", audio: "ph-de-coffee" },
        { speaker: "Kellner", es: "Sonst noch etwas?", expects: ["rechnung", "nein"], item: "ph-de-bill", reply: "Nein, danke. Die Rechnung, bitte.", gloss: "Anything else?", audio: "ph-de-bill" },
        { speaker: "Kellner", es: "Das macht drei Euro.", expects: ["danke"], item: "ph-de-thank-you", reply: "Danke, hier bitte.", gloss: "That's three euros.", audio: "ph-de-thank-you" },
        { speaker: "Kellner", es: "Möchten Sie noch Wasser?", expects: ["wasser", "nein"], item: "ph-de-water", reply: "Wasser, bitte.", gloss: "Would you like water too?", audio: "ph-de-water" },
        { speaker: "Kellner", es: "Hier ist Ihr Kaffee.", expects: ["danke"], item: "ph-de-thank-you", reply: "Danke.", gloss: "Here is your coffee.", audio: "ph-de-thank-you" },
        { speaker: "Kellner", es: "Auf Wiedersehen!", expects: ["wiedersehen", "tschüss"], item: "ph-de-goodbye", reply: "Auf Wiedersehen!", gloss: "Goodbye!", audio: "ph-de-goodbye" },
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
    if (window.SemaLangs) window.SemaLangs.define("de", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
