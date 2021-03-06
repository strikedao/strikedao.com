//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const config = {
  title: "StrikeDAO - Register to Vote"
};

export default html`
  <html>
    <head>
      ${head(config)}
    </head>
    <body>
      <${Navigation} />
      <section class="register">
        <form action="/api/v1/stills/" method="post">
          <input
            required
            name="email"
            type="email"
            placeholder="Your email address"
          />
          <p>
            We will send you an email with a link to participate in the STRIKE
            DAO voting process. In this process we will vote on different models
            of governance of the bundeskunsthalle.eth domain.
          </p>
          <input type="submit" value="Send me an Email" />
        </form>
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
