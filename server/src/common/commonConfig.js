const vaultData = require("../vault/config");
const config = require("../config/appConfig");

const getConfig = () => {
    const INTERVAL = vaultData.getData()["INTERVAL"] || config.interval;
    const EXPORT_LIMIT = vaultData.getData()["EXPORT_LIMIT"] || config.limit;
    const BATCH_EXPORT = vaultData.getData()["BATCH"] || config.batch;
    const INSTANCE_SETTLEMENT = vaultData.getData()["INSTANCE_SETTLEMENT"] || config.instanceSettlement;
    const BATCH_SCHEDULER = vaultData.getData()["BATCH_SCHEDULER"] || config.batchScheduler;

    return { INTERVAL, EXPORT_LIMIT, BATCH_EXPORT, INSTANCE_SETTLEMENT, BATCH_SCHEDULER };
};

const commonConfig = getConfig();

module.exports = commonConfig;