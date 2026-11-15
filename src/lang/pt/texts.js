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
      id: "tx-pt-feira-livros",
      title: "A feira de livros usados",
      level: 2,
      band: "A2",
      body: "Domingo de manhã, a praça perto do rio enche-se de mesas com livros usados. A feira abre às nove e fecha ao meio-dia. A maioria dos livros custa um ou dois euros, e as crianças podem escolher um de graça. Eu procurava um livro de cozinha para oferecer à minha irmã. Encontrei um antigo, com receitas de sopa e de peixe, por três euros. A senhora da banca disse que era da sua avó e que já não o usava. Ficámos a conversar sobre comida e sobre o bairro. Voltei para casa com um livro e uma receita nova.",
      questions: [
        {"q": "O que se vende na feira?", "options": ["livros usados", "comida para o almoço", "mesas e cadeiras"], "answer": 0, "why": ["", "o livro de cozinha tem receitas, não comida pronta", "as mesas servem para expor os livros"]},
        {"q": "Quanto custou o livro que o narrador comprou?", "options": ["três euros", "um euro", "nada"], "answer": 0, "why": ["", "um ou dois euros é o preço da maioria, não deste livro", "só as crianças podem escolher um livro de graça"]},
        {"q": "Com quem falou o narrador?", "options": ["com a senhora da banca", "com a irmã", "com as crianças"], "answer": 0, "why": ["", "a irmã recebe o livro, mas não está na feira", "o texto fala das crianças, mas não de uma conversa com elas"]},
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
    {
      id: "tx-pt-festa-aldeia",
      title: "A festa da aldeia",
      level: 3,
      band: "B1",
      body: "Todos os anos, no primeiro fim de semana de agosto, a aldeia dos meus avós enche-se para a festa. As ruas estreitas ficam com bancas de doces, e o largo da igreja torna-se um palco. Os mais velhos preparam a comida durante dias: caldo verde, sardinhas e pão caseiro. Os jovens montam as luzes e ensaiam a música. Na noite principal, há um desfile com trajes tradicionais e, no fim, todos dançam até tarde. Eu cresci na cidade, mas volto sempre naquela semana. Ajudo a servir à mesa e ouço histórias que não conhecia. Quando a festa termina, a aldeia parece outra vez vazia, mas as pessoas já falam do próximo ano.",
      questions: [
        {"q": "Quando acontece a festa?", "options": ["no primeiro fim de semana de agosto", "na Páscoa", "todos os meses"], "answer": 0, "why": ["", "o texto não fala da Páscoa", "a festa é uma vez por ano"]},
        {"q": "O que fazem os jovens?", "options": ["montam as luzes e ensaiam a música", "preparam a comida durante dias", "vendem doces nas ruas"], "answer": 0, "why": ["", "isso é o que fazem os mais velhos", "as bancas de doces existem, mas o texto não diz que os jovens as vendem"]},
        {"q": "Porque é que o narrador volta sempre à aldeia?", "options": ["para ajudar e ouvir histórias", "porque vive lá", "para vender pão caseiro"], "answer": 0, "why": ["", "ele cresceu na cidade", "o pão é feito pelos mais velhos"]},
      ]
    },
    {
      "id": "tx-pt-horta",
      "title": "A horta do bairro",
      "level": 3,
      "band": "B1",
      "body": "Na rua onde vivo, um terreno vazio estava cheio de ervas. Há dois anos, os vizinhos decidiram criar uma horta. Cada família recebeu um pequeno canteiro. Ao sábado, encontramo-nos para regar e trocar conselhos. A minha vizinha cultiva tomates; eu cuido das ervas aromáticas. No verão, partilhamos a colheita e fazemos uma sopa para todos. O projeto não resolve todos os problemas da rua, mas aproximou pessoas que antes só diziam «bom dia». Aprendi que uma mudança pequena pode começar num espaço vazio.",
      "questions": [
        {
          "q": "O que os vizinhos criaram?",
          "options": [
            "uma horta",
            "um parque",
            "uma loja"
          ],
          "answer": 0,
          "why": [
            "",
            "o texto fala de uma horta, não de um parque",
            "há uma loja na rua, mas não foi criada pelos vizinhos"
          ]
        },
        {
          "q": "Quando se encontram para regar?",
          "options": [
            "ao sábado",
            "ao domingo",
            "todos os dias"
          ],
          "answer": 0,
          "why": [
            "",
            "o texto diz ao sábado",
            "encontram-se uma vez por semana"
          ]
        },
        {
          "q": "O que o narrador aprendeu?",
          "options": [
            "que uma mudança pequena pode começar num espaço vazio",
            "que a horta é cara",
            "que os vizinhos não falam"
          ],
          "answer": 0,
          "why": [
            "",
            "o texto não fala de custos",
            "o projeto aproximou as pessoas"
          ]
        }
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("pt", "texts", SEMA_TEXTS);
}
