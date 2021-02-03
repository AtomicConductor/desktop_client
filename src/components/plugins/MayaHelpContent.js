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
        Congratulations! You're now all set to start submitting renders to
        Conductor from within Maya. Open Maya and load the Conductor plugin from
        the Plugin Manager.
      </DialogContentText>

      <Typography variant="body1" color="secondary">
        Conductor command-line tools
      </Typography>

      <DialogContentText variant="body2">
        It is recommended to add the Conductor bin location to your PATH
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

      <Typography variant="body1" color="secondary">
        Shared installation
      </Typography>
      <DialogContentText variant="body2">
        To make the plugin accessible to others on your network, use one of the
        methods below:
      </DialogContentText>
      <ol>
        <DialogContentText variant="body2">
          <li>
            Share the conductor.mod file with colleagues so they can add it to
            their Maya environment. You'll find it in the modules folder with
            your other Maya preferences.
          </li>

          <li>
            Point the MAYA_MODULE_PATH environment variable to the Conductor
            install location. See below.
          </li>
        </DialogContentText>
      </ol>

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
        {`# Add the Conductor module install location to the MAYA_MODULE_PATH.
export MAYA_MODULE_PATH=${packageLocation}/${packageName}:$MAYA_MODULE_PATH`}
      </SyntaxHighlighter>
      <p></p>
    </DialogContent>
  );
};
