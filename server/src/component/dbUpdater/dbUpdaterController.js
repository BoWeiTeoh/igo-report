const { responseError, responseSuccess } = require("../../helper/utilController.js");
const adminMethod = require("../admin/adminMethod");
const consumptionMethod = require("../consumptionSummary/consumptionSummaryMethod");
const platformMethod = require("../platform/platformMethod");
const playerMethod = require("../player/playerMethod");
const { constServerError} = require("../../const/constErrorCode");
const argon2 = require("argon2");
const {logger} = require("../../helper/utilPinoLogger");
const dbConnections = require("../../db/connect");

const INIT_ADMIN_USERNAME = "super-admin";
const INIT_ADMIN_PASSWORD = "game-zone"; // change this password after login
const INIT_PS = "55667788";

class DbUpdaterController {
  async onInit(req, res) {
    try {
      const { ps } = req.body || {};
      if (ps !== INIT_PS) {
        responseError(res, constServerError.API.NOT_FOUND);
      }

      let response = "";

      const rootAdminData = {
        username: INIT_ADMIN_USERNAME,
        isRoot: true
      };
      let rootAdmin = await adminMethod.findOne(rootAdminData);
      if (!rootAdmin) {
        rootAdminData.password = await argon2.hash(INIT_ADMIN_PASSWORD);
        await adminMethod.create(rootAdminData);
        response += "admin created, ";
      }

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onHealthCheck(req, res) {
    try {
      const healthStatus = {};
      const disconnectedDatabases = [];
      for (const dbName in dbConnections) {
        if (dbConnections.hasOwnProperty(dbName)) {
          const connection = dbConnections[dbName];
          const isConnected = connection.readyState === 1;
          healthStatus[dbName] = isConnected ? "Connected" : "Disconnected";
          if (!isConnected) {
            disconnectedDatabases.push(dbName);
          }
        }
      }

      if (disconnectedDatabases.length === 0) {
        return res.status(200).json({ status: 200, DB: healthStatus });
      } else {
        // "disconnected" for alert
        // need server restart status 503
        return res.status(202).json({ status: 202, errors: [`Databases ${disconnectedDatabases.join(', ')} are disconnected`] });
      }
    } catch (error) {
      logger.error({ message: "Error while checking database connection", error });
      return res.status(202).json({ status: 202, errors: ["Internal server error"] });
    }
  }

  async onGetVersion(req, res) {
    return res.json([{
      version: "g1.0.19"
    }]);
  }
}

const dbUpdaterController = new DbUpdaterController();
module.exports = dbUpdaterController;
