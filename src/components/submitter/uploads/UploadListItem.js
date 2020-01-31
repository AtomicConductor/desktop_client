import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { createSelectable } from "react-selectable-fast";
import { WarningRounded } from "@material-ui/icons";
import Tooltip from "../../app/Tooltip";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    backgroundColor: fade(theme.palette.primary[900], 0.4),
    height: 24
  },
  odd: {
    backgroundColor: fade(theme.palette.primary[900], 0.7)
  },
  sel: {
    color: "white",
    backgroundColor: fade(theme.palette.primary.light, 0.2)
  },
  right: {
    flexGrow: 1
  },
  left: {
    width: 40,
    flexShrink: 0,
    padding: theme.spacing(1, 1)
  }
}));

const UploadListItem = props => {
  const classes = useStyles();

  const { odd, selectableRef, isSelected, isSelecting, path, missing } = props;
  const hilight = isSelected || isSelecting || missing;
  const hilightClassname = clsx({ [classes.sel]: hilight });

  return (
    <Paper
      ref={selectableRef}
      className={`${classes.root} ${odd && classes.odd}`}
    >
      <div className={classes.left}>
        {missing && (
          <Tooltip title="Missing asset">
            <WarningRounded />
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
