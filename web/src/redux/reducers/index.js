import { combineReducers } from "redux";
import common from "./common";
import data from "./data";

const reducers = {
  common,
  data
};

export default combineReducers(reducers);
