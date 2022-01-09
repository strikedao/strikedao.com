export function getParam(search, name) {
  const qs = [];
  const params = new URLSearchParams(search);
  for (const [key, value] of params.entries()) {
    qs.push({ key, value });
  }

  const l = qs.filter(param => param.key === name).map(({ value }) => value);
  if (l.length === 0) {
    throw new Error(`Couldn't find parameter with name: "${name}"`);
  } else if(l.length=== 1) {
    return l[0];
  } else {
    return l;
  }
}

export const apiV1 = {
  getQuestionWithOptions: function(id) {}
};
