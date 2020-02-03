import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import ctReducer from "./_reducers/root";
import createThunkErrorHandlerMiddleware from "redux-thunk-error-handler";
import * as Sentry from "@sentry/browser";
import config from "./config";
import desktopClientErrorHandler from "./middleware/desktopClientErrorHandler";
import LogRocket from "logrocket";
import { appVersion } from "./_helpers/constants";
import { sanitizers } from "./middleware/logRocket";
console.log("process.versions['node-webkit'] ", process.versions['node-webkit']);
Sentry.init({
  dsn: config.sentryDns,
  environment: process.env.NODE_ENV,
  defaultIntegrations: false
});

if (process.env.NODE_ENV === "production") {
  LogRocket.init(config.logRocketAppId, {
    release: appVersion,
    network: {
      isEnabled: false
    }
  });
}

LogRocket.getSessionURL(sessionURL => {
  Sentry.configureScope(scope => {
    scope.setExtra("sessionURL", sessionURL);
  });
});

const store = configureStore({
  reducer: ctReducer,
  middleware: [
    createThunkErrorHandlerMiddleware({
      onError: desktopClientErrorHandler
    }),
    ...getDefaultMiddleware(),
    LogRocket.reduxMiddleware({ ...sanitizers })
  ]
});

export default store;
