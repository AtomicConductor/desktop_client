import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/HelpOutline";
import IconButton from "@material-ui/core/IconButton";

import LinearProgress from "@material-ui/core/LinearProgress";

import CardActions from "@material-ui/core/CardActions";
import Chip from "@material-ui/core/Chip";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CodeIcon from "@material-ui/icons/Code";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Tooltip from "@material-ui/core/Tooltip";
import LinesEllipsis from "react-lines-ellipsis";

import InstallPathFieldContainer from "./InstallPathFieldContainer";
const useStyles = makeStyles(theme => ({
  card: {
    width: 560,
    marginBottom: theme.spacing(1),
    position: "relative",
    margin: theme.spacing(1)
  },
  logo: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    flexShrink: 0,
    width: 60,
    height: 60
  },

  actionRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  top: {
    height: 100,
    display: "flex",
    flexDirection: "row"
  },
  bottom: {
    paddingTop: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.divider}`
  },
  title: {
    display: "flex",
    justifyContent: "space-between"
  },
  description: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(3)
  },
  chip: { color: theme.palette.text.secondary },
  secondaryActions: {
    display: "flex",
    flexDirection: "row"
  },
  secondaryIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const InstallProgress = withStyles(
  {
    root: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: 3,
      backgroundColor: fade("#000", 0.0)
    }
  },
  { withTheme: true }
)(LinearProgress);

const PluginItem = props => {
  const { plugin, install, uninstall } = props;
  const { name, title, description, installed } = plugin;

  const classes = useStyles();

  const [completed, setCompleted] = React.useState(0);
  let timer = null;

  const toggleInstall = () => {
    timer = setInterval(() => {
      setCompleted(oldCompleted => {
        if (oldCompleted === 100) {
          if (installed) {
            uninstall();
          } else {
            install();
          }
          setCompleted(0);
          clearInterval(timer);
        }
        const diff = Math.random() * (installed ? 40 : 20);
        return Math.min(oldCompleted + diff, 100);
      });
    }, 500);
  };

  return (
    <Card className={classes.card}>
      <Box className={classes.top}>
        <CardMedia className={classes.logo} image={`/images/${name}.png`} />
        <CardContent>
          <div className={classes.title}>
            <Typography variant="h6">{title}</Typography>
            {installed ? (
              <Chip
                variant="outlined"
                size="small"
                color="secondary"
                label="Installed"
                className={classes.chip}
              />
            ) : null}
          </div>

          <LinesEllipsis
            className={classes.description}
            text={description}
            maxLine="3"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </CardContent>
      </Box>
      <CardContent className={classes.bottom}>
        <InstallPathFieldContainer pluginName={name} />
      </CardContent>

      <CardActions className={classes.actionRow}>
        <div className={classes.secondaryActions}>
          <Tooltip title={`Help on ${title}`} placement="top">
            <IconButton
              size="small"
              aria-label="Previous"
              className={classes.secondaryIcon}
            >
              <HelpIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={`View environment variables and setup details for ${title}`}
            placement="top"
          >
            <IconButton
              size="small"
              aria-label="Previous"
              className={classes.secondaryIcon}
            >
              <CodeIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
        <Button size="small" color="secondary" onClick={toggleInstall}>
          {installed ? `Uninstall` : `Install`}
        </Button>
      </CardActions>
      {completed > 0 ? (
        <InstallProgress
          color="secondary"
          variant="determinate"
          value={completed}
        />
      ) : null}
    </Card>
  );
};

PluginItem.propTypes = {
  install: PropTypes.func.isRequired,
  uninstall: PropTypes.func.isRequired,

  plugin: PropTypes.object.isRequired
};

export default PluginItem;

