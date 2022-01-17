import { render, Component } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { getParam, v1 } from "./api.mjs";
import VotingItem from "./components/VotingItem.mjs";
import ContentSection from "./components/ContentSection.mjs";
import { classes } from "./VotingStyles.mjs";
import { calculateCost } from "../../src/voting.mjs";
import config from "../../config.mjs";

const MAX_CREDITS = config.stills.perEmail;

function VotingApp() {
  const tokens = getParam(location.search, "tokens");
  const questionId = getParam(location.search, "questionId");
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState([0, 0, 0]);
  const [maxima, setMaxima] = useState([5, 5, 5]);
  const [credits, setCredits] = useState(MAX_CREDITS);

  const handleUpdate = index => {
    return value => {
      let nextVotes = [...votes];
      nextVotes[index] = value;
      setVotes(nextVotes);
      setCredits(MAX_CREDITS - calculateCost(nextVotes));

      const nextMaxima = [...maxima];
      const votesCopy = [...nextVotes];
      for (let index in votes) {
        const copy = [...votesCopy];
        while (true) {
          try {
            calculateCost(copy);
            copy[index] += 1;
          } catch {
            nextMaxima[index] = copy[index] - 1;
            break;
          }
        }
      }
      setMaxima(nextMaxima);
    };
  };

  useEffect(async () => {
    let question;
    try {
      question = await v1.question.getWithOptions(questionId);
    } catch (err) {
      window.location.href = `/error?message=${encodeURIComponent(
        err.toString()
      )}`;
    }
    setQuestion(question);
  }, []);

  const handleSubmit = async () => {
    // TODO: The following is a mock and must be removed when the actual
    // functionality is implemented.
    const choices = question.options.map(({ ksuid }, i) => ({
      optionId: ksuid,
      token: tokens[i]
    }));

    // NOTE: From hereon the functionality is production-ready.
    try {
      await v1.votes(choices);
      window.location.href = `/done`;
    } catch (err) {
      window.location.href = `/error?message=${encodeURIComponent(
        err.toString()
      )}`;
    }
  };

  if (question) {
    const votingItemList = question.options.map(
      (props, i) =>
        html`
          <${VotingItem}
            min="0"
            max=${maxima[i]}
            onUpdate=${handleUpdate(i)}
            content="${props.name}"
            styles="${classes}"
          />
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
            <button class="${classes.votingButton}" onClick="${handleSubmit}">
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
        <div style="margin-bottom: 10vh">
          ${question.options.map(option => {
            return html`
            <${ContentSection} name=${option.name} headline=${option.name}>
              <p>
                ${option.content}
              </p>
            </>
          `;
          })}
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
