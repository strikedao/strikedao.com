import { html } from "htm/preact";
import NominalAllocator from "preact-nominal-allocator";
import { create } from "https://unpkg.com/jss@10.9.0";
import preset from "https://unpkg.com/jss-preset-default@10.9.0";

const jss = create(preset());
const style = {
  allocatorContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--logo-font)"
  },
  allocatorButtonPlus: {
    padding:0,
    margin:0,
    fontSize: "4vw",
    border: "none"
  },
  allocatorButtonMinus: {
    padding:0,
    margin:0,
    fontSize: "4vw",
    border: "none"
  },
  allocatorNumberInput: {
    display:"flex",
    fontSize: 100,
    maxWidth: 125,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "white",
    border: "none"
  }
};

const { classes } = jss.createStyleSheet(style).attach();

function VotingItem (props) {
  return html`
    <div class="voting-item">
        <${NominalAllocator}
            min="${0}"
            max="${12}"
            onUpdate="${console.log}"
            styles="${classes}"
        />
        <p>${props.content}</p>
    </div>
  `;
}

export default VotingItem;
