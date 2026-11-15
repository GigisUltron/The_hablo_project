/* sema — installable, offline shell.
 *
 * Registration is skipped on file:// and when the browser has no service
 * worker. The worker itself is network-first for app files so updates are not
 * hidden behind a stale cache; it falls back to the cache when offline.
 */
(function () {
  "use strict";
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () { /* file://, private mode, older browser */ });
  });
})();
