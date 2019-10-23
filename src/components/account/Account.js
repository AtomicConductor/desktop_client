import React from "react";
import {
  AccountCircle,
  ExitToAppRounded,
  ExpandMoreRounded
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
  Typography,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LinesEllipsis from "react-lines-ellipsis";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "../../selectors/account";
import { signOut, selectAccount } from "../../_actions/user";

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
  accountListItem: {
    paddingRight: theme.spacing(0.5),
    paddingBottom: 0
  },
  expand: {
    color: theme.palette.secondary.dark
  }
}));

const Account = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isSignedIn, selectedAccount, otherAccounts } = useSelector(state =>
    accountsSelector(state)
  );
  const dispatch = useDispatch();

  if (!isSignedIn) return null;

  const handleSwitchAccount = accountId => {
    setAnchorEl(null);
    dispatch(selectAccount(accountId));
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    dispatch(signOut());
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.accountListItem}>
        <ListItemAvatar>
          <Avatar className={classes.avatar}>
            <Typography variant="body2">{selectedAccount.avatar}</Typography>
          </Avatar>
        </ListItemAvatar>

        <LinesEllipsis
          component={ListItemText}
          text={selectedAccount.name}
          basedOn="letters"
        />

        <IconButton onClick={e => setAnchorEl(e.target)}>
          <ExpandMoreRounded color="secondary" />
        </IconButton>
      </ListItem>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        variant="selectedMenu"
      >
        {otherAccounts.map(({ id, name }) => (
          <MenuItem key={id} onClick={() => handleSwitchAccount(id)}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>{name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => handleSignOut()}>
          <ListItemIcon>
            <ExitToAppRounded />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      <LinesEllipsis
        component={Typography}
        display="block"
        variant="caption"
        className={classes.email}
        text={selectedAccount.email}
        basedOn="letters"
      />

      <Divider />
    </List>
  );
};

export default Account;
