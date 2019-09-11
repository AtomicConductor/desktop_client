import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import Environment from "./Environment";
import Uploads from "./Uploads";
import General from "./General";

import AppBar from "./AppBar";

import { appBarHeight } from "../../_helpers/constants";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: appBarHeight,
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  tabsCard: {
    height: theme.spacing(4.5), // 36
    flexGrow: 0,
    flexShrink: 0
  },
  actionsCard: {
    height: theme.spacing(5),
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "auto"
  },

  tabsRoot: {
    height: theme.spacing(4.5),
    display: "flex",
    flexGrow: 1,
    justifyContent: "center"
  },
  tab: {
    paddingTop: 0,
    paddingBottom: theme.spacing(0.5)
  }
}));

const Yaml = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <React.Fragment>
      <AppBar />
      <Box className={classes.container}>
        <Card className={classes.tabsCard}>
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{ flexContainer: classes.tabsRoot }}
            color="inherit"
          >
            <Tab
              label="General"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Extra uploads"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
            <Tab
              label="Environment"
              classes={{ wrapper: classes.tab, root: classes.tab }}
            />
          </Tabs>
        </Card>
        <Box className={classes.content}>
          {value === 0 && <General />}
          {value === 1 && <Uploads />}
          {value === 1 && <Environment />}
        </Box>
        <Card className={classes.actionsCard}>
          <Button color="secondary">Save</Button>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Yaml;
