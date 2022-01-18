//@format
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

export default () => html`
  <nav>
    <div class="col logo">
      <a href="/"> STRIKE </a>
    </div>
    <div class="col">
      <ul>
        <li>
          <a href="/about"> About </a>
        </li>
        <li>
          <a href="/contact"> Contact </a>
        </li>
      </ul>
    </div>
  </nav>
`;
