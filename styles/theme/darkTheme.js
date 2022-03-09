import { createTheme } from "@mui/material/styles";
import { teal, lime } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[200],
    },
    secondary: {
      main: lime[200],
    },
  },
});

export default darkTheme;
