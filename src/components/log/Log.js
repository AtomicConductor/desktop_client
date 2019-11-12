import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Box } from "@material-ui/core";
import { WrapText } from "@material-ui/icons";
import AppBar from "./AppBar";
import SignIn from "../account/SignIn";
import { appBarHeight } from "../../_helpers/constants";
import IconButton from "@material-ui/core/IconButton";
import { Virtuoso } from "react-virtuoso";
import { signedInSelector } from "../../selectors/account";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import clsx from "clsx";
import moment from "moment";
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: appBarHeight,
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  toolsCard: {
    display: "flex",
    flexDirection: "row",
    height: theme.spacing(4),
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: "flex-end"
  },

  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "auto",
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.primary[900]
  },
  event: {
    margin: 0,
    marginBottom: theme.spacing(0.2)
  },
  error: {
    color: red[300]
  },
  info: {
    color: green[300]
  },
  time: {
    fontWeight: "bold",
    paddingRight: theme.spacing(1)
  },
  icon: {
    margin: 0,
    marginRight: theme.spacing(2),
    padding: 0,
    borderRadius: 0
  },
  wrap: {
    whiteSpace: "pre-wrap",
    marginBottom: theme.spacing(1)
  },
  footer: {
    padding: theme.spacing(2),
    textAlign: "center"
  }
}));

const Log = () => {
  const [wrap, setWrap] = useState(false);

  const events = useSelector(state => state.log.events);

  const toggleWrap = () => {
    setWrap(!wrap);
  };

  const getEvent = i => (
    <pre
      className={clsx({
        [classes.event]: true,
        [classes.wrap]: wrap
      })}
    >
      <span
        className={clsx({
          [classes.error]: events[i].level === "error",
          [classes.info]: events[i].level === "info",
          [classes.time]: true
        })}
      >
        {`[${moment(events[i].time).format("YYYY-MM-DD HH:mm")}]`}
      </span>
      <span>{events[i].text}</span>
    </pre>
  );

  const classes = useStyles();
  const signedIn = useSelector(state => signedInSelector(state));

  if (!signedIn) {
    return <SignIn />;
  }

  return (
    <React.Fragment>
      <AppBar />
      <Box className={classes.container}>
        <Card className={classes.toolsCard}>
          <IconButton
            onClick={toggleWrap}
            className={classes.icon}
            color="primary"
            size="small"
          >
            <WrapText color={wrap ? "secondary" : "primary"} />
          </IconButton>
        </Card>
        <Box className={classes.content}>
          <Virtuoso
            style={{ width: "100%", height: "100%" }}
            totalCount={events.length}
            item={_ => getEvent(_)}
            footer={() => (
              <div className={classes.footer}>-- End of log --</div>
            )}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Log;
