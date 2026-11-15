/* Name the mistake, do not just mark it.
 *
 * A tutor says "you dropped the article" or "watch the accent". A red cross
 * teaches nothing. This classifies the difference between what the learner
 * wrote and what was expected, using the same normalisation as the scorer.
 */
(function (root) {
  var ACCENTS = { a: "á", e: "é", i: "í", o: "ó", u: "ú", n: "ñ" };
  var ARTICLES = {
    es: ["el", "la", "los", "las", "un", "una"],
    fr: ["le", "la", "les", "un", "une", "des", "du"],
    it: ["il", "lo", "la", "i", "gli", "le", "un", "una", "uno"],
    pt: ["o", "a", "os", "as", "um", "uma"],
    de: ["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer"],
    nl: ["de", "het", "een"],
    en: ["the", "a", "an"]
  };

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function classify(said, expected, code) {
    var a = fold(said), b = fold(expected);
    if (!a) return "empty";
    if (a === b) return said.trim() === expected.trim() ? "ok" : "accents";

    var articles = ARTICLES[String(code || "es").toLowerCase()] || [];
    var wa = a.split(/\s+/), wb = b.split(/\s+/);
    var artA = wa.length > 1 && articles.indexOf(wa[0]) !== -1 ? wa[0] : null;
    var artB = wb.length > 1 && articles.indexOf(wb[0]) !== -1 ? wb[0] : null;
    if (artA && artB && wa.slice(1).join(" ") === wb.slice(1).join(" ")) return "article";
    if (artA && !artB && wa.slice(1).join(" ") === wb.join(" ")) return "extra-article";
    if (!artA && artB && wa.join(" ") === wb.slice(1).join(" ")) return "missing-article";
    return "spelling";
  }

  function message(kind, expected) {
    switch (kind) {
      case "ok": return "exactly right";
      case "accents": return "right word — check the accent";
      case "article": return "wrong article — it is \u201c" + expected + "\u201d";
      case "extra-article": return "no article here — just \u201c" + expected + "\u201d";
      case "missing-article": return "it needs one — \u201c" + expected + "\u201d";
      case "empty": return "nothing typed";
      default: return "spelling — it is \u201c" + expected + "\u201d";
    }
  }

  var api = { classify: classify, message: message, fold: fold };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaCorrect = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
