import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SyncIcon from "@material-ui/icons/Sync";
import IconButton from "@material-ui/core/IconButton";

import JobItemDetailsContainer from "./JobItemDetailsContainer";

const useStyles = makeStyles(theme => ({
  summary: {
    height: 20
  },

  summaryLeft: {
    height: 30,
    display: "flex",
    width: "100%"
  },

  summaryLabelText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: 70,
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },

  summaryProjectText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: 100,
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  summaryTitleText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: 500,
    fontSize: theme.typography.pxToRem(15)
  },
  spacer: {
    flexGrow: 1
  },
  button: {}
}));

const SyncButton = props => {
  const classes = useStyles();
  console.log(props.show);

  if (!props.show) {
    return null;
  }

  return (
    <IconButton
      color="primary"
      className={classes.syncButton}
      component="span"
      size="small"
      onClick={props.onClick}
    >
      <SyncIcon color="secondary" />
    </IconButton>
  );
};

const JobItem = props => {
  const {
    job,
    onPanelClick,
    expanded,
    addToQueue,
    fetchFilesInfo,
    loadingKey
  } = props;

  // const loadingKey = { job };
  const downloadable = Boolean(
    job.files &&
      Object.values(job.files).some(f => {
        return f.exists !== true;
      })
  );

  const projectLabel = job.projectId
    ? job.projectId.split("|").reverse()[0]
    : "NULL";

  const jobLabel = job.jobLabel;
  const jobTitle = job.title;

  const classes = useStyles();

  return (
    <ExpansionPanel
      TransitionProps={{ mountOnEnter: true }}
      expanded={expanded === job.jobLabel}
      onChange={onPanelClick(job.jobLabel)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon color="secondary" />}
        className={classes.summary}
        id={`${job.jobLabel}-header`}
      >
        <Box className={classes.summaryLeft}>
          <Typography
            className={classes.summaryLabelText}
          >{`${jobLabel}`}</Typography>

          <Typography
            className={classes.summaryProjectText}
          >{`${projectLabel}`}</Typography>

          <Typography
            className={classes.summaryTitleText}
          >{`${jobTitle}`}</Typography>
        </Box>

        <Box className={classes.spacer} />
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <JobItemDetailsContainer job={job} />
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <SyncButton show={loadingKey === 0} onClick={fetchFilesInfo} />

        <Button
          disabled={!downloadable}
          size="small"
          color="secondary"
          variant="outlined"
          onClick={addToQueue}
        >
          Download
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

JobItem.propTypes = {
  loadingKey: PropTypes.number.isRequired,
  fetchFilesInfo: PropTypes.func.isRequired,
  expanded: PropTypes.string.isRequired,
  onPanelClick: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired,
  addToQueue: PropTypes.func.isRequired
};

export default JobItem;

/* 



        <Box className={classes.summaryRight}>
          <Typography className={classes.summaryInfoText}>{`${
            job.title
          }`}</Typography>
        </Box>





const stopPropagation = e => e.stopPropagation();
const InputWrapper = ({ children }) => (
  <div onClick={stopPropagation}>{children}</div>
);



<InputWrapper className={classes.summaryActions}>
<Box className={classes.summaryActions}>
  <Typography
    variant="body2"
    className={classes.d}
  >{`${count} `}</Typography>

  <IconButton
    onClick={addJobToQueue(job.jobLabel)}
    size="small"
    className={classes.button}
    aria-label="Add to queue"
  >
    <AddToQueueIcon />
  </IconButton>
</Box>
</InputWrapper>

*/
