// @format
import test from "ava";
import { calculateCost } from "../src/voting.mjs";

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
