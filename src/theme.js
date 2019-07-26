// import blueGrey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
// import lightGreen from "@material-ui/core/colors/lightGreen";
import green from "@material-ui/core/colors/green";

import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";

import { createMuiTheme } from "@material-ui/core/styles";
import {
  lightBlue,
  lightGreen,
  lime,
  grey,
  blueGrey
} from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: grey,
    secondary: lightBlue,
    // secondary: {
    //   light: "#64A9E9",
    //   main: "#3B8EDE",
    //   dark: "#2888E0",
    //   contrastText: "#fff"
    // },
    error: red
  }
});
