//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "Impressum"
};

export default body => html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section style="align-items: start">
        <p>
          Websitebetreiber:
          <br />
          Tim Daubenschütz
          <br />
          Badstr 38
          <br />
          13357 Berlin
          <br />
          <br />
          tim@daubenschuetz.de
          <br />
          +4917684084263
        </p>
      </section>
      <footer>
        <hr />
        <a href="/datenschutz">Datenschutzhinweise</a>
        <br />
        <a href="/impressum">Impressum</a>
      </footer>
    </body>
  </html>
`;
