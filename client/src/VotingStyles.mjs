import { create } from "jss";
import preset from "jss-preset-default";

const jss = create(preset());
const style = {
  votingAppContainer: {
    display: "flex",
    maxWidth: 1280,
    minHeight: "90vh",
    margin: "0 auto",
    flexWrap: "wrap",
    flexDirection: "column",
    alignContent: "center",
    textAlign: "left",
    "@media (min-width: 1024px)": {
      textAlign: "center"
    }
  },
  votingItemList: {
    display: "grid",
    padding: 0,
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
    fontSize: 18,
    fontFamily: "var(--regular-font)",
    width: 280,
    backgroundColor: "white",
    color: "black",
    "&:disabled": {
      backgroundColor: "black",
      color: "white",
      cursor: "not-allowed"
    },
    "@media (min-width: 1024px)": {
      marginTop: 50,
      marginBottom: 30
    }
  },
  votingAppHeadline: {
    fontSize: 30,
    padding: "0 8px",
    maxWidth: 1110,
    textAlign: "center",
    wordWrap: "wrap",
    margin: "15px 0",
    "@media (min-width: 1024px)": {
      margin: "25px 0",
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
    flexFlow: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    border: "1px solid white",
    margin: "0 0.5em 10px 0.5em",
    "@media (min-width: 1024px)": {
      flexFlow: "column",
      justifyContent: "center",
      margin: "16px 32px",
      padding: "32px 32px",
      maxWidth: 250,
      maxHeight: 220
    }
  },
  votingItemText: {
    fontSize: 25,
    textAlign: "left",
    marginLeft: "1em",
    fontFamily: "var(--logo-font)",
    wordWrap: "wrap",
    width: "50%",
    minHeight: "2em",
    "@media (min-width: 1024px)": {
      width: "inherit",
      textAlign: "center",
      marginLeft: 0
    }
  },
  votingItemLink: {
    textAlign: "left",
    fontSize: 18,
    fontFamily: "var(--regular-font)",
    textDecoration: "underline",
    margin: "0 0.5em 10px 0.5em",
    "@media (min-width: 1024px)": {
      textDecoration: "underline",
      fontSize: 20,
      marginTop: 16
    }
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
    position: "fixed",
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
    margin: "0 2em 0 0",
    "@media (min-width: 1024px)": {
      margin: "0 16px"
    }
  },
  allocatorButtonPlus: {
    padding: 0,
    margin: 0,
    fontSize: 30,
    border: "none",
    "@media (min-width: 1024px)": {
      fontSize: 72
    }
  },
  allocatorButtonMinus: {
    padding: 0,
    margin: 0,
    fontSize: 30,
    border: "none",
    "@media (min-width: 1024px)": {
      fontSize: 72
    }
  },
  allocatorNumberInput: {
    display: "flex",
    fontSize: 40,
    maxWidth: 60,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    "@media (min-width: 1024px)": {
      fontSize: 100,
      maxWidth: 120
    },
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
