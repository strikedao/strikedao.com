import dotenv from "dotenv";
dotenv.config();
import test from "ava";
import bs58 from "bs58";
import process from "process";

import { link, generate } from "../src/tokens.mjs";
const { HOSTNAME } = process.env;

test("if generating a crypto token works", async t => {
  const size = 16;

  const token = await generate(size);
  const buf = bs58.decode(token);

  t.is(size, buf.length);
  t.truthy(token);
});

test("if generating a link from tokens works", async t => {
  t.truthy(HOSTNAME);
  t.is(
    link(["a", "b"], "abc"),
    `https://${HOSTNAME}/vote/?tokens=a&tokens=b&questionId=abc`
  );
});
