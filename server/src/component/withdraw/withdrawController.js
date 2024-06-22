const { responseError, responseSuccess } = require("../../helper/utilController.js");
const adminMethod = require("../admin/adminMethod");
const utilController = require("../../helper/utilController");
const utilExport = require("../../helper/utilExport");
const constWithdrawType = require("../../const/constWithdrawType");
const utilDate = require("../../helper/utilDate");
const playerMethod = require("../player/playerMethod");
const proposalTypeMethod = require("../proposalType/proposalTypeMethod");
const proposalMethod = require("../proposal/proposalMethod");
const configMethod = require("../../component/config/configMethod");
const {constConfig} = require("../../const/constConfig");
const {constCommonError} = require("../../const/constErrorCode");

class WithdrawController {
    async onGet(req, res) {
        try {
            const { filter, paginateOption } = utilController?.parseQuery(req?.query);

            const TIME_LIMIT_WITHDRAW_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_WITHDRAW_REPORT);

            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_WITHDRAW_REPORT);
            const skip = ((paginateOption.page - 1) * (paginateOption.limit || 0))
            const { proposalQuery, proposalProjection } = await _generateProposalQuery(filter, req?.authClaims?.id);
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
            const TIME_LIMIT_WITHDRAW_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_WITHDRAW_REPORT);
            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_WITHDRAW_REPORT);
            const { proposalQuery } = await _generateProposalQuery(filter, req?.authClaims?.id);
            const totalDocs = await proposalMethod.count(proposalQuery);
            return responseSuccess(res, totalDocs);
        } catch (error) {
            return responseError(res, error);
        }
    }

    async onExport(req, res) {
        try {
            const { filter } = utilController?.parseQuery(req?.query);

            const TIME_LIMIT_WITHDRAW_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_WITHDRAW_REPORT);

            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_WITHDRAW_REPORT);

            const {proposalQuery, proposalProjection} = await _generateProposalQuery(filter, req?.authClaims?.id);
            let exportLinks = [];
            const EXPORT_LIMIT_WITHDRAW_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_WITHDRAW_REPORT);

            for (let i = 0; i < 10000; i++) {
                let skip = i * Number(EXPORT_LIMIT_WITHDRAW_REPORT);
                let proposals = await proposalMethod.aggregate(proposalQuery, proposalProjection, null, skip, EXPORT_LIMIT_WITHDRAW_REPORT);
                if (!proposals.length) {
                    break;
                }
                let proposalPopulated = await _populatePlayerProposal(proposals);
                let exportData = await _exportPlayerWithdraw(proposalPopulated, req?.authClaims?.id, i);
                exportLinks.push({link: exportData?.link});
            }
            return responseSuccess(res, exportLinks);
        } catch (e) {
            return responseError(res, e);
        }
    }
}

const _generateProposalQuery = async (filter, adminObjId) => {
    const platforms = await adminMethod.getBranches({ _id: adminObjId });
    const { min, max, name, playerId, createTime, proposalId, status } = filter;
    const { startTime, endTime } = createTime;
    const platformObjIds = platforms.map(item => item?._id);
    // GET Deposit Proposal Type
    const withDrawProposalTypeQuery = {
        name: { $in: constWithdrawType },
        platformId: { $in: platformObjIds }
    };

    const proposalTypes = await proposalTypeMethod.find(withDrawProposalTypeQuery);
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

const _exportPlayerWithdraw = async (proposals, adminObjId, i) => {
    const result = [];
    for (const item of proposals) {
        const playerId = item?.data?.playerObjId?.playerId || item?.data?.playerId;
        const playerName = item?.data?.playerObjId?.name || item?.data?.playerName;
        const amount = Number((item?.amount || item?.data?.amount)?.toFixed(2));
        const createTime = utilDate.getDateTzISOString(item?.createTime);
        const status = item?.status;
        const proposalId = item?.proposalId;

        result.push({
            PlayerId: playerId,
            PlayerName: playerName,
            Amount: amount,
            CreateTime: createTime,
            Status: status,
            ProposalId: proposalId
        });
    }

    const fileName = `PlayerWithdrawReport-${adminObjId}${i}`;
    return utilExport.exportData(result, fileName);
};


const withdrawController = new WithdrawController();
module.exports = withdrawController;