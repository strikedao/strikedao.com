//@format
import dotenv from "dotenv";
dotenv.config();
import { existsSync } from "fs";
import Fastify from "fastify";
import process from "process";
import fastifyStatic from "fastify-static";
import fastifyFormbody from "fastify-formbody";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getName, init, migrations, stills, questions, votes } from "./db.mjs";
import index from "./views/index.mjs";
import register from "./views/register.mjs";
import markdown from "./views/markdown.mjs";
import message from "./views/message.mjs";
import vote from "./views/vote.mjs";
import result from "./views/result.mjs";
import lock from "./views/lock.mjs";
import apiV1 from "./api/v1/index.mjs";
import impressum from "./views/impressum.mjs";
import config from "../config.mjs";

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
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(index);
});

fastify.get("/lock", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(lock);
});

fastify.get("/register", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(register);
});

fastify.get("/success", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(
      message(html`
        <h2 style="margin-bottom: 0;">Thank You!</h2>
        <p>We just sent you an email.</p>
        <a style="margin-top: 5em;" href="/">
          <button>Back to homepage</button>
        </a>
        <a href="/register" class="secondary"> Send me another email </a>
      `)
    );
});

fastify.get("/done", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(
      message(html`
        <h2 style="margin-bottom: 0;">Thank You!</h2>
        <p style="text-align:center">
          We will let you know when the results are ready. <br />You're also
          invited to the live event.
        </p>
      `)
    );
});

fastify.get("/error", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(
      message(html`
        <h2 style="margin-bottom: 0;">Error!</h2>
        <p>Something went wrong! Please contact us or try again.</p>
        <p>${request.query.message}</p>
        <a style="margin-top: 5em;" href="/">
          <button>Back to homepage</button>
        </a>
      `)
    );
});

fastify.get("/vote", (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(vote);
});

fastify.get("/about", async (request, reply) => {
  const content = await markdown("about.md");
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(content);
});

fastify.get("/datenschutz", async (request, reply) => {
  const content = await markdown("datenschutz.md");
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(content);
});

fastify.get("/impressum", async (request, reply) => {
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=86400, must-revalidate"
    })
    .type("text/html")
    .send(impressum());
});

fastify.get("/result", (request, reply) => {
  const { ksuid } = questions.getFirstQuestionId();
  const results = votes.tally(ksuid);
  return reply
    .code(200)
    .headers({
      "Cache-Control": "public, max-age=15, must-revalidate"
    })
    .type("text/html")
    .send(result(results, config.stills.quantity, config.stills.perEmail));
});

fastify.register(apiV1, { prefix: "/api/v1" });

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
  if (existsSync(getName())) {
    console.info(
      "Found existing database file and hence not reapplying migrations"
    );
    return;
  }
  migrations.init(0);
  migrations.init(1);
  migrations.init(2);
  migrations.init(3);
  migrations.init(4);

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
