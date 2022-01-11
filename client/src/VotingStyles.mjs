import { create } from "https://unpkg.com/jss@10.9.0";
import preset from "https://unpkg.com/jss-preset-default@10.9.0";
import NominalAllocator from "preact-nominal-allocator";

/*'@media (min-width: 1024px)': {
  width: 200
}*/

const jss = create(preset());
const style = {
  // VotingApp.mjs
  votingAppContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignContent: "center",
    textAlign: "center",
    margin: "0 16px",
  },
  votingItemList: {
    display: "grid",
    padding:0,
    justifyContent: "center",
    gridTemplateColumns: "repeat(1, minmax(280px, 1fr))",

    gridGap: "1rem",
    '@media (min-width: 1024px)': {
      gridTemplateColumns: "repeat(3, minmax(320px, 1fr))",
    }
  },
  votingButtonContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  votingButton: {
    fontSize: 28,
    width: 280
  },
  // VotingItem.mjs
  votingItem: {
    listStyleType: "none",
    maxHeight: 280,
    position: "relative",
    margin: "8px 4px",
    padding: "8px 64px",
    border: "1px solid white",
    '@media (min-width: 1024px)': {
      margin: "8px 16px",
    }
  },
  votingItemText: {
    fontSize: 32,
    fontFamily: "var(--logo-font)",
    wordWrap: "anywhere"
  },
  votingItemLink: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: "var(--logo-font)",
  },
  // NominalAllocator
  allocatorContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--logo-font)"
  },
  allocatorButtonPlus: {
    padding:0,
    margin:0,
    fontSize: "20vw",
    border: "none",
    '@media (min-width: 1024px)': {
      fontSize: "4vw",
    }
  },
  allocatorButtonMinus: {
    padding:0,
    margin:0,
    fontSize: "20vw",
    border: "none",
    '@media (min-width: 1024px)': {
      fontSize: "4vw",
    }
  },
  allocatorNumberInput: {
    display: "flex",
    fontSize: 100,
    maxWidth: 125,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      margin: 0,
    },
    '&[type=number]': {
      '-webkit-appearance': 'textfield',
      '-moz-appearance': 'textfield'
    }
  }
};

export const { classes } = jss.createStyleSheet(style).attach();
