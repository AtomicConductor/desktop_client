import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import JobItemDetailsContainer from "./JobItemDetailsContainer";

const useStyles = makeStyles(theme => ({
  summaryDate: {
    width: 170,
    paddingRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  title: {
    fontSize: theme.typography.pxToRem(16)
  },
  label: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  labelBox: {
    width: 80,
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    marginRight: theme.spacing(1)
  },
  meta: {
    height: 24,
    overflow: "hidden",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(1)
  },

  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  chip: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));

const JobItem = props => {
  const { job, onPanelClick, addToQueue, expanded } = props;

  const downloadable = Boolean(
    job.files &&
      Object.values(job.files).some(f => {
        return f.exists !== 100;
      })
  );

  const { jobLabel, title, project, owner, created, location } = job;

  const createdTime = moment(created).format("Do MMM YYYY, H:mm");

  const projectLabel = project && project.split("|").reverse()[0];

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
        <Box className={classes.labelBox}>
          <Typography
            variant="h6"
            color="primary"
            className={classes.label}
          >{`${jobLabel}`}</Typography>
        </Box>

        <Box className={classes.main}>
          <Typography className={classes.title}>{title}</Typography>

          <Box className={classes.meta}>
            <Typography className={classes.summaryDate}>
              {createdTime}
            </Typography>

            {projectLabel ? (
              <Chip
                variant="outlined"
                size="small"
                color="primary"
                label={projectLabel}
                className={classes.chip}
              />
            ) : null}

            {owner ? (
              <Chip
                variant="outlined"
                size="small"
                color="primary"
                label={owner}
                className={classes.chip}
              />
            ) : null}

            {location ? (
              <Chip
                variant="outlined"
                size="small"
                color="primary"
                label={location}
                className={classes.chip}
              />
            ) : null}
          </Box>
        </Box>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <JobItemDetailsContainer job={job} />
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button
          disabled={!downloadable}
          size="small"
          color="secondary"
          onClick={addToQueue}
        >
          Download
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

JobItem.propTypes = {
  expanded: PropTypes.string.isRequired,
  onPanelClick: PropTypes.func.isRequired,
  loadingKey: PropTypes.number.isRequired,
  job: PropTypes.object.isRequired,
  addToQueue: PropTypes.func.isRequired
};

export default JobItem;
