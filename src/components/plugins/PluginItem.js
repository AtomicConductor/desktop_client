import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/HelpOutline";

import { installPlugin, openPluginHelp } from "../../_actions/plugins";
import { useSelector, useDispatch } from "react-redux";
import { packageLocation } from "../../_selectors/settings";

import { itemsSelector, packageNameSelector } from "../../_selectors/plugins";
import { Alert } from "@material-ui/lab";
import { blue, indigo } from "@material-ui/core/colors";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import os from "os";
import { pythonLocationValid } from "../../_selectors/settings";
import {
  Button,
  LinearProgress,
  CardActions,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  card: {
    width: 460,
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
  ribbon: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 60,
    height: 60
  },

  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: `2px solid ${theme.palette.divider}`,
    height: theme.spacing(6)
  },
  top: {
    height: 130,
    display: "flex",
    flexDirection: "row"
  },

  info: {
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: fade(indigo[900], 0.25)
  },
  infoIcon: {
    color: blue[400]
  },
  dialogActionRow: {
    borderTop: `2px solid ${theme.palette.divider}`,
    height: theme.spacing(6)
  },

  description: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(3)
  },
  chip: { color: theme.palette.text.secondary, marginTop: "3px" },
  secondaryActions: {
    display: "flex",
    flexDirection: "row"
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const { pluginName } = props;
  const {
    title,
    description,
    installed,
    packageName,
    phase,
    available,
    darwin_url,
    linux_url,
    win32_url
  } = useSelector(itemsSelector)[pluginName];

  const pkgLocation = useSelector(packageLocation);

  const installing = useSelector(packageNameSelector);
  const pythonValid = useSelector(pythonLocationValid);
  const installingThis = installing === packageName;

  const dim = Boolean(installing) || !pythonValid;

  const [openConfirm, setOpenConfirm] = React.useState(false);

  const platform = os.platform();

  let url = null;
  let tooltip = `Install the Conductor ${pluginName} Pip package from PyPi`;

  if (
    available === "github" &&
    ["linux", "darwin", "win32"].includes(platform)
  ) {
    url = { darwin_url, linux_url, win32_url }[`${platform}_url`];
    tooltip = `Download ${url} from Github`;
  }

  const onOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const onCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const install = async () => {
    setOpenConfirm(false);
    dispatch(installPlugin(pluginName));
  };

  const onDownload = async () => {
    nw.Shell.openExternal(url);
  };

  const openHelp = () => {
    dispatch(openPluginHelp(pluginName));
  };

  const confirmText = `${title} will be installed at:<br>
<strong>${pkgLocation}/${packageName}</strong><br>
To change the install location, press 'CANCEL' and edit the Conductor Package Location on the Settings page.`;

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.ribbon}
          image={`/images/${phase}Ribbon.png`}
        />
        <Box className={classes.top}>
          <CardMedia
            className={classes.logo}
            image={`/images/${pluginName}.png`}
          />

          <CardContent>
            <Typography variant="h6">{title}</Typography>

            <Typography variant="body2" className={classes.description}>
              {description}
            </Typography>
          </CardContent>
        </Box>

        <CardActions className={classes.actionRow}>
          <div className={classes.secondaryActions}>
            {installed ? (
              <Chip
                onDelete={openHelp}
                onClick={openHelp}
                deleteIcon={<HelpIcon />}
                variant="outlined"
                size="small"
                color="secondary"
                label={`Installed v${installed}`}
                className={classes.chip}
              />
            ) : null}
          </div>
          <Tooltip title={tooltip}>
            <Button
              size="small"
              color="secondary"
              onClick={available === "github" ? onDownload : onOpenConfirm}
              disabled={dim}
            >
              {available === "pip"
                ? installed
                  ? "Upgrade"
                  : "Install"
                : available === "github"
                ? "Download"
                : ""}
            </Button>
          </Tooltip>
        </CardActions>

        {installingThis ? (
          <InstallProgress color="secondary" variant="indeterminate" />
        ) : null}
      </Card>

      <Dialog
        open={openConfirm}
        onClose={onCloseConfirm}
        className={classes.dialog}
        maxWidth={"sm"}
      >
        <DialogTitle className={classes.dialogTitle}>
          Confirm Install Location?
        </DialogTitle>

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
          <div dangerouslySetInnerHTML={{ __html: confirmText }}></div>
        </Alert>

        <DialogActions className={classes.dialogActionRow}>
          <Button onClick={onCloseConfirm} color="secondary">
            Cancel
          </Button>
          <Button onClick={install} color="secondary">
            Install
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

PluginItem.propTypes = {
  pluginName: PropTypes.string.isRequired
};

export default PluginItem;
