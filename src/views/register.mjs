//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

export default html`
  <html>
    <head>
      <link rel="stylesheet" href="public/normalize.css" />
      <link rel="stylesheet" href="public/style.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
      <title></title>
    </head>
    <body>
      <section class="register">
        <input type="email" placeholder="Your email address" />
        <p>
          The first mate and his Skipper too will do their very best to make the
          others comfortable in their tropic island nest.
        </p>
        <a href="#">
          <button>Send me an Email</button>
        </a>
      </section>
    </body>
  </html>
`;
