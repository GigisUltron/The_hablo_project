/* Reading — graded texts. `band` is the CEFR grade; `level` is the reader's
 * numeric shelf. Every wrong option carries a why. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-en-market",
      title: "The Saturday market",
      level: 1,
      band: "A1",
      body: "On Saturday morning the market opens at seven. My mother buys bread, fruit and coffee. I buy water and take an apple for breakfast. The man at the stall smiles and says, “Good morning.” We pay and walk home. At home we drink coffee together. Then I read and my mother works in the garden. In the evening, the neighbours come back to the market for a drink and talk about the week until the stalls close and the lights go out.",
      questions: [
        {"q": "What does the mother buy?", "options": ["bread, fruit and coffee", "water and an apple", "flowers and milk"], "answer": 0, "why": ["", "the narrator buys water and an apple", "the text does not mention flowers"]},
        {"q": "How do they get home?", "options": ["by bus", "on foot", "by car"], "answer": 1, "why": ["the text says they walk", "", "the text does not mention a car"]},
        {"q": "Who comes in the evening?", "options": ["the neighbours", "the workers", "the students"], "answer": 0, "why": ["", "the workers come in the morning", "the students come in the afternoon"]},
      ]
    },
    {
      id: "tx-en-train",
      title: "The six o'clock train",
      level: 2,
      band: "A2",
      body: "The six o'clock train leaves from the central station. That morning I arrived one minute too late: the doors were already closed. I ran along the platform, but the train began to move. An official told me to wait for the next one. I drank a coffee and watched the travellers. The next train came at eight. I got on, found a seat by the window and finally breathed. The delay cost me an hour, but it gave me a book and a coffee.",
      questions: [
        {"q": "Why did the narrator miss the train?", "options": ["they arrived one minute too late", "the train left early", "they were on the wrong platform"], "answer": 0, "why": ["", "the text does not say it left early", "they ran along the right platform"]},
        {"q": "What did they do while waiting?", "options": ["drank a coffee and watched people", "went home", "called work"], "answer": 0, "why": ["", "they stayed at the station", "the text does not mention a call"]},
        {"q": "How do they feel at the end?", "options": ["angry with the official", "relieved despite the delay", "anxious to leave again"], "answer": 1, "why": ["they do not criticise the official", "", "they have just sat down and breathed"]},
      ]
    },
    {
      id: "tx-en-bakery",
      title: "The bakery that closed",
      level: 3,
      band: "B1",
      body: "The bakery on the corner closed in spring. The owner wanted to retire, and nobody took over the business. Since then, mornings are quieter: people have to walk to the supermarket, where the bread is worse and the queues are longer. The neighbours talk about opening a shop, but the rent is too high. Last week, however, a young woman came by. She looked at the window, took some photos and asked the price of the rent. Nobody knows yet whether she will come back. For now the bakery stays closed, and everyone hopes.",
      questions: [
        {"q": "Why did the bakery close?", "options": ["the owner was retiring", "the bread was bad", "the rent was too low"], "answer": 0, "why": ["", "the bread was good", "the text mentions high rent, not low rent"]},
        {"q": "What do the neighbours do now?", "options": ["they go to the supermarket", "they bake their own bread", "they have opened a shop"], "answer": 0, "why": ["", "this is not stated", "they only talk about it"]},
        {"q": "What does the young woman's visit suggest?", "options": ["she may want to take over the shop", "she is the new baker", "she wants to buy the photos"], "answer": 0, "why": ["", "nobody knows if she will return", "she took photos of the window"]},
      ]
    },
    {
      id: "tx-en-box",
      title: "The moving box",
      level: 4,
      band: "B2",
      body: "The box had stayed in the hallway for three weeks. Nobody knew who it belonged to. It was sealed with tape and had an unreadable label. One day the neighbour from downstairs asked if she could open it. Inside were books, a photo of a beach and a letter with no addressee. The letter said: “If you find this box, keep the books and forget the rest.” The neighbour kept the books. She never found out who had written the letter, but since then she reads a little every evening.",
      questions: [
        {"q": "Whose box was it?", "options": ["nobody knows", "the neighbour downstairs", "the previous tenant"], "answer": 0, "why": ["", "she is the one who opens it", "the text does not name the tenant"]},
        {"q": "What did the neighbour keep?", "options": ["the books", "the letter", "the photo"], "answer": 0, "why": ["", "the letter is not mentioned again", "the photo is not mentioned again"]},
        {"q": "What does “forget the rest” suggest?", "options": ["the other things mattered less", "everything should be thrown away", "the letter was fake"], "answer": 0, "why": ["", "the books are kept, not everything", "nothing says the letter is fake"]},
      ]
    },
    {
      id: "tx-en-silence",
      title: "What the silence says",
      level: 4,
      band: "C1",
      body: "People often say that neighbourhoods change when the residents leave. But they also change when the residents stay and their habits shift. In my building, the same people have lived here for twenty years. Yet the dinners on the balconies have disappeared, the doors close earlier and the hallways are silent. Nobody has complained. The silence is not a departure; it is another way of staying. Sometimes I meet a neighbour on the stairs and we talk about the rain. We no longer know what to say about anything else. The neighbourhood has not lost its residents; it has lost its occasions to talk.",
      questions: [
        {"q": "What does “the silence is not a departure” mean?", "options": ["the residents stayed but talk less", "everyone moved away", "the nights are quieter"], "answer": 0, "why": ["", "the author says they stayed", "the text is about conversation, not night noise"]},
        {"q": "What is the tone of the text?", "options": ["nostalgic and clear-eyed", "cheerful and light", "aggressive"], "answer": 0, "why": ["", "it notices a loss, without cheer", "it attacks nobody"]},
        {"q": "What does the author miss most?", "options": ["the dinners on the balconies", "the occasions to talk", "the price of the flats"], "answer": 1, "why": ["the dinners are one example", "", "the price is not mentioned"]},
      ]
    },
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("en", "texts", SEMA_TEXTS);
}
