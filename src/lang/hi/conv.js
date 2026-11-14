/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "एक व्यक्ति", es: "नमस्ते! आप कैसे हैं?", expects: ["ठीक", "नमस्ते"], item: "ph-hi-hello", reply: "मैं ठीक हूँ, धन्यवाद।", gloss: "Hello! How are you?", audio: "ph-hi-hello" },
        { speaker: "एक व्यक्ति", es: "आपका नाम क्या है?", expects: ["नाम"], item: "ph-hi-my-name-is", reply: "मेरा नाम… है।", gloss: "What's your name?", audio: "ph-hi-my-name-is" },
        { speaker: "एक व्यक्ति", es: "आप कहाँ से हैं?", expects: ["से"], item: "ph-hi-where-from", reply: "मैं… से हूँ।", gloss: "Where are you from?", audio: "ph-hi-where-from" },
        { speaker: "एक व्यक्ति", es: "आपका पसंदीदा रंग कौन सा है?", expects: ["रंग", "नीला"], item: "ph-hi-colour", reply: "मेरा पसंदीदा रंग नीला है।", gloss: "What's your favourite colour?", audio: "ph-hi-colour" },
        { speaker: "एक व्यक्ति", es: "क्या आप अंग्रेज़ी बोलते हैं?", expects: ["हाँ", "नहीं"], item: "ph-hi-speak-english", reply: "हाँ, थोड़ा।", gloss: "Do you speak English?", audio: "ph-hi-speak-english" },
        { speaker: "एक व्यक्ति", es: "कल मिलते हैं।", expects: [], item: "ph-hi-see-you", reply: "", gloss: "See you tomorrow.", audio: "ph-hi-see-you" },
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
    if (window.SemaLangs) window.SemaLangs.define("hi", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
