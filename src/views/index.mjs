//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title:
    "StrikeDAO is a project by Hito Steyerl and Department of Decentralization",
  paragraph:
    "Strike DAO is an experiment in participatory governance of blockchain art institutions. The Ethereum domain of Bundeskunsthalle was squatted by artist Hito Steyerl and DoD. In the Strike DAO process we will vote on three models of future governance of this squatted domain."
};

export default html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section class="hero">
        <video
          muted
          autoplay
          loop
          preload="metadata"
          src="https://strikedao.s3.eu-central-1.amazonaws.com/original.mp4"
          type="video/mp4"
          width="90%"
        ></video>
        <p style="text-align:center">${config.paragraph}</p>
        <a href="/register">
          <button>Participate</button>
        </a>
      </section>
    </body>
    <footer>
      <hr />
      <a href="/datenschutz">Datenschutzhinweise</a>
      <br />
      <a href="/impressum">Impressum</a>
    </footer>
  </html>
`;
