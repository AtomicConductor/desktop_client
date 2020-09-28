import React from "react";
import {
  DialogContent,
  DialogContentText,
  Typography
} from "@material-ui/core";

import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightEighties } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default props => {
  const { packageLocation } = props;

  return (
    <DialogContent>
      <DialogContentText variant="body1">
        Almost there! You just need to tell Clarisse where to find the Conductor
        plugin.
      </DialogContentText>
      <DialogContentText variant="body1">
        Open Clarisse and go to Edit-&gt;Preferences-&gt;General tab, then enter
        the following in the Startup Script field.
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
        $CIO_DIR/cioclarisse/startup.py
      </SyntaxHighlighter>
      <DialogContentText variant="body1">
        Now restart Clarisse and find ConductorJob in the Create menu.
      </DialogContentText>

      <Typography variant="body1" color="secondary">
        Conductor command-line tools
      </Typography>

      <DialogContentText variant="body2">
        It is recommended to add the conductor bin location to your PATH
        variable (if you haven't already done so). You can do this in ~/.bashrc
        on Mac and Linux, or use the Environment Variables panel on Windows.
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
        {`# Add the Conductor bin location to your PATH.
export PATH=${packageLocation}/bin:$PATH`}
      </SyntaxHighlighter>

      <Typography variant="caption" display="block" gutterBottom>
        <i>
          To see additional info click the version chip on the Conductor Core
          card.
        </i>
      </Typography>
    </DialogContent>
  );
};
