import { combineReducers } from "redux";
import downloader from "./downloader";
import environment from "./environment";
import profile from "./profile";
import notification from "./notification";
import python from "./python";
import entities from "./entities/root";

const conductorReducer = combineReducers({
  environment,
  downloader,
  profile,
  notification,
  python,
  entities
});
export default conductorReducer;
