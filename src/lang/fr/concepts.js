/* sema — French concept dataset.
 *
 * Mirrors the Spanish deck: same categories, relations and shapes, translated
 * properly with French articles (le, la, l') and accents. There is still no
 * English gloss here — that lives in glosses.js.
 */
var SEMA_DATA = {
  language: { code: "fr", name: "French", locale: "fr-FR" },

  categories: {
    home: { label: "Home", hue: "#d93a1c" },
    food: { label: "Food", hue: "#f2b705" },
    nature: { label: "Nature", hue: "#5f7f24" },
    animals: { label: "Animals", hue: "#c9721c" },
    body: { label: "Body", hue: "#7a2e57" },
    city: { label: "City", hue: "#ef5a2c" },
    time: { label: "Time", hue: "#2f6f8f" },
    emotion: { label: "Emotion", hue: "#c2185b" },
    action: { label: "Action", hue: "#8d5a2b" },
    abstract: { label: "Abstract", hue: "#6b5a49" }
  },

  relationTypes: {
    "part-of": { label: "part of", weight: 1 },
    "used-for": { label: "used for", weight: 1 },
    "used-with": { label: "used with", weight: 1 },
    "lives-in": { label: "lives in", weight: 1 },
    "grows-in": { label: "grows in", weight: 1 },
    opposite: { label: "opposite of", weight: 2 },
    "leads-to": { label: "leads to", weight: 1 },
    related: { label: "related to", weight: 0.5 }
  },

  /* fields: id, emoji, word, article, cat, sentence
   * `emoji` is the anchor; the sentence supplies the context a translation
   * would otherwise provide. */
  concepts: [
    { id: "maison",   emoji: "🏠", word: "maison",   article: "la", cat: "home",     sentence: "Ma maison est près de la mer.", synonyms: ["demeure"] },
    { id: "porte",    emoji: "🚪", word: "porte",    article: "la", cat: "home",     sentence: "La porte est ouverte." },
    { id: "fenetre",  emoji: "🪟", word: "fenêtre",  article: "la", cat: "home",     sentence: "J'ouvre la fenêtre le matin." },
    { id: "lit",      emoji: "🛏️", word: "lit",      article: "le", cat: "home",     sentence: "Je dors dans mon lit." },
    { id: "chaise",   emoji: "🪑", word: "chaise",   article: "la", cat: "home",     sentence: "La chaise est en bois." },
    { id: "cle",      emoji: "🔑", word: "clé",      article: "la", cat: "home",     sentence: "Je cherche la clé de la voiture." },

    { id: "pain",     emoji: "🍞", word: "pain",     article: "le", cat: "food",     sentence: "Le pain est frais." },
    { id: "eau",      emoji: "💧", word: "eau",      article: "l'", cat: "food",     sentence: "Je bois de l'eau froide." },
    { id: "pomme",    emoji: "🍎", word: "pomme",    article: "la", cat: "food",     sentence: "La pomme est rouge." },
    { id: "lait",     emoji: "🥛", word: "lait",     article: "le", cat: "food",     sentence: "Le café au lait est chaud." },
    { id: "cafe",     emoji: "☕", word: "café",     article: "le", cat: "food",     sentence: "Je bois du café le matin." },

    { id: "soleil",   emoji: "☀️", word: "soleil",   article: "le", cat: "nature",   sentence: "Le soleil se lève tôt." },
    { id: "lune",     emoji: "🌙", word: "lune",     article: "la", cat: "nature",   sentence: "La lune est pleine cette nuit." },
    { id: "arbre",    emoji: "🌳", word: "arbre",    article: "l'", cat: "nature",   sentence: "L'arbre est très haut." },
    { id: "mer",      emoji: "🌊", word: "mer",      article: "la", cat: "nature",   sentence: "La mer est calme aujourd'hui." },
    { id: "montagne", emoji: "⛰️", word: "montagne", article: "la", cat: "nature",   sentence: "Nous marchons jusqu'à la montagne." },
    { id: "pluie",    emoji: "🌧️", word: "pluie",    article: "la", cat: "nature",   sentence: "La pluie ne s'arrête pas." },

    { id: "chien",    emoji: "🐕", word: "chien",    article: "le", cat: "animals",  sentence: "Le chien dort par terre." },
    { id: "chat",     emoji: "🐈", word: "chat",     article: "le", cat: "animals",  sentence: "Le chat regarde par la fenêtre." },
    { id: "oiseau",   emoji: "🐦", word: "oiseau",   article: "l'", cat: "animals",  sentence: "L'oiseau chante dans l'arbre." },

    { id: "main",     emoji: "✋", word: "main",     article: "la", cat: "body",     sentence: "Je lève la main." },
    { id: "oeil",     emoji: "👁️", word: "œil",      article: "l'", cat: "body",     sentence: "Je ferme un œil." },
    { id: "coeur",    emoji: "❤️", word: "cœur",     article: "le", cat: "body",     sentence: "Le cœur bat vite." },

    { id: "ville",    emoji: "🏙️", word: "ville",    article: "la", cat: "city",     sentence: "La ville est grande." },
    { id: "rue",      emoji: "🛣️", word: "rue",      article: "la", cat: "city",     sentence: "J'habite dans cette rue." },
    { id: "voiture",  emoji: "🚗", word: "voiture",  article: "la", cat: "city",     sentence: "La voiture est rouge.", synonyms: ["auto"] },
    { id: "train",    emoji: "🚆", word: "train",    article: "le", cat: "city",     sentence: "Le train arrive en retard." },
    { id: "argent",   emoji: "💰", word: "argent",   article: "l'", cat: "city",     sentence: "Je n'ai pas d'argent.", synonyms: ["fric"] },

    { id: "jour",     emoji: "📅", word: "jour",     article: "le", cat: "time",     sentence: "Le jour est long." },
    { id: "nuit",     emoji: "🌃", word: "nuit",     article: "la", cat: "time",     sentence: "La nuit est calme." },
    { id: "temps",    emoji: "⏳", word: "temps",    article: "le", cat: "time",     sentence: "Je n'ai pas le temps." },

    { id: "amour",    emoji: "💗", word: "amour",    article: "l'", cat: "emotion",  sentence: "L'amour ne s'explique pas." },
    { id: "peur",     emoji: "😨", word: "peur",     article: "la", cat: "emotion",  sentence: "J'ai peur de la pluie." },
    { id: "joie",     emoji: "😊", word: "joie",     article: "la", cat: "emotion",  sentence: "Sa joie est contagieuse." },

    { id: "manger",   emoji: "🍽️", word: "manger",   article: "",   cat: "action",   sentence: "Je veux manger du pain." },
    { id: "boire",    emoji: "🥤", word: "boire",    article: "",   cat: "action",   sentence: "Je bois de l'eau tous les jours." },
    { id: "dormir",   emoji: "😴", word: "dormir",   article: "",   cat: "action",   sentence: "J'ai besoin de dormir huit heures." },
    { id: "courir",   emoji: "🏃", word: "courir",   article: "",   cat: "action",   sentence: "Je cours le matin." },
    { id: "parler",   emoji: "💬", word: "parler",   article: "",   cat: "action",   sentence: "Je parle avec ma mère." },
    { id: "ecouter",  emoji: "👂", word: "écouter",  article: "",   cat: "action",   sentence: "J'écoute la pluie." },

    { id: "paix",     emoji: "☮️", word: "paix",     article: "la", cat: "abstract", sentence: "La paix est fragile." },
    { id: "liberte",  emoji: "🗽", word: "liberté",  article: "la", cat: "abstract", sentence: "La liberté a un prix." }
  ],

  /* The semantic web, translated edge for edge. Distractors come from here
   * first, so a confusion is a meaningful neighbour, not a random collision. */
  edges: [
    { a: "porte",    b: "maison",   type: "part-of" },
    { a: "fenetre",  b: "maison",   type: "part-of" },
    { a: "lit",      b: "maison",   type: "part-of" },
    { a: "chaise",   b: "maison",   type: "part-of" },
    { a: "cle",      b: "porte",    type: "used-for" },
    { a: "lit",      b: "dormir",   type: "used-for" },
    { a: "chaise",   b: "lit",      type: "related" },
    { a: "maison",   b: "ville",    type: "part-of" },
    { a: "rue",      b: "ville",    type: "part-of" },
    { a: "voiture",  b: "rue",      type: "related" },
    { a: "train",    b: "ville",    type: "related" },
    { a: "argent",   b: "ville",    type: "related" },
    { a: "voiture",  b: "cle",      type: "used-for" },
    { a: "pain",     b: "manger",   type: "used-for" },
    { a: "eau",      b: "boire",    type: "used-for" },
    { a: "cafe",     b: "lait",     type: "used-with" },
    { a: "eau",      b: "mer",      type: "related" },
    { a: "pluie",    b: "eau",      type: "related" },
    { a: "pomme",    b: "manger",   type: "used-for" },
    { a: "arbre",    b: "montagne", type: "grows-in" },
    { a: "oiseau",   b: "arbre",    type: "lives-in" },
    { a: "chat",     b: "maison",   type: "lives-in" },
    { a: "chien",    b: "maison",   type: "lives-in" },
    { a: "chien",    b: "chat",     type: "related" },
    { a: "soleil",   b: "lune",     type: "opposite" },
    { a: "jour",     b: "nuit",     type: "opposite" },
    { a: "jour",     b: "soleil",   type: "related" },
    { a: "nuit",     b: "lune",     type: "related" },
    { a: "temps",    b: "jour",     type: "related" },
    { a: "coeur",    b: "amour",    type: "related" },
    { a: "peur",     b: "joie",     type: "opposite" },
    { a: "main",     b: "coeur",    type: "part-of" },
    { a: "oeil",     b: "coeur",    type: "part-of" },
    { a: "ecouter",  b: "parler",   type: "opposite" },
    { a: "parler",   b: "oiseau",   type: "related" },
    { a: "courir",   b: "voiture",  type: "related" },
    { a: "manger",   b: "boire",    type: "related" },
    { a: "paix",     b: "peur",     type: "opposite" },
    { a: "liberte",  b: "paix",     type: "related" },
    { a: "soleil",   b: "mer",      type: "related" },
    { a: "montagne", b: "mer",      type: "related" },
    { a: "fenetre",  b: "soleil",   type: "related" },
    { a: "dormir",   b: "nuit",     type: "related" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("fr", "concepts", SEMA_DATA);
}
