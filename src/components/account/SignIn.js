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

import Button from "@material-ui/core/Button";
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
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

const SignIn = props => {
  const classes = useStyles();
  const { onSignIn } = props;

  const [values, setValues] = React.useState({
    email: "julian.mann@admios-sa.com",
    password: "G9oZ#f92PBrc"
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
            Account
          </Typography>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <Card className={classes.card}>
          <Typography variant="h5">Sign in</Typography>
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
              >
                Submit
              </Button>
            </Box>
          </FormControl>
        </Card>
      </main>
    </React.Fragment>
  );
};

SignIn.propTypes = {
  error: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired
};

export default SignIn;
