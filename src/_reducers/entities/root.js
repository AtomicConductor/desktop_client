import { combineReducers } from "redux";
import jobs from "./jobs";
import instanceTypes from "./instanceTypes";
import softwarePackages from "./softwarePackages";
import projects from "./projects";

const entities = combineReducers({
  jobs,
  softwarePackages,
  instanceTypes,
  projects
});

export default entities;
