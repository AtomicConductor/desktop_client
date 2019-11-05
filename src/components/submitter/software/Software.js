import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { isDeepStrictEqual } from "util";
import {
  IconButton,
  Grid,
  Typography,
  Select,
  Box,
  Paper,
  MenuItem,
  InputBase
} from "@material-ui/core";
import { DeleteOutlineRounded } from "@material-ui/icons";
import { updateSelectedSoftware } from "../../../_actions/submitter";

const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px 192px 20px 96px",
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
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          key={softwareIndex}
          spacing={1}
        >
          <Grid item xs={1}>
            <Typography color="primary">Software:</Typography>
          </Grid>
          <Grid item xs={4}>
            <Paper className={clsx(classes.paper, classes.dominantPaper)}>
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
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">Version:</Typography>
          </Grid>
          <Grid item xs={5}>
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
          </Grid>
          <Grid item xs={1}>
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
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default Software;
