/* Bind the generated manifest to its pack. Loaded immediately after
 * assets/audio/tr/manifest.js, before another pack can overwrite
 * window.SEMA_AUDIO. */
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("tr", "audio", window.SEMA_AUDIO || {});
}
