import { combineReducers } from "redux";
import downloader from "./downloader";
import notification from "./notification";
import plugins from "./plugins";
import user from './user';

import entities from "./entities/root";

const conductorReducer = combineReducers({
  downloader,
  notification,
  plugins,
  entities,
  user
});
export default conductorReducer;
