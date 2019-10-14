import { configureStore, getDefaultMiddleware } from "redux-starter-kit";
import ctReducer from "./_reducers/root";
import DesktopClientError from "./errors/desktopClientError";
import { setNotification } from './_actions/notification';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';
import * as Sentry from '@sentry/browser';
import config from './config';
import { currentAccountSelector, signedInSelector } from './selectors/account';

Sentry.init({
  dsn: config.sentryDns,
  environment: process.env.NODE_ENV
});

const desktopClientErrorHandler = e => (dispatch, getState) => {
  if ((e instanceof DesktopClientError)) {
    const { inner, message } = e;
    const state = getState();

    Sentry.withScope(scope => {
      if (signedInSelector(state)) {
        scope.setUser(currentAccountSelector(state));
      }
      Sentry.captureException(inner);
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(inner);
    }

    dispatch(setNotification({
      type: "error",
      snackbar: message
    }));
  }
};

const store = configureStore({
  reducer: ctReducer,
  middleware: [
    createThunkErrorHandlerMiddleware({ onError: desktopClientErrorHandler }),
    ...getDefaultMiddleware()
  ]
});

export default store;
