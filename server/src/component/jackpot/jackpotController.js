const { responseError, responseSuccess } = require("../../helper/utilController.js");
const utilController = require("../../helper/utilController");
const utilsCustom = require("../../helper/utilCustom");
const providerGamesMinuteSummaryMethod = require("./providerGamesMinuteSummaryMethod")
const utilNumber = require("../../helper/utilNumber");
const utilExport = require("../../helper/utilExport");

class JackpotController {
    async onGetMany(req, res) {
        try {
            const { filter, paginateOption } = utilController.parseQuery(req.query);
            const { provider, platform, summaryTime, gameCode } = filter;
            const { isExport } = paginateOption;
            let result = [];
            let totalResult= []
            utilController.checkFilterDate(filter?.summaryTime);

            let query = {
                summaryTime: {
                    $gte: new Date(summaryTime?.startTime),
                    $lt: new Date(summaryTime?.endTime)
                },
                jackpotRoundNoArray: { "$exists": true, "$not": { "$size": 0 }}
            };
            if (Array.isArray(provider) && provider.length) {
                query.providerObjId = { $in: provider.map(item => utilsCustom.toObjectId(item)) };
            }
            if (platform) {
                query.platformObjId = { $in: platform.map(item => utilsCustom.toObjectId(item)) };
            }
            if(gameCode){
                query.jackpotRoundNoArray = gameCode
            }
            const groupQuery = {
                _id: "$jackpotRoundNoArray",
                summaryTime:{ $first:"$summaryTime" }
            };
            const providerGamesResponse = await providerGamesMinuteSummaryMethod.aggregate(query, groupQuery, null);

            if(providerGamesResponse?.length) {
                const jackpotRound = providerGamesResponse?.map(roundRecord => roundRecord?._id).flat();
                const consumptionQuery = {
                    createTime: {
                        $gte: new Date(summaryTime?.startTime),
                        $lt: new Date(summaryTime?.endTime)
                    },
                    roundNo: {$in: jackpotRound}
                }
                if (Array.isArray(provider) && provider.length) {
                    consumptionQuery.providerId = { $in: provider.map(item => utilsCustom.toObjectId(item)) };
                }
                if (platform) {
                    consumptionQuery.platformId = { $in: platform.map(item => utilsCustom.toObjectId(item)) };
                }
                const { recordPipeline, countPipeline } = jackpotController._groupQuery(consumptionQuery, paginateOption)
                const consumptionResult = await providerGamesMinuteSummaryMethod?.consumptionAggregate(recordPipeline);
                totalResult = await providerGamesMinuteSummaryMethod?.consumptionAggregate(countPipeline);
                if(consumptionResult?.length) {
                    result = consumptionResult.map((record) => {
                        return {
                            createTime: record?.createTime,
                            settlementTime: record?.settlementTime,
                            gameCode: record?._id,
                            platformName: record?.platform?.name,
                            totalBetAmount: Number(record?.totalBetAmount).toFixed(2) || "0.00",
                            jackpotAmountForGameRound: Number(record?.jackpotAmountForGameRound).toFixed(2) || "0.00",
                            totalJackpotAmount: Number(record?.totalJackpotAmount).toFixed(2) || "0.00",
                            grandJackpotAmountForGameRound: Number(record?.grandJackpotAmountForGameRound).toFixed(2) || "0.00",
                            grandJackpotAmount: Number(record?.grandJackpotAmount).toFixed(2) || "0.00",
                            majorJackpotAmountForGameRound: Number(record?.majorJackpotAmountForGameRound).toFixed(2) || "0.00",
                            majorJackpotAmount: Number(record?.majorJackpotAmount).toFixed(2) || "0.00",
                            minorJackpotAmountForGameRound: Number(record?.minorJackpotAmountForGameRound).toFixed(2) || "0.00",
                            minorJackpotAmount: Number(record?.minorJackpotAmount).toFixed(2) || "0.00",
                            betBonusAmountForGameRound: Number(record?.betBonusAmountForGameRound).toFixed(2) || "0.00",
                            betBonusAmount: Number(record?.betBonusAmount).toFixed(2) || "0.00",
                            jackpotType: record?.jackpotType,
                            payout: Number(record?.payout).toFixed(2) || "0.00",
                            jackpotPayout: Number(record?.jackpotPayout).toFixed(2) || "0.00",
                            initialJackpotAmount: Number(record?.initialJackpotAmount).toFixed(2) || "0.00"
                        }
                    });
                }
            }
            const totalDocs = totalResult.length;
            const totalPages = Math.ceil(totalDocs / paginateOption.limit);

            const response = {
                docs: result,
                totalDocs,
                totalPages,
                page: paginateOption.page,
                limit: paginateOption.limit
            };
            if (isExport) {
                return totalResult;
            } else {
                return responseSuccess(res, response);
            }
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onExport(req, res) {
        try {
            const { filter } = utilController?.parseQuery(req.query);
            req.query.isExport = true;
            utilController.checkFilterDate(filter?.summaryTime);
            const response = await jackpotController.onGetMany(req, res);
            let links = [];
            if (response.length) {
                const result = response.map(item => {
                    return {
                        "Game Code": item?._id,
                        "Platform Name": item?.platform.name,
                        "Total Bet Amount": Number(item?.totalBetAmount).toFixed(2) || "0.00",
                        "Jackpot Increment for each round": Number(item?.jackpotAmountForGameRound).toFixed(2) || "0.00",
                        "Total Jackpot Amount": Number(item?.totalJackpotAmount).toFixed(2) || "0.00",
                        "Grand Jackpot Increment for each round": Number(item?.grandJackpotAmountForGameRound).toFixed(2) || "0.00",
                        "Grand Jackpot Amount": Number(item?.grandJackpotAmount).toFixed(2) || "0.00",
                        "Major Jackpot Increment for each round": Number(item?.majorJackpotAmountForGameRound).toFixed(2) || "0.00",
                        "Major Jackpot Amount": Number(item?.majorJackpotAmount).toFixed(2) || "0.00",
                        "Minor Jackpot Increment for each round": Number(item?.minorJackpotAmountForGameRound).toFixed(2) || "0.00",
                        "Minor Jackpot Amount": Number(item?.minorJackpotAmount).toFixed(2) || "0.00",
                        "Jackpot Type": item?.jackpotType,
                        "Payout": Number(item?.payout).toFixed(2) || "0.00",
                        "Jackpot Payout": Number(item?.jackpotPayout).toFixed(2) || "0.00",
                        "Jackpot Seed Amount": Number(item?.initialJackpotAmount).toFixed(2) || "0.00"
                    };
                });

                const fileName = "JackpotReport" + " - " + String(req?.authClaims?.u);

                const exportData = await utilExport.exportData(result, fileName);
                links.push({ link: exportData?.link });
            }
            return responseSuccess(res, links);
        } catch (e) {
            return responseError(res, e);
        }
    }

    _groupQuery = (query, paginateOption) => {
        // TODO
        const recordPipeline = [
            {
                $match: query
            },
            {
                $group: {
                    _id: {
                        roundNo: "$roundNo",
                        jackpotType: "$details.jackpotType",
                        platform: "$platformId"
                    },
                    platformId: {$first: "$platformId"},
                    createTime: {$first: "$createTime"},
                    settlementTime: {$first: "$settlementTime"},
                    totalBetAmount: {$sum: "$amount"},
                    jackpotAmountForGameRound: {$sum: "$details.jackpotContribution"},
                    totalJackpotAmount: {$first: "$details.jackpotInfo.totalJackpotAmount"},
                    grandJackpotAmountForGameRound: {$sum: "$details.grand"},
                    grandJackpotAmount: {$first: "$details.jackpotInfo.grand.amount"},
                    majorJackpotAmountForGameRound: {$sum: "$details.major"},
                    majorJackpotAmount: {$first: "$details.jackpotInfo.major.amount"},
                    minorJackpotAmountForGameRound: {$sum: "$details.minor"},
                    minorJackpotAmount: {$first: "$details.jackpotInfo.minor.amount"},
                    betBonusAmountForGameRound: {$sum: "$details.betBonus"},
                    betBonusAmount: {$first: "$details.jackpotInfo.betBonus.amount"},
                    payout: {$sum: "$bonusAmount"},
                    jackpotPayout: {$sum: "$details.jackpotClaim"},
                    initialJackpotAmount: {$max: "$details.initialJackpotAmount"}
                }
            },
            {
                $group: {
                    _id: "$_id.roundNo",
                    platform: {$first: "$_id.platform"},
                    createTime: {$first: "$createTime"},
                    settlementTime: {$first: "$settlementTime"},
                    totalBetAmount: {$sum: "$totalBetAmount"},
                    jackpotAmountForGameRound: {$sum: "$jackpotAmountForGameRound"},
                    totalJackpotAmount: {$first: "$totalJackpotAmount"},
                    grandJackpotAmountForGameRound: {$sum: "$grandJackpotAmountForGameRound"},
                    grandJackpotAmount: {$first: "$grandJackpotAmount"},
                    majorJackpotAmountForGameRound: {$sum: "$majorJackpotAmountForGameRound"},
                    majorJackpotAmount: {$first: "$majorJackpotAmount"},
                    minorJackpotAmountForGameRound: {$sum: "$minorJackpotAmountForGameRound"},
                    minorJackpotAmount: {$first: "$minorJackpotAmount"},
                    betBonusAmountForGameRound: {$sum: "$betBonusAmountForGameRound"},
                    betBonusAmount: {$first: "$betBonusAmount"},
                    payout: {$sum: "$payout"},
                    jackpotPayout: {$sum: "$jackpotPayout"},
                    jackpotType: {$addToSet: "$_id.jackpotType"},
                    initialJackpotAmount: {$sum: "$initialJackpotAmount"}
                }
            },
            { $sort: { createTime: -1} },
            { $skip: ((paginateOption.page - 1) * (paginateOption.limit || 0))},
            { $limit: paginateOption.limit }
        ];

        const countPipeline = [
            {
                $match: query
            },
            {
                $group: {
                    _id: {
                        roundNo: "$roundNo",
                        jackpotType: "$details.jackpotType",
                        platform: "$platformId"
                    },
                    platformId: {$first: "$platformId"},
                    createTime: {$first: "$createTime"},
                    settlementTime: {$first: "$settlementTime"},
                    totalBetAmount: {$sum: "$amount"},
                    jackpotAmountForGameRound: {$sum: "$details.jackpotContribution"},
                    totalJackpotAmount: {$first: "$details.jackpotInfo.totalJackpotAmount"},
                    grandJackpotAmountForGameRound: {$sum: "$details.grand"},
                    grandJackpotAmount: {$first: "$details.jackpotInfo.grand.amount"},
                    majorJackpotAmountForGameRound: {$sum: "$details.major"},
                    majorJackpotAmount: {$first: "$details.jackpotInfo.major.amount"},
                    minorJackpotAmountForGameRound: {$sum: "$details.minor"},
                    minorJackpotAmount: {$first: "$details.jackpotInfo.minor.amount"},
                    betBonusAmountForGameRound: {$sum: "$details.betBonus"},
                    betBonusAmount: {$first: "$details.jackpotInfo.betBonus.amount"},
                    payout: {$sum: "$bonusAmount"},
                    jackpotPayout: {$sum: "$details.jackpotClaim"},
                    initialJackpotAmount: {$max: "$details.initialJackpotAmount"}
                }
            },
            {
                $group: {
                    _id: "$_id.roundNo",
                    platform: {$first: "$_id.platform"},
                    createTime: {$first: "$createTime"},
                    settlementTime: {$first: "$settlementTime"},
                    totalBetAmount: {$sum: "$totalBetAmount"},
                    jackpotAmountForGameRound: {$sum: "$jackpotAmountForGameRound"},
                    totalJackpotAmount: {$first: "$totalJackpotAmount"},
                    grandJackpotAmountForGameRound: {$sum: "$grandJackpotAmountForGameRound"},
                    grandJackpotAmount: {$first: "$grandJackpotAmount"},
                    majorJackpotAmountForGameRound: {$sum: "$majorJackpotAmountForGameRound"},
                    majorJackpotAmount: {$first: "$majorJackpotAmount"},
                    minorJackpotAmountForGameRound: {$sum: "$minorJackpotAmountForGameRound"},
                    minorJackpotAmount: {$first: "$minorJackpotAmount"},
                    betBonusAmountForGameRound: {$sum: "$betBonusAmountForGameRound"},
                    betBonusAmount: {$first: "$betBonusAmount"},
                    payout: {$sum: "$payout"},
                    jackpotPayout: {$sum: "$jackpotPayout"},
                    jackpotType: {$addToSet: "$_id.jackpotType"},
                    initialJackpotAmount: {$sum: "$initialJackpotAmount"}
                }
            },
            { $sort: { createTime: -1} }
        ];
        return {recordPipeline, countPipeline}
    }
}

const jackpotController = new JackpotController();
module.exports = jackpotController;
