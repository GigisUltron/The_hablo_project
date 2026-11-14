/* The track: a visible curriculum instead of an endless deck.
 *
 * Each unit is a lesson with a mode and a scope, unlocked by how many cards are
 * solid (interval >= 6 days). Pure: pass the count in, get the map back.
 */
var SEMA_TRACK = {
  units: [
    { id: "u1", title: "Say hello", mode: "phrases", fields: null, need: 0 },
    { id: "u2", title: "First words", mode: "words", fields: ["home", "food"], need: 6 },
    { id: "u3", title: "Around you", mode: "words", fields: ["nature", "animals", "body"], need: 14 },
    { id: "u4", title: "Out in the city", mode: "words", fields: ["city", "time"], need: 22 },
    { id: "u5", title: "Connect ideas", mode: "terms", fields: null, need: 30 },
    { id: "u6", title: "Read in Spanish", mode: "read", fields: null, need: 40 }
  ]
};

(function (root) {
  function map(solid) {
    var n = Number(solid) || 0;
    var current = -1;
    SEMA_TRACK.units.forEach(function (u, i) { if (n >= u.need) current = i; });
    return SEMA_TRACK.units.map(function (u, i) {
      return {
        id: u.id, title: u.title, mode: u.mode, fields: u.fields, need: u.need,
        index: i,
        unlocked: n >= u.need,
        current: i === current,
        remaining: Math.max(0, u.need - n)
      };
    });
  }

  function currentUnit(solid) {
    var rows = map(solid);
    for (var i = 0; i < rows.length; i += 1) if (rows[i].current) return rows[i];
    return rows[0];
  }

  var api = { units: SEMA_TRACK.units, map: map, currentUnit: currentUnit };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SemaTrack = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
