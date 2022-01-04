// @format
import pino from "pino";
import { Worker } from "worker_threads";
import { once } from "events";

import { stills, votes } from "../../db.mjs";
import enUS from "../../locales/en-US.mjs";
import { link } from "../../tokens.mjs";

const logger = pino({ level: "info" });
const mailWorkerPath = "./src/workers/send.mjs";

export async function serveBallotBox(request, reply) {
  return reply.code(200).send();
}

export async function handleVote(request, reply) {
  const promises = request.body.map(
    async ({ optionId, token }) => await votes.vote(optionId, token)
  );
  const results = await Promise.allSettled(promises);
  const rejected = results.filter((result) => result.status === "rejected");

  if (rejected.length > 0) {
    return reply
      .code(401)
      .send(
        `"${rejected.length}" credits couldn't be counted towards voting choice`
      );
  }
  return reply.code(200).send();
}

export async function handleAllocate(request, reply) {
  const { email } = request.body;

  const emailExists = stills.doesEmailExist(email);
  if (emailExists) {
    return reply.code(403).send("Forbidden");
  }

  let tokens;
  try {
    tokens = stills.allocateMany(email);
  } catch (err) {
    logger.error(
      `Couldn't allocate stills to email with error: "${err.toString()}"`
    );
    return reply.code(410).send();
  }

  const text = link(tokens);
  const mailWorker = new Worker(mailWorkerPath, {
    workerData: {
      to: email,
      subject: enUS.mail.allocate.subject,
      text,
      link: text,
    },
  });

  const [exitCode] = await once(mailWorker, "exit");
  if (exitCode === 0) {
    // TODO: Upon success, we want to redirect the user to a screen
    // indicating success. For now, the design isn't recommending an
    // option yet, which is why we're redirecting to the root page.
    return reply.redirect("/success");
  } else {
    return reply.code(500).send("Internal Server Error");
  }
}

export default (fastify, opts, done) => {
  fastify.get(
    "/ballotbox/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["tokens"],
          properties: {
            tokens: { type: "array" },
          },
        },
      },
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
                type: "string",
              },
              optionId: {
                type: "string",
              },
            },
            required: ["token", "optionId"],
          },
        },
      },
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
            email: { type: "string" },
          },
        },
      },
    },
    handleAllocate
  );

  done();
};
