// @format
import test from "ava";
import { access, unlink } from "fs/promises";
import { constants } from "fs";
import { fileURLToPath } from "url";
import path from "path";

import { init, stills, migrations } from "../src/db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const database = {
  name: "test.db"
};

async function delDB() {
  try {
    await access(database.name, constants.F_OK);
  } catch (err) {
    return;
  }
  console.info("deleting test.db");
  await unlink(path.resolve(__dirname, `../${database.name}`));
}

test.afterEach.always(delDB);
test.before(delDB);

test.serial("if init migration runs a migration on the db", async t => {
  migrations.init(0);
  const db = init();
  const [priority, token] = db.prepare("PRAGMA table_info(stills)").all();
  console.log(priority);
  t.is(priority.name, "priority");
  t.is(token.name, "token");
});

test.serial("if stills can be generated with tokens in db", async t => {
  migrations.init(0);
  const quantity = 693;
  await stills.init(quantity);

  const db = init();
  const { actual } = db.prepare("SELECT COUNT(*) as actual FROM stills").get();
  t.is(quantity, actual);
});
