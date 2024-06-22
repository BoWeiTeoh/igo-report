const { responseError, responseSuccess } = require("../../helper/utilController.js");
const playerMethod = require("../player/playerMethod");
const adminMethod = require("../admin/adminMethod");
const utilController = require("../../helper/utilController");
const proposalTypeMethod = require("../proposalType/proposalTypeMethod");
const proposalMethod = require("../proposal/proposalMethod");
const constDepositType = require("../../const/constDepositType");
const utilExport = require("../../helper/utilExport");
const utilDate = require("../../helper/utilDate");
const configMethod = require("../../component/config/configMethod");
const {constConfig} = require("../../const/constConfig");
const {constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class DepositController {
  async onGet(req, res) {
    try {
      const { filter, paginateOption } = utilController?.parseQuery(req?.query);

        const TIME_LIMIT_DEPOSIT_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_DEPOSIT_REPORT);
      // check filter validated
        utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_DEPOSIT_REPORT);
        const skip = ((paginateOption.page - 1) * (paginateOption.limit || 0))
      // generate proposal query and projection
      const { proposalQuery, proposalProjection } = await _generateQuery(filter, req?.authClaims?.id);

      // paginate Option
      const proposalOption = {
        ...paginateOption,
        select: proposalProjection,
      };
        
        let response = await proposalMethod.aggregate(
            proposalQuery,
            proposalProjection,
            null,
            skip,
            paginateOption?.limit
        );

      response = await _populatePlayerProposal(response);

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetTotal(req, res) {
      try {
          const { filter } = utilController?.parseQuery(req?.query);
          const TIME_LIMIT_DEPOSIT_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_DEPOSIT_REPORT);
          utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_DEPOSIT_REPORT);
          const { proposalQuery } = await _generateQuery(filter, req?.authClaims?.id);
          const totalDocs = await proposalMethod.count(proposalQuery);
          return responseSuccess(res, totalDocs);
      } catch (error) {
          return responseError(res, error);
      }
  }

  async onExport(req, res) {
    try {
        const {filter} = utilController?.parseQuery(req?.query);

        const TIME_LIMIT_DEPOSIT_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_DEPOSIT_REPORT);
        // check filter validated
        utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_DEPOSIT_REPORT);

        // generate proposal query and projection
        const {proposalQuery, proposalProjection} = await _generateQuery(filter, req?.authClaims?.id);
        
        let links = [];

        const EXPORT_LIMIT_DEPOSIT_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_DEPOSIT_REPORT);

        for (let i = 0; i < 10000; i++) {
            let skip = i * Number(EXPORT_LIMIT_DEPOSIT_REPORT);

            let proposals = await proposalMethod.aggregate(proposalQuery, proposalProjection, null, skip, EXPORT_LIMIT_DEPOSIT_REPORT);

            if (!proposals.length) {
                break;
            }

            let proposalPopulated = await _populatePlayerProposal(proposals);

            let exportData = await _exportProposal(proposalPopulated, req?.authClaims?.id, i);

            links.push({ link: exportData?.link });
        }

        return responseSuccess(res, links);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const _generateQuery = async (query, adminObjId) => {

    // GET platforms by player role's permissions
    const adminQuery = {
        _id: adminObjId
    };
    const platforms = await adminMethod.getBranches(adminQuery);

    const { min, max, name, playerId, createTime, proposalId, status } = query;

    const { startTime, endTime } = createTime;

    const platformObjIds = platforms.map(item => item?._id);

    // GET Deposit Proposal Type
    const proposalTypeQuery = {
      name: { $in: constDepositType },
      platformId: { $in: platformObjIds }
    };

    const proposalTypes = await proposalTypeMethod.find(proposalTypeQuery);
    const proposalTypeObjIds = proposalTypes.map((item) => item?._id);

    // Initial Proposal Query
    const proposalQuery = {
        createTime: { $gte: startTime, $lt: endTime},
        "data.platformId": { $in: platformObjIds },
        type: { $in: proposalTypeObjIds },
        ...(proposalId && {proposalId}),
        ...(status && {status})
    };

    // Optional: Min Max condition
    if (min || max) {
        proposalQuery["data.amount"] = {
            ...(min && { $gte: Number(min) }),
            ...(max && { $lt: Number(max) })
        };
    }

    // Optional: specify player condition
    if (playerId || name) {
        const playerQuery = {
            ...(playerId && { playerId }),
            ...(name && { name })
        };

        const playerProjection = {
            playerId: 1,
            name: 1
        };
        const player = await playerMethod.findOne(playerQuery, playerProjection);

        if (player) {
            proposalQuery["data.playerObjId"] = player?._id;
        } else {
            throw (constCommonError.NAME("Player").NOT_EXIST);
        }
    }

    const proposalProjection = {
        "data.playerName": 1,
        "data.playerId": 1,
        "data.amount": 1,
        "data.playerObjId": 1,
        createTime: 1,
        status: 1,
        proposalId: 1,
    };

    return {proposalQuery, proposalProjection};
}

const _populatePlayerProposal = async (proposals) => {
    const path = "data.playerObjId";
    const select = {
        playerId: 1,
        name: 1
    }
    return playerMethod.populate(proposals, path, select);
}

const _exportProposal = async (proposals, adminObjId, i) => {
  const result = proposals.map((item) => {
    return {
      PlayerId: item?.data?.playerObjId?.playerId,
      PlayerName: item?.data?.playerObjId?.name,
      Amount:
        Number(item?.amount?.toFixed(2)) ||
        Number(item?.data?.amount?.toFixed(2)),
      CreateTime: utilDate.getDateTzISOString(item?.createTime),
      Status: item?.status,
      ProposalId: item?.proposalId,
    };
  });

  const fileName = "PlayerDepositReport" + "-" + String(adminObjId) + i;

  return utilExport.exportData(result, fileName);
};

const depositController = new DepositController();
module.exports = depositController;