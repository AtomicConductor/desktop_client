import { combineReducers } from "redux";
import downloader from "./downloader";
import profile from "./profile";
import notification from "./notification";
import plugins from "./plugins";

import entities from "./entities/root";

const conductorReducer = combineReducers({
  downloader,
  profile,
  notification,
  plugins,
  entities
});
export default conductorReducer;
