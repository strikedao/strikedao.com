//@format
import { init, migrations, stills, questions } from "./db.mjs";
import Fastify from "fastify";
import dotenv from "dotenv";
import process from "process";

import { handleAllocate } from "./handlers.mjs";

dotenv.config();

const { SERVER_PORT } = process.env;

export const fastify = Fastify({
  logger: true
});

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
  fastify.listen(SERVER_PORT, (err, address) => {
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
