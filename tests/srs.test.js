/* Tests for the scheduling + matching core. Node's built-in runner, no deps.
 *   node --test tests/
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const S = require("../src/srs.js");

const T0 = 1763000000000;

test("newState seeds one due card per concept", () => {
  const st = S.newState(["a", "b"], T0);
  assert.equal(Object.keys(st.cards).length, 2);
  assert.equal(st.cards.a.reps, 0);
  assert.equal(st.cards.a.ef, 2.5);
  assert.ok(S.isDue(st.cards.a, T0));
  assert.equal(S.learnedCount(st), 0);
});

test("first successful review schedules one day out", () => {
  const st = S.newState(["a"], T0);
  const card = S.review(st, "a", 2, T0);
  assert.equal(card.reps, 1);
  assert.equal(card.interval, 1);
  assert.equal(card.due, T0 + S.DAY_MS);
  assert.equal(S.isDue(card, T0), false);
  assert.equal(S.learnedCount(st), 1);
});

test("second review is six days, third multiplies by ease", () => {
  const st = S.newState(["a"], T0);
  S.review(st, "a", 2, T0);
  const c2 = S.review(st, "a", 2, T0);
  assert.equal(c2.interval, 6);
  const c3 = S.review(st, "a", 2, T0);
  assert.equal(c3.interval, Math.round(6 * c2.ef));
});

test("ease rises on easy and never falls below 1.3", () => {
  const st = S.newState(["a"], T0);
  const easy = S.review(st, "a", 3, T0);
  assert.ok(easy.ef > 2.5);

  for (let i = 0; i < 20; i += 1) S.review(st, "a", 0, T0);
  assert.equal(st.cards.a.ef, 1.3);
  assert.ok(st.cards.a.ef >= 1.3);
});

test("a lapse resets to a same-session retry, not a day", () => {
  const st = S.newState(["a"], T0);
  S.review(st, "a", 2, T0);
  const lapsed = S.review(st, "a", 0, T0);
  assert.equal(lapsed.reps, 0);
  assert.equal(lapsed.interval, S.LAPSE_MS / S.DAY_MS);
  assert.equal(lapsed.due, T0 + S.LAPSE_MS);
  assert.equal(S.isDue(lapsed, T0), false);
  assert.equal(S.isDue(lapsed, T0 + S.LAPSE_MS), true);
});

test("retention is null until graded, then a real ratio", () => {
  const st = S.newState(["a", "b"], T0);
  assert.equal(S.retention(st), null);
  S.review(st, "a", 2, T0);
  S.review(st, "b", 0, T0);
  assert.equal(S.retention(st), 0.5);
});

test("confusions ignore self-matches and rank by count", () => {
  const st = S.newState(["a", "b", "c"], T0);
  S.recordConfusion(st, "a", "a");
  assert.deepEqual(st.confusions, {});
  S.recordConfusion(st, "a", "b");
  S.recordConfusion(st, "a", "b");
  S.recordConfusion(st, "a", "c");
  const top = S.topConfusions(st, 5);
  assert.equal(top[0].target, "a");
  assert.equal(top[0].chosen, "b");
  assert.equal(top[0].count, 2);
  assert.equal(top[1].count, 1);
});

test("buildQueue serves due reviews before new cards, capped", () => {
  const st = S.newState(["a", "b", "c", "d"], T0);
  S.review(st, "a", 2, T0 - S.DAY_MS * 5);
  S.review(st, "b", 2, T0 - S.DAY_MS * 5);
  const queue = S.buildQueue(st, T0, { newLimit: 1, maxItems: 10, rand: () => 0 });
  assert.equal(queue[0], "a");
  assert.equal(queue.length, 3);
  assert.ok(queue.includes("b"));
});

test("buildQueue honours maxItems", () => {
  const st = S.newState(["a", "b", "c", "d", "e"], T0);
  const queue = S.buildQueue(st, T0, { newLimit: 5, maxItems: 3 });
  assert.equal(queue.length, 3);
});

test("distractors are unique, exclude the target, prefer neighbours", () => {
  const all = ["a", "b", "c", "d", "e", "f"];
  const near = ["b", "c"];
  const picked = S.pickDistractors("a", all, near, 2, () => 0.01);
  assert.equal(picked.length, 2);
  assert.ok(!picked.includes("a"));
  assert.equal(new Set(picked).size, 2);
  assert.ok(picked.includes("b") && picked.includes("c"));

  const many = S.pickDistractors("a", all, near, 5, () => 0.5);
  assert.equal(many.length, 5);
  assert.equal(new Set(many).size, 5);
  assert.ok(!many.includes("a"));
});

test("normalize keeps non-Latin scripts exact", () => {
  for (const [a, b] of [["你好", "你好"], ["Привет", "привет"], ["مرحبا", "مرحبا"], ["नमस्ते", "नमस्ते"], ["こんにちは", "こんにちは"]]) {
    assert.equal(S.similarity(a, b), 1, a + " should match itself");
  }
  assert.ok(S.similarity("你好", "您好") > 0.4, "one-character variation should still score");
});

test("normalize ignores accents, articles and case", () => {
  assert.equal(S.normalize("La Casa"), "casa");
  assert.equal(S.normalize("café"), "cafe");
  assert.equal(S.normalize("el  árbol!"), "arbol");
});

test("levenshtein and similarity behave", () => {
  assert.equal(S.levenshtein("casa", "casa"), 0);
  assert.equal(S.levenshtein("casa", "cassa"), 1);
  assert.equal(S.levenshtein("", "abc"), 3);
  assert.equal(S.similarity("casa", "casa"), 1);
  assert.equal(S.similarity("Casa", "casa"), 1);
  assert.ok(S.similarity("cassa", "casa") >= 0.75);
  assert.ok(S.similarity("perro", "casa") < 0.3);
  assert.equal(S.similarity("", "casa"), 0);
});
