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
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  toolbar: { height: 48 },
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
  title: {
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    zIndex: 1301
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  },
  buttonBox: {
    // marginTop: 20,
    // borderColor: "red",
    // borderWidth: 1,
    // borderStyle: "solid",
    display: "flex",
    justifyContent: "flex-end"
  }
}));

const CtAccountSignIn = props => {
  const classes = useStyles();
  const { onSignIn, profile } = props;

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
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              variant="filled"
              fullWidth
              id="password-input"
              label="Password"
              type="password"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Box className={classes.buttonBox}>
              <Button onClick={onSignIn} variant="outlined" color="secondary">
                Submit
              </Button>
            </Box>
          </FormControl>
        </Card>
      </main>
    </React.Fragment>
  );
};

CtAccountSignIn.propTypes = {
  error: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired
};

export default CtAccountSignIn;
