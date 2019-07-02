import { combineReducers } from "redux";
import jobs from "./jobs";

const entities = combineReducers({ jobs /* , downloads */ });

export default entities;
