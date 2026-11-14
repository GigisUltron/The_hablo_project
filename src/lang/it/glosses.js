/* sema — Italian English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "it-house": "house",
  "it-door": "door",
  "it-water": "water",
  "it-bread": "bread",
  "it-apple": "apple",
  "it-coffee": "coffee",
  "it-sun": "sun",
  "it-moon": "moon",
  "it-tree": "tree",
  "it-sea": "sea",
  "it-dog": "dog",
  "it-cat": "cat",
  "it-bird": "bird",
  "it-hand": "hand",
  "it-eye": "eye",
  "it-heart": "heart",
  "it-city": "city",
  "it-car": "car",
  "it-train": "train",
  "it-street": "street",
  "it-night": "night",
  "it-day": "day",
  "it-love": "love",
  "it-eat": "to eat",

  /* phrases */
  "ph-it-hello": "hello",
  "ph-it-good-morning": "good morning",
  "ph-it-good-night": "good night",
  "ph-it-goodbye": "goodbye",
  "ph-it-thank-you": "thank you",
  "ph-it-please": "please",
  "ph-it-excuse-me": "excuse me",
  "ph-it-how-are-you": "how are you?",
  "ph-it-my-name-is": "my name is …",
  "ph-it-what-is-your-name": "what is your name?",
  "ph-it-dont-understand": "I don't understand",
  "ph-it-repeat": "can you repeat that?",
  "ph-it-speak-slower": "can you speak more slowly?",
  "ph-it-how-much": "how much does it cost?",
  "ph-it-where-bathroom": "where is the bathroom?",
  "ph-it-where-station": "where is the station?",
  "ph-it-coffee": "a coffee, please",
  "ph-it-bill": "the bill, please",
  "ph-it-water": "water, please",
  "ph-it-need-help": "I need help",
  "ph-it-need-doctor": "I need a doctor",
  "ph-it-lost": "I am lost",
  "ph-it-speak-english": "do you speak English?",
  "ph-it-dont-speak": "I don't speak the language",
  "ph-it-nice-to-meet": "nice to meet you",
  "ph-it-see-you": "see you tomorrow",
  "ph-it-yes": "yes",
  "ph-it-no": "no",
  "ph-it-this-please": "this one, please",
  "ph-it-hotel": "where is the hotel?",

  /* terms */
  "t-it-already": "already",
  "t-it-not-yet": "not yet",
  "t-it-always": "always",
  "t-it-never": "never",
  "t-it-before": "before",
  "t-it-after": "afterwards",
  "t-it-maybe": "maybe",
  "t-it-however": "however",

  /* grammar */
  "b-it-io": "I",
  "b-it-tu": "you (informal)",
  "b-it-lui": "he",
  "b-it-lei": "she",
  "b-it-noi": "we",
  "b-it-loro": "they",
  "b-it-sono": "I am",
  "b-it-sei": "you are",
  "b-it-e": "he / she is",
  "b-it-siamo": "we are",
  "b-it-sono-3p": "they are",
  "b-it-ho": "I have",
  "b-it-hai": "you have",
  "b-it-ha": "he / she has",
  "b-it-abbiamo": "we have",
  "b-it-hanno": "they have",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("it", "glosses", SEMA_GLOSSES);
}
