const express = require("express");
const cors = require("cors");
const { logHttpRequest } = require("../helper/httpMiddleware");
const { log } = require("../helper/utils");
const { initRedis } = require("../redis/redisConnect");
const constLogType = require("./../const/constLogType");
const { clsProxifyExpressMiddleware } = require('cls-proxify/integration/express');
const { defaultLogger, logger } = require("../helper/utilPinoLogger");
const { REQUEST_ID } = require("../const/constLogger");
require("dotenv").config();

let vaultData, PORT;
const initVault = (service) => {
  log("", "======================================================");
  log("", "INITIALIZE VAULT CONNECTION");
  log("", "======================================================");
  try {
    return new Promise(async (resolve, reject) => {
      try {
        vaultData = require("../vault/config");
        const vault = await vaultData.initial();
        vaultData.data = vault.data;
        await initRedis(vaultData?.getData()["REDIS"]);
        const app = express();
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(logHttpRequest);
        app.use(
            clsProxifyExpressMiddleware((req) => {
              return defaultLogger.child({ [REQUEST_ID]: req?.requestId })
            }),
        );

        switch (service) {
          case "adminService": {
            const router = require("../api/adminApi");
            PORT = vaultData?.getData()["PORT"];
            app.use("/v1", router);
            break;
          }
          case "scheduleService": {
            PORT = vaultData?.getData()["PORT_SCHEDULER"];
            require("../scheduler/schedulerController");
            break;
          }
          case "settlementService": {
            const router = require("../api/settlementApi");
            PORT = vaultData?.getData()["PORT_SETTLEMENT"];
            app.use("/v2", router);
            break;
          }
        }
        app.listen(PORT, function() {
          log("", `API listening on port ${PORT}. service:${service}`);
        });
      } catch (err) {
        log("", `INITIALIZE VAULT ERR : ${err}`, constLogType.ERROR);
        return reject(err);
      }
      resolve(true);
    });
  } catch (err) {
    throw err;
  }
};

const initService = {
  initVault
};

module.exports = initService;
