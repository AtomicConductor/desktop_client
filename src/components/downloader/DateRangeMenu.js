import React from "react";
import PropTypes from "prop-types";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import { TIMESPANS } from "../../_helpers/constants";

const DateRangeMenu = props => {
  const { fetchJobsInSpan, span } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const handle = span => () => {
    setAnchorEl(null);
    fetchJobsInSpan(span);
  };

  return (
    <React.Fragment>
      <Button onClick={handleMenuOpen} color="inherit">
        {span}
      </Button>

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
  fetchJobsInSpan: PropTypes.func.isRequired,
  span: PropTypes.string.isRequired
};
