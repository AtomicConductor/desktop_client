import blueGrey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import lightGreen from "@material-ui/core/colors/lightGreen";
import green from "@material-ui/core/colors/green";

import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";

import { createMuiTheme } from "@material-ui/core/styles";
import { teal } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: blueGrey,
    secondary: green,
    // secondary: {
    //   light: "#65a2bb",
    //   main: "#19759a",
    //   dark: "#0c5a7a",
    //   contrastText: "#fff"
    // },
    error: red
  }
});
