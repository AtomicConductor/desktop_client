import red from "@material-ui/core/colors/red";
import { createMuiTheme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: grey,

    secondary: {
      light: "#64A9E9",
      main: "#3B8EDE",
      dark: "#2888E0",
      contrastText: "#fff"
    },
    // To switch to nicer colors - uncomment the line below
    // and remove the secondary block above
    // secondary: lightGreen,
    error: red
  }
});
