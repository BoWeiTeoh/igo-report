const { responseError, responseSuccess } = require("../../helper/utilController.js");
const platformMethod = require("./platformMethod");

class PlatformController {
  async onGetPlatform(req, res) {
    try {
      const query = {};
      const filter = { platformId: 1, name: 1, isActive: 1 };
      const platform = await platformMethod.find(query, filter);
      return responseSuccess(res, platform);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const platformController = new PlatformController();
module.exports = platformController;