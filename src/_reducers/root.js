import { combineReducers } from "redux";
import downloader from "./downloader";
import environment from "./environment";

const conductorReducer = combineReducers({ environment, downloader });
export default conductorReducer;
