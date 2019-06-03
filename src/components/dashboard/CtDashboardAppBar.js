import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import IconButton from '@material-ui/icons/IconButton';
import IconButton from "@material-ui/core/IconButton";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    zIndex: 1301
  }
  ,
   hide: {
    display: 'none',
  }
}));

const CtDashboardAppBar = props => {
  const classes = useStyles();

  const {drawerIsOpen, onToggleDrawer} = props

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Dashboard
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          // className={clsx(open && classes.hide)}
          onClick={onToggleDrawer}
        >
          {props.drawerIsOpen ? (
          <ChevronRightIcon />
        ) : (
          <MenuIcon  />
        )}

 
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}



CtDashboardAppBar.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  onToggleDrawer: PropTypes.func.isRequired
};

// CtDashboardAppBar.defaultProps = {
//   drawerIsOpen: false
// };



export default CtDashboardAppBar;
