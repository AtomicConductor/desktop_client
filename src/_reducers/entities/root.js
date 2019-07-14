import { combineReducers } from "redux";
import jobs from "./jobs";
import accounts from "./accounts";

const entities = combineReducers({ jobs, accounts });

export default entities;
