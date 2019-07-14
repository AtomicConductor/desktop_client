import React from "react";
import PropTypes from "prop-types";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import { withRouter } from "react-router-dom";

/*
  A single menu item.
  The component is wrapped in a withRouter HOC which
  provides the history object. This is how we interact 
  with the router, by pushing the URL onto the history 
  stack.
*/

const DrawerMenuItem = props => {
  const { text_props, url, icon, history } = props;
  const onClick = () => {
    history.push(url);
  };

  return (
    <ListItem
      button
      selected={history.location.pathname === url}
      onClick={onClick}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText {...text_props} />
    </ListItem>
  );
};

DrawerMenuItem.propTypes = {
  url: PropTypes.string.isRequired,
  text_props: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired
};

export { DrawerMenuItem };

export default withRouter(DrawerMenuItem);
