//@format
import dotenv from "dotenv";
dotenv.config();
import { init, migrations, stills, questions } from "./db.mjs";
import Fastify from "fastify";
import process from "process";
import fastifyStatic from "fastify-static";
import fastifyFormbody from "fastify-formbody";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { serveBallotBox, handleAllocate } from "./handlers.mjs";
import index from "./views/index.mjs";
import register from "./views/register.mjs";

const { SERVER_PORT, NODE_ENV } = process.env;

export const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: "array"
    }
  }
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/" // optional: default '/'
});
fastify.register(fastifyFormbody);

// Visual Frontend Endpoints
fastify.get("/", (request, reply) => {
  return reply
    .code(200)
    .type("text/html")
    .send(index);
});

fastify.get("/register", (request, reply) => {
  return reply
    .code(200)
    .type("text/html")
    .send(register);
});

// API Endpoints
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

fastify.post(
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
