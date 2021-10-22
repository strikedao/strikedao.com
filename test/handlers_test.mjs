// @format
import test from "ava";

import { init, migrations, stills } from "../src/db.mjs";
import { fastify, initDB } from "../src/start.mjs";
import { delDB } from "./utils.mjs";
import config from "../config.mjs";

test.afterEach.always(delDB);
test.before(delDB);

test("if handling allocations works", async t => {
  await initDB();

  const response = await fastify.inject({
    method: "PATCH",
    url: "/stills/",
    body: {
      email: "example@example.com"
    }
  });

  t.is(response.statusCode, 200);
});

test("if handling multiple query strings as an array works with fastify", async t => {
  await initDB();

  const response = await fastify.inject({
    method: "get",
    url: "/ballotbox/",
    query: {
      tokens: ["a", "b"]
    }
  });

  t.is(response.statusCode, 200);
});

test("if handling allocation returns error when not enough stills are available", async t => {
  migrations.init(0);
  migrations.init(1);
  await stills.init();

  const db = init();
  const leftovers = config.stills.perEmail - 2;
  const allocation = config.stills.quantity - leftovers;
  const statement = db.prepare(`
      UPDATE
        stills
      SET
        email = 'test@example.com'
      WHERE
        priority = @id
      `);
  for (let id of Array(allocation).keys()) {
    statement.run({ id });
  }

  const response = await fastify.inject({
    method: "PATCH",
    url: "/stills/",
    body: {
      email: "example@example.com"
    }
  });

  t.is(response.statusCode, 410);
});
