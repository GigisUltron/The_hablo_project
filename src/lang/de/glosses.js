/* sema — German English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "de-house": "house",
  "de-door": "door",
  "de-water": "water",
  "de-bread": "bread",
  "de-apple": "apple",
  "de-coffee": "coffee",
  "de-sun": "sun",
  "de-moon": "moon",
  "de-tree": "tree",
  "de-sea": "sea",
  "de-dog": "dog",
  "de-cat": "cat",
  "de-bird": "bird",
  "de-hand": "hand",
  "de-eye": "eye",
  "de-heart": "heart",
  "de-city": "city",
  "de-car": "car",
  "de-train": "train",
  "de-street": "street",
  "de-night": "night",
  "de-day": "day",
  "de-love": "love",
  "de-eat": "to eat",

  /* phrases */
  "ph-de-hello": "hello",
  "ph-de-good-morning": "good morning",
  "ph-de-good-night": "good night",
  "ph-de-goodbye": "goodbye",
  "ph-de-thank-you": "thank you",
  "ph-de-please": "please",
  "ph-de-excuse-me": "excuse me",
  "ph-de-how-are-you": "how are you?",
  "ph-de-my-name-is": "my name is …",
  "ph-de-what-is-your-name": "what is your name?",
  "ph-de-dont-understand": "I don't understand",
  "ph-de-repeat": "can you repeat that?",
  "ph-de-speak-slower": "can you speak more slowly?",
  "ph-de-how-much": "how much does it cost?",
  "ph-de-where-bathroom": "where is the bathroom?",
  "ph-de-where-station": "where is the station?",
  "ph-de-coffee": "a coffee, please",
  "ph-de-bill": "the bill, please",
  "ph-de-water": "water, please",
  "ph-de-need-help": "I need help",
  "ph-de-need-doctor": "I need a doctor",
  "ph-de-lost": "I am lost",
  "ph-de-speak-english": "do you speak English?",
  "ph-de-dont-speak": "I don't speak the language",
  "ph-de-nice-to-meet": "nice to meet you",
  "ph-de-see-you": "see you tomorrow",
  "ph-de-yes": "yes",
  "ph-de-no": "no",
  "ph-de-this-please": "this one, please",
  "ph-de-hotel": "where is the hotel?",

  /* terms */
  "t-de-already": "already",
  "t-de-not-yet": "not yet",
  "t-de-always": "always",
  "t-de-never": "never",
  "t-de-before": "before",
  "t-de-after": "afterwards",
  "t-de-maybe": "maybe",
  "t-de-however": "however",

  /* grammar */
  "b-de-ich": "I",
  "b-de-du": "you (informal)",
  "b-de-er": "he",
  "b-de-sie": "she",
  "b-de-wir": "we",
  "b-de-sie-3p": "they",
  "b-de-bin": "I am",
  "b-de-bist": "you are",
  "b-de-ist": "he / she is",
  "b-de-sind": "we are",
  "b-de-sind-3p": "they are",
  "b-de-habe": "I have",
  "b-de-hast": "you have",
  "b-de-hat": "he / she has",
  "b-de-haben": "we have",
  "b-de-haben-3p": "they have",
  "ph-de-colour": "what is your favourite colour?",
  "ph-de-where-from": "where are you from?",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("de", "glosses", SEMA_GLOSSES);
}
