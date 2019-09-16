import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  FormControl,
  Card,
  Box,
  Divider,
  Button,
  Link,
  AppBar,
  Toolbar
} from "@material-ui/core";
import GoogleButton from 'react-google-button';
import googleSignIn from './googleSignIn';
import config from '../../config';
import {drawerWidth} from '../../_helpers/constants';

const { onboarding } = config;
const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  card: {
    width: "500px",
    padding: theme.spacing(10),
    margin: "auto",
    marginTop: "100px"
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  },
  signInButton: {
    width: "100%"
  },
  dividerGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    color: theme.palette.primary.main,
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  divider: {
    width: 100
  },
  centered: {
    alignSelf: "center"
  },
  onboarding: {
    marginTop: theme.spacing(2)
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
}));

const SignIn = props => {
  const classes = useStyles();
  const { onSignIn } = props;

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const handleSignIn = () => {
    onSignIn(values);
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            Sign in
          </Typography>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <Card className={classes.card}>
          <FormControl className={classes.formControl}>
            <TextField
              fullWidth
              id="email-input"
              label="Email"
              variant="filled"
              value={values.email}
              onChange={handleChange("email")}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              variant="filled"
              fullWidth
              id="password-input"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Button
              onClick={handleSignIn}
              variant="outlined"
              color="secondary"
              className={classes.signInButton}
            >
              Sign in
            </Button>
            <Link
              href="#"
              variant="body2"
              className={classes.onboarding}
              onClick={() => nw.Shell.openExternal(`${onboarding}/forgot-password`)}
            >
              Forgot password?
            </Link>
          </FormControl>
          <Box className={classes.dividerGroup}>
            <Divider variant="middle" className={classes.divider} />
            <Typography> Or </Typography>
            <Divider variant="middle" className={classes.divider} />
          </Box>
          <FormControl className={classes.formControl}>
            <GoogleButton
              className={classes.centered}
              type="dark"
              onClick={() => googleSignIn(onSignIn)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Link
              className={classes.centered}
              variant="body2"
              href="#"
              onClick={() => nw.Shell.openExternal(`${onboarding}/sign-up`)}
            >
              No Conductor account? Create a New Account
            </Link>
          </FormControl>
        </Card>
      </main>
    </React.Fragment>
  );
};

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired
};

export default SignIn;
