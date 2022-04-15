import { createTheme } from "@mui/material/styles";
import { teal, lime } from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: teal[200],
    },
    secondary: {
      main: line[200],
    },
  },
});

export default lightTheme;
