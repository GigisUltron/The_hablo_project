/* sema — Hindi connector deck.
 *
 * Generated from the shared deck, then checked item by item. The
 * shape is the same as every other pack: no English gloss here, and
 * every item is graded in levels.js.
 */
var SEMA_TERMS = {
  terms: [
    { id: "t-hi-already", text: "पहले से", gloss: "already", schema: "clock",
      frame: "मैंने काम ____ पूरा कर लिया है।", contrast: "t-hi-not-yet" },
    { id: "t-hi-not-yet", text: "अभी नहीं", gloss: "not yet", schema: "clock",
      frame: "मैंने काम ____ पूरा किया है।", contrast: "t-hi-already" },
    { id: "t-hi-always", text: "हमेशा", gloss: "always", schema: "repeat",
      frame: "मैं सुबह ____ कॉफ़ी पीता हूँ।", contrast: "t-hi-never" },
    { id: "t-hi-never", text: "कभी नहीं", gloss: "never", schema: "repeat",
      frame: "मैं वहाँ ____ गया हूँ।", contrast: "t-hi-always" },
    { id: "t-hi-before", text: "पहले", gloss: "before", schema: "left",
      frame: "____ मैं दूसरे शहर में रहता था।", contrast: "t-hi-after" },
    { id: "t-hi-after", text: "बाद में", gloss: "afterwards", schema: "right",
      frame: "पहले वह खाता है, ____ सोता है।", contrast: "t-hi-before" },
    { id: "t-hi-maybe", text: "शायद", gloss: "maybe", schema: "question",
      frame: "____ वह कल आएगा।", contrast: null },
    { id: "t-hi-however", text: "लेकिन", gloss: "however", schema: "balance",
      frame: "यह महंगा है; ____, मैं इसे खरीदता हूँ।", contrast: null },
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = SEMA_TERMS;
if (typeof window !== "undefined") {
  window.SEMA_TERMS = SEMA_TERMS;
  if (window.SemaLangs) window.SemaLangs.define("hi", "terms", SEMA_TERMS);
}
