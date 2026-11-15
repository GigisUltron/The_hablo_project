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
      id: "tx-it-caffe",
      title: "Il caffè sospeso",
      level: 2,
      band: "A2",
      body: "A Napoli esiste una tradizione semplice e generosa: il caffè sospeso. Al bancone, una persona ordina due caffè ma ne beve solo uno. Paga tutti e due e lascia il secondo per uno sconosciuto. Più tardi, qualcuno entra e chiede: «C'è un caffè sospeso?». Il barista risponde di sì e prepara il caffè senza chiedere nulla. Nessuno sa chi ha offerto il caffè né chi lo riceve. La tradizione è nata negli anni quaranta, quando il caffè costava caro e molte persone non avevano soldi. Oggi continua in diverse città italiane. È un piccolo gesto, ma rende il quartiere più caloroso.",
      questions: [
        {"q": "Che cosa lascia la persona al bar?", "options": ["un caffè per uno sconosciuto", "un biglietto con il suo nome", "un dolce per il barista"], "answer": 0, "why": ["", "il testo dice che nessuno sa chi offre", "non si parla di dolci"]},
        {"q": "Perché è nata questa tradizione?", "options": ["per attirare i turisti", "perché molti non potevano pagarsi un caffè", "per festeggiare il lunedì"], "answer": 1, "why": ["i turisti non sono menzionati", "", "non si parla di una festa"]},
        {"q": "Che cosa non si sa?", "options": ["chi offre e chi riceve il caffè", "quanti caffè si vendono ogni giorno", "come si prepara il caffè"], "answer": 0, "why": ["", "il testo non parla delle vendite giornaliere", "non spiega la ricetta"]},
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
      id: "tx-it-olive",
      title: "La raccolta delle olive",
      level: 3,
      band: "B1",
      body: "Ogni autunno, la mia famiglia torna in campagna per la raccolta delle olive. Partiamo presto, quando l'aria è ancora fresca, e lavoriamo fino a mezzogiorno. Gli alberi non sono alti, ma servono pazienza e buone braccia. Un cesto pieno pesa parecchio, quindi ci fermiamo spesso a bere acqua e a mangiare pane e formaggio. Quest'anno il raccolto è stato inferiore al solito, perché l'estate è stata troppo secca. Nonostante questo, mio nonno non si lamenta: dice che un anno così capita e che la terra ha bisogno di riposare. Alla fine portiamo le olive al frantoio. Il profumo dell'olio nuovo è la parte che mi piace di più.",
      questions: [
        {"q": "Quando parte la famiglia per la raccolta?", "options": ["la sera", "presto, quando l'aria è fresca", "dopo mezzogiorno"], "answer": 1, "why": ["partono presto, non la sera", "", "si fermano a mezzogiorno, non partono allora"]},
        {"q": "Perché il raccolto è minore quest'anno?", "options": ["l'estate è stata troppo secca", "gli alberi erano troppo alti", "la famiglia è arrivata tardi"], "answer": 0, "why": ["", "gli alberi non sono alti", "non si parla di ritardi"]},
        {"q": "Che cosa dice il nonno?", "options": ["che bisogna vendere il campo", "che un anno così può capitare", "che l'olio è troppo caro"], "answer": 1, "why": ["non parla di vendere il campo", "", "non parla del prezzo dell'olio"]},
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
    {
      id: "tx-it-coro",
      title: "Il coro del quartiere",
      level: 4,
      band: "B2",
      body: "Tre anni fa, la vecchia officina di via dei Fiori è diventata una sala prove. Ogni martedì sera, una ventina di persone di età diverse si trova lì per cantare. Non serve saper leggere la musica e nessuno fa un provino: basta voler esserci. Il direttore, un ex insegnante di matematica, sceglie brani semplici e spiega ogni frase prima di provarla. All'inizio il coro era solo un passatempo, ma con il tempo è diventato qualcosa di più. Quando una signora del palazzo accanto è rimasta sola, sono stati i vicini del coro a organizzare le cene. Il direttore dice che non gli interessa il risultato: gli interessa che, alla fine delle prove, le persone escano insieme.",
      questions: [
        {"q": "Che cosa serve per entrare nel coro?", "options": ["voler esserci", "saper leggere la musica", "superare un provino"], "answer": 0, "why": ["", "il testo dice che non serve", "nessuno fa un provino"]},
        {"q": "Che cosa fa il direttore prima di provare un brano?", "options": ["spiega ogni frase", "canta da solo", "riscrive il brano"], "answer": 0, "why": ["", "il testo non dice che canta da solo", "non riscrive i brani, li sceglie"]},
        {"q": "Che cosa è diventato il coro con il tempo?", "options": ["un modo per stare insieme", "un gruppo professionista", "un corso a pagamento"], "answer": 0, "why": ["", "il testo non parla di professionisti", "il testo non parla di denaro"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("it", "texts", SEMA_TEXTS);
}
