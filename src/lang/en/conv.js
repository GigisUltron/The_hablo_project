/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "a person", es: "Hi! How's it going?", expects: ["good", "fine", "not bad"], item: "ph-en-greetings-1", reply: "Good, thanks.", gloss: "Hi! How's it going?", audio: "ph-en-greetings-1" },
        { speaker: "a person", es: "What's your name?", expects: ["my name", "i'm called"], item: "ph-en-introductions-1", reply: "My name is…", gloss: "What's your name?", audio: "ph-en-introductions-1" },
        { speaker: "a person", es: "Where are you from?", expects: ["from"], item: "ph-en-where-from", reply: "I'm from…", gloss: "Where are you from?", audio: "ph-en-where-from" },
        { speaker: "a person", es: "What's your favourite colour?", expects: ["colour", "color", "favourite"], item: "ph-en-colour", reply: "Blue.", gloss: "What's your favourite colour?", audio: "ph-en-colour" },
        { speaker: "a person", es: "What do you do at weekends?", expects: ["read", "rest", "work"], item: "ph-en-plans-1", reply: "I read and rest.", gloss: "What do you do at weekends?", audio: "ph-en-plans-1" },
        { speaker: "a person", es: "Nice to meet you! See you tomorrow.", expects: [], item: "ph-en-greetings-4", reply: "", gloss: "Nice to meet you! See you tomorrow.", audio: "ph-en-greetings-4" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "server", es: "Good afternoon. What can I get you?", expects: ["coffee", "water", "tea"], item: "ph-en-café-1", reply: "A coffee, please.", gloss: "Good afternoon. What can I get you?", audio: "ph-en-café-1" },
        { speaker: "server", es: "With milk?", expects: ["milk", "black", "no"], item: "ph-en-café-1", reply: "Black, please.", gloss: "With milk?", audio: "ph-en-café-1" },
        { speaker: "server", es: "Anything else?", expects: ["no", "nothing", "bill"], item: "ph-en-restaurant-2", reply: "No, thanks.", gloss: "Anything else?", audio: "ph-en-restaurant-2" },
        { speaker: "server", es: "That's two pounds.", expects: ["card", "cash"], item: "ph-en-shopping-1", reply: "By card.", gloss: "That's two pounds.", audio: "ph-en-shopping-1" },
        { speaker: "server", es: "Would you like the receipt?", expects: ["yes", "no"], item: "ph-en-restaurant-2", reply: "Yes, please.", gloss: "Would you like the receipt?", audio: "ph-en-restaurant-2" },
        { speaker: "server", es: "Thank you, see you soon.", expects: [], item: "ph-en-greetings-4", reply: "", gloss: "Thank you, see you soon.", audio: "ph-en-greetings-4" },
      ]
    },
    {
      id: "cv-at-the-station",
      title: "At the station",
      turns: [
        { speaker: "clerk", es: "Good morning, how can I help?", expects: ["ticket", "train"], item: "ph-en-tickets-1", reply: "I'd like a ticket.", gloss: "Good morning, how can I help?", audio: "ph-en-tickets-1" },
        { speaker: "clerk", es: "Where are you going?", expects: ["centre", "city"], item: "ph-en-directions-1", reply: "To the centre.", gloss: "Where are you going?", audio: "ph-en-directions-1" },
        { speaker: "clerk", es: "One way or return?", expects: ["one way", "return"], item: "ph-en-tickets-1", reply: "One way, please.", gloss: "One way or return?", audio: "ph-en-tickets-1" },
        { speaker: "clerk", es: "The train leaves at eight.", expects: ["thanks", "thank you"], item: "ph-en-tickets-3", reply: "Thanks.", gloss: "The train leaves at eight.", audio: "ph-en-tickets-3" },
        { speaker: "clerk", es: "That's three pounds.", expects: ["card", "cash"], item: "ph-en-money-4", reply: "By card.", gloss: "That's three pounds.", audio: "ph-en-money-4" },
        { speaker: "clerk", es: "The platform is number two.", expects: ["thanks", "thank you"], item: "ph-en-station-1", reply: "Thanks.", gloss: "The platform is number two.", audio: "ph-en-station-1" },
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
    if (window.SemaLangs) window.SemaLangs.define("en", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
