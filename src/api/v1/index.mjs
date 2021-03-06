// @format
import pino from "pino";
import { Worker } from "worker_threads";
import { once } from "events";
import { hrtime } from "process";

import { stills, votes, questions } from "../../db.mjs";
import { link } from "../../tokens.mjs";
import config from "../../../config.mjs";
import { hasVotingBegun, calculateCost } from "../../voting.mjs";

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
  if (!hasVotingBegun()) {
    logger.error(`Voting attempted but voting hasn't begun yet`);
    return reply.code(423).send("Locked");
  }

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

  const ss1 = hrtime.bigint();
  const emailExists = stills.doesEmailExist(email);
  if (emailExists) {
    return reply.redirect(`/error?message=${encodeURI("Status: 403")}`);
  }
  const se1 = hrtime.bigint();
  logger.info(`doesEmailExist: ${(se1 - ss1) / BigInt(10e6)} ms`);

  const ss2 = hrtime.bigint();
  let tokens;
  try {
    tokens = stills.allocateMany(email);
  } catch (err) {
    logger.error(
      `Couldn't allocate stills to email with error: "${err.toString()}"`
    );
    return reply.redirect(
      `/error?message=${encodeURI("Status: 410. No voting credits left.")}`
    );
  }
  const se2 = hrtime.bigint();
  logger.info(`allocateMany: ${(se2 - ss2) / BigInt(10e6)} ms`);

  const ss3 = hrtime.bigint();
  const [question] = questions.listWithLimit(1);
  const se3 = hrtime.bigint();
  logger.info(`listWithLimit: ${(se3 - ss3) / BigInt(10e6)} ms`);

  const ss4 = hrtime.bigint();
  const text = link(tokens, question.ksuid);

  // NOTE: Given performance reasons, we don't await the worker's response but
  // instead "fire and forget." Waiting for a response exponentially increases
  // the wait time when many people simultaneously request their registration.
  new Worker(mailWorkerPath, {
    workerData: {
      to: email,
      subject: "Your Voting Credits",
      text,
      link: text
    }
  });
  const se4 = hrtime.bigint();
  logger.info(`emailWorker: ${(se4 - ss4) / BigInt(10e6)} ms`);

  return reply.redirect("/success");
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

// NOTE: Albeit desirable, this API function must not be used to implement a
// feature where a user can vote a second time with their unspent tokens. It's
// because for doing that, we'd have to replicate the previous voting
// allocation to make sure they comply with the quadratic principle of just
// allowing a total of 25 credits spent.
export function validateTokens(request, reply) {
  const { tokens } = request.query;
  const unusedTokens = tokens.filter(token => !votes.isTokenUsed(token));
  return reply.code(200).send({ unusedTokens });
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

  fastify.get(
    "/status",
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
    validateTokens
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
