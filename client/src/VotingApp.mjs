import { render, Component } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { getParam, v1 } from "./api.mjs";
import VotingItem from "./components/VotingItem.mjs";
import { classes } from "./VotingStyles.mjs";
import { calculateCost } from "../../src/voting.mjs";

function VotingApp() {
  const tokens = getParam(location.search, "tokens");
  const questionId = getParam(location.search, "questionId");
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState([]);

  useEffect(async () => {
    setQuestion(await v1.question.getWithOptions(questionId));
  }, []);

  const onUpdateVotes = index => {
    return value => {
      let newVotes = [...value];
      newVotes[index] = value;
      setVotes(newVotes);
      /*calculateCost(newVotes);*/
    }
  };

  if (question) {
    const votingItemList = question.options.map(
      (props, i) =>
        html`
          <${VotingItem} content="${props.content}" styles="${classes}" onUpdate="${onUpdateVotes(i)}" />
        `
    );

    return html`
      <div>
        <div class="${classes.votingAppContainer}">
          <h2 class="${classes.votingAppHeadline}">${question.title}</h2>
          <ul class="${classes.votingItemList}">
            ${votingItemList}
          </ul>
          <div class="${classes.votingButtonContainer}">
            <button
              class="${classes.votingButton}"
              onClick="${e => console.log(e)}"
            >
              Vote
            </button>
          </div>
        </div>
        <div class="${classes.votingFooterContainer}">
          <div class="${classes.flexCenter}">
            <p class="${classes.votingCredits}">You have 45/12 Credits</p>
          </div>
          <div class="${classes.votingProgressbarContainer}">
            <div class="${classes.votingProgressbar}"></div>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <div>
      ...loading data for voting, this can take a few seconds...
    </div>
  `;
}

render(
  html`
    <${VotingApp} />
  `,
  document.querySelector("#app")
);
