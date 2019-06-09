import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  // root: {
  //   width: "100%",
  //   padding: "80px",
  //   margin: "auto"
  // },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2)
  },
  tableKey: {
    width: 300
  },
  tableValue: {},
  title: { padding: 16 }
}));

const CtSettingsTable = props => {
  const classes = useStyles();

  const { data, title } = props;

  const arr = Object.keys(data).map(k => ({
    name: k,
    value: data[k]
  }));

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableKey}>Key</TableCell>
            <TableCell className={classes.tableValue}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.value || "-- not set --"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

CtSettingsTable.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default CtSettingsTable;
