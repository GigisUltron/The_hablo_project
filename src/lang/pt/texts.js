/* sema — Portuguese reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-pt-mercado",
      title: "O mercado de sábado",
      level: 1,
      body: "No sábado de manhã, o mercado do bairro abre às sete. A minha mãe compra pão, fruta e café. Eu compro água e levo uma maçã para o pequeno-almoço. O senhor da banca sorri e diz: «Bom dia». Pagamos e voltamos para casa a pé. Em casa, tomamos café juntos. Depois, eu leio e a minha mãe trabalha no jardim.",
      questions: [
        { q: "O que a mãe compra?", options: ["pão, fruta e café", "água e maçã", "flores e leite"], answer: 0 },
        { q: "Como voltam para casa?", options: ["de autocarro", "a pé", "de carro"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("pt", "texts", SEMA_TEXTS);
}
