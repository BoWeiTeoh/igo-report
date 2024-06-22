const { responseError, responseSuccess } = require("../../helper/utilController.js");
const gameMethod = require("../game/gameMethod");
const utilController = require("../../helper/utilController");

class GameController {
  async onGetMany(req, res) {
    try {
      const { filter } = utilController.parseQuery(req.query);
      const { provider } = filter;
      let query = {};
      if (Array.isArray(provider)) {
        query.provider = { $in: provider };
      }

      const response = await gameMethod.find(query);
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetGameName(req, res) {
    try {
      const { filter } = utilController.parseQuery(req.query);
      const { provider } = filter;
      let query = {};
      if (Array.isArray(provider)) {
        query.provider = { $in: provider };
      }

      const response = await gameMethod.distinct(query, "regionName.EN");
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const gameController = new GameController();
module.exports = gameController;
