import { combineReducers } from "redux";
import jobs from "./jobs";
import instanceTypes from "./instanceTypes";
import softwarePackages from "./softwarePackages";
import projects from "./projects";
import presets from "./presets";

const entities = combineReducers({
  jobs,
  softwarePackages,
  instanceTypes,
  projects,
  presets
});

export default entities;
