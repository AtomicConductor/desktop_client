import React from "react";
import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from "./Layout";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../theme";

/*
Provide the theme and create a layout.
*/

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Layout />
  </ThemeProvider>
);

export default App;
