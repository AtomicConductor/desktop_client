import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { avatarInitials } from "../../helpers/presentation";

const useStyles = makeStyles(theme => ({
  in: {
    backgroundColor: theme.palette.secondary.dark,
    width: 30,
    height: 30
  },
  out: { backgroundColor: theme.palette.primary.dark },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
  },
  email: {
    marginLeft: "16px",
    color: theme.palette.text.secondary
  }
}));

const CtDrawerAccountMenuItem = props => {
  const classes = useStyles();
  const { history, currentUser } = props;
  const initials = avatarInitials(currentUser);

  const onClick = () => {
    history.push("/account");
  };

  return (
    <React.Fragment>
      <div className={classes.spacer} />
      <List>
        <Divider />
        <ListItem
          button
          selected={history.location.pathname === "/account"}
          onClick={onClick}
        >
          {currentUser.email ? (
            <ListItemAvatar>
              <Avatar className={classes.in}>
                <Typography variant="body2">{initials}</Typography>
              </Avatar>
            </ListItemAvatar>
          ) : (
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
          )}

          <ListItemText primary="Account" />
        </ListItem>

        {currentUser.email ? (
          <Typography
            display="block"
            variant="caption"
            className={classes.email}
          >
            {currentUser.email}
          </Typography>
        ) : null}
      </List>
    </React.Fragment>
  );
};

CtDrawerAccountMenuItem.propTypes = {
  currentUser: PropTypes.object.isRequired
};

export { CtDrawerAccountMenuItem };

export default withRouter(CtDrawerAccountMenuItem);
