import { createTheme } from "@mui/material/styles";
import { red, gray } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fafafa",
    },
    pokeicon: {
      main: "#ffffff",
      dark: "#fafafa",
    },
  },
});

export default theme;
