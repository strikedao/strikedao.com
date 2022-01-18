//@format
import { spawn } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { writeFile, rename } from "fs/promises";
import pino from "pino";

import { generate } from "./tokens.mjs";

const logger = pino({ level: "info" });
const __dirname = dirname(fileURLToPath(import.meta.url));
const moviePath = resolve(__dirname, "./public/result.mp4");

export const stillPath = num =>
  resolve(
    __dirname,
    `../assets/stills/out${num.toString().padStart(4, "0")}.mp4`
  );

export async function render(priority) {
  const inputs = priority.map(num => `file '${stillPath(num)}'`).join("\n");
  const inputPath = "/tmp/inputs.txt";
  const outputPath = `/tmp/${await generate(8)}.mp4`;
  await writeFile(inputPath, inputs);

  return new Promise((resolve, reject) => {
    // NOTE: https://trac.ffmpeg.org/wiki/Concatenate
    const args = [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      inputPath,
      "-c",
      "copy",
      outputPath
    ];
    // NOTE: We're using spawn as `exec` has only a limited buffer for
    // collecting the command's output.
    logger.info("Starting to render video with ffmpeg");
    const proc = spawn("ffmpeg", args);
    proc.on("close", async () => {
      logger.info("Done rendering, now replacing old video with new one.");
      await rename(outputPath, moviePath);
      resolve();
    });
    proc.on("error", reject);
  });
}
