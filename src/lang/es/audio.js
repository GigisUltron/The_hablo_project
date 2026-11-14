/* Bind the generated Spanish manifest to its pack.
 *
 * Loaded immediately after assets/audio/manifest.js, before any other pack's
 * manifest can overwrite window.SEMA_AUDIO. */
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("es", "audio", window.SEMA_AUDIO || {});
}
