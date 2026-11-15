/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-mercado",
      title: "El mercado",
      level: 1,
      band: "A1",
      body: "El mercado abre muy temprano. Mi madre compra pan y manzanas. Yo compro café y leche. El pan está fresco y huele muy bien. La mujer del puesto sonríe y dice: «Buenos días». Pagamos con dinero y volvemos a casa. En casa desayunamos juntos. Mi padre bebe café y yo bebo agua. Después yo estudio y mi madre trabaja. Por la noche cenamos y hablamos del día. El mercado es mi lugar favorito del barrio. El pan de casa siempre está fresco.",
      questions: [
        {"q": "¿Qué compra la madre?", "options": ["pan y manzanas", "café y leche", "agua y sal"], "answer": 0, "why": ["", "eso lo compra el hijo", "el agua no se compra aquí"]},
        {"q": "¿Cuándo abre el mercado?", "options": ["por la noche", "muy temprano", "por la tarde"], "answer": 1, "why": ["el texto dice temprano, no de noche", "", "el texto no habla de la tarde"]},
        {"q": "¿Quién bebe café en casa?", "options": ["el padre", "la madre", "el hijo"], "answer": 0, "why": ["", "la madre no bebe café en casa", "el hijo bebe agua"]},
      ]
    },
    {
      id: "tx-tren",
      title: "Un viaje en tren",
      level: 2,
      band: "A2",
      body: "Ayer viajé en tren a otra ciudad. El billete costó poco. El tren salió a las ocho y llegó a las diez. En el andén había mucha gente. Me senté cerca de la ventana y miré el mar. El viaje fue tranquilo y corto. Cuando llegué, busqué la estación de autobús. Pregunté a una mujer: «¿Dónde está el centro?». Ella me dijo: «Gira a la derecha y camina cinco minutos». Encontré el centro sin problema. Compré un café y llamé a mi familia.",
      questions: [
        {"q": "¿Cómo viajó?", "options": ["en coche", "en tren", "en autobús"], "answer": 1, "why": ["no viajó en coche", "", "el texto dice que viajó en tren"]},
        {"q": "¿Qué miró por la ventana?", "options": ["el mar", "una montaña", "la ciudad"], "answer": 0, "why": ["", "no menciona una montaña", "la ciudad no se ve por la ventana"]},
        {"q": "¿A quién preguntó?", "options": ["a un hombre", "a una mujer", "a un niño"], "answer": 1, "why": ["preguntó a una mujer", "", "no habla con un niño"]},
      ]
    },
    {
      id: "tx-es-receta",
      title: "La receta de la abuela",
      level: 2,
      band: "A2",
      body: "Los domingos, mi abuela cocina tortilla de patatas para toda la familia. Primero pela las patatas y las corta en trozos finos. Después las fríe despacio en aceite de oliva, con un poco de sal. Mientras se hacen, bate seis huevos en un bol grande. Cuando las patatas están blandas, las mezcla con el huevo y lo deja reposar cinco minutos. Luego pone todo en una sartén y espera. A mí me gusta la tortilla un poco jugosa, pero mi madre prefiere que esté bien cuajada. Al final, mi abuela la sirve con pan y tomate. Nadie habla mucho durante la comida: todos comemos.",
      questions: [
        {"q": "¿Qué cocina la abuela los domingos?", "options": ["tortilla de patatas", "paella", "sopa de tomate"], "answer": 0, "why": ["", "la paella no aparece en el texto", "la sopa tampoco aparece en el texto"]},
        {"q": "¿Cuántos huevos bate?", "options": ["cuatro", "seis", "diez"], "answer": 1, "why": ["el texto dice seis, no cuatro", "", "tampoco dice diez"]},
        {"q": "¿Cómo prefiere la tortilla el narrador?", "options": ["bien cuajada", "un poco jugosa", "fría"], "answer": 1, "why": ["eso lo prefiere su madre", "", "el texto no dice que la quiera fría"]},
      ]
    },
    {
      id: "tx-lluvia",
      title: "La lluvia",
      level: 3,
      band: "B1",
      body: "Hoy llueve, aunque no hace frío. Quería salir, sin embargo me quedo en casa. Mientras escucho la lluvia, preparo un café. Antes salía todos los días, pero ahora trabajo desde casa. Por eso tengo más tiempo y cocino mejor. Además, hablo con mi familia por teléfono cada tarde. No es un día alegre ni triste: es un día tranquilo. Cuando la lluvia para, abro la ventana y respiro. Quizá mañana haga sol. Por eso no me importa la lluvia de hoy.",
      questions: [
        {"q": "¿Por qué se queda en casa?", "options": ["porque hace frío", "porque llueve", "porque trabaja"], "answer": 1, "why": ["dice que no hace frío", "", "trabaja, pero se queda por la lluvia"]},
        {"q": "¿Qué hace mientras escucha la lluvia?", "options": ["prepara un café", "duerme", "llama a un amigo"], "answer": 0, "why": ["", "no duerme", "llama a la familia por la tarde, no mientras"]},
        {"q": "¿Qué hará quizá mañana?", "options": ["sol", "frío", "viento"], "answer": 0, "why": ["", "dice que quizá haga sol", "no menciona viento"]},
      ]
    },
    {
      id: "tx-es-huerto",
      title: "El huerto del barrio",
      level: 3,
      band: "B1",
      body: "En el solar vacío de mi calle, un grupo de vecinos ha creado un huerto comunitario. Al principio, el ayuntamiento no quería ceder el terreno, porque decía que era para construir viviendas. Después de varias reuniones, aceptó prestarlo durante cinco años. Hoy hay tomates, calabacines y hierbas aromáticas, y cada familia cuida una pequeña parcela. Los martes por la tarde, quien puede se queda a regar y a charlar. Aunque el huerto no produce comida para todo el barrio, sí ha cambiado algo más importante: gente que vivía en el mismo edificio y no se saludaba ahora comparte herramientas y consejos. Si el proyecto sigue adelante, el año que viene abrirán también un taller para niños.",
      questions: [
        {"q": "¿Qué quería hacer el ayuntamiento con el solar?", "options": ["construir viviendas", "abrir un parque", "venderlo a una empresa"], "answer": 0, "why": ["", "el texto no menciona un parque", "habla de viviendas, no de venderlo a una empresa"]},
        {"q": "¿Qué ha cambiado, sobre todo, con el huerto?", "options": ["produce comida para todo el barrio", "ha unido a los vecinos", "ha reducido el ruido"], "answer": 1, "why": ["el texto dice que no produce para todo el barrio", "", "no se habla de ruido"]},
        {"q": "¿Qué pasará el año que viene si el proyecto sigue?", "options": ["un taller para niños", "un mercado nuevo", "más viviendas"], "answer": 0, "why": ["", "no se menciona un mercado", "las viviendas eran el plan anterior del ayuntamiento"]},
      ]
    },
    {
      id: "tx-barrio",
      title: "El barrio que cambia",
      level: 4,
      band: "B1",
      body: "Cuando llegué a este barrio, hace diez años, había una panadería en cada esquina. Ahora solo queda una, aunque el pan sigue siendo bueno. Mucha gente se queja de que los alquileres suban cada año y, sin embargo, nadie se va: el barrio está cerca del centro y las escuelas son buenas. Quizá lo que más ha cambiado sea el ruido. Antes se oían voces en la calle hasta tarde; hoy se oyen obras. Si el ayuntamiento no hiciera nada, dentro de cinco años no quedaría ningún vecino de los de antes. Aunque, pensándolo bien, eso mismo decían hace diez años.",
      questions: [
        {"q": "¿Qué quiere decir el autor sobre el barrio?", "options": ["que ha empeorado del todo", "que cambia pero conserva algo", "que ya no vive nadie"], "answer": 1, "why": ["reconoce cosas buenas, como el pan", "", "dice que la gente sigue viviendo allí"]},
        {"q": "¿Por qué no se marcha la gente?", "options": ["por la situación y las escuelas", "porque no pueden vender", "porque no les importa el precio"], "answer": 0, "why": ["", "el texto no habla de ventas", "se quejan del precio: sí les importa"]},
        {"q": "¿Qué tono tiene la última frase?", "options": ["irónico", "enfadado", "neutro"], "answer": 0, "why": ["", "no hay enfado, hay ironía", "repite una queja antigua: no es neutro"]},
      ]
    },
    {
      id: "tx-es-plaza",
      title: "El ruido que volvió",
      level: 4,
      band: "C1",
      body: "Durante años, la plaza fue un aparcamiento. Los vecinos se quejaban del ruido de los coches, pero nadie imaginaba que, al quitarlo, el silencio sería peor. Ahora hay un parque, y por la noche se oyen voces, risas y una guitarra. Mi vecina, que entonces pedía más plazas, dice que no cambiaría el parque por nada. Yo no estoy tan seguro: a las dos de la mañana, el ruido también cansa. Pero cuando veo a los niños jugar donde antes había coches, pienso que el barrio ha ganado algo que no se compra. Quizá el problema no sea el ruido, sino quién lo hace.",
      questions: [
        {"q": "¿Qué había antes en la plaza?", "options": ["un aparcamiento", "un parque", "una escuela"], "answer": 0, "why": ["", "eso es lo que hay ahora", "el texto no menciona una escuela"]},
        {"q": "¿Qué piensa el narrador del cambio?", "options": ["que solo ha traído cosas buenas", "que tiene ventajas e inconvenientes", "que fue un error volver al parque"], "answer": 1, "why": ["reconoce que el ruido también cansa", "", "dice que el barrio ha ganado algo"]},
        {"q": "¿Qué sugiere la última frase?", "options": ["que el ruido depende de quién lo produce", "que hay que cerrar el parque", "que los niños no deben jugar de noche"], "answer": 0, "why": ["", "no pide cerrarlo", "no habla de prohibir el juego"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("es", "texts", SEMA_TEXTS);
}
