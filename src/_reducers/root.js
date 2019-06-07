import { combineReducers } from "redux";
import downloader from "./downloader";
import environment from "./environment";
import profile from "./profile";

const conductorReducer = combineReducers({ environment, downloader, profile });
export default conductorReducer;
