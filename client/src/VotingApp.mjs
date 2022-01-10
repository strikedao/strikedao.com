import { render, Component } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { getParam, v1 } from "./api.mjs";
import VotingItem from "./components/VotingItem.mjs";

function VotingApp() {
  const tokens = getParam(location.search, "tokens");
  const questionId = getParam(location.search, "questionId");
  const [question, setQuestion] = useState(null);

  useEffect(async () => {
    setQuestion(await v1.question.getWithOptions(questionId));
  }, []);

  if (question) {
    console.log(question);
    console.log(question.options);

    const votingItemList = question.options.map((props, i) =>
      html`
        <${VotingItem} content="${props.content}" />
      `
    );

    return html`
      <div class="voting-app-container">
        <h2>${question.title}</h2>
        <div class="voting-items-list-container">
          ${votingItemList}
        </div>
      </div>
    `;
  }

  return html`
    <div>
        ${questionId}
    </div>
  `;
}

render(
  html`
    <${VotingApp} />
  `,
  document.querySelector("#app")
);
/*
{$question.options.map((props, i) =>
<VotingItem {...props} key={i}/>
))}*/
