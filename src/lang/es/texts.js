/* Reading — the first graded texts.
 *
 * Every word here is either already in the decks or is glossed below the text.
 * Reading is where isolated items become language: the grammar is repeated
 * across sentences so the pattern is felt before it is explained.
 *
 * level: 1 = present tense, short clauses. 2 = past tense. 3 = connectors.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-mercado",
      title: "El mercado",
      level: 1,
      body: "El mercado abre muy temprano. Mi madre compra pan y manzanas. Yo compro café y leche. El pan está fresco y huele muy bien. La mujer del puesto sonríe y dice: «Buenos días». Pagamos con dinero y volvemos a casa. En casa desayunamos juntos. Mi padre bebe café y yo bebo agua. Después yo estudio y mi madre trabaja. Por la noche cenamos y hablamos del día. El mercado es mi lugar favorito del barrio.",
      questions: [
        { q: "¿Qué compra la madre?", options: ["pan y manzanas", "café y leche", "agua y sal"], answer: 0, why: ["", "ese es el que compra el hijo", "el agua no se compra aquí"] },
        { q: "¿Cuándo abre el mercado?", options: ["por la noche", "muy temprano", "por la tarde"], answer: 1, why: ["el texto dice temprano, no de noche", "", "el texto no habla de la tarde"] },
        { q: "¿Quién bebe café en casa?", options: ["el padre", "la madre", "el hijo"], answer: 0 }
      ]
    },
    {
      id: "tx-tren",
      title: "Un viaje en tren",
      level: 2,
      body: "Ayer viajé en tren a otra ciudad. El billete costó poco. El tren salió a las ocho y llegó a las diez. En el andén había mucha gente. Me senté cerca de la ventana y miré el mar. El viaje fue tranquilo y corto. Cuando llegué, busqué la estación de autobús. Pregunté a una mujer: «¿Dónde está el centro?». Ella me dijo: «Gira a la derecha y camina cinco minutos». Encontré el centro sin problema. Compré un café y llamé a mi familia.",
      questions: [
        { q: "¿Cómo viajó?", options: ["en coche", "en tren", "en autobús"], answer: 1 },
        { q: "¿Qué miró por la ventana?", options: ["el mar", "una montaña", "la ciudad"], answer: 0 },
        { q: "¿A quién preguntó?", options: ["a un hombre", "a una mujer", "a un niño"], answer: 1 }
      ]
    },
    {
      id: "tx-lluvia",
      title: "La lluvia",
      level: 3,
      body: "Hoy llueve, aunque no hace frío. Quería salir, sin embargo me quedo en casa. Mientras escucho la lluvia, preparo un café. Antes salía todos los días, pero ahora trabajo desde casa. Por eso tengo más tiempo y cocino mejor. Además, hablo con mi familia por teléfono cada tarde. No es un día alegre ni triste: es un día tranquilo. Cuando la lluvia para, abro la ventana y respiro. Quizá mañana haga sol. Por eso no me importa la lluvia de hoy.",
      questions: [
        { q: "¿Por qué se queda en casa?", options: ["porque hace frío", "porque llueve", "porque trabaja"], answer: 1 },
        { q: "¿Qué hace mientras escucha la lluvia?", options: ["prepara un café", "duerme", "llama a un amigo"], answer: 0 },
        { q: "¿Qué hará quizá mañana?", options: ["sol", "frío", "viento"], answer: 0 }
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("es", "texts", SEMA_TEXTS);
}
