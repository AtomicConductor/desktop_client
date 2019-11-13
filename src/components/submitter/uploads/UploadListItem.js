import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

import { createSelectable } from "react-selectable-fast";
import { humanFileSize } from "../../../_helpers/presentation";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: theme.spacing(0.2, 2),
    backgroundColor: fade(theme.palette.primary[900], 0.4)
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
    width: 85,
    flexShrink: 0,
    paddingRight: theme.spacing(1),
    borderRight: `2px solid ${theme.palette.divider}`
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
        <Typography
          variant="body2"
          color="primary"
          className={hilightClassname}
          component="p"
          align="right"
        >
          {humanFileSize(size)}
        </Typography>
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
