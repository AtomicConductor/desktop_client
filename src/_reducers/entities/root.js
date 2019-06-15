import { combineReducers } from "redux";
import jobs from "./jobs";
import downloads from "./downloads";

const entities = combineReducers({ jobs, downloads });

export default entities;
