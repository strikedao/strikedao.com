// @format
import test from "ava";
import { Worker } from "worker_threads";
import { once } from "events";

test("if email can be sent as worker thread", async t => {
  const w = new Worker("./src/workers/send.mjs", {
    workerData: {
      to: "example@example.com",
      subject: "hello world",
      text: "this is a test",
      html: "no html"
    }
  });

  t.deepEqual(await once(w, "exit"), [0]);
});

test("if errors are thrown when worker thread execution fails", async t => {
  const w = new Worker("./src/workers/send.mjs", {
    workerData: {}
  });

  t.deepEqual(await once(w, "exit"), [1]);
});
