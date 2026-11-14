const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/chat.js");

test("a chat starts on the greeting and ends after the last topic", () => {
  const chat = C.start();
  assert.equal(C.respond(chat, "bien").topic, "greet");
  for (const reply of ["me llamo Ana", "soy de Peru", "mi color favorito es el azul", "trabajo en un banco"]) {
    assert.equal(C.respond(chat, reply).retry, undefined);
  }
  assert.equal(C.respond(chat, "adios").done, true);
});

test("an unusable answer asks again rather than moving on", () => {
  const chat = C.start();
  const r = C.respond(chat, "xyz");
  assert.equal(r.retry, true);
  assert.equal(chat.turn, 0);
  assert.equal(chat.misses, 1);
});

test("accents and case do not decide whether it understands", () => {
  const chat = C.start();
  assert.equal(C.respond(chat, "MUY BIEN").retry, undefined);
});

test("it offers the next question after understanding", () => {
  const chat = C.start();
  const r = C.respond(chat, "bien");
  assert.match(r.next, /\?/);
});
