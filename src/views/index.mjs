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
      <section class="hero">
        <h1>STRIKE</h1>
      </section>
    </body>
  </html>
`;
