//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Vote"
};

export default html`
  <html>
    <head>
      ${head(config)}
      <script type="module" src="public/bundle.js" defer></script>
    </head>
    <body>
      <${Navigation} />
      <div id="app" />
    </body>
  </html>
`;
