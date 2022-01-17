//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Vote"
};

// result expects an array of {optionID: 1, votes: 2, text: 'Some Text'}
export default (result, totalVotes, noOfVotes) => {
  const radius = result.map(({ votes }) => Math.sqrt(votes / totalVotes));

  return html`
    <html>
      <head>
        ${head(config)}
      </head>
      <body>
        <${Navigation} />
        <section style="margin-top: 50px">
          <section style="display: block; margin-bottom: 18px; ">
            <video
              controls
              loop
              src="public/result.mp4"
              type="video/mp4"
              width="100%"
            ></video>
            <div
              style="width: 75px; height: 7px; background-color: #F1F1F1;"
            ></div>
          </section>
          <section>
            <p>
              The initial video is rearranged according to the results and
              temporal order of the voting process.
            </p>
            <h2 style="margin-bottom: 0px;">DoD's proposal won the vote!</h2>
            <p style="text-align: center;">
              Total Votes: ${totalVotes} <br />
              Number of Votes: ${noOfVotes} votes
            </p>

            <div class="result-visual">
              <div
                class="result-visual__svgContainer"
                style="justify-content: center;"
              >
                <svg
                  style="stroke: white; 
                width: calc(${radius[0] * 2} * 100vw * var(--svg-normalizer)); 
                height: calc(${radius[0] * 2} * 100vw * var(--svg-normalizer));"
                >
                  <circle cx="50%" cy="50%" r="49%"></circle>
                  <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dy="0.3em"
                    fill="white"
                    stroke="none"
                  >
                    ${result[0].votes}
                  </text>
                </svg>
                <span
                  style="margin-top: 10px;
                    max-width: calc(${radius[0] *
                    2} * 100vw * var(--svg-normalizer))"
                  >${result[0].text}</span
                >
                <span>${result[0].votes}</span>
              </div>
              <div>
                <div class="result-visual__svgContainer">
                  <svg
                    style="stroke: white;
                  width: calc(${radius[1] * 2} * 100vw * var(--svg-normalizer));
                  height: calc(${radius[1] *
                      2} * 100vw * var(--svg-normalizer));"
                  >
                    <circle cx="50%" cy="50%" r="49%"></circle>
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy="0.3em"
                      fill="white"
                      stroke="none"
                    >
                      ${result[1].votes}
                    </text>
                  </svg>
                  <span
                    style="margin-top: 10px;
                    max-width: calc(${radius[1] *
                      2} * 100vw * var(--svg-normalizer))"
                    >${result[1].text}</span
                  >
                  <span>${result[1].votes}</span>
                </div>
                <div
                  class="result-visual__svgContainer"
                  style="margin-top: 40px;"
                >
                  <svg
                    style="stroke: white;
                  width: calc(${radius[2] * 2} * 100vw * var(--svg-normalizer));
                  height: calc(${radius[2] *
                      2} * 100vw * var(--svg-normalizer));"
                  >
                    <circle cx="50%" cy="50%" r="49%"></circle>
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy="0.3em"
                      fill="white"
                      stroke="none"
                    >
                      ${result[2].votes}
                    </text>
                  </svg>
                  <span
                    style="margin-top: 10px;
                    max-width: calc(${radius[2] *
                      2} * 100vw * var(--svg-normalizer))"
                    >${result[2].text}</span
                  >
                  <span>${result[2].votes}</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </body>
    </html>
  `;
};
