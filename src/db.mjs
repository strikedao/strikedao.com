// @format
import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";
import assert from "assert";
import sqlite3 from "better-sqlite3";
import { fileURLToPath } from "url";
import { env } from "process";
import KSUID from "ksuid";

import { generate } from "./tokens.mjs";
import config from "../config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let verbose;
if (env.LOG_LEVEL === "ALL") {
  verbose = console.log;
}

const database = {
  name: "strike.db",
  options: {
    verbose
  },
  migrations: {
    path: "./sql"
  }
};

const token = {
  size: 32
};

export function init(options) {
  let name;
  if (env.NODE_ENV === "test") {
    name = "test.db";
  } else {
    name = database.name;
  }

  options = { ...database.options, ...options };

  return sqlite3(name, options);
}

export const migrations = {
  init: async function(num) {
    const db = init();
    const dirPath = path.resolve(__dirname, `${database.migrations.path}`);
    const files = readdirSync(dirPath);

    const migrationName = `${num}_migration.sql`;
    const filePath = `${dirPath}/${migrationName}`;

    assert(
      existsSync(filePath),
      `Migration with path "${filePath}" doesn't exist.`
    );

    console.info(`Attempting to read migration file "${migrationName}"`);
    const schema = readFileSync(filePath).toString();

    try {
      console.info(`Attempting to apply migration file "${migrationName}"`);
      db.exec(schema);
    } catch (err) {
      if (
        err instanceof sqlite3.SqliteError &&
        new RegExp(".*table.*already exists").test(err.message)
      ) {
        console.info(`Skipping migration "${migrationName}"; already applied`);
      } else {
        console.error(err);
      }
    }
  }
};

export const questions = {
  init: async function() {
    const db = init();
    for (let question of config.questions) {
      const qksuid = await KSUID.random();
      db.prepare(
        `
        INSERT INTO
          boxes(ksuid, title, content)
        VALUES
          (@ksuid, @title, @content)
      `
      ).run({
        ksuid: qksuid.string,
        title: question.title,
        content: question.content
      });

      for (let option of question.options) {
        const oksuid = await KSUID.random();
        db.prepare(
          `
            INSERT INTO
              options(ksuid, content, boxID)
            VALUES
              (@ksuid, @content, @boxID)
          `
        ).run({
          ksuid: oksuid.string,
          content: option.content,
          boxID: qksuid.string
        });
      }
    }
  }
};

export const stills = {
  getUnclaimed: function() {
    const limit = config.stills.perEmail;
    const db = init();

    const stills = db
      .prepare(
        `
      SELECT
        token
      FROM
        stills
      WHERE
        email IS NULL
      LIMIT @limit
    `
      )
      .all({ limit });
    if (stills.length < limit) {
      throw new Error(
        `Couldn't allocate further stills; available stills currently is: ${stills.length}`
      );
    } else {
      return stills;
    }
  },
  allocate: function(token, email) {
    const db = init();

    db.prepare(
      `
      UPDATE
        stills
      SET
        email = @email
      WHERE
        token = @token
      AND
        email IS NULL
    `
    ).run({
      token,
      email
    });
  },
  init: async function() {
    const db = init();

    const statement = db.prepare(`
      INSERT INTO stills
        (
          priority,
          token
        )
      VALUES
        (
          @priority,
          @token
        )
    `);

    for (let priority of Array(config.stills.quantity).keys()) {
      const t = await generate(token.size);
      statement.run({ priority, token: t });
    }
  }
};

stills.allocateMany = function(email) {
  const db = init();
  let tokens;

  db.transaction(() => {
    tokens = stills.getUnclaimed();

    for (let { token } of tokens) {
      stills.allocate(token, email);
    }
  })();

  return tokens;
};
