// @format
import fetch from "cross-fetch";

export function getParam(search, name) {
  const qs = [];
  const params = new URLSearchParams(search);
  for (const [key, value] of params.entries()) {
    qs.push({ key, value });
  }

  const l = qs.filter(param => param.key === name).map(({ value }) => value);
  if (l.length === 0) {
    throw new Error(`Couldn't find parameter with name: "${name}"`);
  } else if (l.length === 1) {
    return l[0];
  } else {
    return l;
  }
}

export const v1 = {
  question: {
    getWithOptions: async function(id) {
      const res = await fetch(`/api/v1/questions/${id}`);
      if (res.status !== 200) {
        throw new Error(
          `Couldn't find question resource: Status: "${res.status}"`
        );
      }
      return await res.json();
    }
  },
  // choices :: [{optionId: string, token: string}, ...], for more details see
  // POST /votes endpoint schema
  votes: async function(choices) {
    const res = await fetch(`/api/v1/votes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(choices)
    });

    if (res.status !== 200) {
      throw new Error(`Sending votes didn't work! Status "${res.status}"`);
    }
  }
};
