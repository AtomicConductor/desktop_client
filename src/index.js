import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/app/App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store";

import { readSettings } from "./_actions/environment";
import {
  startDownloadQueue
  // startDownloadQueueTest
} from "./_actions/files";

// import { fetchProfile } from "./_actions/profile";

store.dispatch(readSettings());
// store.dispatch(fetchProfile());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

store.dispatch(startDownloadQueue());
// store.dispatch(startDownloadQueueTest());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
