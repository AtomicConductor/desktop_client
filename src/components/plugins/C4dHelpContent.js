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
        Almost there! You just need to tell Cinema4d where to find the Conductor
        plugin.
      </DialogContentText>
      <ul>
        <DialogContentText variant="body2">
          <li>Open Cinema4d and go to Edit-&gt;Preferences-&gt;Plugins.</li>
          <li>
            In the Search Paths panel click Add Folder, and browse to{" "}
            {packageLocation}/{packageName}.
          </li>
          <li>
            Restart Cinema4d and you should see a Conductor menu in the menu
            bar.
          </li>
        </DialogContentText>
      </ul>

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

      <Typography variant="body1" color="secondary">
        Shared installation
      </Typography>
      <DialogContentText variant="body2">
        To make the plugin accessible to others on your network, you can set
        Cinema4d's g_additionalModulePath variable in .bashrc or the equivalent
        for your shell. See below.
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
        {`# Add the Conductor plugin location to the Cinema4d's g_additionalModulePath.
export g_additionalModulePath=${packageLocation}/${packageName}`}
      </SyntaxHighlighter>
      <p></p>
    </DialogContent>
  );
};
