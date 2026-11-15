const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/conversation.js");

test("conversation feedback counts the learner side only", () => {
  const messages = [
    { role: "assistant", text: "Hola, ¿cómo estás?" },
    { role: "user", text: "Hola, estoy bien. ¿Y tú?" },
    { role: "user", text: "Quiero un café, por favor." }
  ];
  const s = C.stats(messages, [{ text: "un café" }, { text: "la cuenta" }]);
  assert.equal(s.turns, 2);
  assert.equal(s.questions, 1);
  assert.equal(s.used, 1);
  assert.equal(s.targets, 2);
  assert.ok(s.words >= 8);
});

test("conversation feedback handles an empty chat", () => {
  const s = C.stats([], []);
  assert.deepEqual(s, { turns: 0, words: 0, questions: 0, used: 0, targets: 0 });
});
