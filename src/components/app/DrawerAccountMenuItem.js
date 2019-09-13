import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { LockOutlined } from "@material-ui/icons";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { avatarInitials } from "../../_helpers/presentation";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.dark,
    width: 30,
    height: 30
  },
  email: {
    marginLeft: "16px",
    color: theme.palette.text.secondary
  },
  list: {
    paddingTop: 0
  }
}));

const DrawerAccountMenuItem = props => {
  const classes = useStyles();
  const { history, email, loggedIn, accountName } = props;
  const initials = avatarInitials({ email });

  const onClick = () => {
    history.push("/account");
  };

  if (loggedIn) {
    return (
      <React.Fragment>
        
        <List className={classes.list}>
          <Divider />
          <ListItem
            button
            selected={history.location.pathname === "/account"}
            onClick={onClick}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <Typography variant="body2">{initials}</Typography>
              </Avatar>
            </ListItemAvatar>

            <ListItemText primary={accountName} />
          </ListItem>
          <Typography
            display="block"
            variant="caption"
            className={classes.email}
          >
            {email}
          </Typography>
        </List>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <List className={classes.list}>
        <Divider />
        <ListItem
          button
          selected={history.location.pathname === "/account"}
          onClick={onClick}
        >
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>

          <ListItemText primary="Sign in" />
        </ListItem>
      </List>
    </React.Fragment>
  );
};

DrawerAccountMenuItem.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  accountName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export { DrawerAccountMenuItem };

export default withRouter(DrawerAccountMenuItem);
