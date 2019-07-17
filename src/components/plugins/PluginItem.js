import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Avatar from "@material-ui/core/Avatar";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SyncIcon from "@material-ui/icons/Sync";
import IconButton from "@material-ui/core/IconButton";

import PluginItemDetailsContainer from "./PluginItemDetailsContainer";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const useStyles = makeStyles(theme => ({
  spacer: {
    flexGrow: 1
  },
  button: {},
  avatar: {
    width: 32,
    height: 32,
    marginBottom: 8,
    marginRight: 8
  },
  card: {
    display: "flex",
    marginBottom: theme.spacing(1)
  },
  details: {
    display: "flex",
    flexDirection: "row"
  },
  content: {
    flex: "1 0 auto"
    // flexBasis: "66.66%"
  },
  logo: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),

    width: 60,
    height: 60
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  },

  leftColumn: {
    flexBasis: "66.66%"
  },
  rightColumn: {
    flexShrink: 0,
    width: 200,
    borderRight: `2px solid ${theme.palette.divider}`,
    borderLeft: `2px solid ${theme.palette.divider}`
  }
}));

const PluginItem = props => {
  const { expanded, onPanelClick, plugin } = props;
  const { name, title, description } = plugin;
  const theme = useTheme();
  // const loadingKey = { job };
  // const downloadable = Boolean(
  //   job.files &&
  //     Object.values(job.files).some(f => {
  //       return f.exists !== true;
  //     })
  // );

  // const projectLabel = job.project
  //   ? job.project.split("|").reverse()[0]
  //   : "NULL";

  // const jobLabel = job.jobLabel;
  // const jobTitle = job.title;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.logo}
        image={`/images/${name}.png`}
        title="Live from space album logo"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {`${title} intaller`}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {description}
          </Typography>
        </CardContent>

        <CardContent className={classes.rightColumn}>foo</CardContent>
      </div>
    </Card>
  );
};

PluginItem.propTypes = {
  expanded: PropTypes.string.isRequired,
  onPanelClick: PropTypes.func.isRequired,
  plugin: PropTypes.object.isRequired
};

export default PluginItem;

/**
 * 
 * 
 *  <div className={classes.controls}>
          <IconButton aria-label="Previous">
            {theme.direction === "rtl" ? (
              <SkipNextIcon />
            ) : (
              <SkipPreviousIcon />
            )}
          </IconButton>
          <IconButton aria-label="Play/pause">
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="Next">
            {theme.direction === "rtl" ? (
              <SkipPreviousIcon />
            ) : (
              <SkipNextIcon />
            )}
          </IconButton>
        </div>




        
<ExpansionPanel
TransitionProps={{ mountOnEnter: true }}
expanded={expanded === name}
onChange={onPanelClick(name)}
>
<ExpansionPanelSummary
  expandIcon={<ExpandMoreIcon color="secondary" />}
  className={classes.summary}
  id={`${name}-header`}
>
  <Box className={classes.summaryLeft}>
    <Avatar
      alt="maya"
      src={youNameIt}
      style={{ borderRadius: 0 }}
      className={classes.avatar}
    />
    <Typography className={classes.summaryLabelText}>TMP</Typography>,
    <Typography className={classes.summaryProjectText}>TMP</Typography>
    <Typography className={classes.summaryTitleText}>{title}</Typography>
  </Box>

  <Box className={classes.spacer} />
</ExpansionPanelSummary>

<ExpansionPanelDetails>
  <PluginItemDetailsContainer plugin={plugin} />
</ExpansionPanelDetails>
<Divider />
<ExpansionPanelActions>
  <Button size="small" color="secondary" variant="outlined">
    Install
  </Button>
</ExpansionPanelActions>
</ExpansionPanel>

 */
