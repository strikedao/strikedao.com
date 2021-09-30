// @format
import { workerData, isMainThread } from "worker_threads";
import pino from "pino";
import { exit } from "process";
import { send } from "../mail.mjs";

if (isMainThread) {
  throw new Error("This file can only be launched as a nodejs worker_thread");
}

const logger = pino({ level: "info" });
const { to, subject, text, html } = workerData;

send(to, subject, text, html)
  .then(() => exit(0))
  .catch(err => {
    logger.error(
      `While sending an email to "${to}" an error occurred: ${err.toString()}`
    );
    exit(1);
  });
