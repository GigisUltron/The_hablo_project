/* sema — local data portability.
 *
 * A backup is a plain JSON envelope around the whole local state. Exporting is
 * synchronous and safe; importing validates the envelope in the page and then
 * writes the state back through localStorage. Nothing is uploaded.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SemaBackup = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var FORMAT = "hablo-backup";
  var VERSION = 1;

  function exportState(state, now) {
    var body = {};
    try { body = JSON.parse(JSON.stringify(state || {})); } catch (err) { body = {}; }
    return {
      format: FORMAT,
      version: VERSION,
      exportedAt: new Date(now == null ? Date.now() : now).toISOString(),
      state: body
    };
  }

  function parse(text) {
    var data;
    try { data = JSON.parse(String(text || "")); } catch (err) {
      return { ok: false, error: "invalid-json" };
    }
    if (!data || data.format !== FORMAT) return { ok: false, error: "wrong-format" };
    if (Number(data.version) !== VERSION) return { ok: false, error: "wrong-version" };
    var state = data.state;
    if (!state || typeof state !== "object" || Array.isArray(state)) return { ok: false, error: "no-state" };
    if (!state.profile || typeof state.profile !== "object" || Array.isArray(state.profile)) {
      return { ok: false, error: "no-profile" };
    }
    if (!state.cards || typeof state.cards !== "object" || Array.isArray(state.cards)) {
      return { ok: false, error: "no-cards" };
    }
    return { ok: true, state: state, exportedAt: data.exportedAt || "" };
  }

  function filename(now) {
    var date = new Date(now == null ? Date.now() : now);
    var iso = isNaN(date.getTime()) ? "backup" : date.toISOString().slice(0, 10);
    return "hablo-backup-" + iso + ".json";
  }

  return { FORMAT: FORMAT, VERSION: VERSION, exportState: exportState, parse: parse, filename: filename };
});
