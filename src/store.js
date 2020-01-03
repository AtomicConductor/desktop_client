import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import ctReducer from "./_reducers/root";
import createThunkErrorHandlerMiddleware from "redux-thunk-error-handler";
import * as Sentry from "@sentry/browser";
import config from "./config";
import desktopClientErrorHandler from "./middleware/desktopClientErrorHandler";

Sentry.init({
  dsn: config.sentryDns,
  environment: process.env.NODE_ENV,
  defaultIntegrations: false
});

const store = configureStore({
  reducer: ctReducer,
  middleware: [
    createThunkErrorHandlerMiddleware({
      onError: desktopClientErrorHandler(Sentry)
    }),
    ...getDefaultMiddleware()
  ]
});

export default store;
