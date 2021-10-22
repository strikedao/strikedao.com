//@format
import dotenv from "dotenv";
dotenv.config();
import { init, migrations, stills, questions } from "./db.mjs";
import Fastify from "fastify";
import process from "process";

import { serveBallotBox, handleAllocate } from "./handlers.mjs";

const { SERVER_PORT, NODE_ENV } = process.env;

export const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: "array"
    }
  }
});

fastify.get(
  "/ballotbox/",
  {
    schema: {
      querystring: {
        type: "object",
        required: ["tokens"],
        properties: {
          tokens: { type: "array" }
        }
      }
    }
  },
  serveBallotBox
);

fastify.patch(
  "/stills/",
  {
    schema: {
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string" }
        }
      }
    }
  },
  handleAllocate
);

export async function boot() {
  fastify.log.info(`Initializing database.`);
  await initDB();
  fastify.log.info(`Starting web server.`);
  server();
}

function server() {
  let iface = "127.0.0.1";
  if (NODE_ENV === "production") iface = "0.0.0.0";

  fastify.listen(SERVER_PORT, iface, (err, address) => {
    if (err) throw err;
  });
}

export async function initDB() {
  migrations.init(0);
  migrations.init(1);

  const db = init();
  const stillsDB = db.prepare("SELECT COUNT(*) as amount FROM stills").get();
  const boxesDB = db.prepare("SELECT COUNT(*) as amount FROM boxes").get();
  const optionsDB = db.prepare("SELECT COUNT(*) as amount FROM options").get();

  if (stillsDB.amount === 0) {
    await stills.init();
  }
  if (boxesDB.amount === 0 && optionsDB.amount === 0) {
    await questions.init();
  }
}
