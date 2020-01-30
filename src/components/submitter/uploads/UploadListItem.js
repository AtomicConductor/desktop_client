import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { createSelectable } from "react-selectable-fast";
import { WarningRounded } from "@material-ui/icons";
import amber from "@material-ui/core/colors/amber";
import Tooltip from "../../app/Tooltip";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: theme.spacing(0.2, 2),
    backgroundColor: fade(theme.palette.primary[900], 0.4),
    height: 24
  },
  odd: {
    backgroundColor: fade(theme.palette.primary[900], 0.7)
  },
  sel: {
    color: "white",
    backgroundColor: fade(theme.palette.secondary.light, 0.2)
  },
  unsel: {},
  right: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1)
  },
  left: {
    width: 40,
    flexShrink: 0,
    paddingRight: theme.spacing(1)
  },
  icon: {
    color: amber[600]
  }
}));

const UploadListItem = props => {
  const classes = useStyles();

  const { odd, selectableRef, isSelected, isSelecting, path, missing } = props;

  const hilight = isSelected || isSelecting;
  const hilightClassname = clsx({ [classes.sel]: hilight });

  return (
    <Paper
      ref={selectableRef}
      className={`${classes.root} ${odd && classes.odd}`}
    >
      <div className={classes.left}>
        {missing && (
          <Tooltip title="Missing asset">
            <WarningRounded className={classes.icon} />
          </Tooltip>
        )}
      </div>

      <div className={classes.right}>
        <Typography
          variant="body2"
          color="primary"
          className={hilightClassname}
          component="p"
        >
          {path}
        </Typography>
      </div>
    </Paper>
  );
};

export default createSelectable(UploadListItem);
