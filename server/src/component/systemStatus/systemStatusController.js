const { responseError, responseSuccess } = require("../../helper/utilController.js");
const systemStatusMethod = require("../systemStatus/systemStatusMethod");

class SystemStatusController {
  async onGetStatus(req, res) {
    try {
      const status = await systemStatusMethod.getStatus();

      return res.json({ functionAvailable: status });
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const systemStatusController = new SystemStatusController();
module.exports = systemStatusController;
