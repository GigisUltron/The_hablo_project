/* sema — German English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "house": "house",
  "door": "door",
  "water": "water",
  "bread": "bread",
  "apple": "apple",
  "coffee": "coffee",
  "sun": "sun",
  "moon": "moon",
  "tree": "tree",
  "sea": "sea",
  "dog": "dog",
  "cat": "cat",
  "bird": "bird",
  "hand": "hand",
  "eye": "eye",
  "heart": "heart",
  "city": "city",
  "car": "car",
  "train": "train",
  "street": "street",
  "night": "night",
  "day": "day",
  "love": "love",
  "eat": "to eat",

  /* phrases */
  "ph-hello": "hello",
  "ph-good-morning": "good morning",
  "ph-good-night": "good night",
  "ph-goodbye": "goodbye",
  "ph-thank-you": "thank you",
  "ph-please": "please",
  "ph-excuse-me": "excuse me",
  "ph-how-are-you": "how are you?",
  "ph-my-name-is": "my name is …",
  "ph-what-is-your-name": "what is your name?",
  "ph-dont-understand": "I don't understand",
  "ph-repeat": "can you repeat that?",
  "ph-speak-slower": "can you speak more slowly?",
  "ph-how-much": "how much does it cost?",
  "ph-where-bathroom": "where is the bathroom?",
  "ph-where-station": "where is the station?",
  "ph-coffee": "a coffee, please",
  "ph-bill": "the bill, please",
  "ph-water": "water, please",
  "ph-need-help": "I need help",
  "ph-need-doctor": "I need a doctor",
  "ph-lost": "I am lost",
  "ph-speak-english": "do you speak English?",
  "ph-dont-speak": "I don't speak the language",
  "ph-nice-to-meet": "nice to meet you",
  "ph-see-you": "see you tomorrow",
  "ph-yes": "yes",
  "ph-no": "no",
  "ph-this-please": "this one, please",
  "ph-hotel": "where is the hotel?",

  /* terms */
  "t-already": "already",
  "t-not-yet": "not yet",
  "t-always": "always",
  "t-never": "never",
  "t-before": "before",
  "t-after": "afterwards",
  "t-maybe": "maybe",
  "t-however": "however",

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
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("de", "glosses", SEMA_GLOSSES);
}
