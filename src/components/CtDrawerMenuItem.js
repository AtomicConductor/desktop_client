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

const CtDrawerMenuItem = props => {
  const { url, label, icon, history } = props;

  const onClick = () => {
    console.log(`Pushing ${url}`)
    history.push(url);
  };

  return (
    <ListItem button dense onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
};

CtDrawerMenuItem.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired
};

export { CtDrawerMenuItem };

export default withRouter(CtDrawerMenuItem);
