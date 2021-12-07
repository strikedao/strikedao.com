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
    ${head(config)}
    <body>
      <${Navigation} />
      <section class="hero">
        <h1>STRIKE</h1>
        <p>
          ${config.paragraph}
        </p>
        <a href="/register">
          <button>Participate</button>
        </a>
      </section>
    </body>
  </html>
`;
