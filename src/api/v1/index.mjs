// @format
import pino from "pino";
import { Worker } from "worker_threads";
import { once } from "events";

import { stills, votes, questions } from "../../db.mjs";
import { link } from "../../tokens.mjs";
import config from "../../../config.mjs";
import { calculateCost } from "../../voting.mjs";

const logger = pino({ level: "info" });
const mailWorkerPath = "./src/workers/send.mjs";

export async function serveBallotBox(request, reply) {
  return reply.code(200).send();
}

export function aggregateCredits(choices) {
  const votes = {};

  for (let { optionId } of choices) {
    if (typeof votes[optionId] === "undefined") {
      votes[optionId] = 1;
    } else {
      votes[optionId] += 1;
    }
  }
  const votesList = Object.values(votes);
  const MAX_OPTIONS = config.questions[0].options.length;
  if (votesList.length > MAX_OPTIONS) {
    throw new Error(`Too many options "${votesList}"`);
  } else if (votesList.length < MAX_OPTIONS) {
    const diff = MAX_OPTIONS - votesList.length;
    return [...votesList, ...new Array(diff).fill(0)];
  } else {
    return votesList;
  }
}

export async function handleVote(request, reply) {
  let aggregatedCredits;
  try {
    aggregatedCredits = aggregateCredits(request.body);
  } catch {
    logger.error(`Too many optionIds presented: "${request.body.length}"`);
    return reply.code(400).send(`Bad Request`);
  }

  aggregatedCredits = aggregatedCredits.map(vote => Math.sqrt(vote));

  try {
    calculateCost(aggregatedCredits);
  } catch (err) {
    logger.error(
      `Encountered error when calculating cost of vote: "${err.toString()}"`
    );
    return reply.code(400).send(`Bad Request`);
  }

  const promises = request.body.map(
    async ({ optionId, token }) => await votes.vote(optionId, token)
  );
  const results = await Promise.allSettled(promises);
  const rejected = results.filter(result => result.status === "rejected");

  if (rejected.length > 0) {
    logger.error(
      `"${rejected.length}" credits couldn't be counted towards voting choice`
    );
    return reply.code(401).send("Unauthorized");
  }
  return reply.code(200).send("OK");
}

export async function handleAllocate(request, reply) {
  const { email } = request.body;

  const emailExists = stills.doesEmailExist(email);
  if (emailExists) {
    return reply.redirect(`/error?message=${encodeURI("Status: 403")}`);
  }

  let tokens;
  try {
    tokens = stills.allocateMany(email);
  } catch (err) {
    logger.error(
      `Couldn't allocate stills to email with error: "${err.toString()}"`
    );
    return reply.redirect(`/error?message=${encodeURI("Status: 410")}`);
  }

  const [question] = questions.listWithLimit(1);
  const text = link(tokens, question.ksuid);
  const mailWorker = new Worker(mailWorkerPath, {
    workerData: {
      to: email,
      subject: "Your Voting Credits",
      text,
      link: text
    }
  });

  const [exitCode] = await once(mailWorker, "exit");
  if (exitCode === 0) {
    // TODO: Upon success, we want to redirect the user to a screen
    // indicating success. For now, the design isn't recommending an
    // option yet, which is why we're redirecting to the root page.
    return reply.redirect("/success");
  } else {
    return reply.redirect(`/error?message=${encodeURI("Status: 500")}`);
  }
}

export function handleGetQuestion(request, reply) {
  const { id } = request.params;
  let q;
  try {
    q = questions.getWithOptions(id);
  } catch (err) {
    logger.error(err.toString());
    return reply.code(404).send("Not Found");
  }
  return reply.code(200).send(q);
}

export default (fastify, opts, done) => {
  fastify.get("/questions/:id", handleGetQuestion);

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
    "/votes",
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

  done();
};
