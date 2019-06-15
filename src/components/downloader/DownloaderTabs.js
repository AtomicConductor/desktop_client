import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    borderStyle: "solid",
    margin: 0
  }
}));
const DownloaderTabs = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Tabs
      className={classes.root}
      value={value}
      onChange={handleChange}
      indicatorColor="secondary"
      textColor="secondary"
      centered
    >
      <Tab className={classes.tab} label="Item One" />
      <Tab className={classes.tab} label="Item Two" />
    </Tabs>
  );
};

export default DownloaderTabs;
