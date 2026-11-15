/* sema — Portuguese English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "pt-house": "house",
  "pt-door": "door",
  "pt-water": "water",
  "pt-bread": "bread",
  "pt-apple": "apple",
  "pt-coffee": "coffee",
  "pt-sun": "sun",
  "pt-moon": "moon",
  "pt-tree": "tree",
  "pt-sea": "sea",
  "pt-dog": "dog",
  "pt-cat": "cat",
  "pt-bird": "bird",
  "pt-hand": "hand",
  "pt-eye": "eye",
  "pt-heart": "heart",
  "pt-city": "city",
  "pt-car": "car",
  "pt-train": "train",
  "pt-street": "street",
  "pt-night": "night",
  "pt-day": "day",
  "pt-love": "love",
  "pt-eat": "to eat",

  /* phrases */
  "ph-pt-hello": "hello",
  "ph-pt-good-morning": "good morning",
  "ph-pt-good-night": "good night",
  "ph-pt-goodbye": "goodbye",
  "ph-pt-thank-you": "thank you",
  "ph-pt-please": "please",
  "ph-pt-excuse-me": "excuse me",
  "ph-pt-how-are-you": "how are you?",
  "ph-pt-my-name-is": "my name is …",
  "ph-pt-what-is-your-name": "what is your name?",
  "ph-pt-dont-understand": "I don't understand",
  "ph-pt-repeat": "can you repeat that?",
  "ph-pt-speak-slower": "can you speak more slowly?",
  "ph-pt-how-much": "how much does it cost?",
  "ph-pt-where-bathroom": "where is the bathroom?",
  "ph-pt-where-station": "where is the station?",
  "ph-pt-coffee": "a coffee, please",
  "ph-pt-bill": "the bill, please",
  "ph-pt-water": "water, please",
  "ph-pt-need-help": "I need help",
  "ph-pt-need-doctor": "I need a doctor",
  "ph-pt-lost": "I am lost",
  "ph-pt-speak-english": "do you speak English?",
  "ph-pt-dont-speak": "I don't speak the language",
  "ph-pt-nice-to-meet": "nice to meet you",
  "ph-pt-see-you": "see you tomorrow",
  "ph-pt-yes": "yes",
  "ph-pt-no": "no",
  "ph-pt-this-please": "this one, please",
  "ph-pt-hotel": "where is the hotel?",

  /* terms */
  "t-pt-already": "already",
  "t-pt-not-yet": "not yet",
  "t-pt-always": "always",
  "t-pt-never": "never",
  "t-pt-before": "before",
  "t-pt-after": "afterwards",
  "t-pt-maybe": "maybe",
  "t-pt-however": "however",

  /* grammar */
  "b-pt-eu": "I",
  "b-pt-tu": "you (informal)",
  "b-pt-ele": "he",
  "b-pt-ela": "she",
  "b-pt-nos": "we",
  "b-pt-eles": "they",
  "b-pt-sou": "I am",
  "b-pt-es": "you are",
  "b-pt-e": "he / she is",
  "b-pt-somos": "we are",
  "b-pt-sao": "they are",
  "b-pt-tenho": "I have",
  "b-pt-tens": "you have",
  "b-pt-tem": "he / she has",
  "b-pt-temos": "we have",
  "b-pt-tem-3p": "they have",
  "ph-pt-colour": "what is your favourite colour?",
  "ph-pt-where-from": "where are you from?",
  "ph-pt-reservation": "I have a reservation",
  "ph-pt-train-time": "what time does the train leave?",
  "ph-pt-pharmacy": "where is the pharmacy?",
  "ph-pt-hurts-here": "it hurts here",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("pt", "glosses", SEMA_GLOSSES);
}
