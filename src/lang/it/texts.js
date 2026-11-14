/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-it-mercato",
      title: "Il mercato del sabato",
      level: 1,
      band: "A1",
      body: "Il sabato mattina il mercato del quartiere apre alle sette. Mia madre compra pane, frutta e caffè. Io compro acqua e prendo una mela per colazione. Il signore del banco sorride e dice: «Buongiorno». Paghiamo e torniamo a casa a piedi. A casa beviamo il caffè insieme. Poi io leggo e mia madre lavora in giardino. La sera, i vicini tornano al mercato per un bicchiere e parlano del quartiere fino a tardi, seduti sulle panchine vicino alla fontana. Il quartiere è cambiato, ma il mercato resta lo stesso.",
      questions: [
        {"q": "Che cosa compra la madre?", "options": ["pane, frutta e caffè", "acqua e una mela", "fiori e latte"], "answer": 0, "why": ["", "quello lo compra il narratore", "i fiori e il latte non sono nel testo"]},
        {"q": "Come tornano a casa?", "options": ["in autobus", "a piedi", "in macchina"], "answer": 1, "why": ["il testo dice a piedi", "", "il testo non parla di macchina"]},
        {"q": "Chi torna la sera?", "options": ["i vicini", "i turisti", "i bambini"], "answer": 0, "why": ["", "i turisti non sono nel testo", "i bambini non sono nel testo"]},
      ]
    },
    {
      id: "tx-it-treno",
      title: "Il treno delle sei",
      level: 2,
      band: "A2",
      body: "Alle sei del mattino il treno parte dalla stazione centrale. Quel giorno sono arrivato un minuto troppo tardi: le porte erano già chiuse. Ho corso sul binario, ma il treno ha iniziato a muoversi. Un impiegato mi ha detto di aspettare il prossimo. Ho bevuto un caffè e ho guardato i viaggiatori. Il treno successivo è arrivato alle otto. Sono salito, ho trovato un posto vicino al finestrino e ho respirato. Il ritardo mi è costato un'ora, ma mi ha regalato un libro e un caffè.",
      questions: [
        {"q": "Perché il narratore ha perso il treno?", "options": ["è arrivato un minuto troppo tardi", "il treno è partito in anticipo", "ha sbagliato binario"], "answer": 0, "why": ["", "il testo non dice che è partito prima", "era sul binario giusto"]},
        {"q": "Che cosa ha fatto mentre aspettava?", "options": ["ha bevuto un caffè e guardato i viaggiatori", "è tornato a casa", "ha chiamato il lavoro"], "answer": 0, "why": ["", "è rimasto in stazione", "il testo non parla di telefonate"]},
        {"q": "Come si sente alla fine?", "options": ["arrabbiato con l'impiegato", "sollevato nonostante il ritardo", "ansioso di ripartire"], "answer": 1, "why": ["non critica l'impiegato", "", "si è appena seduto e ha respirato"]},
      ]
    },
    {
      id: "tx-it-forno",
      title: "Il forno chiuso",
      level: 3,
      band: "B1",
      body: "Il forno del quartiere ha chiuso in primavera. La proprietaria voleva andare in pensione e nessuno ha ripreso l'attività. Da allora le mattine sono più tristi: bisogna andare fino al supermercato, dove il pane è meno buono e le file sono più lunghe. I vicini parlano di aprire un negozio, ma il locale costa troppo. La settimana scorsa, però, è arrivata una giovane donna. Ha guardato la vetrina, ha fatto delle foto e ha chiesto il prezzo dell'affitto. Nessuno sa ancora se tornerà. Intanto il forno resta chiuso, e tutti sperano.",
      questions: [
        {"q": "Perché il forno ha chiuso?", "options": ["la proprietaria andava in pensione", "il pane era cattivo", "l'affitto era troppo basso"], "answer": 0, "why": ["", "il pane era buono", "il testo parla del costo del locale, non di un affitto basso"]},
        {"q": "Che cosa fanno ora gli abitanti?", "options": ["vanno al supermercato", "fanno il pane in casa", "hanno aperto un negozio"], "answer": 0, "why": ["", "non è detto", "ne parlano soltanto"]},
        {"q": "Che cosa suggerisce la visita della giovane donna?", "options": ["forse vuole riprendere il locale", "è la nuova fornaia", "vuole comprare le foto"], "answer": 0, "why": ["", "nessuno sa se tornerà", "ha fatto foto della vetrina"]},
      ]
    },
    {
      id: "tx-it-scatola",
      title: "La scatola del trasloco",
      level: 4,
      band: "B2",
      body: "La scatola era rimasta nel corridoio per tre settimane. Nessuno sapeva a chi appartenesse. Era chiusa con nastro adesivo e aveva un'etichetta illeggibile. Un giorno la vicina del piano di sotto ha chiesto se poteva aprirla. Dentro c'erano dei libri, una foto di mare e una lettera senza destinatario. La lettera diceva: «Se trovi questa scatola, tieni i libri e dimentica il resto.» La vicina ha tenuto i libri. Non ha mai saputo chi avesse scritto la lettera, ma da allora legge un po' ogni sera.",
      questions: [
        {"q": "A chi apparteneva la scatola?", "options": ["non si sa", "alla vicina del piano di sotto", "al vecchio inquilino"], "answer": 0, "why": ["", "è lei che la apre", "il testo non fa il suo nome"]},
        {"q": "Che cosa ha tenuto la vicina?", "options": ["i libri", "la lettera", "la foto"], "answer": 0, "why": ["", "la lettera non viene menzionata dopo", "la foto non viene menzionata dopo"]},
        {"q": "Che cosa suggerisce «dimentica il resto»?", "options": ["che il resto contava meno", "che bisognava buttare tutto", "che la lettera era falsa"], "answer": 0, "why": ["", "i libri sono tenuti, non tutto", "nulla dice che sia falsa"]},
      ]
    },
    {
      id: "tx-it-silenzio",
      title: "Quello che dice il silenzio",
      level: 4,
      band: "C1",
      body: "Si dice spesso che i quartieri cambiano quando gli abitanti se ne vanno. Ma cambiano anche quando gli abitanti restano e le abitudini si trasformano. Nel mio palazzo vivono le stesse persone da vent'anni. Eppure le cene sui balconi sono sparite, le porte si chiudono prima e i corridoi sono silenziosi. Nessuno si è lamentato. Il silenzio non è una partenza: è un altro modo di restare. A volte incontro un vicino sulle scale e parliamo della pioggia. Del resto non sappiamo più cosa dirci. Il quartiere non ha perso i suoi abitanti; ha perso le occasioni di parlarsi.",
      questions: [
        {"q": "Che cosa intende con «il silenzio non è una partenza»?", "options": ["gli abitanti sono rimasti ma si parlano meno", "tutti sono andati via", "la notte è più tranquilla"], "answer": 0, "why": ["", "dice che sono rimasti", "parla di conversazioni, non di rumore notturno"]},
        {"q": "Qual è il tono del testo?", "options": ["nostalgico e lucido", "allegro e leggero", "aggressivo"], "answer": 0, "why": ["", "constata una perdita, senza allegria", "non attacca nessuno"]},
        {"q": "Che cosa rimpiange soprattutto l'autore?", "options": ["le cene sui balconi", "le occasioni di parlarsi", "il prezzo degli appartamenti"], "answer": 1, "why": ["le cene sono un esempio", "", "il prezzo non è menzionato"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("it", "texts", SEMA_TEXTS);
}
