const { responseError, responseSuccess } = require("../../helper/utilController.js");
const adminMethod = require("../admin/adminMethod");
const utilController = require("../../helper/utilController");
const utilExport = require("../../helper/utilExport");
const utilDate = require("../../helper/utilDate");
const transferStatus = require("../../const/constStatus");
const playerCreditTransferLogMethod = require("../playerCreditTransferLog/playerCreditTransferLogMethod");
const configMethod = require("../../component/config/configMethod");
const {constConfig} = require("../../const/constConfig");

const buildTransferQuery = async (authClaims, filter) => {
    const { playerId, playerName, min, max, providerId, createTime, type, status } = filter;
    const { startTime, endTime } = createTime;
    const platforms = await adminMethod.getBranches({ _id: authClaims?.id });
    const platformArr = platforms.map(item => item?._id);

    const transferQuery = {
        createTime: { $gte: startTime, $lt: endTime},
        platformObjId: { $in: platformArr }
    };

    if (playerId) {
        transferQuery.playerId = playerId;
    }
    if (playerName) {
        transferQuery.playerName = playerName;
    }
    if (providerId) {
        transferQuery.providerId = providerId;
    }
    if (type) {
        transferQuery.type = { $in: type };
    }
    if (status) {
        transferQuery.status = status;
    }

    if (min || max) {
        transferQuery.amount = {
            ...(min && { $gte: Number(min) }),
            ...(max && { $lte: Number(max) })
        };
    }

    const transferProjection = {
        playerName: 1,
        playerId: 1,
        providerId: 1,
        amount: 1,
        createTime: 1,
        type: 1,
        status: 1
    };

    const transferExportProjection = {
        _id: 0, // Exclude the _id field
        PlayerName: "$playerName",
        PlayerId: "$playerId",
        ProviderId: "$providerId",
        Amount: {
            $toDouble: {
                $substr: [
                    { $toString: { $round: [{ $toDouble: "$amount" }, 2] } },
                    0,
                    -1
                ]
            }
        },
        CreateTime: {
            $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$createTime",
                timezone: "Asia/Kuala_Lumpur"
            }
        },
        Type: "$type",
        Status: {
            $switch: {
                branches: [
                    { case: { $eq: ["$status", "1"] }, then: "Success" },
                    { case: { $eq: ["$status", "2"] }, then: "Fail" },
                    { case: { $eq: ["$status", "3"] }, then: "Request" },
                    { case: { $eq: ["$status", "4"] }, then: "Send" },
                    { case: { $eq: ["$status", "5"] }, then: "Time Out" }
                ],
                default: "UNKNOWN"
            }
        }
    };

    return { transferQuery, transferProjection, transferExportProjection };
}

class TransferInOutController {
    async onGet(req, res) {
        try {
            const {filter, paginateOption} = utilController?.parseQuery(req.query);
            const TIME_LIMIT_TRANSFER_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSFER_REPORT);
            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_TRANSFER_REPORT);
            const skip = ((paginateOption.page - 1) * (paginateOption.limit || 0))

            const { transferQuery, transferProjection } = await buildTransferQuery(req.authClaims, filter);
            let response = await playerCreditTransferLogMethod.aggregate(transferQuery, transferProjection, null, skip, paginateOption.limit);
            // response.docs = formatAmount(response.docs);
            for (let doc of response) {
                let { amount, ...rest } = doc;
                doc.amount = Number(amount).toFixed(2);
            }
            return responseSuccess(res, response);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onGetTotal(req, res){
        try {
            const {filter, paginateOption} = utilController?.parseQuery(req.query);
            const TIME_LIMIT_TRANSFER_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSFER_REPORT);
            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_TRANSFER_REPORT);
            const { transferQuery } = await buildTransferQuery(req.authClaims, filter);
            let total = await playerCreditTransferLogMethod.count(transferQuery);
            return responseSuccess(res, total);
        } catch (error) {
            return responseError(res, error);
        }
    }

    async onExport(req, res) {
        try {
            const { filter } = utilController?.parseQuery(req.query);
            const TIME_LIMIT_TRANSFER_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSFER_REPORT);
            utilController.checkFilterDate(filter?.createTime, TIME_LIMIT_TRANSFER_REPORT);

            const { transferQuery, transferExportProjection } = await buildTransferQuery(req.authClaims, filter);
            req.query.isExport = true;
            const adminObjId = req?.authClaims?.id;
            const exportFiles = [];
            const EXPORT_LIMIT_TRANSFER_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_TRANSFER_REPORT);

            const processChunk = async (chunkIndex) => {
                const skip = chunkIndex * Number(EXPORT_LIMIT_TRANSFER_REPORT);
                const response = await playerCreditTransferLogMethod.aggregate(transferQuery, transferExportProjection, null, skip, EXPORT_LIMIT_TRANSFER_REPORT);
                const fileName = `TransferInOutReport${chunkIndex}-${adminObjId}`;
                if (response.length) {
                    const result = response.map(item => {
                        item.Amount = (item.Amount).toFixed(2);
                        return item
                    });
                    const exportFile = await utilExport.exportData(result, fileName);
                    return { link: exportFile?.link };
                }
                return null;
            };

            const concurrencyLimit = 2;
            let chunkIndex = 0;
            while (true) {
                const promises = [];
                for (let j = 0; j < concurrencyLimit; j++) {
                    const currentIndex = chunkIndex + j;
                    promises.push(processChunk(currentIndex));
                }
                const chunkResults = await Promise.all(promises);
                exportFiles.push(...chunkResults.filter(result => result !== null));
                if (chunkResults.includes(null)){
                    break;
                }
                chunkIndex += concurrencyLimit;
            }
            return responseSuccess(res, exportFiles);
        } catch (e) {
            return responseError(res, e);
        }
    }
}

const transferInOutController = new TransferInOutController();
module.exports = transferInOutController;