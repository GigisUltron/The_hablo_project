/* Bind the generated French manifest to its pack.
 *
 * Loaded immediately after assets/audio/fr/manifest.js, while that manifest is
 * still the value of window.SEMA_AUDIO. */
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("fr", "audio", window.SEMA_AUDIO || {});
}
