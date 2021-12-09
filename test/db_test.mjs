// @format
import test from "ava";
import esmock from "esmock";

import { init, questions, stills, migrations, votes } from "../src/db.mjs";
import config from "../config.mjs";
import { delDB } from "./utils.mjs";

test.afterEach.always(delDB);
test.before(delDB);

test.serial("if init migration runs a migration on the db", async t => {
  migrations.init(0);
  const db = init();
  const [token, priority] = db.prepare("PRAGMA table_info(stills)").all();
  t.is(priority.name, "priority");
  t.is(token.name, "token");
});

test.serial("if init allows overwriting options", async t => {
  t.plan(1);
  const dbMock = await esmock("../src/db.mjs", {
    "better-sqlite3": {
      default: (name, options) => {
        t.is(options.verbose, null);
      }
    }
  });
  dbMock.init({ verbose: null });
});

test.serial("if stills can be generated with tokens in db", async t => {
  migrations.init(0);
  await stills.init();

  const db = init();
  const { actual } = db.prepare("SELECT COUNT(*) as actual FROM stills").get();
  t.is(config.stills.quantity, actual);
});

test.serial(
  "if unclaimed can return an amount of unclaimed cryptographic tokens",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
    await stills.init();

    const db = init();
    const tokens = stills.getUnclaimed();
    t.truthy(tokens);
    t.is(tokens.length, config.stills.perEmail);
  }
);

test.serial("if allocating many tokens at once is possible", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  await stills.init();

  const db = init();
  const email = "example@example.com";
  const tokens = stills.allocateMany(email);
  t.is(typeof tokens[0], "string");
  t.truthy(tokens);
  t.is(tokens.length, config.stills.perEmail);
  const sample = db
    .prepare(`SELECT * FROM stills WHERE email = @email`)
    .all({ email });
  t.truthy(sample);
  t.is(sample.length, config.stills.perEmail);
});

test.serial(
  "if allocating many tokens throws when not enough are available",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
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

    const email = "example@example.com";
    t.throws(t => stills.allocateMany(email));
  }
);

test.serial(
  "if still claims function throws when less than required stills can only be claimed",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
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

    t.throws(t => stills.getUnclaimed());
  }
);

test.serial("if still email can be set by knowing its token", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  await stills.init();

  const db = init();
  const { token } = db
    .prepare("SELECT priority, token FROM stills where priority = 0")
    .get();
  t.truthy(token);
  const email = "example@example.com";
  stills.allocate(token, email);
  const still = db
    .prepare(`SELECT email FROM stills where token = @token`)
    .get({ token });
  t.is(still.email, email);
});

test.serial(
  "that email's existence in stills table can be verified",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
    await stills.init();

    const db = init();
    const { token } = db
      .prepare("SELECT priority, token FROM stills where priority = 0")
      .get();
    t.truthy(token);
    const email = "example@example.com";
    stills.allocate(token, email);
    t.true(stills.doesEmailExist(email));
    t.false(stills.doesEmailExist("nonexistent@email.com"));
  }
);

test.serial("if questions with options can be get by id", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
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

  t.truthy(qs);
  t.is(qs.length, 2);
  const defaultId = qs[0].ksuid;

  const actualQuestion = questions.getWithOptions(defaultId);
  t.truthy(actualQuestion);
  t.is(actualQuestion.ksuid, defaultId);
  t.is(actualQuestion.title, qs[0].title);
  t.truthy(actualQuestion.options);
  t.true(actualQuestion.options.length > 0);
  t.truthy(actualQuestion.options[0].ksuid);
  t.truthy(actualQuestion.options[0].content);
});

test.serial("if questions can be get by id", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
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

  t.truthy(qs);
  t.is(qs.length, 2);
  const defaultId = qs[0].ksuid;

  const actualQuestion = questions.get(defaultId);
  t.truthy(actualQuestion);
  t.is(actualQuestion.ksuid, defaultId);
  t.is(actualQuestion.title, qs[0].title);
});

test.serial(
  "if double voting with same token on different choice throws an error",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
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

    votes.vote(option1.ksuid, token);

    t.not(option1.ksuid, question.options[1].ksuid);
    t.throws(() => votes.vote(option2.ksuid, token));
  }
);

test.serial(
  "if double voting with same token on same choice throws an error",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
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

    votes.vote(option1.ksuid, token);

    t.throws(() => votes.vote(option1.ksuid, token));
  }
);

test.serial("if votes can be cast for an option using a token", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
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

  votes.vote(option1.ksuid, token);

  const dbVotes = db
    .prepare(
      `
    SELECT
      optionID,
      token
    FROM
      votes
  `
    )
    .all();

  t.truthy(dbVotes);
  t.is(dbVotes.length, 1);

  const vote = dbVotes[0];
  t.is(vote.optionID, option1.ksuid);
  t.is(vote.token, token);
});

test.serial(
  "if questions can be configured in db according to .mjs file",
  async t => {
    migrations.init(0);
    migrations.init(1);
    migrations.init(2);
    await stills.init();
    await questions.init();

    const db = init();
    const { questionAmount } = db
      .prepare("SELECT COUNT(*) as questionAmount FROM questions")
      .get();
    t.true(questionAmount > 0);
    t.truthy(questionAmount);

    const { optionAmount } = db
      .prepare("SELECT COUNT(*) as optionAmount FROM options")
      .get();
    t.true(optionAmount > 0);
    t.truthy(optionAmount);

    const ksuids = db
      .prepare("SELECT ksuid FROM questions ORDER BY ksuid")
      .all();
    const copy = [...ksuids].sort((a, b) => a.ksuid - b.ksuid);
    t.deepEqual(ksuids, copy);
  }
);

test.serial("if migration 1 and two can be applied", async t => {
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  const db = init();

  db.prepare(
    `
    INSERT INTO
      questions(ksuid, title, content)
    VALUES
      ('q1', 'title', 'content')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      options(ksuid, name, content, questionID)
    VALUES
      ('option1', 'name1', 'option1', 'q1')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      options(ksuid, name, content, questionID)
    VALUES
      ('option2', 'name2', 'option2', 'q1')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      stills(token, priority, email)
    VALUES
      ('a', 0, 'tim@example.com')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      stills(token, priority, email)
    VALUES
      ('b', 1, 'tim@example.com')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      stills(token, priority, email)
    VALUES
      ('c', 2, 'alice@example.com')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      votes(optionID, token)
    VALUES
      ('option2', 'a')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      votes(optionID, token)
    VALUES
      ('option1', 'b')
  `
  ).run();

  db.prepare(
    `
    INSERT INTO
      votes(optionID, token)
    VALUES
      ('option1', 'c')
  `
  ).run();

  const result = db
    .prepare(
      `
    SELECT
      stills.email,
      votes.optionID,
      stills.priority
    FROM
      options
    JOIN
      questions
    ON
      questions.ksuid = options.questionID
    JOIN
      votes
    ON
      votes.optionId = options.ksuid
    JOIN
      stills
    ON
      stills.token = votes.token
    WHERE
      questions.ksuid = 'q1'
    GROUP BY
      stills.email,
      votes.optionID
  `
    )
    .all();
  t.deepEqual(result, [
    {
      email: "alice@example.com",
      optionID: "option1",
      priority: 2
    },
    {
      email: "tim@example.com",
      optionID: "option1",
      priority: 1
    },
    {
      email: "tim@example.com",
      optionID: "option2",
      priority: 0
    }
  ]);
});
