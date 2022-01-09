import { render, Component } from "preact";
import { html } from "htm/preact";

import { getParam } from "./browser.mjs";

class App extends Component {
  render() {
    const tokens = getParam(location.search, "token");
    return html`
      <div>this is a voting app</div>
    `;
  }
}

render(
  html`
    <${App} />
  `,
  document.querySelector("#app")
);
