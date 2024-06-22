const { responseError, responseSuccess } = require("../../helper/utilController.js");
const utilController = require("../../helper/utilController");
const operationLogMethod = require("../operationLog/operationLogMethod");

class OperationLogController {
  async onGetTable(req, res) {
    try {
      let { paginate, filter } = utilController.parseQuery2(req.query);
      const options = {
        ...paginate,
        sort: { _id: -1 }
      };

      const response = await operationLogMethod.paginate(filter, options);
      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const operationLogController = new OperationLogController();
module.exports = operationLogController;
