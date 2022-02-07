//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import config from "../../config.mjs";
const { description, keywords, author } = config.website;

export default ({ title } = {}) => html`
  <link rel="stylesheet" href="public/normalize.css" />
  <link rel="stylesheet" href="public/style.css" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    <meta
    charset="utf-8"
  />
  <meta name="description" content=${description} />
  <meta name="keywords" content=${keywords} />
  <meta name="author" content=${author} />
  <title>${title}</title>
`;
