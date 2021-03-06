import React, { useState, useEffect } from "react";
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
  Avatar,
  CircularProgress
} from "@material-ui/core";
import GoogleButton from "react-google-button";
import googleSignIn from "./googleSignIn";
import config from "../../config";
import { drawerWidth } from "../../_helpers/constants";
import { LockRounded } from "@material-ui/icons";
import { signIn } from "../../_actions/user";
import signInClientTools from "../../_actions/clientTools";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { paths } from "../../_helpers/constants";
import { signedInSelector } from "../../_selectors/account";

const { onboarding } = config;
const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  card: {
    width: "500px",
    padding: theme.spacing(6, 10, 10, 10),
    margin: "auto",
    marginTop: "30px",
    textAlign: "center"
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
    marginTop: theme.spacing(2),
    textAlign: "left"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  avatar: {
    margin: "auto",
    color: theme.palette.common.white
  },
  signInText: {
    paddingBottom: theme.spacing(4)
  },
  progress: {
    backgroundColor: theme.palette.background.paper
  }
}));

const SignIn = () => {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const handleSignIn = async credentials => {
    await dispatch(signIn(credentials));
    await dispatch(signInClientTools());
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const isLoading = useSelector(state => state.user.loading);

  const { pathname } = useLocation();
  const history = useHistory();
  const isSignedIn = useSelector(state => signedInSelector(state));

  useEffect(() => {
    const { signIn } = paths;
    if (pathname === signIn && isSignedIn) {
      history.goBack();
    }
  }, [pathname, history, isSignedIn]);

  return (
    <React.Fragment>
      <main className={classes.content}>
        <Card className={classes.card}>
          <Avatar className={classes.avatar}>
            {isLoading ? (
              <CircularProgress
                className={classes.progress}
                color="secondary"
              />
            ) : (
              <LockRounded />
            )}
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            className={classes.signInText}
          >
            Sign in
          </Typography>
          <FormControl className={classes.formControl}>
            <TextField
              fullWidth
              id="email-input"
              label="Email"
              variant="outlined"
              value={values.email}
              onChange={handleChange("email")}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
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
              onClick={() => handleSignIn(values)}
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
              onClick={() =>
                nw.Shell.openExternal(`${onboarding}/forgot-password`)
              }
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
              onClick={() => googleSignIn(handleSignIn)}
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

export default SignIn;
