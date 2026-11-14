/* Phrases — whole utterances, not single words.
 *
 * Same rule as the vocabulary: there is no English translation here. The scene
 * emoji is the anchor, and the phrase is what a person would actually say.
 *
 * `text` is spoken and displayed; `sub` is optional context in Spanish.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hola",     emoji: "👋", text: "Hola, ¿qué tal?",            sub: "Al entrar en un sitio.",        cat: "phrase" },
    { id: "ph-dias",     emoji: "🌅", text: "Buenos días.",                sub: "Por la mañana.",                cat: "phrase" },
    { id: "ph-noches",   emoji: "🌙", text: "Buenas noches.",              sub: "Al despedirte de noche.",        cat: "phrase" },
    { id: "ph-adios",    emoji: "✌️", text: "Hasta luego.",                 sub: "Al irte.",                       cat: "phrase" },
    { id: "ph-gusto",    emoji: "🤝", text: "Mucho gusto.",                sub: "Al conocer a alguien.",          cat: "phrase" },
    { id: "ph-perdon",   emoji: "🙇", text: "Perdón, no entiendo.",        sub: "Cuando algo no queda claro.",    cat: "phrase" },
    { id: "ph-repetir",  emoji: "🔁", text: "¿Puedes repetirlo?",          sub: "Cuando no has oído bien.",       cat: "phrase" },
    { id: "ph-despacio", emoji: "🐢", text: "¿Puedes hablar más despacio?", sub: "Cuando hablan muy rápido.",     cat: "phrase" },
    { id: "ph-banio",    emoji: "🚻", text: "¿Dónde está el baño?",        sub: "En un bar o una tienda.",        cat: "phrase" },
    { id: "ph-estacion", emoji: "🚉", text: "¿Dónde está la estación?",    sub: "Buscando el tren.",              cat: "phrase" },
    { id: "ph-tarda",    emoji: "⏱️", text: "¿Cuánto tarda?",              sub: "Preguntando por el viaje.",      cat: "phrase" },
    { id: "ph-precio",   emoji: "🏷️", text: "¿Cuánto cuesta?",             sub: "Mirando un producto.",           cat: "phrase" },
    { id: "ph-cafe",     emoji: "☕", text: "Un café, por favor.",         sub: "Pidiendo en la barra.",          cat: "phrase" },
    { id: "ph-agua",     emoji: "💧", text: "Agua sin gas, por favor.",    sub: "Pidiendo de beber.",             cat: "phrase" },
    { id: "ph-cuenta",   emoji: "🧾", text: "La cuenta, por favor.",       sub: "Al terminar de comer.",          cat: "phrase" },
    { id: "ph-rico",     emoji: "😋", text: "Está muy rico.",              sub: "Después de comer.",              cat: "phrase" },
    { id: "ph-ayuda",    emoji: "🆘", text: "Necesito ayuda.",             sub: "Cuando algo va mal.",            cat: "phrase" },
    { id: "ph-hora",     emoji: "🕐", text: "¿Qué hora es?",               sub: "Preguntando la hora.",           cat: "phrase" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") window.SEMA_PHRASES = SEMA_PHRASES;
