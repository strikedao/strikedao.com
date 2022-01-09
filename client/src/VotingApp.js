import { render, h } from "preact";
import { html } from "htm/preact";

render(
  html`
    <div>this is a voting app</div>
  `,
  document.querySelector("#app")
);
