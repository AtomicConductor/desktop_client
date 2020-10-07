import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";
import { closePluginHelp } from "../../_actions/plugins/install";
import { useSelector, useDispatch } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import indigo from "@material-ui/core/colors/indigo";
import { helpItemSelector } from "../../_selectors/plugins";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import MayaHelpContent from "./MayaHelpContent";
import C4dHelpContent from "./C4dHelpContent";
import CoreHelpContent from "./CoreHelpContent";
import ClarisseHelpContent from "./ClarisseHelpContent";

import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    color: theme.palette.secondary.main,
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  actionRow: {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  info: {
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: fade(indigo[900], 0.25)
  },
  infoIcon: {
    color: blue[400]
  }
}));

export default props => {
  const { pluginName } = props;

  if (!pluginName) return null;

  const dispatch = useDispatch();

  const {
    title,
    installed,
    packageLocation,
    packageName
  } = useSelector(state => helpItemSelector(state));

  const classes = useStyles();

  const onClose = () => {
    dispatch(closePluginHelp());
  };

  const HelpContent = ({ pluginName }) => {
    switch (pluginName) {
      case "maya":
        return (
          <MayaHelpContent
            packageLocation={packageLocation}
            installed={installed}
            packageName={packageName}
          />
        );
      case "clarisse":
        return (
          <ClarisseHelpContent
            packageLocation={packageLocation}
            installed={installed}
            packageName={packageName}
          />
        );
      case "c4d":
        return (
          <C4dHelpContent
            packageLocation={packageLocation}
            installed={installed}
            packageName={packageName}
          />
        );
      case "core":
        return (
          <CoreHelpContent
            packageLocation={packageLocation}
            installed={installed}
            packageName={packageName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={Boolean(pluginName)}
      onClose={onClose}
      className={classes.dialog}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>

      <Alert
        icon={
          <InfoIcon
            fontSize="inherit"
            color="inherit"
            className={classes.infoIcon}
          />
        }
        severity="info"
        className={classes.info}
      >
        {`Version ${installed} of ${title} is installed as a python package at:
${packageLocation}/${packageName}.`}
      </Alert>

      <HelpContent pluginName={pluginName} />

      <DialogActions className={classes.actionRow}>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
