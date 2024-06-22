// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
const vaultData = require("./src/vault/config");
const path = "";
const port = vaultData?.getData()["PORT"];
const portSchedule = vaultData?.getData()["PORT_SCHEDULER"];
const portSettlement = vaultData?.getData()["PORT_SETTLEMENT"];

module.exports = {
  apps: [
    {
      port: port,
      name: "admin-api",
      script: `./${path}/src/adminService.js`,
      instances: 1,
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS Z",
      output: "~/.pm2/logs/admin-api-out.log",
      error: "~/.pm2/logs/admin-api-error.log",
      max_memory_restart: "2048M",
      merge_logs: true
    },
    {
      port: portSchedule,
      name: "schedule",
      script: `./${path}/src/scheduleService.js`,
      instances: 1,
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS Z",
      output: "~/.pm2/logs/schedule-out.log",
      error: "~/.pm2/logs/schedule-error.log",
      max_memory_restart: "2048M",
      merge_logs: true
    },
    {
      port: portSettlement,
      name: "settlement",
      script: `./${path}/src/settlementService.js`,
      instances: 5,
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS Z",
      output: "~/.pm2/logs/settlement-out.log",
      error: "~/.pm2/logs/settlement-error.log",
      max_memory_restart: "2048M",
      merge_logs: true
    }
  ]
};
