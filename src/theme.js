import red from "@material-ui/core/colors/red";
import { createMuiTheme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: grey,
    secondary: {
      light: "#3597f2",
      main: "#3597f2",
      dark: "#3597f2"
    },
    error: red,
    success: { main: grey[500] },
    info: { main: grey[500] },
    warning: { main: grey[500] }
  }
});
