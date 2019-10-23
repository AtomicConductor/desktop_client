import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { resolveSubmission } from "../../../_helpers/submitter";

import { selectedInstanceType } from "../../../selectors/submitter";

const useStyles = makeStyles(theme => ({
  container: {
    margin: "20px 192px 20px 96px",
    minWidth: 700
  }
}));

const Preview = () => {
  const classes = useStyles();
  const submission = resolveSubmission(
    useSelector(_ => _.submitter),
    useSelector(selectedInstanceType)
  );

  return (
    <Box className={classes.container}>
      <pre>{JSON.stringify(submission, null, " ")}</pre>
    </Box>
  );
};

export default Preview;
