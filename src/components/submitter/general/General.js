import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import HelpIcon from "../../app/HelpIcon";

import FolderIcon from "@material-ui/icons/Folder";

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
  },
  spacer: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
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

  const handleSelectOutputDirectory = e => {
    if (e.target.files && e.target.files[0]) {
      dispatch(setOutputPath(e.target.files[0].path));
    }
  };

  return (
    <Box className={classes.container}>
      <InputRow single>
        <InputLabel label="Job title" firstLabel />

        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <InputBase
            onChange={e => dispatch(setJobTitle(e.target.value))}
            value={jobTitle}
            className={classes.input}
            placeholder="e.g. Arnold shot car crash <seq_start> to <seq_end>"
          />
        </Paper>
        <HelpIcon tooltip="Title that appears in the Conductor dashboard." />
      </InputRow>

      <InputRow single>
        <InputLabel label="Conductor project" firstLabel />
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
        <HelpIcon tooltip="The project on the Conductor dashboard that you want to submit to." />
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
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>
                Generate frame numbers for each task and specify the number of
                frames per task (chunk size).
              </p>
              <p>
                To specify frames, enter a range with an optional step, for
                example: 1001-1200x3. If you want a set of frames with gaps, you
                can enter several ranges separated by commas such as:
                1,7,10-20,30-60x3,1001
              </p>
              <p>
                Use a chunk size greater than one if you want each task to
                process more than one frame.
              </p>
              <p>
                The first and last frames of each chunk are available to the
                task template in the tokens <b>chunk_start</b> and{" "}
                <b>chunk_end</b>
              </p>
            </React.Fragment>
          }
        />
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
        <div className={classes.spacer} />
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>
                If your renderer supports tile rendering, use this control to
                generate tile numbers. A task will be generated for every chunk,
                for every tile. If for example you have 10 frames with a chunk
                size of 1, and 4 tiles, you'll get 40 tasks.
              </p>
              <p>
                Tile numbers are available to the task template in the token:
                <b>tile</b>
              </p>
            </React.Fragment>
          }
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
        <div className={classes.spacer} />
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>Specifies the tasks to be rendered first. </p>
              <p>
                Scout frame spec is the same as for frame numbers. Example:
                0-200x50 would start tasks 0,50,100,150,200. Other tasks will be
                in a holding state until you visit the web dashboard to start
                them.
              </p>
            </React.Fragment>
          }
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
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>Specify the hardware configuration used to run your tasks.</p>
              <p>
                Higher specification instances are potentially faster and able
                to handle heavier scenes. You are encouraged to run tests to
                find the most cost-efficient combination that meets your
                deadline.
              </p>
              <p>
                Preemptible instances are less expensive to run than
                non-preemptible. The drawback is that they may be stopped at any
                time by the cloud provider. The likelihood of an instance being
                preempted rises with the duration of the task. Conductor does
                not support checkpointing, so if a task is preempted it is
                started from scratch on another instance. For this reason, you
                are encouraged to specify non-preemptible instances if frames
                renders take several hours.
              </p>
            </React.Fragment>
          }
        />
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
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>Specify the location where files are written to.</p>
              <p>
                All files produced by the submission must be written into this
                directory. Also note that none of the assets in the files tab
                can live under the output directory.
              </p>
            </React.Fragment>
          }
        />
      </InputRow>
      <InputRow>
        <InputLabel label="Task template" firstLabel />
        <TaskTemplate />
        <HelpIcon
          tooltip={
            <React.Fragment>
              <p>
                Specifies a template for the commands to be run on remote
                instances.
              </p>
              <p>
                Commands are generated by replacing tokens in this template with
                values that vary for each task. Example, if you specify frames 1
                to 4 with a chunk size of 2, you'll generate 2 tasks of 2 frames
                each. You can use the tokens <b>chunk_start</b> and
                <b>chunk_end</b> to substitute the first and last frame of each
                chunk into the task template. If the template is
                <pre>
                  Render -s &lt;chunk_start&gt; -e &lt;chunk_end&gt; myfile
                </pre>
                then the commands will be
                <pre>
                  Render -s 1 -e 2 myfile
                  <br />
                  Render -s 3 -e 4 myfile
                </pre>
              </p>
              <p>
                Check the preview tab any time to see how task commands are
                resolved.
              </p>
            </React.Fragment>
          }
        />
      </InputRow>
    </Box>
  );
};

export default General;
