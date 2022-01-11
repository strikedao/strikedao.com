import { create } from "https://unpkg.com/jss@10.9.0";
import preset from "https://unpkg.com/jss-preset-default@10.9.0";

const jss = create(preset());
const style = {
  // VotingApp
  votingAppContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignContent: "center",
    textAlign: "center",
  },
  votingItemList: {
    display: "grid",
    padding:0,
    margin: "0 16px",
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
    marginTop: 75,
    fontSize: 28,
    width: 280
  },
  // VotingItem
  votingItem: {
    listStyleType: "none",
    maxHeight: 320,
    maxWidth: 320,
    position: "relative",
    margin: "8px 4px",
    padding: "32px 32px",
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
  // Footer
  votingFooterContainer: {
    position: "absolute",
    width: "100%",
    bottom:0,
  },
  votingFooter: {
    borderTop: "1px solid white",
    borderBottom: "1px solid white",
    backgroundColor: "black"
  },
  votingProgressbar: {
    height: 24,
    width: "50%",
    backgroundColor: "white"
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
