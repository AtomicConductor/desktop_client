import React from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { fade, makeStyles } from "@material-ui/core/styles";
import { pythonInstallersSelector } from "../../../_selectors/settings";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import blue from "@material-ui/core/colors/blue";
import indigo from "@material-ui/core/colors/indigo";
import { Alert } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { pythonLocationValid } from "../../../_selectors/settings";
const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px",
    minWidth: 700
  },
  info: {
    marginRight: theme.spacing(15),
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: fade(indigo[900], 0.25),
    display: "flex",
    width: "100%"
  },
  infoIcon: {
    color: blue[400]
  },

  buttonBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  button: {
    textTransform: "none"
  },
  buttonGroup: {
    marginTop: theme.spacing(4)
  },
  description: {
    marginTop: theme.spacing(2)
  }
}));

export default function PythonInstallerPanel() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const pyValid = useSelector(pythonLocationValid);

  const installers = useSelector(pythonInstallersSelector);
  const installerVersion = useSelector(
    state => state.settings.pythonInstallerVersion
  );
  const installersCount = installers.length;

  const classes = useStyles();

  if (installers.length === 0 || pyValid) {
    return null;
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const onDownloadPython = async () => {
    nw.Shell.openExternal(installers[selectedIndex].url);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Alert
        severity="info"
        icon={
          <InfoIcon
            fontSize="inherit"
            color="inherit"
            className={classes.infoIcon}
          />
        }
        className={classes.info}
      >
        <Typography variant="body2">
          If you don't have a valid version of Python installed, you can use
          this button to get the latest version from Python.org.
        </Typography>

        <Box className={classes.buttonBox}>
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={anchorRef}
            className={classes.buttonGroup}
          >
            <Button onClick={onDownloadPython} className={classes.button}>
              {`Install Python ${installerVersion} for ${installers[selectedIndex].label}`}
            </Button>
            {installersCount > 1 ? (
              <Button color="primary" size="small" onClick={handleToggle}>
                <ArrowDropDownIcon />
              </Button>
            ) : null}
          </ButtonGroup>
          <Typography
            variant="caption"
            color="secondary"
            className={classes.description}
          >
            {installers[selectedIndex].description}
          </Typography>
        </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {installers.map((installer, index) => (
                      <MenuItem
                        key={installer.label}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {installer.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Alert>
    </React.Fragment>
  );
}
