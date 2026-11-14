/* Phrases — whole utterances, not single words.
 *
 * The same 68 situations as the Spanish deck, written the way a French
 * speaker would actually say them. `text` is spoken and displayed; `sub` is
 * optional French context.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-quoi-de-neuf",      emoji: "🤙", text: "Quoi de neuf ?",                          sub: "Entre amis.",                          cat: "phrase" },
    { id: "ph-ton-nom",           emoji: "🙋", text: "Comment tu t'appelles ?",                  sub: "Pour faire connaissance.",             cat: "phrase" },
    { id: "ph-d-ou-viens",        emoji: "🏳️", text: "Tu viens d'où ?",                          sub: "Pour demander le pays.",               cat: "phrase" },
    { id: "ph-couleur",           emoji: "🎨", text: "Quelle est ta couleur préférée ?",         sub: "En parlant de goûts.",                 cat: "phrase" },
    { id: "ph-metier",            emoji: "💼", text: "Qu'est-ce que tu fais dans la vie ?",      sub: "Pour parler du travail.",              cat: "phrase" },
    { id: "ph-comment-dit",       emoji: "❓", text: "Comment on dit ça ?",                      sub: "Quand il manque un mot.",              cat: "phrase" },
    { id: "ph-ca-veut-dire",      emoji: "🔎", text: "Qu'est-ce que ça veut dire ?",             sub: "Pour demander le sens.",               cat: "phrase" },
    { id: "ph-a-demain",          emoji: "🫡", text: "À demain.",                                sub: "En partant.",                          cat: "phrase" },
    { id: "ph-salut",             emoji: "👋", text: "Salut, ça va ?",                           sub: "En entrant quelque part.",             cat: "phrase" },
    { id: "ph-bonjour",           emoji: "🌅", text: "Bonjour.",                                 sub: "Le matin.",                            cat: "phrase" },
    { id: "ph-bonne-nuit",        emoji: "🌙", text: "Bonne nuit.",                              sub: "En se couchant.",                      cat: "phrase" },
    { id: "ph-a-plus-tard",       emoji: "✌️", text: "À plus tard.",                             sub: "En s'en allant.",                      cat: "phrase" },
    { id: "ph-enchante",          emoji: "🤝", text: "Enchanté.",                                sub: "En rencontrant quelqu'un.",            cat: "phrase" },
    { id: "ph-ca-va",             emoji: "😊", text: "Comment ça va ?",                          sub: "En voyant une connaissance.",          cat: "phrase" },
    { id: "ph-tu-es-d-ici",       emoji: "🌍", text: "Tu es d'ici ?",                           sub: "En discutant avec quelqu'un.",         cat: "phrase" },
    { id: "ph-heure",             emoji: "🕐", text: "Quelle heure est-il ?",                    sub: "Pour demander l'heure.",               cat: "phrase" },
    { id: "ph-cafe",              emoji: "☕", text: "Un café, s'il vous plaît.",                 sub: "En commandant au comptoir.",           cat: "phrase" },
    { id: "ph-eau",               emoji: "💧", text: "Une eau plate, s'il vous plaît.",          sub: "Pour boire.",                          cat: "phrase" },
    { id: "ph-table-deux",        emoji: "🪑", text: "Une table pour deux, s'il vous plaît.",    sub: "En entrant au restaurant.",            cat: "phrase" },
    { id: "ph-carte",             emoji: "📋", text: "Je peux avoir la carte ?",                 sub: "En s'asseyant à table.",               cat: "phrase" },
    { id: "ph-conseil",           emoji: "🍲", text: "Qu'est-ce que vous me conseillez ?",       sub: "Quand on hésite.",                     cat: "phrase" },
    { id: "ph-vegetarien",        emoji: "🥗", text: "Vous avez des plats végétariens ?",        sub: "Pour connaître les options.",          cat: "phrase" },
    { id: "ph-sans-oignon",       emoji: "🧅", text: "Sans oignon, s'il vous plaît.",            sub: "En demandant sans un ingrédient.",     cat: "phrase" },
    { id: "ph-vin-rouge",         emoji: "🍷", text: "Un verre de vin rouge, s'il vous plaît.",  sub: "En commandant à boire.",               cat: "phrase" },
    { id: "ph-tres-bon",          emoji: "😋", text: "C'est très bon.",                          sub: "Après le repas.",                      cat: "phrase" },
    { id: "ph-addition",          emoji: "🧾", text: "L'addition, s'il vous plaît.",              sub: "En fin de repas.",                     cat: "phrase" },
    { id: "ph-toilettes",         emoji: "🚻", text: "Où sont les toilettes ?",                  sub: "Dans un bar ou un magasin.",           cat: "phrase" },
    { id: "ph-centre-ville",      emoji: "🗺️", text: "Comment aller au centre-ville ?",          sub: "Pour demander son chemin.",            cat: "phrase" },
    { id: "ph-loin",              emoji: "📍", text: "C'est loin d'ici ?",                       sub: "Pour demander la distance.",           cat: "phrase" },
    { id: "ph-quel-bus",          emoji: "🚌", text: "Quel bus va au centre-ville ?",            sub: "À l'arrêt de bus.",                    cat: "phrase" },
    { id: "ph-gare",              emoji: "🚉", text: "Où est la gare ?",                         sub: "En cherchant le train.",               cat: "phrase" },
    { id: "ph-aller-simple",      emoji: "🎫", text: "Un aller simple, s'il vous plaît.",        sub: "Au guichet.",                          cat: "phrase" },
    { id: "ph-quai",              emoji: "🚏", text: "Le train part de quel quai ?",             sub: "En demandant à la gare.",              cat: "phrase" },
    { id: "ph-combien-de-temps",  emoji: "⏱️", text: "Ça prend combien de temps ?",              sub: "Pour parler du trajet.",               cat: "phrase" },
    { id: "ph-appeler-taxi",      emoji: "🚕", text: "Vous pouvez m'appeler un taxi ?",          sub: "Quand il n'y en a pas.",               cat: "phrase" },
    { id: "ph-aeroport",          emoji: "✈️", text: "Comment aller à l'aéroport ?",             sub: "En cherchant un transport.",           cat: "phrase" },
    { id: "ph-a-droite",          emoji: "➡️", text: "Tournez à droite.",                        sub: "En donnant une indication.",           cat: "phrase" },
    { id: "ph-combien-coute",     emoji: "🏷️", text: "Combien ça coûte ?",                       sub: "Devant un produit.",                   cat: "phrase" },
    { id: "ph-taille",            emoji: "👕", text: "Vous l'avez dans une taille au-dessus ?",  sub: "En essayant des vêtements.",           cat: "phrase" },
    { id: "ph-essayer",           emoji: "👗", text: "Je peux l'essayer ?",                      sub: "Avant d'acheter.",                     cat: "phrase" },
    { id: "ph-reduction",         emoji: "💸", text: "Il y a une réduction ?",                   sub: "Pour demander le prix.",               cat: "phrase" },
    { id: "ph-par-carte",         emoji: "💳", text: "Je peux payer par carte ?",                sub: "En passant à la caisse.",              cat: "phrase" },
    { id: "ph-un-sac",            emoji: "🛍️", text: "Je peux avoir un sac ?",                  sub: "En fin d'achat.",                      cat: "phrase" },
    { id: "ph-je-regarde",        emoji: "👀", text: "Je regarde seulement, merci.",             sub: "Quand on te propose de l'aide.",       cat: "phrase" },
    { id: "ph-marche",            emoji: "🧺", text: "Le marché ouvre à quelle heure ?",         sub: "Pour demander les horaires.",          cat: "phrase" },
    { id: "ph-reservation",       emoji: "🛎️", text: "J'ai une réservation.",                   sub: "En arrivant à l'hôtel.",               cat: "phrase" },
    { id: "ph-chambre-double",    emoji: "🛏️", text: "Je voudrais une chambre double.",          sub: "En réservant.",                        cat: "phrase" },
    { id: "ph-wifi",              emoji: "📶", text: "Quel est le mot de passe du wifi ?",       sub: "Pour se connecter à l'hôtel.",         cat: "phrase" },
    { id: "ph-petit-dejeuner",    emoji: "🥐", text: "Le petit-déjeuner est à quelle heure ?",   sub: "À l'hôtel.",                           cat: "phrase" },
    { id: "ph-valises",           emoji: "🧳", text: "Je peux laisser mes valises ici ?",        sub: "En quittant la chambre.",              cat: "phrase" },
    { id: "ph-vol",               emoji: "🛫", text: "Le vol part à quelle heure ?",             sub: "À l'aéroport.",                        cat: "phrase" },
    { id: "ph-passeport",         emoji: "🛂", text: "Voici mon passeport.",                      sub: "Au contrôle des passeports.",          cat: "phrase" },
    { id: "ph-changer-argent",    emoji: "💱", text: "Où je peux changer de l'argent ?",         sub: "En cherchant un bureau de change.",    cat: "phrase" },
    { id: "ph-aide",              emoji: "🆘", text: "J'ai besoin d'aide.",                      sub: "Quand ça va mal.",                     cat: "phrase" },
    { id: "ph-medecin",           emoji: "🏥", text: "J'ai besoin d'un médecin.",                sub: "Quand on ne se sent pas bien.",        cat: "phrase" },
    { id: "ph-pharmacie",         emoji: "💊", text: "Où est la pharmacie ?",                    sub: "En cherchant des médicaments.",        cat: "phrase" },
    { id: "ph-mal-tete",          emoji: "🤕", text: "J'ai mal à la tête.",                      sub: "Pour expliquer ce qui ne va pas.",     cat: "phrase" },
    { id: "ph-fievre",            emoji: "🌡️", text: "Je crois que j'ai de la fièvre.",          sub: "Quand on se sent mal.",                cat: "phrase" },
    { id: "ph-perdu",             emoji: "🧭", text: "Je suis perdu.",                           sub: "Quand on ne trouve pas le chemin.",    cat: "phrase" },
    { id: "ph-vole",              emoji: "🚨", text: "On m'a volé mon portefeuille.",            sub: "Pour porter plainte.",                 cat: "phrase" },
    { id: "ph-urgence",           emoji: "🚑", text: "C'est une urgence.",                       sub: "En appelant les secours.",             cat: "phrase" },
    { id: "ph-pardon",            emoji: "🙇", text: "Pardon, je ne comprends pas.",             sub: "Quand quelque chose n'est pas clair.", cat: "phrase" },
    { id: "ph-repeter",           emoji: "🔁", text: "Vous pouvez répéter ?",                    sub: "Quand on n'a pas bien entendu.",       cat: "phrase" },
    { id: "ph-plus-lentement",    emoji: "🐢", text: "Vous pouvez parler plus lentement ?",      sub: "Quand on parle trop vite.",            cat: "phrase" },
    { id: "ph-merci",             emoji: "🙌", text: "Merci beaucoup.",                          sub: "En recevant quelque chose.",           cat: "phrase" },
    { id: "ph-de-rien",           emoji: "💐", text: "De rien.",                                 sub: "Quand on te remercie.",                cat: "phrase" },
    { id: "ph-excusez-moi",       emoji: "🙏", text: "Excusez-moi, je peux passer ?",            sub: "Pour te frayer un chemin.",            cat: "phrase" },
    { id: "ph-m-asseoir",         emoji: "💺", text: "Je peux m'asseoir ici ?",                   sub: "En cherchant une place.",              cat: "phrase" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("fr", "phrases", SEMA_PHRASES);
}
