// @format
import test from "ava";
import esmock from "esmock";

import { delDB } from "./utils.mjs";
import { init } from "../src/db.mjs";

test.afterEach.always(delDB);
test.before(delDB);

test.serial(
  "if start procedure initializes the data base if there's none",
  async t => {
    const { initDB } = await import("../src/start.mjs");
    await initDB();

    const db = init();
    t.true(db.prepare("SELECT COUNT(*) as amount FROM boxes").get().amount > 0);
    t.true(
      db.prepare("SELECT COUNT(*) as amount FROM stills").get().amount > 0
    );
    t.true(
      db.prepare("SELECT COUNT(*) as amount FROM options").get().amount > 0
    );
    t.truthy(db.prepare("PRAGMA table_info(votes)").get());
  }
);

test.serial("if start procedure exits if data base already exists", async t => {
  const start = await import("../src/start.mjs");
  await start.initDB();

  const startMock = await esmock("../src/start.mjs", {
    "../src/db.mjs": {
      stills: {
        init: () => t.fail()
      },
      questions: {
        init: () => t.fail()
      }
    }
  });

  await startMock.initDB();
  t.pass();
});
