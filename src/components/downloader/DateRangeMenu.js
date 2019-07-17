import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";

import MoreIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { TIMESPANS } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({}));

const DateRangeMenu = props => {
  const classes = useStyles();

  const { fetchJobsInSpan } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const handle = span => () => {
    setAnchorEl(null);
    console.log(`SPAN: ${span}`);
    fetchJobsInSpan(span);
  };

  return (
    <React.Fragment>
      <ListItem button divider onClick={handleMenuOpen}>
        <ListItemIcon>
          <CalendarTodayIcon color="secondary" />
        </ListItemIcon>
        <ListItemText primary="Date range" />
      </ListItem>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handle(TIMESPANS.TODAY)}>{TIMESPANS.TODAY}</MenuItem>
        <MenuItem onClick={handle(TIMESPANS.THISWEEK)}>
          {TIMESPANS.THISWEEK}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.LASTWEEK)}>
          {TIMESPANS.LASTWEEK}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.THISMONTH)}>
          {TIMESPANS.THISMONTH}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.LASTMONTH)}>
          {TIMESPANS.LASTMONTH}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.THISYEAR)}>
          {TIMESPANS.THISYEAR}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.LASTYEAR)}>
          {TIMESPANS.LASTYEAR}
        </MenuItem>
        <MenuItem onClick={handle(TIMESPANS.ALLTIME)}>
          {TIMESPANS.ALLTIME}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default DateRangeMenu;

DateRangeMenu.propTypes = {
  fetchJobsInSpan: PropTypes.func.isRequired
};
