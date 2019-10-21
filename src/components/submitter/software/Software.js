import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";

import InputRow from "../InputRow";
import InputLabel from "../InputLabel";

import clsx from "clsx";
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
  }
}));

const Software = props => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <InputRow single>
        <InputLabel label="Software" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <Select value={10} input={<InputBase className={classes.input} />}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Autodesk Maya</MenuItem>
            <MenuItem value={20}>Clarisse</MenuItem>
            <MenuItem value={30}>Nuke</MenuItem>
          </Select>
        </Paper>

        <InputLabel label="Version" />
        <Paper className={clsx(classes.paper)}>
          <Select value={10} input={<InputBase className={classes.input} />}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>2018 SP3</MenuItem>
            <MenuItem value={10}>2018 SP4</MenuItem>
            <MenuItem value={10}>2018 SP5</MenuItem>
            <MenuItem value={10}>2018.5 SP0 </MenuItem>
            <MenuItem value={10}>2019 SP0</MenuItem>
          </Select>
        </Paper>
      </InputRow>

      <InputRow single>
        <InputLabel label="" firstLabel />
        <Paper className={clsx(classes.paper, classes.dominantPaper)}>
          <Select value={20} input={<InputBase className={classes.input} />}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Vray</MenuItem>
            <MenuItem value={20}>Arnold</MenuItem>
            <MenuItem value={30}>Mental Ray</MenuItem>
          </Select>
        </Paper>

        <InputLabel label="Version" />
        <Paper className={clsx(classes.paper)}>
          <Select value={10} input={<InputBase className={classes.input} />}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>3.2.1.1</MenuItem>
            <MenuItem value={20}>3.2.1.2</MenuItem>
            <MenuItem value={30}>3.2.2.1</MenuItem>
            <MenuItem value={40}>3.3.0</MenuItem>
            <MenuItem value={50}>3.3.2.1</MenuItem>
          </Select>
        </Paper>
      </InputRow>
    </Box>
  );
};

export default Software;
