import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import DownloaderFilterDrawerContainer from "./DownloaderFilterDrawerContainer";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
    //   display: "flex"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  toolbar: { height: 48 },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  }
}));

const DownloaderJobs = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  function handleClick() {
    setOpen(!open);
  }

  return (
    <React.Fragment>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem dense button>
          <ListItemText primary="Sent mail" />
        </ListItem>
        <ListItem dense button>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem dense button onClick={handleClick}>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem dense button className={classes.nested}>
              <ListItemText primary="Starred" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      <DownloaderFilterDrawerContainer />
    </React.Fragment>
  );
};

// function DownloaderJobs() {
//   const classes = useStyles();

//   return (
//     <React.Fragment>
//       <main className={classes.content}>
//         <div className={classes.toolbar} />

//       </main>

//       <DownloaderFilterDrawerContainer />
//     </React.Fragment>
//   );
// }

export default DownloaderJobs;
