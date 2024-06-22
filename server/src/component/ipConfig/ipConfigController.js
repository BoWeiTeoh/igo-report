const { responseError, responseSuccess } = require("../../helper/utilController.js");
const ipConfigMethod = require("./ipConfigMethod");
const operationLogMethod = require("../operationLog/operationLogMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilController = require("../../helper/utilController");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const {logger} = require("../../helper/utilPinoLogger");

class IpConfigController {
  async onCreate(req, res) {
    try {
      const { ipAddress, detail } = req.body;
      const { authClaims } = req;
      let saveData = {
        creator: authClaims.id,
        ...req.body
      };

      let response = await ipConfigMethod.create(saveData);

      operationLogMethod
        .insertOperationLog({
          req,
          title: "create ip config",
          operation: constOperationLogOperation.create,
          fnc: "ipConfigController.onCreate",
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

  async onUpdate(req, res) {
    try {
      const { _id, ipAddress, detail } = req.body;
      const updater = req?.authClaims?.id;
      const query = { _id };
      let updateData = {
        ipAddress,
        detail,
        updater
      };
      let options = {
        new: true
      };

      const response = await ipConfigMethod.findOneAndUpdate(query, updateData, options);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "update ip config",
          operation: constOperationLogOperation.update,
          fnc: "ipConfigController.onUpdate",
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
        ]
      };

      const response = await ipConfigMethod.paginate(query, options);
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
      const response = await ipConfigMethod.findOneAndUpdate(query, update, option);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "delete ip",
          operation: constOperationLogOperation.delete,
          fnc: "ipConfigController.onDelete",
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
}

const ipConfigController = new IpConfigController();
module.exports = ipConfigController;