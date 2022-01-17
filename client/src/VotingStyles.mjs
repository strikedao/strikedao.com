import { create } from "jss";
import preset from "jss-preset-default";

const jss = create(preset());
const style = {
  votingAppContainer: {
    display: "flex",
    maxWidth: 1280,
    margin: "0 auto",
    flexWrap: "wrap",
    flexDirection: "column",
    alignContent: "center",
    textAlign: "center"
  },
  votingItemList: {
    display: "grid",
    padding: 0,
    margin: "0 16px",
    justifyContent: "center",
    gridTemplateColumns: "repeat(1, minmax(280px, 1fr))",

    gridGap: "1rem",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(3, minmax(320px, 1fr))"
    }
  },
  votingButtonContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  votingButton: {
    marginTop: 50,
    marginBottom: 50,
    fontSize: 19,
    width: 280,
    backgroundColor: "white",
    color: "black",
    "&:disabled": {
      backgroundColor: "black",
      color: "white",
      cursor: "not-allowed"
    }
  },
  votingAppHeadline: {
    fontSize: 64,
    padding: "0 8px",
    maxWidth: 1110,
    textAlign: "center",
    wordWrap: "wrap",
    margin: "25px 0",
    "@media (min-width: 1024px)": {
      padding: "0 80px",
      fontSize: 96
    }
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center"
  },
  votingItem: {
    listStyleType: "none",
    maxWidth: "100%",
    maxHeight: 220,
    position: "relative",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    margin: "24px 4px",
    padding: "32px 32px",
    border: "1px solid white",
    "@media (min-width: 1024px)": {
      margin: "16px 32px",
      padding: "32px 32px",
      maxWidth: 250,
      maxHeight: 220
    }
  },
  votingItemText: {
    fontSize: 32,
    textAlign: "center",
    fontFamily: "var(--logo-font)",
    wordWrap: "wrap"
  },
  votingItemLink: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: "var(--logo-font)"
  },
  votingCredits: {
    fontFamily: "var(--logo-font)",
    letterSpacing: 2,
    fontSize: 28,
    marginBottom: 8,
    "@media (min-width: 1024px)": {
      marginBottom: 20
    }
  },
  votingFooterContainer: {
    position: "relative",
    width: "100%",
    bottom: 0,
    left: 0
  },
  votingProgressbarContainer: {
    borderTop: "2px solid white",
    borderBottom: "2px solid white",
    backgroundColor: "black"
  },
  votingProgressbar: {
    height: 24,
    backgroundColor: "white"
  },
  allocatorContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--logo-font)",
    margin: "0 48px",
    "@media (min-width: 1024px)": {
      margin: "0 16px"
    }
  },
  allocatorButtonPlus: {
    padding: 0,
    margin: 0,
    fontSize: 64,
    border: "none",
    "@media (min-width: 1024px)": {
      fontSize: 72
    }
  },
  allocatorButtonMinus: {
    padding: 0,
    margin: 0,
    fontSize: 64,
    border: "none",
    "@media (min-width: 1024px)": {
      fontSize: 72
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
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
      margin: 0
    },
    "&[type=number]": {
      "-webkit-appearance": "textfield",
      "-moz-appearance": "textfield"
    }
  }
};

export const { classes } = jss.createStyleSheet(style).attach();
