import React from "react";
import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import CtLayoutContainer from "./CtLayoutContainer";
import { ThemeProvider } from "@material-ui/styles";

import theme from "../../theme";

/*
Provide the theme and create a layout.
*/
const App = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      <CtLayoutContainer />
    </React.Fragment>
  </ThemeProvider>
);

export default App;
