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
  Typography,
  Tooltip
} from "@material-ui/core";
import {
  DeleteOutlineRounded,
  FolderRounded,
  SettingsBackupRestore
} from "@material-ui/icons";
import {
  setEnvEntry,
  savePythonLocation,
  resetPythonLocation
} from "../../../_actions/submitter";
import {
  environmentOverrides,
  pythonLocation
} from "../../../selectors/submitter";

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
  fabIcon: {
    margin: theme.spacing(1)
  },
  row: {
    display: "flex",
    justify: "space-between",
    margin: theme.spacing(1)
  },
  rowIcon: {
    marginLeft: theme.spacing(1),
    padding: 0,
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
  }
}));

const Advanced = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const overrides = useSelector(environmentOverrides);
  const pythonPath = useSelector(pythonLocation);

  return (
    <Box className={classes.container}>
      <Typography
        className={classes.sectionHeading}
        color="primary"
        variant="h6"
      >
        Local settings
      </Typography>

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

          <IconButton
            color="primary"
            className={classes.rowIcon}
            component="span"
            size="small"
          >
            <FolderRounded />
          </IconButton>
        </label>
        <Tooltip enterDelay={200} placement="top" title="Reset Python path">
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
      <Typography
        className={classes.sectionHeading}
        color="primary"
        variant="h6"
      >
        Remote environment overrides
      </Typography>

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
