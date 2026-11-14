/* A first reading for English: short, concrete, and answerable from the text. */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-en-market",
      title: "The Saturday market",
      level: 1,
      body: "On Saturday morning the market opens at seven. My mother buys bread, fruit and coffee. I buy water and take an apple for breakfast. The man at the stall smiles and says, “Good morning.” We pay and walk home. At home we drink coffee together. Then I read and my mother works in the garden.",
      questions: [
        { q: "What does the mother buy?", options: ["bread, fruit and coffee", "water and an apple", "flowers and milk"], answer: 0 },
        { q: "How do they get home?", options: ["by bus", "on foot", "by car"], answer: 1 },
      ]
    }
  ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("en", "texts", SEMA_TEXTS);
}
