/* Curriculum selection: which real phrases belong to a tutor lesson.
 *
 * Packs with an authored `topic` use it directly. Starter packs predate the
 * field, so their ids still name the situation; that is enough to place them
 * in the first five lessons without inventing content.
 */
var SEMA_CURRICULUM = (function () {
  "use strict";

  var TOPIC_OF_SLUG = {
    "hello": "greetings", "good-morning": "greetings", "good-night": "greetings",
    "goodbye": "greetings", "see-you": "greetings", "how-are-you": "greetings",
    "nice-to-meet": "introductions", "my-name-is": "introductions",
    "what-is-your-name": "introductions", "where-from": "introductions",
    "speak-english": "introductions", "dont-speak": "introductions",
    "thank-you": "courtesy", "please": "courtesy", "excuse-me": "courtesy",
    "yes": "courtesy", "no": "courtesy", "this-please": "courtesy",
    "repeat": "courtesy", "speak-slower": "courtesy", "dont-understand": "courtesy",
    "coffee": "café", "water": "café", "bill": "café", "how-much": "café",
    "reservation": "hotel", "train-time": "station", "pharmacy": "pharmacy", "hurts-here": "emergency",
    "cousin": "family", "wedding": "family", "congratulations": "family", "family": "family", "arrived-wedding": "family",
    "where-bathroom": "directions", "where-station": "directions", "lost": "directions",
    "need-help": "emergency", "need-doctor": "emergency", "hotel": "hotel", "colour": "small-talk"
  };

  function topicOf(phrase) {
    if (!phrase) return "";
    if (phrase.topic) return phrase.topic;
    var id = String(phrase.id || "");
    var m = id.match(/^ph-([a-z]{2})-(.+)$/);
    var slug = m ? m[2] : id.replace(/^ph-/, "");
    return TOPIC_OF_SLUG[slug] || "";
  }

  function matches(phrase, unit) {
    if (!unit || !unit.topics || !unit.topics.length) return true;
    var topic = topicOf(phrase);
    return !!topic && unit.topics.indexOf(topic) !== -1;
  }

  function count(unit, phrases) {
    if (!unit || !unit.topics || !unit.topics.length) return Infinity;
    return (phrases || []).filter(function (p) { return matches(p, unit); }).length;
  }

  /* Only show a lesson a pack can actually teach. The first five always show:
   * they are the tutor's opening conversations and may lean on one real phrase
   * plus the words and grammar around it. Later lessons need real material. */
  function available(units, phrases) {
    return (units || []).filter(function (unit) {
      if (unit.mode === "script" || unit.mode === "read") return true;
      if (/^c[1-5]$/.test(unit.id)) return true;
      return count(unit, phrases) >= 2;
    });
  }

  var api = { TOPIC_OF_SLUG: TOPIC_OF_SLUG, topicOf: topicOf, matches: matches, count: count, available: available };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaCurriculum = api;
  return api;
})();
