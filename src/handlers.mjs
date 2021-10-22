// @format
import pino from "pino";
import { Worker } from "worker_threads";
import { once } from "events";

import { stills } from "./db.mjs";
import enUS from "./locales/en-US.mjs";
import { link } from "./tokens.mjs";

const logger = pino({ level: "info" });
const mailWorkerPath = "./src/workers/send.mjs";

export async function serveBallotBox(request, reply) {
  return reply.code(200).send();
}

export async function handleAllocate(request, reply) {
  const { email } = request.body;
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
      html: text
    }
  });

  const [exitCode] = await once(mailWorker, "exit");
  if (exitCode === 0) {
    return reply.code(200).send();
  } else {
    return reply.code(500).send();
  }
}
