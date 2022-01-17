import { html } from "htm/preact";
import NominalAllocator from "preact-nominal-allocator";

function VotingItem(props) {
  const { content, styles } = props;
  return html`
    <div>
      <li class="${styles.votingItem}">
        <${NominalAllocator}
          min="${props.min}"
          max="${props.max}"
          onUpdate="${props.onUpdate}"
          styles="${styles}"
        />
        <p class="${styles.votingItemText}">${content}</p>
      </li>
      <a href=${`#${props.content}`} class="${styles.votingItemLink}"
        >Learn more</a
      >
    </div>
  `;
}

export default VotingItem;
