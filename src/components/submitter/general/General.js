import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { BookmarkBorder, Bookmarks } from "@material-ui/icons";

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
import { instanceTypeDescriptionSelector } from "../../../selectors/submitter";
import {
  setJobTitle,
  setFrameSpec,
  setChunkSize,
  setTileSpec,
  setScoutFrameSpec,
  setUseTiles,
  setUseScoutFrames,
  setTaskTemplate,
  setPreemptible,
  setRetries,
  setInstanceTypeIndex,
  setProjectIndex
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

const General = props => {
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
    taskTemplate,
    preemptible,
    retries,
    projects,
    instanceTypeIndex,
    projectIndex
  } = useSelector(state => state.submitter);

  const instanceTypes = useSelector(instanceTypeDescriptionSelector);

  return (
    <Box className={classes.container}>
      {/* TITLE */}
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
            onChange={e => dispatch(setProjectIndex(e.target.value))}
            value={projectIndex}
            input={<InputBase className={classes.input} />}
            MenuProps={{
              style: { zIndex: "1400" }
            }}
          >
            {projects.map((_, index) => (
              <MenuItem key={index} value={index}>
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
            onChange={e => dispatch(setInstanceTypeIndex(e.target.value))}
            value={instanceTypeIndex}
            input={<InputBase className={classes.input} />}
            MenuProps={{
              style: { zIndex: "1400" }
            }}
          >
            {instanceTypes.map((_, index) => (
              <MenuItem key={index} value={index}>
                {_}
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
            disabled={!preemptible}
            value={retries}
            onChange={e => dispatch(setRetries(e.target.value))}
          />
        </Paper>
      </InputRow>

      <InputRow>
        <InputLabel label="Task template" firstLabel />
        <Box className={classes.taskTemplateContainer}>
          <Paper className={clsx(classes.dominantPaper)}>
            <Box className={clsx(classes.taskToolbar)}>
              <IconButton color="primary" className={classes.iconButton}>
                <BookmarkBorder />
              </IconButton>
              <IconButton color="primary" className={classes.iconButton}>
                <Bookmarks />
              </IconButton>
            </Box>
            <Box className={clsx(classes.taskMain)}>
              <InputBase
                value={taskTemplate}
                onChange={e => dispatch(setTaskTemplate(e.target.value))}
                multiline
                rows={6}
                className={classes.taskTemplateInput}
                placeholder="kick -nstdin -i /path/to/myfile.<chunk_start>.ass -dw -dp -v 5"
              />
            </Box>
          </Paper>
        </Box>
      </InputRow>
    </Box>
  );
};

export default General;
