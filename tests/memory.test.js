/* Tests for the learner-memory module. Pure functions, fixed clocks.
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../src/memory.js");

const T0 = 1763000000000;

test("a fresh memory is empty and counts nothing", () => {
  const mem = M.empty();
  assert.deepEqual(mem.sentences, []);
  assert.equal(mem.attempts, 0);
  assert.equal(M.profile(mem, T0).accuracy, null);
  assert.equal(M.profile(mem, T0).avgMs, null);
});

test("addSentence trims, normalises whitespace and rejects junk", () => {
  const mem = M.empty();
  assert.equal(M.addSentence(mem, "   a  ", [], T0), null);
  assert.equal(M.addSentence(mem, "", [], T0), null);
  const s = M.addSentence(mem, "  Mi   casa es   grande.  ", ["casa"], T0);
  assert.equal(s.text, "Mi casa es grande.");
  assert.deepEqual(s.items, ["casa"]);
  assert.equal(s.reviewed, null);
  assert.equal(mem.sentences.length, 1);
});

test("sentences are capped, oldest dropped first", () => {
  const mem = M.empty();
  for (let i = 0; i < M.MAX_SENTENCES + 5; i += 1) {
    M.addSentence(mem, "sentence number " + i, [], T0 + i);
  }
  assert.equal(mem.sentences.length, M.MAX_SENTENCES);
  assert.equal(mem.sentences[mem.sentences.length - 1].text, "sentence number " + (M.MAX_SENTENCES + 4));
});

test("nextToReview waits for the minimum age and picks the oldest", () => {
  const mem = M.empty();
  const a = M.addSentence(mem, "primera frase", [], T0);
  const b = M.addSentence(mem, "segunda frase", [], T0 + 1000);

  assert.equal(M.nextToReview(mem, T0, M.DAY_MS), null, "too young to resurface");

  const due = M.nextToReview(mem, T0 + M.DAY_MS, M.DAY_MS);
  assert.equal(due.id, a.id, "oldest first");

  M.markReviewed(mem, a.id, T0 + M.DAY_MS);
  // b was created one second after a, so it only qualifies a full day later
  const next = M.nextToReview(mem, T0 + M.DAY_MS * 2, M.DAY_MS);
  assert.equal(next.id, b.id);
});

test("markReviewed records the review count", () => {
  const mem = M.empty();
  const s = M.addSentence(mem, "una frase corta", [], T0);
  M.markReviewed(mem, s.id, T0 + 5000);
  assert.equal(s.reviewed, T0 + 5000);
  assert.equal(s.reviews, 1);
  M.markReviewed(mem, s.id, T0 + 9000);
  assert.equal(s.reviews, 2);
});

test("cloze blanks the target word and returns it", () => {
  const out = M.cloze("Mi casa está cerca del mar.", ["casa"]);
  assert.ok(out);
  assert.equal(out.answer, "casa");
  assert.equal(out.blanked, "Mi ____ está cerca del mar.");
});

test("cloze is case-insensitive and prefers the longest word", () => {
  const out = M.cloze("El pan está en la panadería.", ["pan", "panadería"]);
  assert.equal(out.answer, "panadería");
  assert.match(out.blanked, /____/);
  assert.doesNotMatch(out.blanked, /panadería/);
});

test("cloze returns null when no word matches", () => {
  assert.equal(M.cloze("Mi casa está cerca.", ["perro"]), null);
  assert.equal(M.cloze("", ["casa"]), null);
});

test("profile aggregates attempts and speed", () => {
  const mem = M.empty();
  M.recordAttempt(mem, true, 1200);
  M.recordAttempt(mem, false, 800);
  const p = M.profile(mem, T0);
  assert.equal(p.attempts, 2);
  assert.equal(p.accuracy, 0.5);
  assert.equal(p.avgMs, 1000);
});

test("weakItems merges lapses and confusions, worst first", () => {
  const state = {
    cards: { casa: { lapses: 1 }, perro: { lapses: 3 }, gato: { lapses: 0 } },
    confusions: { "casa>perro": 2, "puerta>ventana": 1 }
  };
  const weak = M.weakItems(state, 3);
  assert.equal(weak[0], "perro", "3 lapses (6) beats 1 lapse + 2 confusions (4)");
  assert.ok(weak.includes("casa"));
  assert.ok(weak.includes("puerta"));
  assert.equal(weak.includes("gato"), false);
});
