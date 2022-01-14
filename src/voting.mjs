// @format
import config from "../config.mjs";

export function cost(x) {
  return Math.pow(x, 2);
}

// NOTE: options :: [{optionId: number, votes: number}, ...]
export function calculateCost(options) {
  const MAX_COST = config.stills.perEmail;

  let aggregatedCost = 0;
  for (let { votes } of options) {
    aggregatedCost += cost(votes);
  }

  if (aggregatedCost > MAX_COST) {
    throw new Error(
      `Aggregated cost "${aggregatedCost}" is higher than MAX_COST: "${MAX_COST}"`
    );
  } else {
    return aggregatedCost;
  }
}
