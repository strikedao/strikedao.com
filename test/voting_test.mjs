// @format
import test from "ava";
import esmock from "esmock";
import { add, sub } from "date-fns";

import { hasVotingBegun, calculateCost } from "../src/voting.mjs";
import config from "../config.mjs";

test("if voting time assessment is correct", async t => {
  const futureDate = add(new Date(), { minutes: 1 }).toISOString();
  const futureDateMock = await esmock("../src/voting.mjs", null, {
    "../config.mjs": {
      default: { ...config, ...{ eventData: { voteBegin: futureDate } } }
    }
  });
  t.false(futureDateMock.hasVotingBegun());

  const pastDate = sub(new Date(), { minutes: 1 }).toISOString();
  const pastDateMock = await esmock("../src/voting.mjs", null, {
    "../config.mjs": {
      default: { ...config, ...{ eventData: { voteBegin: pastDate } } }
    }
  });
  t.true(pastDateMock.hasVotingBegun());
});

test("if cost function throws when costs exceed", t => {
  t.throws(() => calculateCost([6, 0, 0]));
  t.throws(() => calculateCost([3, 3, 3])); // 9 + 9 + 9 = 27
});

test("if cost function throws when negative credit is found", t => {
  t.throws(() => calculateCost([-3, 0, 0]));
});

test("if cost function throws when too many options are submitted", t => {
  t.throws(() => calculateCost([1, 1, 1, 1]));
});

test("if cost function reports accurate cost back", t => {
  t.is(calculateCost([1, 1, 1]), 3);
  t.is(calculateCost([0, 0, 5]), 25);
  t.is(calculateCost([0, 0, 0]), 0);
});
