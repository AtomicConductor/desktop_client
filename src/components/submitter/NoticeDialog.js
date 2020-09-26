import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import config from "../../config";
import { useLocalStorage } from "../../hooks/localStorage";
import { settings as kSettings } from "../../_helpers/constants";

const useStyles = makeStyles(theme => ({
  formTitle: {
    color: theme.palette.secondary.main
  }
}));

export default () => {
  const classes = useStyles();

  const browse = url => () => nw.Shell.openExternal(url);
  const { documentationUrl } = config;

  const [showSubmitterNotice, setShowSubmitterNotice] = useLocalStorage(
    kSettings.showSubmitterNotice,
    true
  );

  const [isOpen, setIsOpen] = useState(showSubmitterNotice);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle id="form-dialog-title" className={classes.formTitle}>
        Important Notice!
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          The Submission Kit is not a replacement for the native Conductor host
          integrations.
        </DialogContentText>
        <DialogContentText>
          If you want to submit renders from Maya, Nuke, or Clarisse, you should
          use the embedded submitter plugins. They save time by taking care of
          asset dependencies and the format of render commands.
        </DialogContentText>
        <DialogContentText>
          This submission kit is provided for lower level hacking in those
          situations where a native plugin is either not available or not
          configurable to meet your circumstances.
        </DialogContentText>
        <DialogContentText>
          For more information on native plugins:
          <br />
          <Link onClick={browse(documentationUrl)} href="#" color="secondary">
            Consult the documentation.
          </Link>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsOpen(false);
            setShowSubmitterNotice(false);
          }}
          color="secondary"
        >
          Close forever
        </Button>
        <Button onClick={() => setIsOpen(false)} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
