const CronJob = require("cron").CronJob;
const scheduleMethod = require("../scheduler/schedulerMethod");
const crypto = require("crypto");
const { log } = require("../helper/utils");
const constLogType = require("../const/constLogType");

const cronjob = new CronJob(
  "1-59/2 * * * * ",
  () => {
    const requestId = crypto.randomUUID();
    log(requestId, "START summaryConsumptionByUpdateTime");
    // summaryConsumptionByUpdateTime 的参数是指summary多少分钟前的数据
    scheduleMethod.summaryConsumptionByUpdateTime(requestId, 20, 18).catch((err) => {
      log(requestId, `summaryConsumptionByUpdateTime ERR: ${err}`, constLogType.ERROR);
    });
  },
  () => {
    /* This function is executed when the job stops */
  },
  /* Start the job right now */
  true
);
