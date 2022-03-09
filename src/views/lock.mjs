//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Voting locked"
};

export default html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section class="lock">
        <h2>
          You can't vote yet!
          <br />
          Check back on March 16, 2022, 7 pm.
        </h2>
        <span>
          To learn more, visit: <a href="http://studiobonn.io">studiobonn.io</a>
        </span>
      </section>
    </body>
  </html>
`;
