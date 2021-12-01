//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import head from "./head.mjs";

const config = {
  title:
    "StrikeDAO is a project by Hito Steyerl and Department of Decentralization",
  paragraph:
    "The first mate and his Skipper too will do their very best to make the others comfortable in their tropic island nest. Michael Knight a young loner on a crusade to champion the cause of the innocent. The helpless. The powerless in a world of criminals who operate above the law. Here he comes Here comes Speed Racer. He's a demon on wheels."
};

export default html`
  <html>
    ${head(config)}
    <body>
      <section class="hero">
        <h1>STRIKE</h1>
        <p>
          ${config.paragraph}
        </p>
        <a href="/register">
          <button>Participate</button>
        </a>
      </section>
    </body>
  </html>
`;
