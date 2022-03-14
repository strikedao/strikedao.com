//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Message"
};

export default body => html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section>${body}</section>
      <footer>
        <hr />
        <a href="/datenschutz">Datenschutzhinweise</a>
        <br />
        <a href="/impressum">Impressum</a>
      </footer>
    </body>
  </html>
`;
