// @format
import config from "../config.mjs";

export function cost(x) {
  return Math.pow(x, 2);
}

// NOTE: options :: [number, ...]
export function calculateCost(credits) {
  const MAX_COST = config.stills.perEmail;
  const MAX_OPTIONS = config.questions[0].options.length;
  if (credits.length > MAX_OPTIONS) {
    throw new Error(`Too many options "${credits.length}"`);
  }

  let aggregatedCost = 0;
  for (let credit of credits) {
    if (credit < 0) {
      throw new Error(`Found negative credit "${credits}"`);
    }
    aggregatedCost += cost(credit);
  }

  if (aggregatedCost > MAX_COST) {
    throw new Error(
      `Aggregated cost "${aggregatedCost}" is higher than MAX_COST: "${MAX_COST}"`
    );
  } else {
    return aggregatedCost;
  }
}
