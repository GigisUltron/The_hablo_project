/* sema — Hindi connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-already", text: "पहले से", gloss: "already", schema: "clock",
      frame: "मैंने काम ____ पूरा कर लिया है।", contrast: "t-not-yet" },
    { id: "t-not-yet", text: "अभी नहीं", gloss: "not yet", schema: "clock",
      frame: "मैंने काम ____ पूरा किया है।", contrast: "t-already" },
    { id: "t-always", text: "हमेशा", gloss: "always", schema: "repeat",
      frame: "मैं सुबह ____ कॉफ़ी पीता हूँ।", contrast: "t-never" },
    { id: "t-never", text: "कभी नहीं", gloss: "never", schema: "repeat",
      frame: "मैं वहाँ ____ गया हूँ।", contrast: "t-always" },
    { id: "t-before", text: "पहले", gloss: "before", schema: "left",
      frame: "____ मैं दूसरे शहर में रहता था।", contrast: "t-after" },
    { id: "t-after", text: "बाद में", gloss: "afterwards", schema: "right",
      frame: "पहले वह खाता है, ____ सोता है।", contrast: "t-before" },
    { id: "t-maybe", text: "शायद", gloss: "maybe", schema: "question",
      frame: "____ वह कल आएगा।", contrast: null },
    { id: "t-however", text: "लेकिन", gloss: "however", schema: "balance",
      frame: "यह महंगा है; ____, मैं इसे खरीदता हूँ।", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("hi", "terms", SEMA_TERMS);
}
