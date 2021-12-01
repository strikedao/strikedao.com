//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

export default ({ title } = {}) => html`
  <head>
    <link rel="stylesheet" href="public/normalize.css" />
    <link rel="stylesheet" href="public/style.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
`;
