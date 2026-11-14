/* Pinyin under the character.
 *
 * A reading aid, not a second line: each Han character carries its own
 * syllable. The data gives pinyin as word-spaced syllables (`nǐ hǎo`), so a
 * character can only be annotated when the counts agree - one syllable per Han
 * character, punctuation aside. When they do not, this returns the plain text
 * and the caller keeps showing the reading on its own line: guessing a split
 * would teach the wrong sound.
 *
 * Pure and dependency-free so it can be tested without a DOM.
 */
(function (root) {
  "use strict";

  function isHan(ch) {
    try { return /\p{Script=Han}/u.test(String(ch)); }
    catch (err) {
      /* engines without Unicode property escapes: the four common Han blocks */
      return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ud840-\ud87f]/.test(String(ch));
    }
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function syllables(pinyin) {
    return String(pinyin == null ? "" : pinyin).trim().split(/\s+/).filter(Boolean);
  }

  /* Can this reading be placed character by character? */
  function aligns(text, pinyin) {
    var chars = Array.from(String(text == null ? "" : text));
    var han = chars.filter(isHan).length;
    if (!han) return false;
    return syllables(pinyin).length === han;
  }

  function html(text, pinyin) {
    if (!aligns(text, pinyin)) return esc(text);
    var parts = syllables(pinyin);
    var at = 0;
    return Array.from(String(text)).map(function (ch) {
      if (!isHan(ch)) return esc(ch);
      var rt = esc(parts[at]);
      at += 1;
      return "<ruby>" + esc(ch) + "<rt>" + rt + "</rt></ruby>";
    }).join("");
  }

  var api = { html: html, aligns: aligns, isHan: isHan };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaRuby = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
