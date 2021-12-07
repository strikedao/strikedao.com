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
    ${head(config)}
    <body>
      <${Navigation} />
      <section class="register">
        <form action="/stills/" method="post">
          <input required name="email" type="email" placeholder="Your email address" />
          <p>
            The first mate and his Skipper too will do their very best to make the
            others comfortable in their tropic island nest.
          </p>
          <input type="submit">Send me an Email</input>
        </form>
      </section>
    </body>
  </html>
`;
