/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-nl-markt",
      title: "De zaterdagmarkt",
      level: 1,
      band: "A1",
      body: "Op zaterdagochtend opent de markt in de buurt om zeven uur. Mijn moeder koopt brood, fruit en koffie. Ik koop water en neem een appel mee voor het ontbijt. De man aan de kraam lacht en zegt: «Goedemorgen». We betalen en lopen naar huis. Thuis drinken we samen koffie. Daarna lees ik en mijn moeder werkt in de tuin. 's Avonds komen de buren terug naar de markt, drinken iets en praten over de week tot de kraampjes sluiten. De markt blijft de plek waar iedereen elkaar ziet.",
      questions: [
        {"q": "Wat koopt de moeder?", "options": ["brood, fruit en koffie", "water en een appel", "bloemen en melk"], "answer": 0, "why": ["", "dat koopt de verteller", "bloemen en melk staan niet in de tekst"]},
        {"q": "Hoe gaan ze naar huis?", "options": ["met de bus", "te voet", "met de auto"], "answer": 1, "why": ["de tekst zegt dat ze lopen", "", "een auto wordt niet genoemd"]},
        {"q": "Hoe laat opent de markt?", "options": ["om zeven uur", "om negen uur", "om twaalf uur"], "answer": 0, "why": ["", "de tekst zegt zeven uur", "de tekst noemt geen twaalf uur"]},
      ]
    },
    {
      id: "tx-nl-trein",
      title: "De trein van zes uur",
      level: 2,
      band: "A2",
      body: "De trein van zes uur vertrekt van het centraal station. Die ochtend kwam ik een minuut te laat: de deuren waren al dicht. Ik rende langs het perron, maar de trein begon te rijden. Een medewerker zei dat ik op de volgende moest wachten. Ik dronk koffie en keek naar de reizigers. De volgende trein kwam om acht uur. Ik stapte in, vond een plek bij het raam en haalde adem. De vertraging kostte me een uur, maar gaf me een boek en een kop koffie.",
      questions: [
        {"q": "Waarom miste de verteller de trein?", "options": ["hij kwam een minuut te laat", "de trein vertrok eerder", "hij stond op het verkeerde perron"], "answer": 0, "why": ["", "de tekst zegt niet dat hij eerder vertrok", "hij rende op het juiste perron"]},
        {"q": "Wat deed hij tijdens het wachten?", "options": ["hij dronk koffie en keek naar reizigers", "hij ging naar huis", "hij belde zijn werk"], "answer": 0, "why": ["", "hij bleef op het station", "de tekst noemt geen telefoontje"]},
        {"q": "Hoe voelt hij zich aan het eind?", "options": ["boos op de medewerker", "opgelucht ondanks de vertraging", "ongeduldig om te vertrekken"], "answer": 1, "why": ["hij bekritiseert de medewerker niet", "", "hij is net gaan zitten en heeft geademd"]},
      ]
    },
    {
      id: "tx-nl-bakkerij",
      title: "De bakkerij die sloot",
      level: 3,
      band: "B1",
      body: "De bakkerij op de hoek is in het voorjaar gesloten. De eigenares wilde met pensioen en niemand nam de zaak over. Sindsdien zijn de ochtenden stiller: mensen moeten naar de supermarkt lopen, waar het brood slechter is en de rijen langer. De buren praten over een winkel beginnen, maar de huur is te hoog. Vorige week kwam er echter een jonge vrouw. Ze bekeek de etalage, maakte foto's en vroeg naar de huur. Niemand weet of ze terugkomt. Voorlopig blijft de bakkerij dicht, en iedereen hoopt.",
      questions: [
        {"q": "Waarom sloot de bakkerij?", "options": ["de eigenares ging met pensioen", "het brood was slecht", "de huur was te laag"], "answer": 0, "why": ["", "het brood was goed", "de tekst noemt een hoge huur"]},
        {"q": "Wat doen de buurtbewoners nu?", "options": ["ze gaan naar de supermarkt", "ze bakken zelf brood", "ze hebben een winkel geopend"], "answer": 0, "why": ["", "dat staat niet in de tekst", "ze praten er alleen over"]},
        {"q": "Wat suggereert het bezoek van de jonge vrouw?", "options": ["misschien wil ze de zaak overnemen", "ze is de nieuwe bakker", "ze wil de foto's kopen"], "answer": 0, "why": ["", "niemand weet of ze terugkomt", "ze fotografeerde de etalage"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("nl", "texts", SEMA_TEXTS);
}
