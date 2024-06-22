const { initVault } = require("../src/common/initService");
const { log } = require("../src/helper/utils");
const constLogType = require("../src/const/constLogType");

initVault("adminService")
  .then(() => {
    const configMethod = require("../src/component/config/configMethod");
    configMethod.initConfig().catch();

    const systemStatusMethod = require("../src/component/systemStatus/systemStatusMethod");
    systemStatusMethod.updateStatus(false).catch();

    const restartLogMethod = require("../src/component/restartLog/restartLogMethod");
    restartLogMethod.insertRestartLog("adminService").catch();
  })
  .catch((e) => {
    log("", `InitVault AdminService ERROR : ${e}`, constLogType.ERROR);
  });
