/* sema — concept dataset.
 *
 * Design rule: a concept is never stored as a translation. Each entry pairs a
 * *non-verbal* anchor (an image) with the target-language sound, plus a
 * target-language sentence for context. There is deliberately no English gloss
 * field: the app has no way to show one.
 *
 * Relations form the semantic web that the Map view draws. They are what make
 * "learn the neighbours together" possible instead of learning a list.
 */
var SEMA_DATA = {
  language: { code: "es", name: "Spanish", locale: "es-ES" },

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
   * `emoji` is the anchor. It is the only thing shown before you recall the
   * word, which is what forces an image -> sound link instead of word -> word. */
  concepts: [
    { id: "casa",     emoji: "🏠", word: "casa",     article: "la", cat: "home",     sentence: "Mi casa está cerca del mar." },
    { id: "puerta",   emoji: "🚪", word: "puerta",   article: "la", cat: "home",     sentence: "La puerta está abierta." },
    { id: "ventana",  emoji: "🪟", word: "ventana",  article: "la", cat: "home",     sentence: "Abro la ventana por la mañana." },
    { id: "cama",     emoji: "🛏️", word: "cama",     article: "la", cat: "home",     sentence: "Duermo en mi cama." },
    { id: "silla",    emoji: "🪑", word: "silla",    article: "la", cat: "home",     sentence: "La silla es de madera." },
    { id: "llave",    emoji: "🔑", word: "llave",    article: "la", cat: "home",     sentence: "Busco la llave del coche." },

    { id: "pan",      emoji: "🍞", word: "pan",      article: "el", cat: "food",     sentence: "El pan está fresco." },
    { id: "agua",     emoji: "💧", word: "agua",     article: "el", cat: "food",     sentence: "Bebo agua fría." },
    { id: "manzana",  emoji: "🍎", word: "manzana",  article: "la", cat: "food",     sentence: "La manzana es roja." },
    { id: "leche",    emoji: "🥛", word: "leche",    article: "la", cat: "food",     sentence: "El café con leche está caliente." },
    { id: "café",     emoji: "☕", word: "café",     article: "el", cat: "food",     sentence: "Tomo café por la mañana." },

    { id: "sol",      emoji: "☀️", word: "sol",      article: "el", cat: "nature",   sentence: "El sol sale temprano." },
    { id: "luna",     emoji: "🌙", word: "luna",     article: "la", cat: "nature",   sentence: "La luna está llena esta noche." },
    { id: "árbol",    emoji: "🌳", word: "árbol",    article: "el", cat: "nature",   sentence: "El árbol es muy alto." },
    { id: "mar",      emoji: "🌊", word: "mar",      article: "el", cat: "nature",   sentence: "El mar está tranquilo hoy." },
    { id: "montaña",  emoji: "⛰️", word: "montaña",  article: "la", cat: "nature",   sentence: "Caminamos hasta la montaña." },
    { id: "lluvia",   emoji: "🌧️", word: "lluvia",   article: "la", cat: "nature",   sentence: "La lluvia no para." },

    { id: "perro",    emoji: "🐕", word: "perro",    article: "el", cat: "animals",  sentence: "El perro duerme en el suelo." },
    { id: "gato",     emoji: "🐈", word: "gato",     article: "el", cat: "animals",  sentence: "El gato mira la ventana." },
    { id: "pájaro",   emoji: "🐦", word: "pájaro",   article: "el", cat: "animals",  sentence: "El pájaro canta en el árbol." },

    { id: "mano",     emoji: "✋", word: "mano",     article: "la", cat: "body",     sentence: "Levanto la mano." },
    { id: "ojo",      emoji: "👁️", word: "ojo",      article: "el", cat: "body",     sentence: "Cierro un ojo." },
    { id: "corazón",  emoji: "❤️", word: "corazón",  article: "el", cat: "body",     sentence: "El corazón late rápido." },

    { id: "ciudad",   emoji: "🏙️", word: "ciudad",   article: "la", cat: "city",     sentence: "La ciudad es grande." },
    { id: "calle",    emoji: "🛣️", word: "calle",    article: "la", cat: "city",     sentence: "Vivo en esta calle." },
    { id: "coche",    emoji: "🚗", word: "coche",    article: "el", cat: "city",     sentence: "El coche es rojo." },
    { id: "tren",     emoji: "🚆", word: "tren",     article: "el", cat: "city",     sentence: "El tren llega tarde." },
    { id: "dinero",   emoji: "💰", word: "dinero",   article: "el", cat: "city",     sentence: "No tengo dinero." },

    { id: "día",      emoji: "📅", word: "día",      article: "el", cat: "time",     sentence: "El día es largo." },
    { id: "noche",    emoji: "🌃", word: "noche",    article: "la", cat: "time",     sentence: "La noche es tranquila." },
    { id: "tiempo",   emoji: "⏳", word: "tiempo",   article: "el", cat: "time",     sentence: "No tengo tiempo." },

    { id: "amor",     emoji: "💗", word: "amor",     article: "el", cat: "emotion",  sentence: "El amor no se explica." },
    { id: "miedo",    emoji: "😨", word: "miedo",    article: "el", cat: "emotion",  sentence: "Tengo miedo de la lluvia." },
    { id: "alegría",  emoji: "😊", word: "alegría",  article: "la", cat: "emotion",  sentence: "Su alegría es contagiosa." },

    { id: "comer",    emoji: "🍽️", word: "comer",    article: "",   cat: "action",   sentence: "Quiero comer pan." },
    { id: "beber",    emoji: "🥤", word: "beber",    article: "",   cat: "action",   sentence: "Bebo agua todos los días." },
    { id: "dormir",   emoji: "😴", word: "dormir",   article: "",   cat: "action",   sentence: "Necesito dormir ocho horas." },
    { id: "correr",   emoji: "🏃", word: "correr",   article: "",   cat: "action",   sentence: "Corro por la mañana." },
    { id: "hablar",   emoji: "💬", word: "hablar",   article: "",   cat: "action",   sentence: "Hablo con mi madre." },
    { id: "escuchar", emoji: "👂", word: "escuchar", article: "",   cat: "action",   sentence: "Escucho la lluvia." },

    { id: "paz",      emoji: "☮️", word: "paz",      article: "la", cat: "abstract", sentence: "La paz es frágil." },
    { id: "libertad", emoji: "🗽", word: "libertad", article: "la", cat: "abstract", sentence: "La libertad tiene un precio." }
  ],

  /* The semantic web. Distractors in the recall drill are drawn from here first,
   * so the confusions you make are the *meaningful* ones (near neighbours),
   * not random collisions. */
  edges: [
    { a: "puerta",   b: "casa",     type: "part-of" },
    { a: "ventana",  b: "casa",     type: "part-of" },
    { a: "cama",     b: "casa",     type: "part-of" },
    { a: "silla",    b: "casa",     type: "part-of" },
    { a: "llave",    b: "puerta",   type: "used-for" },
    { a: "cama",     b: "dormir",   type: "used-for" },
    { a: "silla",    b: "cama",     type: "related" },
    { a: "casa",     b: "ciudad",   type: "part-of" },
    { a: "calle",    b: "ciudad",   type: "part-of" },
    { a: "coche",    b: "calle",    type: "related" },
    { a: "tren",     b: "ciudad",   type: "related" },
    { a: "dinero",   b: "ciudad",   type: "related" },
    { a: "coche",    b: "llave",    type: "used-for" },
    { a: "pan",      b: "comer",    type: "used-for" },
    { a: "agua",     b: "beber",    type: "used-for" },
    { a: "café",     b: "leche",    type: "used-with" },
    { a: "agua",     b: "mar",      type: "related" },
    { a: "lluvia",   b: "agua",     type: "related" },
    { a: "manzana",  b: "comer",    type: "used-for" },
    { a: "árbol",    b: "montaña",  type: "grows-in" },
    { a: "pájaro",   b: "árbol",    type: "lives-in" },
    { a: "gato",     b: "casa",     type: "lives-in" },
    { a: "perro",    b: "casa",     type: "lives-in" },
    { a: "perro",    b: "gato",     type: "related" },
    { a: "sol",      b: "luna",     type: "opposite" },
    { a: "día",      b: "noche",    type: "opposite" },
    { a: "día",      b: "sol",      type: "related" },
    { a: "noche",    b: "luna",     type: "related" },
    { a: "tiempo",   b: "día",      type: "related" },
    { a: "corazón",  b: "amor",     type: "related" },
    { a: "miedo",    b: "alegría",  type: "opposite" },
    { a: "mano",     b: "corazón",  type: "part-of" },
    { a: "ojo",      b: "corazón",  type: "part-of" },
    { a: "escuchar", b: "hablar",   type: "opposite" },
    { a: "hablar",   b: "pájaro",   type: "related" },
    { a: "correr",   b: "coche",    type: "related" },
    { a: "comer",    b: "beber",    type: "related" },
    { a: "paz",      b: "miedo",    type: "opposite" },
    { a: "libertad", b: "paz",      type: "related" },
    { a: "sol",      b: "mar",      type: "related" },
    { a: "montaña",  b: "mar",      type: "related" },
    { a: "ventana",  b: "sol",      type: "related" },
    { a: "dormir",   b: "noche",    type: "related" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("es", "concepts", SEMA_DATA);
}
