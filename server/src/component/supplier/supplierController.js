const { responseError, responseSuccess } = require("../../helper/utilController.js");
const supplierMethod = require("./supplierMethod");
const platformMethod = require("../platform/platformMethod");

class SupplierController {
  async onGetMany(req, res) {
    try {
      let gameProviderArr = [];
      const platforms = await platformMethod.find({}, { gameProviders: 1 });
      for (const platform of platforms) {
        gameProviderArr = gameProviderArr.concat(platform?.gameProviders);
      }
      const response = await supplierMethod.find({ _id: { $in: gameProviderArr } });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const permissionController = new SupplierController();
module.exports = permissionController;
