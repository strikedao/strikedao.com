// @format
import { readFileSync } from "fs";
import { workerData, isMainThread } from "worker_threads";
import pino from "pino";
import { exit } from "process";
import template from "lodash.template";
import mjml from "mjml";

import { send } from "../mail.mjs";

const templatePath = `./src/templates/signup.mjml`;

if (isMainThread) {
  throw new Error("This file can only be launched as a nodejs worker_thread");
}

const fileContent = readFileSync(templatePath).toString();

const logger = pino({ level: "info" });
const { to, subject, text, link } = workerData;

const hydratedHTML = template(fileContent)({
  link
});
const { html } = mjml(hydratedHTML);

send(to, subject, text, html)
  .then(() => exit(0))
  .catch(err => {
    logger.error(
      `While sending an email to "${to}" an error occurred: ${err.toString()}`
    );
    exit(1);
  });
