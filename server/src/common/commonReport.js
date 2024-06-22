/* 链接多个 Method 模块的功能放在这里 */

const { ObjectId } = require("../helper/utilCustom");

const handleBillReportQuery = (data = {}) => {
    const { startTime, endTime, supplier, branch, min, max, gameCode, game, payoutTime, account, billNo, channelType } = data;
    const processQuery = {
      createTime: {
        $gte: new Date(startTime),
        $lt: new Date(endTime)
      }
    };

    if (branch?.length) {
        processQuery.platformId = { $in: branch.map((item) => ObjectId(item)) };
    }

    if (supplier?.length) {
        processQuery.providerId = { $in: supplier.map((item) => ObjectId(item)) };
    }

    if (account?.length) {
        processQuery.playerId = { $in: account.map((item) => ObjectId(item)) };
    }

    if (gameCode?.length) {
        processQuery.gameId = { $in: gameCode.map((item) => ObjectId(item)) };
    }

    if (game?.length) {
        processQuery.gameId = { $in: game.map((item) => ObjectId(item)) };
    }

    if (billNo) {
        processQuery.orderNo = billNo;
    }

    if (payoutTime?.startTime || payoutTime?.endTime) {
        processQuery.settlementTime = {
            ...payoutTime?.startTime && {$gte: new Date(payoutTime?.startTime)},
            ...payoutTime?.endTime && {$lt: new Date(payoutTime?.endTime)},
        };
    }

    if (channelType) {
      if (channelType === "LB") {
          // processQuery.details = {};
          processQuery["details.channel_type"] = channelType;
      } else if (channelType === "RGP") {
        processQuery.$or = [
          { details: { $exists: false } },
          {
            "details.channel_type": { $exists: false },
          },
          { "details.channel_type": channelType },
        ];
      }
    }

    if (min || max) {
        processQuery.amount = {
            ...(min && { $gte: Number(min) }),
            ...(max && { $lt: Number(max) })
        };
    }

    return processQuery;
}

const commonReport = {
    handleBillReportQuery
};


module.exports = commonReport;