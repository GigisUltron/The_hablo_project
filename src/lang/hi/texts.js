/* sema — Hindi reading deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TEXTS = {
  texts: [
    {
      id: "tx-hi-bazaar",
      title: "शनिवार का बाज़ार",
      level: 1,
      body: "शनिवार की सुबह मोहल्ले का बाज़ार सात बजे खुलता है। मेरी माँ रोटी, फल और कॉफ़ी खरीदती है। मैं पानी खरीदता हूँ और नाश्ते के लिए एक सेब लेता हूँ। दुकानदार मुस्कुराता है और कहता है: «सुप्रभात»। हम पैसे देते हैं और पैदल घर लौटते हैं। घर पर हम साथ में कॉफ़ी पीते हैं। फिर मैं पढ़ता हूँ और माँ बगीचे में काम करती है।",
      questions: [
        { q: "माँ क्या खरीदती है?", options: ["रोटी, फल और कॉफ़ी", "पानी और सेब", "फूल और दूध"], answer: 0 },
        { q: "वे घर कैसे लौटते हैं?", options: ["बस से", "पैदल", "गाड़ी से"], answer: 1 },
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TEXTS;
if (typeof window !== "undefined") {
  window.SEMA_TEXTS = SEMA_TEXTS;
  if (window.SemaLangs) window.SemaLangs.define("hi", "texts", SEMA_TEXTS);
}
