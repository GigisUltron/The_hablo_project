/* sema — Turkish English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "tr-house": "house",
  "tr-door": "door",
  "tr-water": "water",
  "tr-bread": "bread",
  "tr-apple": "apple",
  "tr-coffee": "coffee",
  "tr-sun": "sun",
  "tr-moon": "moon",
  "tr-tree": "tree",
  "tr-sea": "sea",
  "tr-dog": "dog",
  "tr-cat": "cat",
  "tr-bird": "bird",
  "tr-hand": "hand",
  "tr-eye": "eye",
  "tr-heart": "heart",
  "tr-city": "city",
  "tr-car": "car",
  "tr-train": "train",
  "tr-street": "street",
  "tr-night": "night",
  "tr-day": "day",
  "tr-love": "love",
  "tr-eat": "to eat",

  /* phrases */
  "ph-tr-hello": "hello",
  "ph-tr-good-morning": "good morning",
  "ph-tr-good-night": "good night",
  "ph-tr-goodbye": "goodbye",
  "ph-tr-thank-you": "thank you",
  "ph-tr-please": "please",
  "ph-tr-excuse-me": "excuse me",
  "ph-tr-how-are-you": "how are you?",
  "ph-tr-my-name-is": "my name is …",
  "ph-tr-what-is-your-name": "what is your name?",
  "ph-tr-dont-understand": "I don't understand",
  "ph-tr-repeat": "can you repeat that?",
  "ph-tr-speak-slower": "can you speak more slowly?",
  "ph-tr-how-much": "how much does it cost?",
  "ph-tr-where-bathroom": "where is the bathroom?",
  "ph-tr-where-station": "where is the station?",
  "ph-tr-coffee": "a coffee, please",
  "ph-tr-bill": "the bill, please",
  "ph-tr-water": "water, please",
  "ph-tr-need-help": "I need help",
  "ph-tr-need-doctor": "I need a doctor",
  "ph-tr-lost": "I am lost",
  "ph-tr-speak-english": "do you speak English?",
  "ph-tr-dont-speak": "I don't speak the language",
  "ph-tr-nice-to-meet": "nice to meet you",
  "ph-tr-see-you": "see you tomorrow",
  "ph-tr-yes": "yes",
  "ph-tr-no": "no",
  "ph-tr-this-please": "this one, please",
  "ph-tr-hotel": "where is the hotel?",

  /* terms */
  "t-tr-already": "already",
  "t-tr-not-yet": "not yet",
  "t-tr-always": "always",
  "t-tr-never": "never",
  "t-tr-before": "before",
  "t-tr-after": "afterwards",
  "t-tr-maybe": "maybe",
  "t-tr-however": "however",

  /* grammar */
  "b-tr-ben": "I",
  "b-tr-sen": "you (informal)",
  "b-tr-o": "he",
  "b-tr-o-she": "she",
  "b-tr-biz": "we",
  "b-tr-onlar": "they",
  "b-tr-gidiyorum": "I go",
  "b-tr-gidiyorsun": "you go",
  "b-tr-gidiyor": "he / she goes",
  "b-tr-gidiyoruz": "we go",
  "b-tr-gidiyorlar": "they go",
  "b-tr-istiyorum": "I want",
  "b-tr-istiyorsun": "you want",
  "b-tr-istiyor": "he / she wants",
  "b-tr-istiyoruz": "we want",
  "b-tr-istiyorlar": "they want",
  "ph-tr-colour": "what is your favourite colour?",
  "ph-tr-where-from": "where are you from?",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("tr", "glosses", SEMA_GLOSSES);
}
