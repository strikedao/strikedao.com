// @format
import { exit } from "process";
import pino from "pino";
import { init, votes } from "./db.mjs";
import { render } from "../src/video.mjs";
import { CronJob } from "cron";

const logger = pino({ level: "info" });

export async function run() {
  const db = init();
  const priorities = votes.listInOrder().map(({ priority }) => priority);
  if (priorities.length > 0) {
    logger.info("Start rerendering video...");
    await render(priorities);
    logger.info("Done rendering.");
  } else {
    logger.info("Renderer received empty list of priorities");
    return;
  }
}

const job = new CronJob("* * * * *", run, null, true, "UTC");
job.start();
