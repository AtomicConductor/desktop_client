import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import SyncIcon from "@material-ui/icons/Sync";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import ListItemText from "@material-ui/core/ListItemText";

import DateRangeMenuContainer from "./DateRangeMenuContainer";

import { filterDrawerWidth, appBarHeight } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: filterDrawerWidth,
    position: "absolute",
    right: 0,
    top: 0,
    marginTop: appBarHeight,
    height: `calc(100% - ${appBarHeight}px)`
  },

  button: {
    margin: theme.spacing(1)
  },

  paper: {
    height: "100%"
  }
}));

const FilterDrawer = props => {
  const classes = useStyles();

  const { refreshJobList } = props;

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <List>
          <ListItem button divider onClick={refreshJobList}>
            <ListItemIcon>
              <SyncIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Refresh jobs list" />
          </ListItem>

          <DateRangeMenuContainer />
        </List>
      </Paper>
    </Box>
  );
};

FilterDrawer.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  refreshJobList: PropTypes.func.isRequired
};

export default FilterDrawer;
