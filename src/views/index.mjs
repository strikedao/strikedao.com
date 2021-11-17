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
        <p>
          The first mate and his Skipper too will do their very best to make the
          others comfortable in their tropic island nest. Michael Knight a young
          loner on a crusade to champion the cause of the innocent. The
          helpless. The powerless in a world of criminals who operate above the
          law. Here he comes Here comes Speed Racer. He's a demon on wheels.
        </p>
        <a href="/register">
          <button>Participate</button>
        </a>
      </section>
    </body>
  </html>
`;
