// @format
import test from "ava";
import { access } from "fs/promises";
import { constants } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { render, stillPath } from "../src/video.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("if stills path can be generated", async t => {
  const p = stillPath(0);
  t.truthy(p);
  t.true(p.includes("/assets/stills/out0000.mp4"));
});

test("if rendering a movie works", async t => {
  // NOTE: If you want to convince yourself of the correctness of the edit,
  // it should be a black still followed by a still where Hito hit's the nail
  // on the TV.
  await render([0, 692]);
  try {
    await access(
      resolve(__dirname, "../src/public/result.mp4"),
      constants.F_OK
    );
    t.pass();
  } catch (err) {
    console.log(err);
    t.fail("failure to find resulting file");
  }
});
