import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/HelpOutline";
import { installPlugin, openPluginHelp } from "../../_actions/plugins/install";
import { useSelector, useDispatch } from "react-redux";
import { packageLocation } from "../../_selectors/settings";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { itemsSelector, packageNameSelector } from "../../_selectors/plugins";
import { Alert } from "@material-ui/lab";
import { blue, indigo } from "@material-ui/core/colors";
import InfoIcon from "@material-ui/icons/InfoOutlined";

import Fade from "@material-ui/core/Fade";

import { pythonLocationValid } from "../../_selectors/settings";
import {
  Button,
  ButtonGroup,
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
  Tooltip,
  MenuItem,
  Menu,
  IconButton
} from "@material-ui/core";
import config from "../../config";

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
  },
  button: {
    textTransform: "none"
  },
  spacer: {
    flexGrow: "1"
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
    versions
  } = useSelector(itemsSelector)[pluginName];

  const versionCount = versions.length;

  const pkgLocation = useSelector(packageLocation);

  const installing = useSelector(packageNameSelector);
  const pythonValid = useSelector(pythonLocationValid);
  const installingThis = installing === packageName;

  const dim = Boolean(installing) || !pythonValid;
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  let tooltip = `Install version ${versions[selectedIndex]} of the Conductor ${pluginName} package from PyPi`;

  const onOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const onCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const install = async () => {
    setOpenConfirm(false);

    dispatch(installPlugin(pluginName, versions[selectedIndex]));
  };

  const openHelp = () => {
    dispatch(openPluginHelp(pluginName));
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };
  const handleToggle = event => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoPyPi = event => {
    nw.Shell.openExternal(`${config.pypi}/project/${packageName}`);
  };

  const confirmText = `Version ${versions[selectedIndex]} of the ${title} will be installed at:<br>
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
          {available === "pip" ? (
            <Tooltip
              title={`See the changelog and other info for the ${packageName} package on PyPy.`}
            >
              <IconButton edge="end" color="secondary" onClick={handleGoPyPi}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ) : null}

          {installed ? (
            <Tooltip
              title={`Click to see information about the installed version of ${packageName}.`}
            >
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
            </Tooltip>
          ) : null}

          <div className={classes.spacer} />
          {available === "pip" && versionCount > 0 ? (
            <Tooltip title={tooltip}>
              <ButtonGroup
                disabled={dim}
                variant="outlined"
                size="small"
                ref={anchorRef}
                aria-label="split button"
              >
                <Button
                  onClick={onOpenConfirm}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  className={classes.button}
                >{`INSTALL v${versions[selectedIndex]}`}</Button>
                {versionCount > 1 ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleToggle}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                ) : null}
              </ButtonGroup>
            </Tooltip>
          ) : null}
        </CardActions>

        {installingThis ? (
          <InstallProgress color="secondary" variant="indeterminate" />
        ) : null}
      </Card>

      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {versions.map((version, index) => (
          <MenuItem
            key={version}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {version}
          </MenuItem>
        ))}
      </Menu>

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
