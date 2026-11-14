/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-de-markt",
      title: "Der Samstagsmarkt",
      level: 1,
      band: "A1",
      body: "Am Samstagmorgen öffnet der Markt im Viertel um sieben Uhr. Meine Mutter kauft Brot, Obst und Kaffee. Ich kaufe Wasser und nehme einen Apfel für das Frühstück mit. Der Mann am Stand lächelt und sagt: «Guten Morgen». Wir bezahlen und gehen zu Fuß nach Hause. Zu Hause trinken wir zusammen Kaffee. Danach lese ich und meine Mutter arbeitet im Garten. Am Abend kommen die Nachbarn zurück auf den Markt, trinken etwas und reden über die Woche, bis die Stände schließen.",
      questions: [
        {"q": "Was kauft die Mutter?", "options": ["Brot, Obst und Kaffee", "Wasser und einen Apfel", "Blumen und Milch"], "answer": 0, "why": ["", "das kauft der Erzähler", "Blumen und Milch kommen im Text nicht vor"]},
        {"q": "Wie kommen sie nach Hause?", "options": ["mit dem Bus", "zu Fuß", "mit dem Auto"], "answer": 1, "why": ["der Text sagt, sie gehen zu Fuß", "", "von einem Auto ist nicht die Rede"]},
        {"q": "Wann öffnet der Markt?", "options": ["um sieben", "um neun", "um zwölf"], "answer": 0, "why": ["", "der Text sagt sieben", "der Text nennt keine zwölf"]},
      ]
    },
    {
      id: "tx-de-zug",
      title: "Der Zug um sechs",
      level: 2,
      band: "A2",
      body: "Der Zug um sechs Uhr fährt vom Hauptbahnhof ab. An diesem Morgen kam ich eine Minute zu spät: Die Türen waren schon geschlossen. Ich lief den Bahnsteig entlang, aber der Zug setzte sich in Bewegung. Ein Angestellter sagte, ich solle auf den nächsten warten. Ich trank einen Kaffee und sah den Reisenden zu. Der nächste Zug kam um acht. Ich stieg ein, fand einen Platz am Fenster und atmete durch. Die Verspätung kostete mich eine Stunde, aber sie schenkte mir ein Buch und einen Kaffee.",
      questions: [
        {"q": "Warum verpasste der Erzähler den Zug?", "options": ["er kam eine Minute zu spät", "der Zug fuhr früher ab", "er stand am falschen Bahnsteig"], "answer": 0, "why": ["", "der Text sagt nicht, dass er früher fuhr", "er lief am richtigen Bahnsteig"]},
        {"q": "Was machte er beim Warten?", "options": ["er trank Kaffee und sah den Reisenden zu", "er ging nach Hause", "er rief bei der Arbeit an"], "answer": 0, "why": ["", "er blieb am Bahnhof", "der Text erwähnt keinen Anruf"]},
        {"q": "Wie fühlt er sich am Ende?", "options": ["wütend auf den Angestellten", "erleichtert trotz der Verspätung", "ungeduldig weiterzufahren"], "answer": 1, "why": ["er kritisiert den Angestellten nicht", "", "er hat sich gerade hingesetzt und durchgeatmet"]},
      ]
    },
    {
      id: "tx-de-baeckerei",
      title: "Die Bäckerei, die schloss",
      level: 3,
      band: "B1",
      body: "Die Bäckerei an der Ecke hat im Frühling geschlossen. Die Besitzerin wollte in Rente gehen, und niemand übernahm das Geschäft. Seitdem sind die Morgen ruhiger: Man muss bis zum Supermarkt gehen, wo das Brot schlechter und die Schlangen länger sind. Die Nachbarn reden davon, einen Laden zu eröffnen, aber die Miete ist zu hoch. Letzte Woche kam jedoch eine junge Frau. Sie sah sich das Schaufenster an, machte Fotos und fragte nach der Miete. Niemand weiß, ob sie wiederkommt. Noch bleibt die Bäckerei geschlossen, und alle hoffen.",
      questions: [
        {"q": "Warum schloss die Bäckerei?", "options": ["die Besitzerin ging in Rente", "das Brot war schlecht", "die Miete war zu niedrig"], "answer": 0, "why": ["", "das Brot war gut", "der Text nennt eine hohe Miete"]},
        {"q": "Was machen die Nachbarn jetzt?", "options": ["sie gehen zum Supermarkt", "sie backen selbst Brot", "sie haben einen Laden eröffnet"], "answer": 0, "why": ["", "das steht nicht im Text", "sie reden nur darüber"]},
        {"q": "Was deutet der Besuch der jungen Frau an?", "options": ["vielleicht will sie den Laden übernehmen", "sie ist die neue Bäckerin", "sie will die Fotos kaufen"], "answer": 0, "why": ["", "niemand weiß, ob sie zurückkommt", "sie fotografierte das Schaufenster"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("de", "texts", SEMA_TEXTS);
}
