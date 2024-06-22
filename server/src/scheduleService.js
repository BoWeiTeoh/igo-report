const { initVault } = require("./common/initService");
const { log } = require("../src/helper/utils");
const constLogType = require("../src/const/constLogType");

initVault("scheduleService").then(() => {
  const restartLogMethod = require("../src/component/restartLog/restartLogMethod");
  restartLogMethod.insertRestartLog("scheduleService").catch();

}).catch(e => {
  log("", `InitVault ScheduleService ERROR : ${e}`, constLogType.ERROR);
})