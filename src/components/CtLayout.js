import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';


import CtDrawer from "./CtDrawer";
import CtDownloader from "./CtDownloader";
import CtAppBarContainer from "./CtAppBarContainer";


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  }
}));

function CtLayout() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
    <CssBaseline />
    <CtAppBarContainer />
    <CtDrawer />
    <CtDownloader />
    </div>
  );
}

export default CtLayout;

