import { combineReducers } from "redux";
import jobs from "./jobs";
import instanceTypes from "./instanceTypes";

const entities = combineReducers({ jobs, instanceTypes });

export default entities;
