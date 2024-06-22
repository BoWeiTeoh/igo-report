const { initVault } = require("./common/initService");
const { log } = require("../src/helper/utils");
const constLogType = require("../src/const/constLogType");

initVault("settlementService").then(() => {
  const restartLogMethod = require("../src/component/restartLog/restartLogMethod");
  restartLogMethod.insertRestartLog("settlementService").catch();

}).catch(e => {
  log("", `InitVault SettlementService ERROR : ${e}`, constLogType.ERROR);
})