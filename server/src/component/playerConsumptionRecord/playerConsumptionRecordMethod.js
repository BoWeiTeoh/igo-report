const dbModel = require("../../db/dbModel");
const { beforeDate , calculateTimeIntervals, removeSSAndMS} = require("../../helper/utilDate");
const settlement = require("../../settlement/settlement");
const { constStreamFileStatus } = require("../../const/constStatus");
const vaultData = require("../../vault/config");

const configMethod = require("../config/configMethod");
const { constConfig } = require("../../const/constConfig");
const { logger } = require("../../helper/utilPinoLogger");

const getHoursConsumptionRecord = async (query, endTime) => {
  let { supplier, platform} = query;
  let startTime = beforeDate(1, "hours");

  let matchQuery = {
    providerId: supplier,
    createTime: { $gte: new Date(startTime), $lt: new Date(endTime) }
  };

  if (platform) {
    matchQuery.platformId = platform;
  }

  if (query?.["details.channel_type"]) {
    matchQuery["details.channel_type"] = query?.["details.channel_type"];
  }

  if (query?.$or) {
    matchQuery.$or = query?.$or;
  }

  let projectQuery = {
    platformId: 1,
    providerId: 1,
    amount: 1,
    validAmount: 1,
    bonusAmount: 1
  };

  let groupQuery = {
    _id: null,
    amount: { $sum: "$amount" },
    validAmount: { $sum: "$validAmount" },
    bonusAmount: { $sum: "$bonusAmount" },
    count: { $sum: 1 }
  };

  if (platform) {
    groupQuery._id = {
      supplier: "$providerId",
      platform: "$platformId"
    };
  } else {
    groupQuery._id = "$providerId";
  }

  matchQuery = _processGovQuery(matchQuery);
  let consumptionRecord = await dbModel.playerConsumptionRecord.aggregate([
    {
      $match: matchQuery
    },
    {
      $project: projectQuery
    },
    {
      $group: groupQuery
    }
  ]).allowDiskUse(true);

  let obj = {};
  for (const result of consumptionRecord) {
    if (platform) {
      obj[String(result._id.platform) + String(result._id.supplier)] = result;
    } else {
      obj[String(result._id)] = result;
    }
  }
  return obj;
};

const aggregate = async (matchQuery, projectQuery, groupQuery, projectQuery2, page, limit, skip, sort) => {
  matchQuery = _processGovQuery(matchQuery);
  const pipeline = [
    {
      $match: matchQuery
    }
  ];

  if (projectQuery && Object.keys(projectQuery).length > 0) {
    pipeline.push({
      $project: projectQuery
    });
  }

  if (groupQuery && Object.keys(groupQuery).length > 0) {
    pipeline.push({
      $group: groupQuery
    });
  }

  if (projectQuery2 && Object.keys(projectQuery2).length > 0) {
    pipeline.push({
      $project: projectQuery2
    });
  }

  if (sort) {
    pipeline.push({
      $sort: sort
    });
  }
  if (page) {
    pipeline.push({
      $skip: ((page - 1) * (limit || 0))
    });
  }

  if (skip) {
    pipeline.push({
      $skip: skip
    });
  }

  if (limit) {
    pipeline.push({
      $limit: limit
    });
  }

  try {
    return dbModel.playerConsumptionRecord.aggregate(pipeline).allowDiskUse(true);
  } catch (e) {
    logger.info(e, "player Consumption Record Aggregate");
    logger.info({"Player Consumption Record pipeline": pipeline});
    throw e;
  }
};

const paginate = (query = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.playerConsumptionRecord?.paginate(query, options);
};

const aggregatePageRecord = async (query = {}, options = {}) => {
  const { page = 1, limit = 10, select } = options;

  let docs = await aggregate(query, select, {}, {}, page, limit);

  docs = await dbModel.player.populate(docs, {
    path: "playerId",
    select: { name: 1, playerId: 1 }
  });

  docs = await dbModel.platform.populate(docs, {
    path: "platformId",
    select: { name: 1 }
  });

  docs = await dbModel.supplier.populate(docs, {
    path: "providerId",
    select: { name: 1 }
  });

  docs = await dbModel.game.populate(docs, {
    path: "gameId",
    select: { name: 1, code: 1, regionName: 1 }
  });

  return docs;
};

const generateBillReportData = async (query = {}, fileName = "", branchObj = {}, filter) => {
  logger.info({query, fileName, branchObj}, "generateBillReportData START EXPORT")
  try {
    let { startTime, endTime } = calculateTimeIntervals(query);

    let proms = [];

    const [INTERVAL, EXPORT_LIMIT_TRANSACTION_REPORT, BATCH_EXPORT] = await Promise.all([
      configMethod.getValue(constConfig.INTERVAL),
      configMethod.getValue(constConfig.EXPORT_LIMIT_TRANSACTION_REPORT),
      configMethod.getValue(constConfig.BATCH_EXPORT)
    ]);

    const indexLength = ((endTime - startTime) / INTERVAL) + 1;
    for (let index = 0; index < indexLength; index++) {
      const matchQuery = {
        platformId: query?.platformId,
        providerId: query?.providerId,
        createTime: {
          "$gte": startTime,
          "$lt": new Date(startTime.getTime() + INTERVAL)
        }
      };
      const settlementParam = _createSettlementParam(matchQuery, branchObj, startTime, INTERVAL);
      startTime = new Date(startTime.getTime() + INTERVAL);
      proms.push(count(settlementParam?.query));
      if (startTime >= endTime) {
        break;
      }
    }
    const promsResult = await Promise.all(proms);

    const queryArr = generateQueryByCount(promsResult, query, EXPORT_LIMIT_TRANSACTION_REPORT, INTERVAL, fileName);

    for (const param of queryArr) {
      try {
        await dbModel.streamFile.updateOne({ fileName: param?.fileName + ".zip" }, {
          $set: {
            query: param?.query,
            skipLimit: param?.skipLimit,
            prefix: fileName,
            branchObj,
            status: constStreamFileStatus.PROCESSING,
            percentage: 0
          }
        }, { upsert: true });
      } catch (err) {
        logger.error("ERR streamFile", err);
      }
      try {
        await settlement.settlementGenerateBillExport({
          ...param,
          branchObj,
          EXPORT_LIMIT_TRANSACTION_REPORT,
          BATCH_EXPORT,
          filter,
        });

        logger.info(`Successfully processed ${param?.fileName}.zip`);
      } catch (err) {
        logger.error("ERR settlementGenerateBillExport", err);
      }
    }

    // 提早返回，因为前端等10分钟系统会报错
    return Promise.resolve();

  } catch (error) {
    logger.error("error error", error);
    return Promise.reject(error);
  }
};

const count = async (query) => {
  query = _processGovQuery(query);
  return dbModel.playerConsumptionRecord.countDocuments(query);
};

const generateQueryByCount = (promsResult, query, limit, interval, fileName) => {
  const promsLength = promsResult?.length;
  const startTime = new Date(query?.startTime);

  let queryArr = [];
  let docNum = 1;
  let docStartTime = startTime;
  let docCount = 0;
  let reminderNum = limit;
  let skipLimit = 0;
  for (let i = 0; i < promsLength; i++) {
    docCount += promsResult[i];
    reminderNum -= promsResult[i];
    while (docCount > limit) {
      reminderNum += promsResult[i];
      const queryObj = {
        query: {
          platformId: query?.platformId,
          providerId: query?.providerId,
          startTime: docStartTime,
          endTime: new Date(startTime.getTime() + (interval * (i + 1)))
        },
        fileName: fileName + "-" + docNum + ".csv",
        skipLimit: skipLimit
      };
      skipLimit = reminderNum;
      reminderNum = (limit - (promsResult[i] - reminderNum));
      queryArr.push(queryObj);
      docStartTime = new Date(startTime.getTime() + (interval * (i)));
      docNum++;
      docCount -= limit;
    }
  }
  const queryObj = {
    query: {
      platformId: query?.platformId,
      providerId: query?.providerId,
      startTime: docStartTime,
      endTime: new Date(startTime.getTime() + (interval * (promsLength)))
    },
    fileName: fileName + "-" + docNum + ".csv",
    skipLimit: skipLimit
  };
  queryArr.push(queryObj);

  return queryArr;
};

const find = (query, project) => {
  query = _processGovQuery(query);
  return dbModel.playerConsumptionRecord.find(query, project).lean();
};

const getLastHourConsumption = async (matchQuery, betTime) => {
  removeSSAndMS(betTime.endTime);
  const lastHourTime = new Date(beforeDate(1, "hours"));
  if (betTime?.startTime < lastHourTime && betTime?.endTime > lastHourTime) {
    matchQuery.betTime = {
      $gte: new Date(betTime?.startTime),
      $lt: lastHourTime
    };
    return getHoursConsumptionRecord(matchQuery, betTime?.endTime);
  } else {
    matchQuery.betTime = {
      $gte: new Date(betTime?.startTime),
      $lt: new Date(betTime?.endTime)
    };
    return {};
  }
};

const _processGovQuery = (query) => {
  if (vaultData?.getData()?.["ENV_DOMAIN"] === "gov") {
    query.isFromCertifiedGame = true
  }
  return query;
}

const _createSettlementParam = (query, branchObj, startTime, interval) => {
  return {
    query: {
      createTime: {
        $gte: startTime,
        $lt: new Date(startTime.getTime() + interval)
      },
      ...query
    },
    branchObj
  };
};

const consumptionRecordMethod = {
  getHoursConsumptionRecord,
  aggregate,
  paginate,
  aggregatePageRecord,
  generateBillReportData,
  getLastHourConsumption,
  count,
  find
};
module.exports = consumptionRecordMethod;
