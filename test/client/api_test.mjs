// @format
import test from "ava";

import { getParam } from "../../client/src/api.mjs";

test("if list can be extracted", t => {
  const search = "?token=abc&token=def&lol=haha";
  const tokens = getParam(search, "token");
  t.deepEqual(tokens, ["abc", "def"]);
});

test("if single param can be extracted", t => {
  const search = "?token=abc&token=def&lol=haha";
  const token = getParam(search, "lol");
  t.is(token, "haha");
});

test("if getParam throws if nothing is found", t => {
  const search = "?token=abc&token=def&lol=haha";
  t.throws(() => getParam(search, "notexistent"));
});
