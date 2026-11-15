/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-fr-cafe",
      title: "Le café du coin",
      level: 1,
      band: "A1",
      body: "Le café du coin ouvre à sept heures. La patronne, Mme Rocher, connaît tous ses clients par leur prénom. Le matin, les ouvriers prennent un café debout au comptoir ; l'après-midi, les étudiants s'installent près de la fenêtre pour travailler. Depuis janvier, le café propose aussi des tartines le midi. Ça marche bien : à midi, il n'y a plus de place. Le soir, les habitués reviennent pour un verre, et ils parlent du quartier jusqu’à la fermeture. Le quartier a changé, mais le café reste le même.",
      questions: [
        {"q": "Pourquoi le café marche mieux ?", "options": ["il a ouvert plus tôt", "il sert à manger le midi", "il est plus grand"], "answer": 1, "why": ["il ouvre à sept heures depuis toujours", "", "le texte ne parle pas de la taille"]},
        {"q": "Qui travaille près de la fenêtre ?", "options": ["les ouvriers", "les étudiants", "Mme Rocher"], "answer": 1, "why": ["les ouvriers sont au comptoir le matin", "", "elle est la patronne"]},
        {"q": "Qui vient le soir ?", "options": ["les habitués", "les ouvriers", "les étudiants"], "answer": 0, "why": ["", "les ouvriers viennent le matin", "les étudiants viennent l'après-midi"]},
      ]
    },
    {
      id: "tx-fr-train",
      title: "Le train de six heures",
      level: 2,
      band: "A2",
      body: "Le train de six heures partait de la gare du Nord. Ce matin-là, je suis arrivé une minute trop tard : les portes étaient déjà fermées. J'ai couru sur le quai, mais le train a commencé à bouger. Un employé m'a dit d'attendre le suivant. J'ai bu un café et j'ai regardé les voyageurs. Le train suivant est arrivé à huit heures. Je suis monté, j'ai trouvé une place près de la fenêtre et j'ai enfin respiré. Le retard m'a coûté une heure, mais il m'a offert un livre et un café.",
      questions: [
        {"q": "Pourquoi le narrateur a-t-il raté le train ?", "options": ["il est arrivé une minute trop tard", "le train est parti en avance", "il a pris le mauvais quai"], "answer": 0, "why": ["", "le texte ne dit pas qu'il est parti en avance", "il a couru sur le bon quai"]},
        {"q": "Qu'a-t-il fait en attendant ?", "options": ["il a pris un café et regardé les voyageurs", "il est rentré chez lui", "il a téléphoné à son travail"], "answer": 0, "why": ["", "il est resté à la gare", "le texte ne parle pas de téléphone"]},
        {"q": "Comment se sent-il à la fin ?", "options": ["furieux contre l'employé", "soulagé malgré le retard", "pressé de repartir"], "answer": 1, "why": ["il ne critique pas l'employé", "", "il vient de s'asseoir et de respirer"]},
      ]
    },
    {
      id: "tx-fr-brocante",
      title: "La brocante du dimanche",
      level: 2,
      band: "A2",
      body: "Chaque premier dimanche du mois, la place du village accueille une brocante. Dès sept heures, les exposants installent leurs tables et sortent de vieux objets : des assiettes, des lampes, des livres et parfois des meubles. Ma voisine y va toujours à la recherche de tasses anciennes. Moi, je préfère regarder les disques et les cartes postales. On peut marchander un peu, mais il faut rester poli. À midi, les cafés sont pleins et les enfants mangent des frites. Vers quinze heures, les exposants commencent à ranger. On repart souvent avec un petit objet inutile, mais on a passé une bonne matinée.",
      questions: [
        {"q": "Quand a lieu la brocante ?", "options": ["le premier samedi du mois", "chaque dimanche", "le premier dimanche du mois"], "answer": 2, "why": ["c'est le premier dimanche, pas le samedi", "ce n'est pas chaque dimanche, seulement le premier du mois", ""]},
        {"q": "Que cherche la voisine ?", "options": ["des tasses anciennes", "des disques", "des meubles"], "answer": 0, "why": ["", "le narrateur regarde les disques", "le texte mentionne des meubles, mais elle cherche des tasses"]},
        {"q": "Que font les enfants à midi ?", "options": ["ils rangent les stands", "ils mangent des frites", "ils marchandent"], "answer": 1, "why": ["les exposants rangent vers quinze heures", "", "ce sont les clients qui marchandent"]},
      ]
    },
    {
      id: "tx-fr-boulangerie",
      title: "La boulangerie fermée",
      level: 3,
      band: "B1",
      body: "La boulangerie du coin a fermé au printemps. La patronne voulait prendre sa retraite, et personne n'a repris le commerce. Depuis, le matin est plus triste : on doit aller jusqu'au supermarché, où le pain est moins bon et les files plus longues. Les voisins parlent d'ouvrir une épicerie, mais le local est cher. Pourtant, une jeune femme est venue la semaine dernière. Elle a regardé la vitrine, a pris des photos et a demandé le prix du loyer. Personne ne sait encore si elle va revenir. En attendant, la boulangerie reste fermée, et chacun espère.",
      questions: [
        {"q": "Pourquoi la boulangerie a-t-elle fermé ?", "options": ["la patronne partait à la retraite", "le pain était mauvais", "le loyer était trop bas"], "answer": 0, "why": ["", "le pain était bon, au contraire", "le texte parle du prix du local, pas d'un loyer bas"]},
        {"q": "Que font les habitants maintenant ?", "options": ["ils vont au supermarché", "ils font leur pain eux-mêmes", "ils ont ouvert une épicerie"], "answer": 0, "why": ["", "le texte ne le dit pas", "ils en parlent seulement"]},
        {"q": "Que peut-on déduire de la visite de la jeune femme ?", "options": ["elle cherche peut-être à reprendre le local", "elle est la nouvelle boulangère", "elle veut acheter des photos"], "answer": 0, "why": ["", "personne ne sait si elle reviendra", "elle prend des photos de la vitrine"]},
      ]
    },
    {
      id: "tx-fr-cinema",
      title: "Le cinéma sauvé",
      level: 3,
      band: "B1",
      body: "Le cinéma du quartier devait fermer l'année dernière. Le propriétaire, fatigué, n'arrivait plus à payer les factures et voulait vendre le bâtiment. Les habitants ont alors créé une association pour le sauver. Ils ont organisé une soirée de soutien, vendu des gâteaux et demandé une aide à la mairie. Grâce à cet argent, ils ont pu réparer la salle et changer les fauteuils. Aujourd'hui, le cinéma propose un film différent chaque semaine, souvent en version originale. Les séances du mercredi attirent surtout les familles, tandis que celles du vendredi rassemblent les étudiants. Le propriétaire, lui, dit qu'il ne regrette rien : il a retrouvé le plaisir de voir les gens entrer dans sa salle.",
      questions: [
        {"q": "Pourquoi le cinéma allait-il fermer ?", "options": ["le propriétaire voulait vendre", "la salle était trop petite", "les films étaient trop chers"], "answer": 0, "why": ["", "le texte ne parle pas de la taille", "le prix des places n'est pas mentionné"]},
        {"q": "Comment les habitants ont-ils aidé ?", "options": ["ils ont acheté le bâtiment", "ils ont organisé une soirée de soutien", "ils ont écrit au propriétaire"], "answer": 1, "why": ["l'association ne l'achète pas dans le texte", "", "le texte ne mentionne pas de lettre"]},
        {"q": "Qui vient surtout le vendredi ?", "options": ["les familles", "les étudiants", "les touristes"], "answer": 1, "why": ["ce sont les familles le mercredi", "", "les touristes ne sont pas mentionnés"]},
      ]
    },
    {
      id: "tx-fr-carton",
      title: "Le carton de déménagement",
      level: 4,
      band: "B2",
      body: "Le carton était resté dans le couloir pendant trois semaines. Personne ne savait à qui il appartenait. Il était fermé avec du ruban adhésif et portait une étiquette illisible. Un jour, la voisine du dessous a demandé si elle pouvait l'ouvrir. À l'intérieur, il y avait des livres, une photo de plage et une lettre adressée à personne. La lettre disait : « Si tu trouves ce carton, garde les livres et oublie le reste. » La voisine a gardé les livres. Elle n'a jamais su qui avait écrit la lettre, mais depuis, elle lit un peu chaque soir.",
      questions: [
        {"q": "À qui appartenait le carton ?", "options": ["on ne le sait pas", "à la voisine du dessous", "à l'ancien locataire"], "answer": 0, "why": ["", "c'est elle qui l'ouvre", "le texte ne donne pas son nom"]},
        {"q": "Qu'a fait la voisine du carton ?", "options": ["elle a gardé les livres", "elle a jeté la lettre", "elle a cherché l'expéditeur"], "answer": 0, "why": ["", "le texte ne dit pas qu'elle l'a jetée", "elle n'a jamais su qui avait écrit"]},
        {"q": "Que suggère « oublie le reste » ?", "options": ["que les autres objets comptaient moins", "qu'il fallait tout jeter", "que la lettre était fausse"], "answer": 0, "why": ["", "elle garde les livres, pas tout", "rien ne dit que la lettre est fausse"]},
      ]
    },
    {
      id: "tx-fr-silence",
      title: "Ce que dit le silence",
      level: 4,
      band: "C1",
      body: "On dit souvent que les quartiers changent quand les habitants partent. Mais ils changent aussi quand les habitants restent et que les habitudes se transforment. Dans mon immeuble, les mêmes personnes vivent depuis vingt ans. Pourtant, les dîners sur les balcons ont disparu, les portes se ferment plus tôt et les couloirs sont silencieux. Personne ne s'est plaint. Le silence n'est pas un départ ; c'est une autre manière de rester. Parfois, je croise un voisin dans l'escalier et nous parlons de la pluie. Nous ne savons plus quoi dire du reste. Le quartier n'a pas perdu ses habitants ; il a perdu ses occasions de se parler.",
      questions: [
        {"q": "Que veut dire « le silence n'est pas un départ » ?", "options": ["les habitants sont restés mais se parlent moins", "tout le monde a déménagé", "les habitants font moins de bruit la nuit"], "answer": 0, "why": ["", "il dit justement qu'ils sont restés", "le texte parle de conversations, pas de bruit nocturne"]},
        {"q": "Quel est le ton du texte ?", "options": ["nostalgique et lucide", "joyeux et léger", "agressif"], "answer": 0, "why": ["", "il constate une perte, sans gaieté", "il n'attaque personne"]},
        {"q": "Que regrette surtout l'auteur ?", "options": ["les dîners sur les balcons", "les occasions de se parler", "le prix des appartements"], "answer": 1, "why": ["les dîners sont un exemple", "", "le prix n'est pas mentionné"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("fr", "texts", SEMA_TEXTS);
}
