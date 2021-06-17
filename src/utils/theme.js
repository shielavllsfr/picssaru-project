import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "rgba(88, 114, 147, 1)",
      main: "rgba(5, 96, 128, 1)",
      dark: "rgba(2, 39, 52, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(251, 176, 61, 1)",
      main: "rgba(242, 145, 0, 1)",
      dark: "rgba(212, 127, 0, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});

export default theme;
