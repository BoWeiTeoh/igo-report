import util_number from "./util_number";
import util_datetime from "./util_datetime";
import util_string from "./util_string";
import util_object from "./util_object";
import util_ui from "./util_ui";
import util_common from "./util_common.js";

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const helpers = {
  sleep,
  dateTime: util_datetime,
  number: util_number,
  object: util_object,
  string: util_string,
  ui: util_ui,
  common: util_common
};

export default helpers;
