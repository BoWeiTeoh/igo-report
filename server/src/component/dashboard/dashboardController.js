const {
  responseError,
  responseSuccess,
} = require("../../helper/utilController.js");
const supplierMethod = require("../supplier/supplierMethod");
const adminMethod = require("../admin/adminMethod");
const utilController = require("../../helper/utilController");
const gameMethod = require("../game/gameMethod");
const platformGameStatusMethod = require("../platformGameStatus/platformGameStatusMethod");
const platformGameGroupMethod = require("../platformGameGroup/platformGameGroupMethod");
const { constGameStatus } = require("../../const/constStatus");
const utilsCustom = require("../../helper/utilCustom");

class DashboardController {
  async onGetGame(req, res) {
    try {
      const { filter } = utilController.parseQuery(req.query);

      const { branch, supplier, game, status } = filter;
      // FE 拿游戏名字，的出所有的game _id
      const gameQuery = {
        provider: { $in: supplier },
          status: { $ne: constGameStatus.DELETED }
      };

      if (game?.length) {
        gameQuery["regionName.EN"] = { $in: game };
      }
      const gameIds = await gameMethod.distinct(gameQuery);
      let platformGroupQuery = {
          platform: { $in: utilsCustom.toObjectIdArray(branch) }
      };
      const platformGameGroupData = await platformGameGroupMethod.find(platformGroupQuery, {"games.game": 1});

      let gameIndex = {};
      let gameListArr = [];

      if (platformGameGroupData && Array.isArray(platformGameGroupData)) {
          platformGameGroupData.forEach(group => {
              if (group.games && Array.isArray(group.games)) {
                  group.games.forEach(game => {
                      if (game && game.game) {
                          gameIndex[game.game] = {
                              index: game.index,
                              _id: game._id
                          };
                          gameListArr.push(game.game);
                      }
                  });
              }
          });
      }
      const existGameList = gameListArr.filter(game => {
        return gameIds.some(gameId => gameId.equals(game));
      });
      const gameIdsArray = existGameList.map(game => game);
      let platformGameQuery = {
        game: { $in: gameIdsArray },
        platform: { $in: branch },
        status: { $in: [constGameStatus.ENABLE, constGameStatus.MAINTENANCE, constGameStatus.DISABLE] }
      };

      if (status?.length) {
        platformGameQuery.status = { $in: status };
      }

      const platformGameFilter = {
        game: 1,
        status: 1
      };
      let response = await platformGameStatusMethod.find(platformGameQuery, platformGameFilter);

      response = await platformGameStatusMethod.populate(response);

      response.map(gameStatus => {
        if (gameStatus.game && gameStatus.game.sourceURL
            && typeof gameStatus.game.images === "object" && !Array.isArray(gameStatus.game.images)) {
          const firstKey = Object.keys(gameStatus.game.images)[0];
          const imageUrl = gameStatus.game.images[firstKey];
          let image;
          if (!imageUrl.startsWith(gameStatus.game.sourceURL)) {
            image = gameStatus.game.sourceURL + imageUrl;
          }
          gameStatus._imageURL = image;
        } else {
          // Handle the case where gameStatus.game.images does not exist
          gameStatus._imageURL = gameStatus.game.sourceURL + gameStatus.game.smallShow;
        }
      });

      const newArray = [];
      for (let i = 0; i < response.length; i += 10) {
        newArray.push(response.slice(i, i + 10));
      }
      return responseSuccess(res, newArray);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetSupplier(req, res) {
    try {
      const { filter } = utilController.parseQuery(req.query);

      let { supplier, game, status } = filter;

      if (game?.length) {
        const gameQuery = {
          provider: { $in: supplier },
        };

        if (game?.length) {
          gameQuery["regionName.EN"] = { $in: game };
        }

        if (status?.length) {
          gameQuery.status = { $in: status };
        }

        supplier = await gameMethod.distinct(gameQuery, "provider");
      }

      const supplierQuery = {
        _id: { $in: supplier }
      };

      if (status?.length) {
        supplierQuery.status = { $in: status };
      }

      const suppliers = await supplierMethod.find(
          supplierQuery
      );

      const roleSupplier = await adminMethod.getSupplier({
        _id: req?.authClaims?.id,
      });

      let roleSupplierList = roleSupplier.map((item) => String(item?._id));

      let filterSupplier = suppliers.filter((item) =>
        roleSupplierList.includes(String(item._id)),
      );

      const newArray = [];
      for (let i = 0; i < filterSupplier.length; i += 10) {
        newArray.push(filterSupplier.slice(i, i + 10));
      }
      
      return responseSuccess(res, newArray);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const dashboardController = new DashboardController();
module.exports = dashboardController;
