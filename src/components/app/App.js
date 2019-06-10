import React from "react";
import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import CtLayout from "./CtLayout";
import { ThemeProvider } from "@material-ui/styles";

import theme from "../../theme";

/*
Provide the theme and create a layout.
*/
const App = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      <CtLayout />
    </React.Fragment>
  </ThemeProvider>
);
export default App;
