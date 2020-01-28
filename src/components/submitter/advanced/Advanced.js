import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  IconButton,
  Paper,
  InputBase,
  Box,
  Divider,
  Typography
} from "@material-ui/core";
import {
  DeleteOutlineRounded,
  FolderRounded,
  SettingsBackupRestore
} from "@material-ui/icons";
import { setEnvEntry } from "../../../_actions/submitter";
import {
  resetPythonLocation,
  savePythonLocation
} from "../../../_actions/submitter/pythonLocation";
import {
  environmentOverrides,
  pythonLocation
} from "../../../selectors/submitter";
import HelpIcon from "../../app/HelpIcon";
import Tooltip from "../../app/Tooltip";

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
    margin: theme.spacing(1)
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
  }
}));

const Advanced = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const overrides = useSelector(environmentOverrides);
  const pythonPath = useSelector(pythonLocation);

  return (
    <Box className={classes.container}>
      <Box className={classes.labelBox}>
        <Typography
          className={classes.sectionHeading}
          color="primary"
          variant="h6"
        >
          Local settings
        </Typography>
        <div className={classes.spacer} />
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>The location of the Python 2.7 executable on this machine.</p>
              <p>
                The Conductor Client Python API is used to submit jobs, and for
                this reason, the submitter needs to know about the location of
                Python 2.7 on your computer. The default value was automatically
                detected and should be sufficient unless you have a custom
                installation of Python.
              </p>
              <p>
                Use the reset button below to set the Python location
                automatically, and use the folder icon to browse to a location.
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
        >
          Python Location:
        </Typography>

        <Paper className={clsx(classes.paper, classes.value)}>
          <InputBase
            disabled={true}
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
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.labelBox}>
        <Typography
          className={classes.sectionHeading}
          color="primary"
          variant="h6"
        >
          Remote environment overrides
        </Typography>
        <div className={classes.spacer} />
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>Set extra environment variables, or override existing ones.</p>
              <p>
                When you select software versions in the <b>Software</b> tab, a
                number of environment variables are made available to the render
                nodes. Use the fields below to override them with new values, or
                to unset them. For example,
                <ol>
                  <li>
                    The PATH variable gets set by Nuke, but you want to append
                    your local scripts folder. You'll have to enter your new
                    path joined to the existing path. Note the colon separator.
                    <pre>
                      PATH :
                      "/opt/thefoundry/nuke/11/nuke11.3v5:/Users/me/scripts"
                    </pre>
                  </li>
                  <li>
                    You want to unset a variable that was set by some software
                    package. Just leave the value empty.
                    <pre>MAYA_DEBUG : ""</pre>
                  </li>
                </ol>
              </p>
            </React.Fragment>
          }
        />
      </Box>
      {overrides.map((entry, i) => (
        <Box
          className={classes.row}
          justify="flex-start"
          alignItems="center"
          key={i}
        >
          <Paper className={clsx(classes.paper, classes.key)}>
            <InputBase
              onChange={e =>
                dispatch(
                  setEnvEntry({ key: e.target.value, value: null, index: i })
                )
              }
              value={entry.key}
              className={classes.input}
              placeholder="KEY"
            />
          </Paper>

          <Paper className={clsx(classes.paper, classes.value)}>
            <InputBase
              onChange={e =>
                dispatch(
                  setEnvEntry({ key: null, value: e.target.value, index: i })
                )
              }
              value={entry.value}
              className={classes.input}
              placeholder="VALUE"
            />
          </Paper>

          <IconButton
            size="small"
            disabled={entry.key.trim() === "" && entry.value.trim() === ""}
            className={classes.rowIcon}
            onClick={() => {
              dispatch(setEnvEntry({ key: "", value: "", index: i }));
            }}
          >
            <DeleteOutlineRounded />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default Advanced;
