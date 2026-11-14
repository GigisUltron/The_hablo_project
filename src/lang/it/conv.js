/* Conversations — the shape a tutor actually teaches in. */
(function (root) {
  var DIALOGUES = [
    {
      id: "cv-first-meeting",
      title: "First meeting",
      turns: [
        { speaker: "una persona", es: "Ciao, come va?", expects: ["bene", "così così"], item: "ph-it-hola", reply: "Bene, grazie.", gloss: "Hi, how's it going?", audio: "ph-it-hola" },
        { speaker: "una persona", es: "Come ti chiami?", expects: ["mi chiamo"], item: "ph-it-tu-nombre", reply: "Mi chiamo…", gloss: "What's your name?", audio: "ph-it-tu-nombre" },
        { speaker: "una persona", es: "Di dove sei?", expects: ["sono di", "di"], item: "ph-it-de-donde", reply: "Sono di…", gloss: "Where are you from?", audio: "ph-it-de-donde" },
        { speaker: "una persona", es: "Qual è il tuo colore preferito?", expects: ["colore", "preferito"], item: "ph-it-color", reply: "Il blu.", gloss: "What's your favourite colour?", audio: "ph-it-color" },
        { speaker: "una persona", es: "Cosa fai nel fine settimana?", expects: ["leggo", "mi riposo", "lavoro"], item: "ph-it-weekend", reply: "Leggo e mi riposo.", gloss: "What do you do at weekends?", audio: "ph-it-weekend" },
        { speaker: "una persona", es: "Piacere! A domani.", expects: [], item: "ph-it-nos-vemos", reply: "", gloss: "Nice to meet you! See you tomorrow.", audio: "ph-it-nos-vemos" },
      ]
    },
    {
      id: "cv-at-the-cafe",
      title: "At the café",
      turns: [
        { speaker: "barista", es: "Buongiorno, cosa prende?", expects: ["caffè", "acqua"], item: "ph-it-cafe", reply: "Un caffè, per favore.", gloss: "Good morning, what can I get you?", audio: "ph-it-cafe" },
        { speaker: "barista", es: "Con latte?", expects: ["latte", "solo", "senza"], item: "ph-it-cafe", reply: "Solo, per favore.", gloss: "With milk?", audio: "ph-it-cafe" },
        { speaker: "barista", es: "Qualcosa da mangiare?", expects: ["no", "niente", "cornetto"], item: "ph-it-cuenta", reply: "No, grazie.", gloss: "Something to eat?", audio: "ph-it-cuenta" },
        { speaker: "barista", es: "Sono due euro.", expects: ["carta", "contanti"], item: "ph-it-tarjeta", reply: "Con la carta.", gloss: "That's two euros.", audio: "ph-it-tarjeta" },
        { speaker: "barista", es: "Vuole lo scontrino?", expects: ["sì", "no"], item: "ph-it-cuenta", reply: "Sì, grazie.", gloss: "Would you like the receipt?", audio: "ph-it-cuenta" },
        { speaker: "barista", es: "Grazie, arrivederci.", expects: [], item: "ph-it-adios", reply: "", gloss: "Thank you, goodbye.", audio: "ph-it-adios" },
      ]
    },
    {
      id: "cv-at-the-station",
      title: "At the station",
      turns: [
        { speaker: "impiegato", es: "Buongiorno, come posso aiutarla?", expects: ["biglietto", "treno"], item: "ph-it-billete", reply: "Vorrei un biglietto.", gloss: "Good morning, how can I help?", audio: "ph-it-billete" },
        { speaker: "impiegato", es: "Dove va?", expects: ["centro", "città"], item: "ph-it-centro", reply: "In centro.", gloss: "Where are you going?", audio: "ph-it-centro" },
        { speaker: "impiegato", es: "Solo andata o andata e ritorno?", expects: ["solo andata", "andata e ritorno"], item: "ph-it-billete", reply: "Solo andata.", gloss: "One way or return?", audio: "ph-it-billete" },
        { speaker: "impiegato", es: "A che ora parte?", expects: ["otto", "nove"], item: "ph-it-hora", reply: "Alle otto.", gloss: "What time does it leave?", audio: "ph-it-hora" },
        { speaker: "impiegato", es: "Sono tre euro.", expects: ["carta", "contanti"], item: "ph-it-tarjeta", reply: "Con la carta.", gloss: "That's three euros.", audio: "ph-it-tarjeta" },
        { speaker: "impiegato", es: "Il binario è il due.", expects: ["grazie"], item: "ph-it-anden", reply: "Grazie.", gloss: "The platform is number two.", audio: "ph-it-anden" },
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
    if (window.SemaLangs) window.SemaLangs.define("it", "conv", api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
