import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import SignInContainer from "./SignInContainer";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import FilledInput from "@material-ui/core/FilledInput";

import Button from "@material-ui/core/Button";
import { drawerWidth } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  },
  card: {
    width: "500px",
    padding: "80px",
    margin: "auto",
    marginTop: "100px"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end"
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
    // zIndex: 1301
  }
}));

const Account = props => {
  const classes = useStyles();

  const { profile, accounts, setAccount, signOut, loggedIn } = props;

  const handleChangeAccount = event => {
    setAccount(event.target.value);
  };

  if (!loggedIn) {
    return <SignInContainer />;
  }

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            {`Account: ${profile.user.data.account}`}
          </Typography>
          <Button color="inherit" onClick={signOut}>
            logout
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Card className={classes.card}>
          <Typography variant="h5">Accounts</Typography>
          <FormControl className={classes.formControl}>
            <Select
              input={
                <FilledInput
                  name="account"
                  id="account"
                  onChange={handleChangeAccount}
                />
              }
              value={profile.user.data.account}
            >
              {accounts.map((account, index) => (
                <MenuItem key={index} value={account.value}>
                  {`${account.label}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>
      </main>
    </React.Fragment>
  );
};

Account.propTypes = {
  profile: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  setAccount: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired
};

export default Account;
