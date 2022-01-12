import { html } from "htm/preact";
import NominalAllocator from "preact-nominal-allocator";

function VotingItem (props) {
  const { content, styles } = props;
  return html`
    <div>
      <li class="${styles.votingItem}">
          <${NominalAllocator}
              min="${0}"
              max="${12}"
              onUpdate="${console.log}"
              styles="${styles}"
          />
          <p class="${styles.votingItemText}">${content}</p>
      </li>
      <a class="${styles.votingItemLink}">Learn more (Arrow)</a>
    </div>
  `;
}

export default VotingItem;
