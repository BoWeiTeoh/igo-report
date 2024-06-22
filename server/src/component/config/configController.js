const { responseError, responseSuccess } = require("../../helper/utilController.js");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const {constMinValue, constMaxValue} = require("../../const/constConfig");
const operationLogMethod = require("../operationLog/operationLogMethod");
const configMethod = require("../config/configMethod");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const { constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class ConfigController {
  async onGet(req, res) {
    try {
      const {type} = req?.query
      let response = await configMethod.find({type});

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { _id, value } = req.body;
      const query = {
        _id,
      };

      const updateData = {
        value,
      };

      const setting = await configMethod.findOne(query, {setting: 1});
      if (!setting?.setting) {
        throw (constCommonError.CONFIG.NOT_FOUND);
      }

      if (constMinValue[setting.setting] && value < constMinValue[setting.setting]) {
        throw (constCommonError.CONFIG.MIN);
      }

      if (constMaxValue[setting.setting] && value > constMaxValue[setting.setting]) {
        throw (constCommonError.CONFIG.MAX);
      }

      // 检查值是否为整数
      if (!Number.isInteger(Number(value))) {
        throw (constCommonError.CONFIG.INTEGER);
      }

      const response = await configMethod.update(query, updateData);

      operationLogMethod.insertOperationLog({
        req,
        title: "update config",
        operation: constOperationLogOperation.update,
        fnc: "configController.onUpdate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const configController = new ConfigController();
module.exports = configController;