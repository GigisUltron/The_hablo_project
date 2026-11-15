/* sema — Chinese English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "zh-house": "house",
  "zh-door": "door",
  "zh-water": "water",
  "zh-bread": "bread",
  "zh-apple": "apple",
  "zh-coffee": "coffee",
  "zh-sun": "sun",
  "zh-moon": "moon",
  "zh-tree": "tree",
  "zh-sea": "sea",
  "zh-dog": "dog",
  "zh-cat": "cat",
  "zh-bird": "bird",
  "zh-hand": "hand",
  "zh-eye": "eye",
  "zh-heart": "heart",
  "zh-city": "city",
  "zh-car": "car",
  "zh-train": "train",
  "zh-street": "street",
  "zh-night": "night",
  "zh-day": "day",
  "zh-love": "love",
  "zh-eat": "to eat",

  /* phrases */
  "ph-zh-hello": "hello",
  "ph-zh-good-morning": "good morning",
  "ph-zh-good-night": "good night",
  "ph-zh-goodbye": "goodbye",
  "ph-zh-thank-you": "thank you",
  "ph-zh-please": "please",
  "ph-zh-excuse-me": "excuse me",
  "ph-zh-how-are-you": "how are you?",
  "ph-zh-my-name-is": "my name is …",
  "ph-zh-what-is-your-name": "what is your name?",
  "ph-zh-dont-understand": "I don't understand",
  "ph-zh-repeat": "can you repeat that?",
  "ph-zh-speak-slower": "can you speak more slowly?",
  "ph-zh-how-much": "how much does it cost?",
  "ph-zh-where-bathroom": "where is the bathroom?",
  "ph-zh-where-station": "where is the station?",
  "ph-zh-coffee": "a coffee, please",
  "ph-zh-bill": "the bill, please",
  "ph-zh-water": "water, please",
  "ph-zh-need-help": "I need help",
  "ph-zh-need-doctor": "I need a doctor",
  "ph-zh-lost": "I am lost",
  "ph-zh-speak-english": "do you speak English?",
  "ph-zh-dont-speak": "I don't speak the language",
  "ph-zh-nice-to-meet": "nice to meet you",
  "ph-zh-see-you": "see you tomorrow",
  "ph-zh-yes": "yes",
  "ph-zh-no": "no",
  "ph-zh-this-please": "this one, please",
  "ph-zh-hotel": "where is the hotel?",

  /* terms */
  "t-zh-already": "already",
  "t-zh-not-yet": "not yet",
  "t-zh-always": "always",
  "t-zh-never": "never",
  "t-zh-before": "before",
  "t-zh-after": "afterwards",
  "t-zh-maybe": "maybe",
  "t-zh-however": "however",

  /* grammar */
  "b-zh-wo": "I",
  "b-zh-ni": "you",
  "b-zh-ta": "he",
  "b-zh-ta-she": "she",
  "b-zh-women": "we",
  "b-zh-tamen": "they",
  "b-zh-shi": "to be",
  "b-zh-bushi": "to not be",
  "ph-zh-colour": "what is your favourite colour?",
  "ph-zh-where-from": "where are you from?",
  "ph-zh-reservation": "I have a reservation",
  "ph-zh-train-time": "what time does the train leave?",
  "ph-zh-pharmacy": "where is the pharmacy?",
  "ph-zh-hurts-here": "it hurts here",
  "b-zh-chi": "to eat",
  "b-zh-he": "to drink",
  "b-zh-qu": "to go",
  "b-zh-lai": "to come",
  "b-zh-mai": "to buy",
  "ph-zh-pizza": "I'd like a pizza.",
  "ph-zh-vegetarian": "I'm vegetarian.",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("zh", "glosses", SEMA_GLOSSES);
}
