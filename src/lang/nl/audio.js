/* Bind the generated manifest to its pack. Loaded immediately after
 * assets/audio/nl/manifest.js, before another pack can overwrite
 * window.SEMA_AUDIO. */
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("nl", "audio", window.SEMA_AUDIO || {});
}
