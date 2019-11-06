import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import FolderIcon from "@material-ui/icons/Folder";
import Typography from "@material-ui/core/Typography";
import {
  Select,
  Box,
  Switch,
  Paper,
  MenuItem,
  IconButton,
  InputBase
} from "@material-ui/core";

import InputRow from "../InputRow";
import InputLabel from "../InputLabel";
import TaskTemplate from "./TaskTemplate";
import {
  instanceTypesSelector,
  projectsSelector
} from "../../../selectors/submitter";
import {
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setPreemptible,
  setRetries,
  setInstanceType,
  setProject,
  setOutputPath
} from "../../../_actions/submitter";

import clsx from "clsx";
const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px 192px 20px 96px",
    minWidth: 700
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  filename: {
    paddingTop: theme.spacing(1)
  },
  iconButton: {
    padding: 0,
    paddingLeft: theme.spacing(1)
  },
  paper: {
    height: 32,
    padding: "2px 4px",
    display: "flex",
    flexBasis: "32%"
  },
  dominantPaper: {
    flexBasis: "100%"
  },
  taskToolbar: {
    padding: "2px 8px",
    height: 36,
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    justifyContent: "flex-end"
  },
  taskTemplateContainer: {
    flexBasis: "100%"
  },
  taskMain: {
    display: "flex"
  },
  taskTemplateInput: {
    padding: "2px 4px",
    flexGrow: 1
  }
}));

const General = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    jobTitle,
    frameSpec,
    chunkSize,
    tileSpec,
    scoutFrameSpec,
    useTiles,
    useScoutFrames,
    preemptible,
    retries,
    instanceType,
    project,
    outputPath
  } = useSelector(state => state.submitter.submission);

  const instanceTypes = useSelector(instanceTypesSelector);

  const projects = useSelector(projectsSelector);

  const filename = useSelector(state => state.submitter.filename);

  const handleSelectOutputDirectory = e => {
    if (e.target.files && e.target.files[0]) {
      dispatch(setOutputPath(e.target.files[0].path));
    }
  };

  return (
    <Box className={classes.container}>
      <InputRow single>
        <InputLabel label="" firstLabel />

        <Typography
          variant="body2"
          color="primary"
          className={classes.filename}
        >
          {filename || "This submission has not been saved"}
        </Typography>
      </InputRow>

      <InputRow single>
        <InputLabel label="Job title" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <InputBase
            onChange={e => dispatch(setJobTitle(e.target.value))}
            value={jobTitle}
            className={classes.input}
            placeholder="e.g. Arnold shot car crash <seq_start> to <seq_end>"
          />
          <IconButton className={classes.iconButton} disabled>
            <MenuIcon />
          </IconButton>
        </Paper>
      </InputRow>

      <InputRow single>
        <InputLabel label="Project" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <Select
            onChange={e => dispatch(setProject(e.target.value))}
            value={project}
            input={<InputBase className={classes.input} />}
          >
            {projects.map((_, index) => (
              <MenuItem key={index} value={_}>
                {_}
              </MenuItem>
            ))}
          </Select>
        </Paper>
      </InputRow>

      <InputRow single>
        <InputLabel label="Frames" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <InputBase
            className={clsx(classes.input)}
            placeholder="e.g. 1-100x1"
            value={frameSpec}
            onChange={e => dispatch(setFrameSpec(e.target.value))}
          />
        </Paper>

        <InputLabel label="Chunk size" />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <InputBase
            className={clsx(classes.input)}
            type="number"
            value={chunkSize}
            onChange={e => dispatch(setChunkSize(e.target.value))}
          />
        </Paper>
      </InputRow>

      <InputRow single>
        <InputLabel label="Tiles" firstLabel />

        <Paper className={clsx(classes.paper)}>
          <InputBase
            className={clsx(classes.input)}
            placeholder="e.g. 1-9"
            value={tileSpec}
            disabled={!useTiles}
            onChange={e => dispatch(setTileSpec(e.target.value))}
          />
        </Paper>
        <Switch
          checked={useTiles}
          onChange={e => dispatch(setUseTiles(e.target.checked))}
        />
      </InputRow>

      <InputRow single>
        <InputLabel label="Scout frames" firstLabel />

        <Paper className={clsx(classes.paper)}>
          <InputBase
            className={clsx(classes.input)}
            placeholder="e.g. 1,25,50"
            value={scoutFrameSpec}
            disabled={!useScoutFrames}
            onChange={e => dispatch(setScoutFrameSpec(e.target.value))}
          />
        </Paper>
        <Switch
          onChange={e => dispatch(setUseScoutFrames(e.target.checked))}
          checked={useScoutFrames}
        />
      </InputRow>

      <InputRow single>
        <InputLabel label="Instance type" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <Select
            onChange={e => dispatch(setInstanceType(e.target.value))}
            value={instanceType}
            input={<InputBase className={classes.input} />}
          >
            {instanceTypes.map((_, index) => (
              <MenuItem key={index} value={_}>
                {_.description}
              </MenuItem>
            ))}
          </Select>
        </Paper>
        <InputLabel label="Preemptible" />
        <Switch
          checked={preemptible}
          onChange={e => dispatch(setPreemptible(e.target.checked))}
        />
        <InputLabel label="Retries" />
        <Paper className={clsx(classes.paper)}>
          <InputBase
            className={clsx(classes.input)}
            type="number"
            disabled={!preemptible}
            value={retries}
            onChange={e => dispatch(setRetries(e.target.value))}
          />
        </Paper>
      </InputRow>
      <InputRow single>
        <InputLabel label="Output folder" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <InputBase
            onChange={e => dispatch(setOutputPath(e.target.value))}
            value={outputPath}
            className={classes.input}
          />
          <label htmlFor="output-path-file">
            <input
              hidden
              className={classes.input}
              id="output-path-file"
              type="file"
              nwdirectory="true"
              nwdirectorydesc="Choose output folder"
              onChange={handleSelectOutputDirectory}
            />
            <IconButton
              color="primary"
              className={classes.iconButton}
              component="span"
              size="small"
            >
              <FolderIcon />
            </IconButton>
          </label>
        </Paper>
      </InputRow>
      <InputRow>
        <InputLabel label="Task template" firstLabel />
        <TaskTemplate />
      </InputRow>
    </Box>
  );
};

export default General;
