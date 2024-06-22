const scheduleMethod = require("./schedulerMethod");
const CronJob = require("cron").CronJob;

const cronjob = new CronJob(
  "1 0 * * * ",
  () => {
    scheduleMethod.generateBillReportExportData().catch((err) => {
    });
  },
  () => {
    /* This function is executed when the job stops */
  },
  /* Start the job right now */
  true
);