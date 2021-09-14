import test from "ava";
import bs58 from "bs58";

import { generate } from "../src/tokens.mjs";

test("if generating a crypto token works", async t => {
  const size = 16;

  const token = await generate(size);
  const buf = bs58.decode(token);

  t.is(size, buf.length);
  t.truthy(token);
});
