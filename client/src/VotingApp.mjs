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
  //TODO: What if the number of tokens and the max_credits aren't equal?
  const tokens = getParam(location.search, "tokens");
  const questionId = getParam(location.search, "questionId");
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState([0, 0, 0]);
  const [maxima, setMaxima] = useState([5, 5, 5]);
  const [credits, setCredits] = useState(MAX_CREDITS);
  const [progress, setProgress] = useState(0);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const handleUpdate = index => {
    return value => {
      let nextVotes = [...votes];
      nextVotes[index] = value;
      setVotes(nextVotes);
      const cost = calculateCost(nextVotes);
      setCredits(MAX_CREDITS - cost);
      setProgress(cost / MAX_CREDITS);

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
      setAllowSubmit(JSON.stringify(nextVotes) === JSON.stringify(nextMaxima));
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
    const choices = [];
    const tokenCopy = [...tokens];
    for (let index in votes) {
      let credits = Math.pow(votes[index], 2);
      while (credits > 0) {
        choices.push({
          optionId: question.options[index].ksuid,
          token: tokenCopy.pop()
        });
        credits -= 1;
      }
    }

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
              ${allowSubmit ? "Vote" : `${credits} voting credits left`}
            </button>
          </div>
        </div>
        <div class="${classes.votingFooterContainer}">
          <div class="${classes.votingProgressbarContainer}">
            <div
              style=${{ width: `${progress * 100}%` }}
              class="${classes.votingProgressbar}"
            ></div>
          </div>
        </div>
        <div style="margin-bottom: 10vh">
          ${question.options.map(option => {
            return html`
              <${ContentSection} name=${option.name} headline=${option.name}>
                <p>${option.content}</p>
              </${ContentSection}>
            `;
          })}
        </div>
      </div>
    `;
  }

  return html`
    <div>...loading data for voting, this can take a few seconds...</div>
  `;
}

render(
  html`
    <${VotingApp} />
  `,
  document.querySelector("#app")
);
