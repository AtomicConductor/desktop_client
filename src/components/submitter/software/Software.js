import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { isDeepStrictEqual } from "util";
import {
  IconButton,
  Select,
  Box,
  Paper,
  MenuItem,
  InputBase
} from "@material-ui/core";
import { DeleteOutlineRounded } from "@material-ui/icons";
import { updateSelectedSoftware } from "../../../_actions/submitter";
import InputRow from "../InputRow";
import InputLabel from "../InputLabel";

const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px 32px",
    minWidth: 700
  },
  input: {
    marginLeft: 8,
    flex: 1,
    flexGrow: 1
  },
  paper: {
    height: 32,
    padding: "2px 4px",
    display: "flex",
    flexBasis: "32%"
  },
  dominantPaper: {
    flexBasis: "100%"
  },
  fabIcon: {
    margin: theme.spacing(1)
  }
}));

const Software = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const softwarePackages = useSelector(
    state => state.entities.softwarePackages
  );

  const packages = useSelector(
    state => state.submitter.submission.softwarePackages
  );

  return (
    <Box className={classes.container}>
      {packages.map(({ softwareKey, package: pkg }, softwareIndex) => (
        <InputRow single key={softwareKey}>
          <InputLabel label="Software" firstLabel />

          <Paper className={clsx(classes.paper)}>
            <Select
              value={softwareKey}
              input={<InputBase className={classes.input} />}
              onChange={e => {
                dispatch(
                  updateSelectedSoftware({
                    index: softwareIndex,
                    softwareKey: e.target.value,
                    package: {}
                  })
                );
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.keys(softwarePackages).map((software, index) => (
                <MenuItem key={index} value={software}>
                  {software}
                </MenuItem>
              ))}
            </Select>
          </Paper>

          <InputLabel label="Version" />

          <Paper className={clsx(classes.paper)}>
            <Select
              value={pkg}
              input={<InputBase className={classes.input} />}
              onChange={e => {
                dispatch(
                  updateSelectedSoftware({
                    index: softwareIndex,
                    softwareKey,
                    package: e.target.value
                  })
                );
              }}
            >
              <MenuItem value={{}}>
                <em>None</em>
              </MenuItem>
              {softwarePackages[softwareKey] &&
                softwarePackages[softwareKey].packages.map((pkg, index) => (
                  <MenuItem key={index} value={pkg}>
                    {pkg.version}
                  </MenuItem>
                ))}
            </Select>
          </Paper>
          <IconButton
            disabled={softwareKey === "" && isDeepStrictEqual(pkg, {})}
            onClick={() => {
              dispatch(
                updateSelectedSoftware({
                  index: softwareIndex,
                  softwareKey: "",
                  package: ""
                })
              );
            }}
          >
            <DeleteOutlineRounded />
          </IconButton>
        </InputRow>
      ))}
    </Box>
  );
};

export default Software;
