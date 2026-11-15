/* sema — Portuguese phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  openers: ["ph-pt-hello", "ph-pt-how-are-you", "ph-pt-colour", "ph-pt-where-from"],
  phrases: [
    { id: "ph-pt-hello", emoji: "👋", text: "Olá!", sub: "Ao entrar num lugar.", cat: "phrase" },
    { id: "ph-pt-good-morning", emoji: "🌅", text: "Bom dia.", sub: "Pela manhã.", cat: "phrase" },
    { id: "ph-pt-good-night", emoji: "🌙", text: "Boa noite.", sub: "Ao se despedir à noite.", cat: "phrase" },
    { id: "ph-pt-goodbye", emoji: "✌️", text: "Tchau.", sub: "Ao se despedir.", cat: "phrase" },
    { id: "ph-pt-thank-you", emoji: "🙌", text: "Muito obrigado.", sub: "Ao receber algo.", cat: "phrase" },
    { id: "ph-pt-please", emoji: "🙏", text: "Por favor.", sub: "Ao pedir algo.", cat: "phrase" },
    { id: "ph-pt-excuse-me", emoji: "🙇", text: "Com licença.", sub: "Para passar ou chamar atenção.", cat: "phrase" },
    { id: "ph-pt-how-are-you", emoji: "😊", text: "Como você está?", sub: "Ao ver um conhecido.", cat: "phrase" },
    { id: "ph-pt-my-name-is", emoji: "🙋", text: "Eu me chamo…", sub: "Ao se apresentar.", cat: "phrase" },
    { id: "ph-pt-what-is-your-name", emoji: "❓", text: "Como você se chama?", sub: "Para saber o nome.", cat: "phrase" },
    { id: "ph-pt-dont-understand", emoji: "🤷", text: "Não entendo.", sub: "Quando algo não está claro.", cat: "phrase" },
    { id: "ph-pt-repeat", emoji: "🔁", text: "Você pode repetir?", sub: "Quando não ouviu bem.", cat: "phrase" },
    { id: "ph-pt-speak-slower", emoji: "🐢", text: "Você pode falar mais devagar?", sub: "Quando falam rápido.", cat: "phrase" },
    { id: "ph-pt-how-much", emoji: "🏷️", text: "Quanto custa?", sub: "Diante de um produto.", cat: "phrase" },
    { id: "ph-pt-where-bathroom", emoji: "🚻", text: "Onde fica o banheiro?", sub: "Num bar ou loja.", cat: "phrase" },
    { id: "ph-pt-where-station", emoji: "🚉", text: "Onde fica a estação?", sub: "Procurando o trem.", cat: "phrase" },
    { id: "ph-pt-coffee", emoji: "☕", text: "Um café, por favor.", sub: "Pedindo no balcão.", cat: "phrase" },
    { id: "ph-pt-bill", emoji: "🧾", text: "A conta, por favor.", sub: "No fim da refeição.", cat: "phrase" },
    { id: "ph-pt-water", emoji: "💧", text: "Água, por favor.", sub: "Pedindo para beber.", cat: "phrase" },
    { id: "ph-pt-need-help", emoji: "🆘", text: "Preciso de ajuda.", sub: "Quando algo vai mal.", cat: "phrase" },
    { id: "ph-pt-need-doctor", emoji: "🏥", text: "Preciso de um médico.", sub: "Quando não se sente bem.", cat: "phrase" },
    { id: "ph-pt-lost", emoji: "🧭", text: "Estou perdido.", sub: "Quando não encontra o caminho.", cat: "phrase" },
    { id: "ph-pt-speak-english", emoji: "💬", text: "Você fala inglês?", sub: "Perguntando por idiomas.", cat: "phrase" },
    { id: "ph-pt-dont-speak", emoji: "🗣️", text: "Não falo português.", sub: "Explicando o idioma.", cat: "phrase" },
    { id: "ph-pt-nice-to-meet", emoji: "🤝", text: "Muito prazer.", sub: "Ao conhecer alguém.", cat: "phrase" },
    { id: "ph-pt-see-you", emoji: "🫡", text: "Até amanhã.", sub: "Ao se despedir.", cat: "phrase" },
    { id: "ph-pt-yes", emoji: "✅", text: "Sim.", sub: "Concordando.", cat: "phrase" },
    { id: "ph-pt-no", emoji: "❌", text: "Não.", sub: "Negando.", cat: "phrase" },
    { id: "ph-pt-this-please", emoji: "👉", text: "Este, por favor.", sub: "Apontando um item.", cat: "phrase" },
    { id: "ph-pt-hotel", emoji: "🛎️", text: "Onde fica o hotel?", sub: "Procurando hospedagem.", cat: "phrase" },
    { id: "ph-pt-colour", emoji: "🎨", text: "Qual é a sua cor preferida?", sub: "Falando de gostos.", cat: "phrase" },
    { id: "ph-pt-where-from", emoji: "🏳️", text: "De onde você é?", sub: "Perguntando pela origem.", cat: "phrase" },
    { id: "ph-pt-reservation", emoji: "🏨", text: "Tenho uma reserva.", sub: "Ao fazer o check-in num hotel.", cat: "phrase" },
    { id: "ph-pt-train-time", emoji: "🚆", text: "A que horas parte o comboio?", sub: "Perguntar a hora de partida.", cat: "phrase" },
    { id: "ph-pt-pharmacy", emoji: "💊", text: "Onde fica a farmácia?", sub: "Procurar uma farmácia.", cat: "phrase" },
    { id: "ph-pt-hurts-here", emoji: "🤕", text: "Dói-me aqui.", sub: "Mostrar ao médico onde dói.", cat: "phrase" },
    { id: "ph-pt-pizza", emoji: "🍕", text: "Queria uma pizza.", sub: "No restaurante.", cat: "phrase", topic: "restaurant" },
    { id: "ph-pt-vegetarian", emoji: "🥦", text: "Sou vegetariano.", sub: "No restaurante.", cat: "phrase", topic: "restaurant" },
    { id: "ph-pt-headache", emoji: "🤒", text: "Dói-me a cabeça desde ontem.", sub: "Explicar ao médico o que dói.", cat: "phrase", topic: "doctor" },
    { id: "ph-pt-home-office", emoji: "💼", text: "Esta semana trabalho em casa.", sub: "Dizer à equipa que trabalho em casa.", cat: "phrase", topic: "work" },
    { id: "ph-pt-dinner-friday", emoji: "🍷", text: "Vamos jantar juntos na sexta?", sub: "Convidar alguém para jantar.", cat: "phrase", topic: "plans" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("pt", "phrases", SEMA_PHRASES);
}
