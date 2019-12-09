import getPort from "get-port";
import { google } from "googleapis";
import { createServer } from "http";
import enableTerminate from "server-terminate";
import { URL } from "url";
import config from "../../config";

const { googleClientSecret: clientSecret, googleClientId: clientId } = config;

export default async signInHandler => {
  const availablePort = await getPort();
  const redirectUri = `http://localhost:${availablePort}`;

  const oauth2Client = new google.auth.OAuth2({
    clientId,
    clientSecret,
    redirectUri
  });

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "profile email"
  });

  nw.Window.open(authorizeUrl, { width: 450, height: 620 }, authWindow => {
    let server;

    authWindow.on("close", function() {
      if (server.terminate) server.terminate();
      this.close(true);
    });

    server = enableTerminate(
      createServer(async (req, res) => {
        try {
          const code = new URL(req.url, redirectUri).searchParams.get("code");
          res.end();

          authWindow.close(true);

          const {
            tokens: { id_token }
          } = await oauth2Client.getToken(code);

          signInHandler({ id_token });
        } finally {
          server.terminate();
        }
      })
    ).listen(availablePort, () =>
      console.log(`listening for auth redirect on ${redirectUri}`)
    );
  });
};
