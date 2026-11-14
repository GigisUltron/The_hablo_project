/* Bind the generated manifest to its pack. Loaded immediately after
 * assets/audio/ar/manifest.js, before another pack can overwrite
 * window.SEMA_AUDIO. */
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("ar", "audio", window.SEMA_AUDIO || {});
}
