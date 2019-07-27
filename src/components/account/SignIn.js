import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import FormControl from "@material-ui/core/FormControl";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import Button from "@material-ui/core/Button";

import GoogleLogin from "react-google-login";
import { drawerWidth } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  card: {
    width: "500px",
    padding: "80px",
    margin: "auto",
    marginTop: "100px"
  },

  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  },

  googleLogo: {
    flexShrink: 0,
    marginRight: theme.spacing(2),
    width: 24,
    height: 24
  },
  signInButton: { width: "100%" },

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
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
    // zIndex: 1301
  }
}));

const SignIn = props => {
  const classes = useStyles();
  const { onSignIn, googleClientId } = props;
  console.log("USING " + googleClientId);
  const [values, setValues] = React.useState({
    email: "julian.mann@admios-sa.com",
    password: "G9oZ#f92PBrc"
  });

  const handleGoogleSignIn = response => {
    onSignIn(response);
  };

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
          {/* <Typography variant="h5">Sign in</Typography> */}
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
            <Box className={classes.buttonBox}>
              <Button
                onClick={handleSignIn}
                variant="outlined"
                color="secondary"
                className={classes.signInButton}
              >
                Sign in
              </Button>
            </Box>
          </FormControl>
          <Box className={classes.dividerGroup}>
            <Divider variant="middle" className={classes.divider} />
            <Typography> Or </Typography>
            <Divider variant="middle" className={classes.divider} />
          </Box>
          <FormControl className={classes.formControl}>
            <Box>
              <GoogleLogin
                clientId={googleClientId}
                render={renderProps => (
                  <Button
                    className={classes.signInButton}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    variant="outlined"
                    color="secondary"
                  >
                    <Avatar
                      className={classes.googleLogo}
                      src="/images/google.png"
                    />
                    Sign in with google
                  </Button>
                )}
                buttonText="Login"
                onSuccess={handleGoogleSignIn}
                onFailure={handleGoogleSignIn}
                cookiePolicy={"single_host_origin"}
              />
            </Box>
          </FormControl>
        </Card>
      </main>
    </React.Fragment>
  );
};

SignIn.propTypes = {
  googleClientId: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired
};

export default SignIn;
