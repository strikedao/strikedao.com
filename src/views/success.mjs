//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Success"
};

export default html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section>
        <h2 style="margin-bottom: 0;">Thank You!</h2>
        <p>
          We just sent you an email.
        </p>
        <a style="margin-top: 5em;" href="/">
          <button>Back to homepage</button>
        </a>
        <a href="/register" class="secondary">
          Send me another email
        </a>
      </section>
    </body>
  </html>
`;
