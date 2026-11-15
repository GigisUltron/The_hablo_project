/* sema — Dutch English glosses.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_GLOSSES = {
  /* concepts */
  "nl-house": "house",
  "nl-door": "door",
  "nl-water": "water",
  "nl-bread": "bread",
  "nl-apple": "apple",
  "nl-coffee": "coffee",
  "nl-sun": "sun",
  "nl-moon": "moon",
  "nl-tree": "tree",
  "nl-sea": "sea",
  "nl-dog": "dog",
  "nl-cat": "cat",
  "nl-bird": "bird",
  "nl-hand": "hand",
  "nl-eye": "eye",
  "nl-heart": "heart",
  "nl-city": "city",
  "nl-car": "car",
  "nl-train": "train",
  "nl-street": "street",
  "nl-night": "night",
  "nl-day": "day",
  "nl-love": "love",
  "nl-eat": "to eat",

  /* phrases */
  "ph-nl-hello": "hello",
  "ph-nl-good-morning": "good morning",
  "ph-nl-good-night": "good night",
  "ph-nl-goodbye": "goodbye",
  "ph-nl-thank-you": "thank you",
  "ph-nl-please": "please",
  "ph-nl-excuse-me": "excuse me",
  "ph-nl-how-are-you": "how are you?",
  "ph-nl-my-name-is": "my name is …",
  "ph-nl-what-is-your-name": "what is your name?",
  "ph-nl-dont-understand": "I don't understand",
  "ph-nl-repeat": "can you repeat that?",
  "ph-nl-speak-slower": "can you speak more slowly?",
  "ph-nl-how-much": "how much does it cost?",
  "ph-nl-where-bathroom": "where is the bathroom?",
  "ph-nl-where-station": "where is the station?",
  "ph-nl-coffee": "a coffee, please",
  "ph-nl-bill": "the bill, please",
  "ph-nl-water": "water, please",
  "ph-nl-need-help": "I need help",
  "ph-nl-need-doctor": "I need a doctor",
  "ph-nl-lost": "I am lost",
  "ph-nl-speak-english": "do you speak English?",
  "ph-nl-dont-speak": "I don't speak the language",
  "ph-nl-nice-to-meet": "nice to meet you",
  "ph-nl-see-you": "see you tomorrow",
  "ph-nl-yes": "yes",
  "ph-nl-no": "no",
  "ph-nl-this-please": "this one, please",
  "ph-nl-hotel": "where is the hotel?",

  /* terms */
  "t-nl-already": "already",
  "t-nl-not-yet": "not yet",
  "t-nl-always": "always",
  "t-nl-never": "never",
  "t-nl-before": "before",
  "t-nl-after": "afterwards",
  "t-nl-maybe": "maybe",
  "t-nl-however": "however",

  /* grammar */
  "b-nl-ik": "I",
  "b-nl-jij": "you (informal)",
  "b-nl-hij": "he",
  "b-nl-zij": "she",
  "b-nl-wij": "we",
  "b-nl-zij-3p": "they",
  "b-nl-ben": "I am",
  "b-nl-bent": "you are",
  "b-nl-is": "he / she is",
  "b-nl-zijn": "we are",
  "b-nl-zijn-3p": "they are",
  "b-nl-heb": "I have",
  "b-nl-hebt": "you have",
  "b-nl-heeft": "he / she has",
  "b-nl-hebben": "we have",
  "b-nl-hebben-3p": "they have",
  "ph-nl-colour": "what is your favourite colour?",
  "ph-nl-where-from": "where are you from?",
  "ph-nl-reservation": "I have a reservation",
  "ph-nl-train-time": "when does the train leave?",
  "ph-nl-pharmacy": "where is the pharmacy?",
  "ph-nl-hurts-here": "it hurts here",
  "ph-nl-pizza": "I'd like a pizza.",
  "ph-nl-vegetarian": "I'm vegetarian.",
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_GLOSSES;
if (typeof window !== "undefined") {
  window.SEMA_GLOSSES = SEMA_GLOSSES;
  if (window.SemaLangs) window.SemaLangs.define("nl", "glosses", SEMA_GLOSSES);
}
