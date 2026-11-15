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
      id: "tx-nl-repaircafe",
      title: "Het repaircafé",
      level: 2,
      band: "A2",
      body: "Elke eerste zaterdag van de maand is er een repaircafé in het buurthuis. Mensen brengen kapotte spullen mee: een broodrooster, een lamp of een oud strijkijzer. Vrijwilligers proberen het samen met hen te maken. Je betaalt alleen voor nieuwe onderdelen, en soms is dat maar twee euro. Ik kwam met een broodrooster die niet meer warm werd. Een man liet me zien hoe ik het snoer moest controleren. Na een half uur werkte het apparaat weer. We dronken koffie en hij zei: «Volgende keer neem je iets moeilijks mee.»",
      questions: [
        {"q": "Wat kun je naar het repaircafé brengen?", "options": ["kapotte spullen", "een kop koffie", "alleen lampen"], "answer": 0, "why": ["", "koffie drink je daar, die breng je niet mee", "lampen zijn maar een voorbeeld"]},
        {"q": "Wat kost een reparatie?", "options": ["alleen de nieuwe onderdelen", "altijd tien euro", "helemaal niets"], "answer": 0, "why": ["", "de tekst noemt twee euro als voorbeeld", "je betaalt wel voor onderdelen"]},
        {"q": "Wat gebeurt er met de broodrooster?", "options": ["hij werkt weer na een half uur", "hij wordt weggegooid", "de vrijwilliger neemt hem mee"], "answer": 0, "why": ["", "het apparaat werkt weer", "de vrijwilliger helpt alleen"]},
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
    {
      id: "tx-nl-buurtmoestuin",
      title: "De buurtmoestuin",
      level: 3,
      band: "B1",
      body: "Op een leeg stuk grond achter de school ligt sinds vorig jaar de buurtmoestuin. Vijfentwintig gezinnen hebben er een klein vak waar ze groenten en kruiden kweken. De grond is van de gemeente, maar de buurt zorgt zelf voor water, gereedschap en afspraken. In het voorjaar delen ze zaadjes en in de zomer ruilen ze courgettes, tomaten en bonen. Wie geen tijd heeft, kan hulp vragen aan een buur. Er is wel een wachtlijst: nieuwe tuinders moeten soms een seizoen wachten. Ik heb zelf geen vak, maar ik kom elke week om te helpen met water geven. Zo leer ik de mensen in mijn straat pas echt kennen.",
      questions: [
        {"q": "Wie zorgen voor de tuin?", "options": ["de buurt zelf", "alleen de gemeente", "de school"], "answer": 0, "why": ["", "de gemeente bezit de grond, maar onderhoudt de tuin niet", "de tuin ligt achter de school, maar de school beheert hem niet"]},
        {"q": "Wat doen de tuinders met de oogst?", "options": ["ze delen en ruilen groenten", "ze verkopen alles op de markt", "ze geven alles aan de gemeente"], "answer": 0, "why": ["", "over verkoop zegt de tekst niets", "de gemeente krijgt niets"]},
        {"q": "Waarom komt de verteller elke week?", "options": ["om te helpen met water geven", "omdat hij een eigen vak heeft", "om nieuwe zaden te kopen"], "answer": 0, "why": ["", "hij heeft juist geen eigen vak", "zaden worden gedeeld, niet verkocht"]},
      ]
    },
    {
      "id": "tx-nl-buurt",
      "title": "De markt op zaterdag",
      "level": 3,
      "band": "B1",
      "body": "Op zaterdag ga ik vroeg naar de markt. De bakker verkoopt vers brood en de groenteman roept zijn prijzen. Ik koop appels, kaas en bloemen voor mijn moeder. Bij de viskraam staat een lange rij, dus ik wacht even. Een oude man vertelt mij dat de markt al vijftig jaar bestaat. Vroeger kwam hij hier met zijn vader; nu komt hij met zijn kleinzoon. Ik luister en vergeet de tijd. Als ik thuiskom, ruikt de keuken naar koffie. Mijn moeder lacht om de bloemen en zegt dat ik te veel heb gekocht.",
      "questions": [
        {
          "q": "Wat koopt de ik?",
          "options": [
            "appels, kaas en bloemen",
            "brood en vis",
            "koffie en taart"
          ],
          "answer": 0,
          "why": [
            "",
            "brood en vis worden genoemd, maar niet gekocht",
            "koffie ruikt in de keuken, maar wordt niet gekocht"
          ]
        },
        {
          "q": "Hoe lang bestaat de markt?",
          "options": [
            "vijftig jaar",
            "tien jaar",
            "honderd jaar"
          ],
          "answer": 0,
          "why": [
            "",
            "dat zegt de oude man niet",
            "dat zegt de oude man niet"
          ]
        },
        {
          "q": "Met wie komt de oude man nu naar de markt?",
          "options": [
            "met zijn kleinzoon",
            "met zijn vader",
            "met zijn broer"
          ],
          "answer": 0,
          "why": [
            "",
            "vroeger kwam hij met zijn vader",
            "een broer wordt niet genoemd"
          ]
        }
      ]
    },
    {
      "id": "tx-nl-vrijwilliger",
      "title": "Vrijwilligerswerk",
      "level": 4,
      "band": "B2",
      "body": "Toen ik met pensioen ging, had ik plotseling veel tijd. Na een paar maanden besloot ik vrijwilliger te worden in een buurtcentrum. Ik help daar met koken en lees voor aan kinderen. In het begin vond ik het spannend: ik was geen leraar en mijn Nederlands was niet perfect. Maar de kinderen luisterden geduldig en de andere vrijwilligers hielpen mij. Nu kom ik drie keer per week en ken ik bijna iedereen. Ik verdien geen geld, maar ik krijg iets beters: verhalen, gezelschap en het gevoel dat ik nodig ben.",
      "questions": [
        {
          "q": "Wanneer besloot hij vrijwilliger te worden?",
          "options": [
            "na zijn pensionering",
            "na school",
            "na een vakantie"
          ],
          "answer": 0,
          "why": [
            "",
            "school wordt niet genoemd",
            "een vakantie wordt niet genoemd"
          ]
        },
        {
          "q": "Wat doet hij daar?",
          "options": [
            "koken en voorlezen",
            "lesgeven",
            "tuinieren"
          ],
          "answer": 0,
          "why": [
            "",
            "hij is geen leraar",
            "tuinieren wordt niet genoemd"
          ]
        },
        {
          "q": "Wat krijgt hij?",
          "options": [
            "verhalen en gezelschap",
            "geld",
            "een diploma"
          ],
          "answer": 0,
          "why": [
            "",
            "hij verdient geen geld",
            "een diploma wordt niet genoemd"
          ]
        }
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("nl", "texts", SEMA_TEXTS);
}
