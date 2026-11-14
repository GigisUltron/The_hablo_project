/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-pt-mercado",
      title: "O mercado de sábado",
      level: 1,
      band: "A1",
      body: "No sábado de manhã, o mercado do bairro abre às sete. A minha mãe compra pão, fruta e café. Eu compro água e levo uma maçã para o pequeno-almoço. O senhor da banca sorri e diz: «Bom dia». Pagamos e voltamos para casa a pé. Em casa, tomamos café juntos. Depois, eu leio e a minha mãe trabalha no jardim. À noite, os vizinhos voltam ao mercado para beber um copo e falar da semana até as bancas fecharem. O bairro agradece.",
      questions: [
        {"q": "O que a mãe compra?", "options": ["pão, fruta e café", "água e maçã", "flores e leite"], "answer": 0, "why": ["", "isso é o que o narrador compra", "o texto não fala de flores nem de leite"]},
        {"q": "Como voltam para casa?", "options": ["de autocarro", "a pé", "de carro"], "answer": 1, "why": ["o texto diz que vão a pé", "", "o texto não fala de carro"]},
        {"q": "A que horas abre o mercado?", "options": ["às sete", "às nove", "ao meio-dia"], "answer": 0, "why": ["", "o texto diz às sete", "o texto não fala do meio-dia"]},
      ]
    },
    {
      id: "tx-pt-comboio",
      title: "O comboio das seis",
      level: 2,
      band: "A2",
      body: "O comboio das seis parte da estação central. Naquela manhã cheguei um minuto tarde: as portas já estavam fechadas. Corri pela plataforma, mas o comboio começou a andar. Um funcionário disse-me para esperar o próximo. Bebi um café e vi os viajantes. O comboio seguinte chegou às oito. Entrei, encontrei um lugar junto à janela e respirei. O atraso custou-me uma hora, mas deu-me um livro e um café. No fim, já não tinha pressa. No fim, já não tinha pressa.",
      questions: [
        {"q": "Porque é que o narrador perdeu o comboio?", "options": ["chegou um minuto tarde", "o comboio partiu mais cedo", "estava na plataforma errada"], "answer": 0, "why": ["", "o texto não diz que partiu mais cedo", "estava na plataforma certa"]},
        {"q": "O que fez enquanto esperava?", "options": ["bebeu um café e viu os viajantes", "voltou para casa", "telefonou ao trabalho"], "answer": 0, "why": ["", "ficou na estação", "o texto não fala de telefonemas"]},
        {"q": "Como se sente no fim?", "options": ["zangado com o funcionário", "aliviado apesar do atraso", "ansioso por partir"], "answer": 1, "why": ["não critica o funcionário", "", "acabou de se sentar e respirar"]},
      ]
    },
    {
      id: "tx-pt-padaria",
      title: "A padaria que fechou",
      level: 3,
      band: "B1",
      body: "A padaria do bairro fechou na primavera. A dona queria reformar-se e ninguém pegou no negócio. Desde então, as manhãs são mais tristes: é preciso ir até ao supermercado, onde o pão é pior e as filas são maiores. Os vizinhos falam de abrir uma mercearia, mas a renda é alta. Na semana passada, porém, apareceu uma mulher jovem. Olhou para a vitrina, tirou fotografias e perguntou o preço da renda. Ninguém sabe se ela vai voltar. Por agora, a padaria continua fechada, e todos esperam.",
      questions: [
        {"q": "Porque é que a padaria fechou?", "options": ["a dona queria reformar-se", "o pão era mau", "a renda era baixa"], "answer": 0, "why": ["", "o pão era bom", "o texto fala de renda alta, não baixa"]},
        {"q": "O que fazem os habitantes agora?", "options": ["vão ao supermercado", "fazem o pão em casa", "abriram uma mercearia"], "answer": 0, "why": ["", "o texto não o diz", "apenas falam disso"]},
        {"q": "O que sugere a visita da mulher jovem?", "options": ["talvez queira ficar com o espaço", "é a nova padeira", "quer comprar as fotografias"], "answer": 0, "why": ["", "ninguém sabe se volta", "tirou fotografias à vitrina"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("pt", "texts", SEMA_TEXTS);
}
