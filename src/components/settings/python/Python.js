import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  IconButton,
  Paper,
  InputBase,
  Box,
  Typography
} from "@material-ui/core";
import { FolderRounded, SettingsBackupRestore } from "@material-ui/icons";

import {
  resetPythonLocation,
  savePythonLocation
} from "../../../_actions/settings/pythonLocation";
import {
  resetPackageLocation,
  savePackageLocation
} from "../../../_actions/settings/packageLocation";

import { pythonLocation, packageLocation } from "../../../_selectors/settings";

import HelpIcon from "../../app/HelpIcon";
import Tooltip from "../../app/Tooltip";
import PythonInstallerPanel from "./PythonInstallerPanel";

const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px",
    minWidth: 700
  },
  input: {
    marginLeft: 8,
    flex: 1,
    flexGrow: 1
  },
  paper: {
    height: 32,
    padding: "2px 4px",
    display: "flex"
  },
  key: {
    flexShrink: 0,
    flexBasis: "30%",
    marginRight: theme.spacing(1)
  },
  value: {
    flexBasis: "70%"
  },
  row: {
    display: "flex",
    justify: "space-between",
    margin: theme.spacing(1),
    marginBottom: 0,
    marginTop: theme.spacing(2)
  },
  errorrow: {
    display: "flex",
    justify: "space-between",
    margin: theme.spacing(1),
    marginTop: 0
  },
  rowIcon: {
    marginLeft: theme.spacing(1),
    alignSelf: "flex-start"
  },
  label: {
    paddingTop: 5,
    flexShrink: 0,
    height: 32,
    flexBasis: "30%",
    marginRight: theme.spacing(1)
  },
  sectionHeading: { paddingLeft: theme.spacing(1) },
  divider: {
    margin: theme.spacing(2)
  },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
  },
  labelBox: {
    display: "flex",
    flexDirection: "row"
  },
  shallow: {
    height: 16,
    marginTop: 0,
    marginBottom: 0
  }
}));

const Python = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const pythonPath = useSelector(pythonLocation);
  const packageLoc = useSelector(packageLocation);

  return (
    <Box className={classes.container}>
      <Box className={classes.row}>
        <Typography
          color="primary"
          align="right"
          display="block"
          className={classes.label}
        >
          Python Executable Location:
        </Typography>

        <Paper className={clsx(classes.paper, classes.value)}>
          <InputBase
            onChange={e => dispatch(savePythonLocation(e.target.value))}
            value={pythonPath}
            className={classes.input}
          />
        </Paper>

        <label htmlFor="python-path-file">
          <input
            hidden
            className={classes.input}
            id="python-path-file"
            type="file"
            nwdirectorydesc="Choose python path"
            onChange={e => {
              const { files } = e.target;
              const file = files[0];
              if (files) {
                dispatch(savePythonLocation(file.path));
              }
            }}
          />

          <Tooltip title="Browse for a Python 2.7 location">
            <IconButton
              color="primary"
              className={classes.rowIcon}
              component="span"
              size="small"
            >
              <FolderRounded />
            </IconButton>
          </Tooltip>
        </label>
        <Tooltip title="Reset Python path">
          <IconButton
            color="primary"
            className={classes.rowIcon}
            component="span"
            size="small"
            onClick={() => dispatch(resetPythonLocation())}
          >
            <SettingsBackupRestore />
          </IconButton>
        </Tooltip>
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p> Python 2.7 Executable Location:</p>
              <p>
                If this field doesn't point to a valid Python executable, you
                should browse for one.
              </p>
              <p>Use the reset button to try to set it automatically.</p>
            </React.Fragment>
          }
        />
      </Box>

      <Box className={classes.row}>
        <Typography
          color="primary"
          align="right"
          display="block"
          className={classes.label}
        >
          Conductor Package Location:
        </Typography>

        <Paper className={clsx(classes.paper, classes.value)}>
          <InputBase
            onChange={e => dispatch(savePackageLocation(e.target.value))}
            value={packageLoc}
            className={classes.input}
          />
        </Paper>
        <label htmlFor="package-location">
          <input
            hidden
            className={classes.input}
            id="package-location"
            type="file"
            nwdirectory="true"
            nwdirectorydesc="Choose package location"
            onChange={e => {
              const { files } = e.target;
              const file = files[0];
              if (files) {
                dispatch(savePackageLocation(file.path));
              }
            }}
          />

          <Tooltip title="Browse for Conductor python package location">
            <IconButton
              color="primary"
              className={classes.rowIcon}
              component="span"
              size="small"
            >
              <FolderRounded />
            </IconButton>
          </Tooltip>
        </label>
        <Tooltip title="Reset package location">
          <IconButton
            color="primary"
            className={classes.rowIcon}
            component="span"
            size="small"
            onClick={() => dispatch(resetPackageLocation())}
          >
            <SettingsBackupRestore />
          </IconButton>
        </Tooltip>
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>Conductor Python Location</p>
              <p>
                This is a folder in which to install and update Conductor
                plugins and API.
              </p>
              <p>
                As the submission kit uses Python core libraries to submit, it
                will not be available until you have installed some plugins or
                the Conductor core libraries.
              </p>
            </React.Fragment>
          }
        />
      </Box>
      <Box className={classes.row}>
        <Typography
          color="primary"
          align="right"
          display="block"
          className={classes.label}
        ></Typography>

        <PythonInstallerPanel />
      </Box>
    </Box>
  );
};

export default Python;
