import { combineReducers } from "redux";
import jobs from "./jobs";
import instanceTypes from "./instanceTypes";
import softwarePackages from "./softwarePackages";

const entities = combineReducers({ jobs, softwarePackages, instanceTypes });

export default entities;
