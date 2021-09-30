// @format
import pino from "pino";
import { stills } from "./db.mjs";

const logger = pino({ level: "info" });

export function handleAllocate(request, reply) {
  try {
    stills.allocateMany(request.body.email);
  } catch (err) {
    logger.error(
      `Couldn't allocate stills to email with error: "${err.toString()}"`
    );
    return reply.code(410).send();
  }

  return reply.code(200).send();
}
