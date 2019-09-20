import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  LockOutlined,
  AccountCircle,
  ExitToApp,
  ExpandMore
} from "@material-ui/icons";
import {
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Menu,
  MenuItem,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { avatarInitials } from "../../_helpers/presentation";
import LinesEllipsis from "react-lines-ellipsis";

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
    paddingTop: 0,
    paddingBottom: 0
  },
  expand: {
    color: theme.palette.secondary.dark
  }
}));

const Account = props => {
  const classes = useStyles();
  const { loggedIn, signOut, setAccount } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  if (loggedIn) {
    const { profile: { user: { data: { email } } }, accountName, accounts } = props;
    const initials = avatarInitials({ email });

    const handleSwitchAccount = accountId => {
      setAnchorEl(null);
      setAccount(accountId);
    };

    const handleSignOut = () => {
      signOut();
      setAnchorEl(null);
    }

    return (

      <List className={classes.list}>
        <ListItem
          onClick={e => setAnchorEl(e.target)}
          button
        >
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <Typography variant="body2">{initials}</Typography>
            </Avatar>
          </ListItemAvatar>

          <LinesEllipsis
            component={ListItemText}
            text={accountName}
            basedOn="letters" />

          <ListItemIcon style={{ minWidth: 0 }}>
            <ExpandMore color="secondary" />
          </ListItemIcon>
        </ListItem>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {accounts.map(({ accountId: id, accountName: name }) => (
            <MenuItem
              key={id}
              onClick={() => handleSwitchAccount(id)}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText>{name}</ListItemText>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => handleSignOut()}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>

        <LinesEllipsis
          component={Typography}
          display="block"
          variant="caption"
          className={classes.email}
          text={email}
          basedOn="letters" />

      </List>
    );
  }

  return (
    <List className={classes.list}>
      <Divider />
      <ListItem
        component={RouterLink} to="/sign-in"
        button
      >
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>

        <ListItemText primary="Sign in" />
      </ListItem>
    </List>
  );
};

export default Account;
