/* sema — Portuguese phrase deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_PHRASES = {
  phrases: [
    { id: "ph-hello", emoji: "👋", text: "Olá!", sub: "Ao entrar num lugar.", cat: "phrase" },
    { id: "ph-good-morning", emoji: "🌅", text: "Bom dia.", sub: "Pela manhã.", cat: "phrase" },
    { id: "ph-good-night", emoji: "🌙", text: "Boa noite.", sub: "Ao se despedir à noite.", cat: "phrase" },
    { id: "ph-goodbye", emoji: "✌️", text: "Tchau.", sub: "Ao se despedir.", cat: "phrase" },
    { id: "ph-thank-you", emoji: "🙌", text: "Muito obrigado.", sub: "Ao receber algo.", cat: "phrase" },
    { id: "ph-please", emoji: "🙏", text: "Por favor.", sub: "Ao pedir algo.", cat: "phrase" },
    { id: "ph-excuse-me", emoji: "🙇", text: "Com licença.", sub: "Para passar ou chamar atenção.", cat: "phrase" },
    { id: "ph-how-are-you", emoji: "😊", text: "Como você está?", sub: "Ao ver um conhecido.", cat: "phrase" },
    { id: "ph-my-name-is", emoji: "🙋", text: "Eu me chamo…", sub: "Ao se apresentar.", cat: "phrase" },
    { id: "ph-what-is-your-name", emoji: "❓", text: "Como você se chama?", sub: "Para saber o nome.", cat: "phrase" },
    { id: "ph-dont-understand", emoji: "🤷", text: "Não entendo.", sub: "Quando algo não está claro.", cat: "phrase" },
    { id: "ph-repeat", emoji: "🔁", text: "Você pode repetir?", sub: "Quando não ouviu bem.", cat: "phrase" },
    { id: "ph-speak-slower", emoji: "🐢", text: "Você pode falar mais devagar?", sub: "Quando falam rápido.", cat: "phrase" },
    { id: "ph-how-much", emoji: "🏷️", text: "Quanto custa?", sub: "Diante de um produto.", cat: "phrase" },
    { id: "ph-where-bathroom", emoji: "🚻", text: "Onde fica o banheiro?", sub: "Num bar ou loja.", cat: "phrase" },
    { id: "ph-where-station", emoji: "🚉", text: "Onde fica a estação?", sub: "Procurando o trem.", cat: "phrase" },
    { id: "ph-coffee", emoji: "☕", text: "Um café, por favor.", sub: "Pedindo no balcão.", cat: "phrase" },
    { id: "ph-bill", emoji: "🧾", text: "A conta, por favor.", sub: "No fim da refeição.", cat: "phrase" },
    { id: "ph-water", emoji: "💧", text: "Água, por favor.", sub: "Pedindo para beber.", cat: "phrase" },
    { id: "ph-need-help", emoji: "🆘", text: "Preciso de ajuda.", sub: "Quando algo vai mal.", cat: "phrase" },
    { id: "ph-need-doctor", emoji: "🏥", text: "Preciso de um médico.", sub: "Quando não se sente bem.", cat: "phrase" },
    { id: "ph-lost", emoji: "🧭", text: "Estou perdido.", sub: "Quando não encontra o caminho.", cat: "phrase" },
    { id: "ph-speak-english", emoji: "💬", text: "Você fala inglês?", sub: "Perguntando por idiomas.", cat: "phrase" },
    { id: "ph-dont-speak", emoji: "🗣️", text: "Não falo português.", sub: "Explicando o idioma.", cat: "phrase" },
    { id: "ph-nice-to-meet", emoji: "🤝", text: "Muito prazer.", sub: "Ao conhecer alguém.", cat: "phrase" },
    { id: "ph-see-you", emoji: "🫡", text: "Até amanhã.", sub: "Ao se despedir.", cat: "phrase" },
    { id: "ph-yes", emoji: "✅", text: "Sim.", sub: "Concordando.", cat: "phrase" },
    { id: "ph-no", emoji: "❌", text: "Não.", sub: "Negando.", cat: "phrase" },
    { id: "ph-this-please", emoji: "👉", text: "Este, por favor.", sub: "Apontando um item.", cat: "phrase" },
    { id: "ph-hotel", emoji: "🛎️", text: "Onde fica o hotel?", sub: "Procurando hospedagem.", cat: "phrase" },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_PHRASES;
if (typeof window !== "undefined") {
  window.SEMA_PHRASES = SEMA_PHRASES;
  if (window.SemaLangs) window.SemaLangs.define("pt", "phrases", SEMA_PHRASES);
}
