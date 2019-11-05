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
import { DeleteOutlineRounded } from "@material-ui/icons";

import { setEnvEntry, setPythonLocation } from "../../../_actions/submitter";

import FolderIcon from "@material-ui/icons/Folder";

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
  rowIcon: { marginLeft: theme.spacing(1), padding: 0 },
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

  const environmentOverrides = useSelector(
    state => state.submitter.submission.environmentOverrides
  );

  const pythonLocation = useSelector(state => state.submitter.pythonLocation);

  const handleSelectPythonLocation = e => {
    if (e.target.files && e.target.files[0]) {
      dispatch(setPythonLocation(e.target.files[0].path));
    }
  };

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
            value={pythonLocation}
            className={classes.input}
          />
        </Paper>
        <label htmlFor="python-path-file">
          <input
            hidden
            className={classes.input}
            id="python-path-file"
            type="file"
            nwdirectory="true"
            nwdirectorydesc="Choose python path"
            onChange={handleSelectPythonLocation}
          />

          <IconButton
            color="primary"
            className={classes.rowIcon}
            component="span"
            size="small"
          >
            <FolderIcon />
          </IconButton>
        </label>
      </Box>
      <Divider className={classes.divider} />
      <Typography
        className={classes.sectionHeading}
        color="primary"
        variant="h6"
      >
        Remote environment overrides
      </Typography>

      {environmentOverrides.map((entry, i) => (
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
