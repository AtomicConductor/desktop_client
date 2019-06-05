import { configureStore } from "redux-starter-kit";
import ctReducer from "./_reducers/root";
// import loggerMiddleware from "./middleware/logger";

const store = configureStore({
    reducer: ctReducer
});

export default store;
