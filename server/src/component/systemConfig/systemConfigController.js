const { responseError, responseSuccess } = require("../../helper/utilController.js");
const systemConfigMethod = require("./systemConfigMethod");
const operationLogMethod = require("../operationLog/operationLogMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilController = require("../../helper/utilController");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const {logger} = require("../../helper/utilPinoLogger");
const { constCommonError } = require("../../const/constErrorCode");

class SystemConfigController {
  async onCreate(req, res) {
    try {
      const { configType } = req.body;
      const { authClaims } = req;
      let saveData = {
        creator: authClaims.id,
        ...req.body
      };
      const query = {
        configType: configType,
        isDelete: false
      }
      const checkConfigType = await systemConfigMethod.findOne(query);
      if (checkConfigType) {
        throw (constCommonError.CONFIG.EXIST)
      }
      const response = await systemConfigMethod.create(saveData);

      operationLogMethod.insertOperationLog({
        req,
        title: "create system config",
        operation: constOperationLogOperation.create,
        fnc: "systemConfigController.onCreate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { _id, configType, config, detail } = req.body;
      const updater = req?.authClaims?.id;
      const query = { _id };
      let updateData = {
        configType,
        config,
        detail,
        updater
      };
      let options = {
        new: true
      };

      const checkQuery = {
        configType: configType,
        isDelete: false,
        _id: {$nin: _id}
      }
      const checkConfigType = await systemConfigMethod.findOne(checkQuery);
      if (checkConfigType) {
        throw (constCommonError.CONFIG.EXIST)
      }
      const response = await systemConfigMethod.findOneAndUpdate(query, updateData, options);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "update system config",
          operation: constOperationLogOperation.update,
          fnc: "systemConfigController.onUpdate",
          changed: response
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetConfig(req, res) {
    try {
      const { paginate, filter, paginateOption } = utilController?.parseQuery(req.query);
      let query = {
        ...filter,
        isDelete: false
      };
      const options = {
        ...paginateOption,
        populate: [
          {
            path: "creator",
            select: { username: 1 }
          },
          {
            path: "updater",
            select: { username: 1 }
          }
          // {
          //   model: dbModel.platform,
          //   path: "branches",
          //   select: { name: 1 }
          // }
        ]
      };

      const response = await systemConfigMethod.paginate(query, options);
      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onDelete(req, res) {
    try {
      const { _id } = req?.body;
      const updater = req?.authClaims?.id;
      const query = { _id };
      const update = {
        isDelete: true,
        updater
      };
      let option = { new: true };
      const response = await systemConfigMethod.findOneAndUpdate(query, update, option);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "delete config",
          operation: constOperationLogOperation.delete,
          fnc: "systemConfigController.onDelete",
          changed: response
        })
        .catch((err) => {
          logger.error({"Operation Delete Log Err": err});
        });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const systemConfigController = new SystemConfigController();
module.exports = systemConfigController;
