// @format
import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";
import assert from "assert";
import sqlite3 from "better-sqlite3";
import { fileURLToPath } from "url";
import { env } from "process";

import { generate } from "./tokens.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const database = {
	name: "strike.db",
	options: {
		verbose: console.log
	},
	migrations: {
		path: "./sql"
	}
};

const token = {
	size: 32
};

export function init() {
	let name;
	if (env.NODE_ENV === "test") {
		name = "test.db";
	} else {
		name = database.name;
	}

	return sqlite3(name, database.options);
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

export const stills = {
	init: async function(quantity) {
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

		for (let priority of Array(quantity).keys()) {
			const t = await generate(token.size);
			statement.run({ priority, token: t });
		}
	}
};
