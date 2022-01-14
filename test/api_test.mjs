// @format
// Test all the API routes
import test from "ava";

import { init, questions, migrations, stills } from "../src/db.mjs";
import { fastify, initDB } from "../src/start.mjs";
import { aggregateVotes } from "../src/api/v1/index.mjs";
import { delDB } from "./utils.mjs";
import config from "../config.mjs";

test.afterEach.always(delDB);
test.before(delDB);

test("if aggregating votes works", t => {
  t.deepEqual(
    aggregateVotes([{ optionId: 0 }, { optionId: 0 }, { optionId: 1 }]),
    [2, 1, 0]
  );
  t.deepEqual(
    aggregateVotes([
      { optionId: 0 },
      { optionId: 0 },
      { optionId: 1 },
      { optionId: 2 }
    ]),
    [2, 1, 1]
  );
  t.throws(() =>
    aggregateVotes([
      { optionId: 0 },
      { optionId: 0 },
      { optionId: 1 },
      { optionId: 2 },
      { optionId: 3 }
    ])
  );
});

test.serial("if voting endpoint throws on invalid optionId", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const { token } = db
    .prepare("SELECT priority, token FROM stills where priority = 0")
    .get();
  t.truthy(token);
  const email = "example@example.com";
  stills.allocate(token, email);

  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/votes/",
    body: [
      {
        token,
        optionId: "non-existent"
      }
    ]
  });
  t.is(response.statusCode, 401);
});

test.serial("if voting endpoint throws on invalid token", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const { token } = db
    .prepare("SELECT priority, token FROM stills where priority = 0")
    .get();
  t.truthy(token);
  const email = "example@example.com";
  stills.allocate(token, email);

  const qs = db
    .prepare(
      `
      SELECT
        *
      FROM
        questions
    `
    )
    .all();
  const question = questions.getWithOptions(qs[0].ksuid);
  const option1 = question.options[0];

  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/votes/",
    body: [
      {
        token: "invalid token",
        optionId: option1.ksuid
      }
    ]
  });
  t.is(response.statusCode, 401);
});

test.serial("retrieving a non-existent question", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();
  const response = await fastify.inject({
    method: "GET",
    url: `/api/v1/questions/doesntexist`
  });
  t.is(response.statusCode, 404);
});

test.serial("if retrieving a question from the JSON API works", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const { ksuid } = db
    .prepare(
      `
      SELECT
        *
      FROM
        questions
      LIMIT 1
    `
    )
    .get();

  const response = await fastify.inject({
    method: "GET",
    url: `/api/v1/questions/${ksuid}`
  });
  const body = JSON.parse(response.body);
  t.truthy(body);
  t.is(body.ksuid, ksuid);
  t.truthy(body.options);
  t.is(response.statusCode, 200);
});

test.serial("if voting throws cost exceeds", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const qs = db
    .prepare(
      `
      SELECT
        *
      FROM
        questions
    `
    )
    .all();
  const choices = [];
  for (let i = 0; i < config.stills.perEmail + 1; i++) {
    choices.push({ optionId: "a", token: i });
  }
  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/votes/",
    body: choices
  });
  t.is(response.statusCode, 400);
});

test.serial("if voting throws when too many options are submitted", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const qs = db
    .prepare(
      `
      SELECT
        *
      FROM
        questions
    `
    )
    .all();
  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/votes/",
    body: [
      {
        optionId: "a",
        token: "abc"
      },
      {
        optionId: "b",
        token: "abc"
      },
      {
        optionId: "c",
        token: "abc"
      },
      {
        optionId: "d",
        token: "abc"
      }
    ]
  });
  t.is(response.statusCode, 400);
});

test.serial("if voting works", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);
  await stills.init();
  await questions.init();
  const db = init();

  const { token } = db
    .prepare("SELECT priority, token FROM stills where priority = 0")
    .get();
  t.truthy(token);
  const email = "example@example.com";
  stills.allocate(token, email);

  const qs = db
    .prepare(
      `
      SELECT
        *
      FROM
        questions
    `
    )
    .all();
  const question = questions.getWithOptions(qs[0].ksuid);
  const option1 = question.options[0];

  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/votes/",
    body: [
      {
        token,
        optionId: option1.ksuid
      }
    ]
  });
  t.is(response.statusCode, 200);
});

test.serial("if handling allocations works", async t => {
  await initDB();

  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/stills/",
    body: {
      email: "example@example.com"
    }
  });

  t.is(response.statusCode, 302);
  t.is(response.headers.location, "/success");
});

test.serial(
  "to ensure same email cannot register for stills twice",
  async t => {
    await initDB();

    const response1 = await fastify.inject({
      method: "POST",
      url: "/api/v1/stills/",
      body: {
        email: "example@example.com"
      }
    });

    t.is(response1.statusCode, 302);
    t.is(response1.headers.location, "/success");

    const response2 = await fastify.inject({
      method: "POST",
      url: "/api/v1/stills/",
      body: {
        email: "example@example.com"
      }
    });

    t.is(response2.statusCode, 403);
  }
);

test.serial(
  "if handling multiple query strings as an array works with fastify",
  async t => {
    await initDB();

    const response = await fastify.inject({
      method: "get",
      url: "/api/v1/ballotbox/",
      query: {
        tokens: ["a", "b"]
      }
    });

    t.is(response.statusCode, 200);
  }
);

test.serial(
  "if handling allocation returns error when not enough stills are available",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
    migrations.init(3);
    migrations.init(4);
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
      method: "POST",
      url: "/api/v1/stills/",
      body: {
        email: "example@example.com"
      }
    });

    t.is(response.statusCode, 410);
  }
);
