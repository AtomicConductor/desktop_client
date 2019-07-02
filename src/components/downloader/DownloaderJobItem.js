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
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import Typography from "@material-ui/core/Typography";
import DownloaderJobItemDetailsContainer from "./DownloaderJobItemDetailsContainer";

const useStyles = makeStyles(theme => ({
  summary: {
    height: 20
    // display: "flex"
    // justifyContent: "space-between"
    // border: "1px solid red"
  },

  summaryLeft: {
    height: 30,
    display: "flex",
    // border: "1px solid yellow",
    // flexGrow: 1,
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

const DownloaderJobItem = props => {
  const { job, onPanelClick, expanded } = props;

  // console.log(job);

  const projectLabel = job.projectId
    ? job.projectId.split("|").reverse()[0]
    : "NULL";
  const jobLabel = job.jobLabel;
  const jobTitle = job.title;

  // console.log(count);

  const classes = useStyles();

  // const addJobToQueue = label => () => {
  //   addToQueue(label);
  // };

  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
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
        <DownloaderJobItemDetailsContainer job={job} />
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button size="small" color="secondary" variant="outlined">
          Download
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

DownloaderJobItem.propTypes = {
  expanded: PropTypes.string.isRequired,
  onPanelClick: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired
};

export default DownloaderJobItem;

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
