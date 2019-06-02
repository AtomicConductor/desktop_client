import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, compose } from "redux";

import ctReducer from "./reducers/root";

const loggerMiddleware = createLogger();


console.log(" window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__")
console.log( window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  ctReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware))
);

export default store;
