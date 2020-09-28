import React from "react";
import {
  DialogContent,
  DialogContentText,
  Typography
} from "@material-ui/core";

import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightEighties } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default props => {
  const { packageLocation, packageName } = props;

  return (
    <DialogContent>
      <DialogContentText variant="body1">
        Conductor core contains the Conductor client-side Python API along with
        a command-line tool to start the uploader and downloader daemons.
      </DialogContentText>

      <DialogContentText variant="body1">
        In order to use the command-line tool, you'll have to either provide the
        full path to the command, or set the location in your PATH variable. See
        examples below
      </DialogContentText>
      <SyntaxHighlighter
        language="bash"
        style={tomorrowNightEighties}
        customStyle={{
          fontSize: "14px",
          padding: "20px",
          margin: 0,
          height: "100%"
        }}
      >
        {`# Get help on the conductor command:
${packageLocation}/bin/conductor --help
# Run the downloader daemon:
${packageLocation}/bin/conductor downloader
# Run the uploader daemon:
${packageLocation}/bin/conductor uploader

# Set the PATH variable in your .bashrc file:
export PATH=${packageLocation}/bin:$PATH`}
      </SyntaxHighlighter>
      <p></p>

      <Typography variant="body1" color="secondary">
        Conductor Python API
      </Typography>

      <DialogContentText variant="body2">
        If you plan to write tools that submit to Conductor, you'll want to
        access the Conductor Python API. See the instructions for setting your
        PYTHONPATH below.
      </DialogContentText>
      <SyntaxHighlighter
        language="bash"
        style={tomorrowNightEighties}
        customStyle={{
          fontSize: "14px",
          padding: "20px",
          margin: 0,
          height: "100%"
        }}
      >
        {`# PYTHONPATH setup for the Conductor Python API (${packageName}):
export PYTHONPATH=${packageLocation}:$PYTHONPATH`}
      </SyntaxHighlighter>
      <p></p>
    </DialogContent>
  );
};
