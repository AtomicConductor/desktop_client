import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import FolderIcon from "@material-ui/icons/Folder";
import Typography from "@material-ui/core/Typography";

import {
  Tooltip,
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
} from "../../../selectors/entities";

import {
  projectSelector,
  instanceTypeSelector
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
    margin: "20px 32px",
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
    outputPath
  } = useSelector(state => state.submitter.submission);

  const instanceTypes = useSelector(instanceTypesSelector);

  const instanceType = useSelector(instanceTypeSelector);

  const projects = useSelector(projectsSelector);
  let project = useSelector(projectSelector);
  project = project.errors ? "" : project;

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
        <Tooltip
          enterDelay={1000}
          title="The title that appears in the Conductor dashboard."
          placement="top"
        >
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
        </Tooltip>
      </InputRow>

      <InputRow single>
        <InputLabel label="Conductor project" firstLabel />
        <Tooltip
          enterDelay={1000}
          title="The Conductor project. The menu is populated when the submitter connects to your Conductor account."
          placement="top"
        >
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
        </Tooltip>
      </InputRow>

      <InputRow single>
        <InputLabel label="Frames" firstLabel />
        <Tooltip
          enterDelay={1000}
          title="The set of frames to render. To specify te set of frames enter a comma-separated list of arithmetic progressions. In most cases, this will be s simple range. Examples: 1001-1200 or 1,7,10-20,30-60x3,1001"
          placement="top"
        >
          <Paper className={clsx(classes.paper, classes.dominantPaper)}>
            <InputBase
              className={clsx(classes.input)}
              placeholder="e.g. 1-100x1"
              value={frameSpec}
              onChange={e => dispatch(setFrameSpec(e.target.value))}
            />
          </Paper>
        </Tooltip>

        <InputLabel label="Chunk size" />
        <Tooltip
          enterDelay={1000}
          title="A chunk is the set of frames handled by one task. If your renders are fairly fast, it may make sense to render many frames per task. In most cases, chunk size should be 1."
          placement="top"
        >
          <Paper className={clsx(classes.paper, classes.dominantPaper)}>
            <InputBase
              className={clsx(classes.input)}
              type="number"
              value={chunkSize}
              onChange={e => dispatch(setChunkSize(e.target.value))}
            />
          </Paper>
        </Tooltip>
      </InputRow>

      <InputRow single>
        <InputLabel label="Tiles" firstLabel />
        <Tooltip
          enterDelay={1000}
          title="If your renderer supports tile rendering, use this control to generate tile numbers for each frame."
          placement="top"
        >
          <Paper className={clsx(classes.paper)}>
            <InputBase
              className={clsx(classes.input)}
              placeholder="e.g. 1-9"
              value={tileSpec}
              disabled={!useTiles}
              onChange={e => dispatch(setTileSpec(e.target.value))}
            />
          </Paper>
        </Tooltip>
        <Switch
          checked={useTiles}
          onChange={e => dispatch(setUseTiles(e.target.checked))}
        />
      </InputRow>

      <InputRow single>
        <InputLabel label="Scout frames" firstLabel />
        <Tooltip
          enterDelay={1000}
          title="When the submission reaches Conductor, only those tasks containing the specified scout frames are started. Other tasks are set to a holding state. Example: 1,50,100"
          placement="top"
        >
          <Paper className={clsx(classes.paper)}>
            <InputBase
              className={clsx(classes.input)}
              placeholder="e.g. 1,25,50"
              value={scoutFrameSpec}
              disabled={!useScoutFrames}
              onChange={e => dispatch(setScoutFrameSpec(e.target.value))}
            />
          </Paper>
        </Tooltip>
        <Switch
          onChange={e => dispatch(setUseScoutFrames(e.target.checked))}
          checked={useScoutFrames}
        />
      </InputRow>

      <InputRow single>
        <InputLabel label="Instance type" firstLabel />
        <Tooltip
          enterDelay={1000}
          title="Specify the hardware configuration used to run your tasks. Higher specification instances are potentially faster and able to handle heavier scenes. You are encouraged to run tests to find the most cost-efficient combination that meets your deadline."
          placement="top"
        >
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
        </Tooltip>

        <InputLabel label="Preemptible" />
        <Tooltip
          enterDelay={1000}
          title="Preemptible instances are less expensive to run than non-preemptible. The drawback is that they may be stopped at any time by the cloud provider. The probability of an instance being preempted rises with the duration of the task. Conductor does not support checkpointing, so if a task is preempted it is started from scratch on another instance. It is possible to change the preemptible setting in the dashboard for your account."
          placement="top"
        >
          <Switch
            checked={preemptible}
            onChange={e => dispatch(setPreemptible(e.target.checked))}
          />
        </Tooltip>
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
          <Tooltip
            enterDelay={1000}
            title="Specify the location where files are rendered to. 
            Any files produced by the render must be in a location somewhere inside the output directory. 
            In addition, none of the assets you specify in the FILES tab may live anywhere in the output directory."
            placement="top"
          >
            <InputBase
              onChange={e => dispatch(setOutputPath(e.target.value))}
              value={outputPath}
              className={classes.input}
            />
          </Tooltip>
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
