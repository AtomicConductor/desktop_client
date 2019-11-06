import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { submissionSelector } from "../../../selectors/submitter";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightEighties } from "react-syntax-highlighter/dist/esm/styles/hljs";

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: 700,
    height: "100%"
  }
}));

const Preview = () => {
  const classes = useStyles();

  const submission = useSelector(submissionSelector);

  return (
    <Box className={classes.container}>
      <SyntaxHighlighter
        language="json"
        style={tomorrowNightEighties}
        customStyle={{
          fontSize: "14px",
          padding: "20px",
          margin: 0,
          height: "100%"
        }}
      >
        {JSON.stringify(submission, null, " ")}
      </SyntaxHighlighter>
    </Box>
  );
};

export default Preview;
