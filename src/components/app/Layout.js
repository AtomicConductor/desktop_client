import React from "react";
import "typeface-roboto";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Drawer from "./Drawer";
import StatusLine from "./StatusLine";
import CtSnackbarContainer from "../notification/CtSnackbarContainer";
import { drawerWidth, statusLineHeight } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flex: "1 0 auto",
    marginLeft: drawerWidth,
    position: "absolute",
    height: `calc(100% - ${statusLineHeight}px)`,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const Layout = (props) => {

  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Drawer />
      <Box className={classes.box}>
        {props.children}
      </Box>
      <CtSnackbarContainer />
      <StatusLine />
    </ThemeProvider>
  );
};

export default Layout;
