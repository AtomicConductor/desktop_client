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
        Conductor from within 3d Studio Max.
      </DialogContentText>
      <ul>
        <DialogContentText variant="body2">
          <li>
            Open Max and choose <b>Rendering-&gt;Render With Conductor.</b>
          </li>
        </DialogContentText>
      </ul>

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
        To make the 3ds Max Conductor plugin accessible to others on your
        network, they should create a file called ciomax_startup.ms in one of
        their 3ds Max startup folders with the contents below.
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
        {`
-- Calls the Conductor 3DS Max plugin.
(
  include "${packageLocation}/${packageName}"
)
`}
      </SyntaxHighlighter>
      <p></p>
    </DialogContent>
  );
};
