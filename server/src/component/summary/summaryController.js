const { responseError, responseSuccess } = require("../../helper/utilController.js");
const summaryListMethod = require("../consumptionSummaryList/consumptionSummaryListMethod");
const operationLogMethod = require("../operationLog/operationLogMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const {logger} = require("../../helper/utilPinoLogger");

class SummaryController {
  async onSummary(req, res) {
    try {
      summaryListMethod.generateSummaryList(req?.body).catch();

      operationLogMethod.insertOperationLog({
        req,
        title: "re-summary",
        operation: constOperationLogOperation.update,
        fnc: "summaryController.onSummary",
        changed: req?.body
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, []);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onCountSummaryList(req, res) {
    try {
      let count = await summaryListMethod.count({ isSettle: false }).catch();

      return responseSuccess(res, count);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const summaryController = new SummaryController();
module.exports = summaryController;
