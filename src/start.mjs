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

import { serveBallotBox, handleVote, handleAllocate } from "./handlers.mjs";
import index from "./views/index.mjs";
import register from "./views/register.mjs";
import contact from "./views/contact.mjs";
import markdown from "./views/markdown.mjs";
import success from "./views/success.mjs";

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

fastify.get("/success", (request, reply) => {
  return reply
    .code(200)
    .type("text/html")
    .send(success);
});

fastify.get("/contact", (request, reply) => {
  return reply
    .code(200)
    .type("text/html")
    .send(contact);
});

fastify.get("/about", async (request, reply) => {
  const content = await markdown("about.md");
  return reply
    .code(200)
    .type("text/html")
    .send(content);
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
  "/votes/",
  {
    schema: {
      body: {
        type: "array",
        items: {
          type: "object",
          properties: {
            token: {
              type: "string"
            },
            optionId: {
              type: "string"
            }
          },
          required: ["token", "optionId"]
        }
      }
    }
  },
  handleVote
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
  migrations.init(2);
  migrations.init(3);

  const db = init();
  const stillsDB = db.prepare("SELECT COUNT(*) as amount FROM stills").get();
  const questionsDB = db
    .prepare("SELECT COUNT(*) as amount FROM questions")
    .get();
  const optionsDB = db.prepare("SELECT COUNT(*) as amount FROM options").get();

  if (stillsDB.amount === 0) {
    await stills.init();
  }
  if (questionsDB.amount === 0 && optionsDB.amount === 0) {
    await questions.init();
  }
}
