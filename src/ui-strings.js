/* Interface strings.
 *
 * Separate from the deck: what you are learning (`profile.lang`) and what the
 * buttons say (`profile.uiLang`) are different choices. A Spanish speaker
 * learning French wants Spanish chrome.
 */
var SEMA_UI = {
  en: {
    start: "Start lesson",
    review: "Review my mistakes",
    place: "Place me",
    read: "Read a text",
    converse: "Have a conversation",
    settings: "Settings",
    done: "Done",
    reset: "Reset progress",
    translationsOn: "translations on request",
    translationsOff: "translations off",
    oneMore: "One more",
    leave: "done for now",
    gotit: "Got it",
    aboutMinute: "about a minute",
    yourPath: "your path",
    upForReview: "up for review",
    yourWords: "your words",
    deckLang: "language you are learning",
    interfaceLang: "interface language",
    settingsTitle: "Settings",

    glossShow: "show translation",
    explain: "why?",
    mix: "you mix these up",
    glossHide: "hide translation",
    whichOne: "Which one is this?",
    notQuite: "Not quite",
    hearit: "Hear it",
    tabToday: "Today",
    tabMap: "Map",
    tabProgress: "Progress"
  },
  es: {
    start: "Empezar lección",
    review: "Repasar mis errores",
    place: "Hazme una prueba",
    read: "Leer un texto",
    converse: "Tener una conversación",
    settings: "Ajustes",
    done: "Listo",
    reset: "Borrar progreso",
    translationsOn: "traducciones a petición",
    translationsOff: "traducciones desactivadas",
    oneMore: "Una más",
    leave: "por ahora no",
    gotit: "Entendido",
    aboutMinute: "un minuto",
    yourPath: "tu camino",
    upForReview: "para repasar",
    yourWords: "tus palabras",
    deckLang: "idioma que estudias",
    interfaceLang: "idioma de la interfaz",
    settingsTitle: "Ajustes",

    glossShow: "ver traducción",
    explain: "¿por qué?",
    mix: "confundes estas dos",
    glossHide: "ocultar traducción",
    whichOne: "¿Cuál es?",
    notQuite: "Casi",
    hearit: "Escucharlo",
    tabToday: "Hoy",
    tabMap: "Mapa",
    tabProgress: "Progreso"
  }
};

(function (root) {
  function t(lang, key) {
    var table = SEMA_UI[lang] || SEMA_UI.en;
    return table[key] || SEMA_UI.en[key] || key;
  }
  SEMA_UI.t = t;
  if (typeof module !== "undefined" && module.exports) module.exports = SEMA_UI;
  if (typeof window !== "undefined") window.SEMA_UI = SEMA_UI;
})(typeof globalThis !== "undefined" ? globalThis : this);
