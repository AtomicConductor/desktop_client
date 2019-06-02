import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";

import Divider from "@material-ui/core/Divider";

import ListItem from "@material-ui/core/ListItem";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";


import ListItemText from '@material-ui/core/ListItemText' 
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction' 


const drawerWidth = 400;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  title: {
    flexGrow: 1
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    // marginTop:  '80px',
    ...theme.mixins.toolbar,
    justifyContent: "flex-start"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  button: {
    margin: theme.spacing(1)
  },
  box: {
    display: "flex",
    // alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: "2em"
  }
}));

const CtDownloaderFormDrawer = props => {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true
  });

  // function handleDrawerOpen() {
  //   setOpen(true);
  // }

  // function handleDrawerClose() {
  //   setOpen(false);
  // }

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const {drawerIsOpen} = props

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerIsOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader} />
        <Divider />

 
        <List>
          <ListItem divider>
            <ListItemText primary="Use Daemon" />
            <ListItemSecondaryAction>
              <Switch
                checked={state.checkedA}
                onChange={handleChange("checkedA")}
                value="checkedA"
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem dense>
            <TextField

              fullWidth
              id="standard-with-placeholder"
              label="Task Id"
              placeholder="e.g 010"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>
          <ListItem dense>
            <TextField
              fullWidth
              id="standard-with-placeholder"
              label="Job Id"
              placeholder="e.g 00873"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>

          <ListItem  dense>
            <TextField
              fullWidth
              id="standard-with-placeholder"
              label="Project"
              placeholder="e.g Spiderman"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>

          <ListItem dense>
            <TextField
              fullWidth
              id="standard-with-placeholder"
              label="Location"
              placeholder="e.g Montreal"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>

          <ListItem dense>
            <TextField
              fullWidth
              id="standard-with-placeholder"
              label="Output path"
              placeholder="e.g /usr/tmp"
              className={classes.textField}
              margin="normal"
            />
          </ListItem>

          <Box className={classes.box}>
            <Button
              variant="outlined"
              className={classes.button}
              color="secondary"
            >
              Download
            </Button>
          </Box>
        </List>
      </Drawer>
    </div>
  );
}


CtDownloaderFormDrawer.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired 
};


export default CtDownloaderFormDrawer;
