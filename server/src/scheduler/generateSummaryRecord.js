const scheduleMethod = require("./schedulerMethod");
const {logger} = require("../helper/utilPinoLogger");
const CronJob = require("cron").CronJob;

const cronjob = new CronJob(
  "*/2 * * * * ",
  () => {
    logger.info("START generateSummaryRecord");
    scheduleMethod.generateSummary().catch(err => {
      logger.error({"generateSummary ERR": err});
    });
  },
  () => {
    /* This function is executed when the job stops */
  },
  /* Start the job right now */
  true
);