import { render, Component } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { getParam, v1 } from "./api.mjs";

function App() {
  const tokens = getParam(location.search, "tokens");
  const questionId = getParam(location.search, "questionId");
  const [question, setQuestion] = useState(null);

  useEffect(async () => {
    setQuestion(await v1.question.getWithOptions(questionId));
  }, []);

  if (question) {
    return html`
      <div>${question.title}</div>
    `;
  }

  return html`
    <div>${questionId}</div>
  `;
}

render(
  html`
    <${App} />
  `,
  document.querySelector("#app")
);
