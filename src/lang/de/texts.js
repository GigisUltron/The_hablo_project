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
      id: "tx-de-fahrradwerkstatt",
      title: "Die Fahrradwerkstatt",
      level: 2,
      band: "A2",
      body: "Seit einem Monat ist die Werkstatt in der alten Garage am Bahnhof geöffnet. Jeden Donnerstag kommen Leute mit kaputten Fahrrädern. Freiwillige zeigen ihnen, wie sie die Kette wechseln oder das Licht reparieren. Man braucht keinen Termin und bezahlt nur die Ersatzteile. Ich kam mit einem platten Reifen. Eine Frau zeigte mir, wie ich den Schlauch finde und flicken kann. Nach einer Stunde fuhr mein Rad wieder. Zum Schluss fragte sie: «Bringst du nächste Woche einen Kuchen mit?» Seitdem helfe ich manchmal mit.",
      questions: [
        {"q": "Was kann man in der Werkstatt machen?", "options": ["Fahrräder reparieren", "Fahrräder kaufen", "Kuchen backen"], "answer": 0, "why": ["", "dort werden Räder repariert, nicht verkauft", "der Kuchen ist nur eine freundliche Bitte"]},
        {"q": "Was kostet die Hilfe?", "options": ["nur die Ersatzteile", "zehn Euro pro Stunde", "einen Kuchen pro Woche"], "answer": 0, "why": ["", "der Text nennt keinen Stundenpreis", "der Kuchen ist freiwillig und kein Preis"]},
        {"q": "Warum hilft der Erzähler jetzt manchmal mit?", "options": ["weil er etwas gelernt hat", "weil er Geld verdienen möchte", "weil sein Fahrrad noch kaputt ist"], "answer": 0, "why": ["", "von Geld ist nicht die Rede", "sein Fahrrad fuhr nach einer Stunde wieder"]},
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
    {
      id: "tx-de-buecherschrank",
      title: "Der Bücherschrank",
      level: 3,
      band: "B1",
      body: "Am Rand unseres Platzes steht seit zwei Jahren ein Bücherschrank. Jeder darf Bücher hineinstellen und mitnehmen, ohne etwas zu bezahlen. Am Anfang war er eine Idee von drei Nachbarn; heute kümmern sich mehr als zwanzig Menschen darum. Einmal pro Woche räumt jemand die Regale auf und entfernt alte Zeitschriften. Manchmal findet man Reiseführer, manchmal Romane, und im Winter liegen dort auch Handschuhe. Wer ein Buch behalten will, kann es einfach mitnehmen. Nur eines ist verboten: den Schrank als Mülleimer zu benutzen. Ein Schild im Inneren erklärt die Regel. Für mich ist der Schrank ein guter Ort, um neue Autoren zu entdecken.",
      questions: [
        {"q": "Wie funktioniert der Bücherschrank?", "options": ["man nimmt Bücher mit oder stellt welche hinein", "man leiht Bücher gegen eine Gebühr", "man muss sich vorher anmelden"], "answer": 0, "why": ["", "der Text sagt, dass man nichts bezahlt", "eine Anmeldung wird nicht verlangt"]},
        {"q": "Wie viele Menschen kümmern sich heute um den Schrank?", "options": ["mehr als zwanzig", "genau drei", "niemand"], "answer": 0, "why": ["", "drei Nachbarn hatten nur die Idee", "der Text sagt, dass sich viele darum kümmern"]},
        {"q": "Was ist im Bücherschrank verboten?", "options": ["Müll hineinwerfen", "Bücher mitnehmen", "Reiseführer hineinstellen"], "answer": 0, "why": ["", "Bücher mitnehmen ist ausdrücklich erlaubt", "Reiseführer werden als Beispiel genannt"]},
      ]
    },
    {
      "id": "tx-de-bahnhof",
      "title": "Am Bahnhof",
      "level": 3,
      "band": "B1",
      "body": "Ich stehe früh am Bahnhof und warte auf den Zug nach Hamburg. Der Bahnsteig ist noch ruhig. Eine Frau fragt mich, ob der Zug Verspätung hat. Ich schaue auf die Anzeige: zehn Minuten. Wir sprechen über das Wetter und darüber, warum sie ihre Schwester besucht. Als der Zug endlich kommt, steigen wir ein und setzen uns gegenüber. Sie liest ein Buch; ich schaue aus dem Fenster. Die Landschaft wird grüner, und die Felder leuchten in der Morgensonne. Manchmal beginnt eine Reise mit einer kleinen Frage.",
      "questions": [
        {
          "q": "Wohin fährt der Zug?",
          "options": [
            "nach Hamburg",
            "nach Berlin",
            "nach München"
          ],
          "answer": 0,
          "why": [
            "",
            "Berlin wird nicht genannt",
            "München wird nicht genannt"
          ]
        },
        {
          "q": "Wie viel Verspätung hat der Zug?",
          "options": [
            "zehn Minuten",
            "eine Stunde",
            "keine"
          ],
          "answer": 0,
          "why": [
            "",
            "die Anzeige zeigt zehn Minuten",
            "der Zug kommt später als geplant"
          ]
        },
        {
          "q": "Was macht die Frau im Zug?",
          "options": [
            "sie liest ein Buch",
            "sie schläft",
            "sie telefoniert"
          ],
          "answer": 0,
          "why": [
            "",
            "das steht nicht im Text",
            "das steht nicht im Text"
          ]
        }
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("de", "texts", SEMA_TEXTS);
}
