import { combineReducers } from "redux";
import downloader from "./downloader";
import environment from "./environment";
import profile from "./profile";
import notification from "./notification";

const conductorReducer = combineReducers({
    environment,
    downloader,
    profile,
    notification
});
export default conductorReducer;
