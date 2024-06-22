const { responseError, responseSuccess } = require("../../helper/utilController");
const utilController = require("../../helper/utilController");
const restartLogMethod = require("./restartLogMethod");

class RestartLogController {
    async onGetTable(req, res) {
        try {
            let { paginate, filter } = utilController.parseQuery2(req.query);
            const options = {
                ...paginate,
                sort: { createdAt: -1 }
            };

            const response = await restartLogMethod.paginate(filter, options);
            return responseSuccess(res, response, {
                paginate
            });
        } catch (e) {
            return responseError(res, e);
        }
    }
}

const restartLogController = new RestartLogController();
module.exports = restartLogController;