//@format
import htm from "htm";
import vhtml from "vhtml";
import MarkdownIt from "markdown-it";
import { readFile } from "fs/promises";

import config from "../../config.mjs";
import head from "./head.mjs";
import Navigation from "./navigation.mjs";

const html = htm.bind(vhtml);
const md = new MarkdownIt({
  html: true
});

const path = `./src/templates`;

export default async name => {
  const content = (await readFile(`${path}/${name}`)).toString();
  const rendered = md.render(content);
  return html`
    <html>
      ${head()}
      <body>
        <${Navigation} />
        <section class="text-content">
          ${html([`<section>${rendered}</section>`])}
        </section>
      </body>
    </html>
  `;
};
