import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

import { createSelectable } from "react-selectable-fast";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: theme.spacing(0.5, 2)
  },
  odd: {
    backgroundColor: fade(theme.palette.primary[800], 0.8)
  },
  sel: {
    color: theme.palette.secondary.light
  },
  unsel: {},
  left: {
    flexGrow: 1
  },
  right: {
    width: 100,
    borderLeft: `2px solid ${theme.palette.divider}`
  }
}));

const UploadListItem = props => {
  const classes = useStyles();

  const { odd, selectableRef, isSelected, isSelecting, path, size } = props;

  const hilight = isSelected || isSelecting;
  const hilightClassname = clsx({ [classes.sel]: hilight });
  return (
    <Paper
      ref={selectableRef}
      className={`${classes.root} ${odd && classes.odd}`}
    >
      <div className={classes.left}>
        <Typography className={hilightClassname} component="p">
          {path}
        </Typography>
      </div>

      <div className={classes.right}>
        <Typography className={hilightClassname} component="p" align="center">
          {`${parseInt(size / 1024)} Kb`}
        </Typography>
      </div>
    </Paper>
  );
};

export default createSelectable(UploadListItem);
