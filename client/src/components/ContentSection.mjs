// @format
import { html } from "htm/preact";
import { create } from "jss";
import preset from "jss-preset-default";

const jss = create(preset());
const style = {
  contentSection: {
    alignItems: "start"
  },
  headline: {
    marginBottom: 0
  }
};
const { classes } = jss.createStyleSheet(style).attach();

export default function ContentSection(props) {
  const { name, headline, text } = props;
  return html`
    <section class=${classes.contentSection}>
      <h2 class=${classes.headline} id=${name}>${headline}</h2>
      ${props.children}
    </section>
  `;
}
