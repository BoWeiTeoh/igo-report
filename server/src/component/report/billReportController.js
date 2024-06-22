// 环境配置导入：
const vaultData = require("../../vault/config");

// 通用功能导入：
const { responseError, responseSuccess } = require("../../helper/utilController.js");
const { parseQuery, checkFilterDate } = require("../../helper/utilController");
const { log } = require("../../helper/utils");
const { ObjectId, toObjectIdArray } = require("../../helper/utilCustom");
const { getDateTzISOString } = require("../../helper/utilDate");
const { getBucket, deleteBucket } = require("../../helper/utilExport");
const { handleBillReportQuery } = require("../../common/commonReport");

// 数据库模型导入：
const dbModel = require("../../db/dbModel");

// Const 模块导入：
const { constStreamFileStatus } = require("../../const/constStatus");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const constLogType = require("../../const/constLogType");
const { constConfig , constInitConfig } = require("../../const/constConfig");

// Method 模块导入：
const consumptionMethod = require("../playerConsumptionRecord/playerConsumptionRecordMethod");
const gameMethod = require("../game/gameMethod");
const playerMethod = require("../player/playerMethod");
const streamFileMethod = require("../streamFile/streamFileMethod");
const branchMethod = require("../branch/branchMethod");
const operationLogMethod = require("../operationLog/operationLogMethod");
const systemStatusMethod = require("../systemStatus/systemStatusMethod");
const configMethod = require("../config/configMethod");

// Settlement 模块导入：
const settlement = require("../../settlement/settlement");
const {errCode, constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class BillReportController {
  async onGet(req, res) {
      try {
        const { paginate, filter, paginateOption } = parseQuery(req.query);

        const TIME_LIMIT_TRANSACTION_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSACTION_REPORT);

        checkFilterDate(filter?.billTime, TIME_LIMIT_TRANSACTION_REPORT)
        _checkFilter(filter);

        let matchQuery = await _generateMatchQuery(filter);

        matchQuery.startTime = filter?.billTime?.startTime;
        matchQuery.endTime = filter?.billTime?.endTime;

        const branchObj = await _generateBranchObj(filter);

        const options = {
          ...paginateOption,
          select: {
            _id: 1,
            orderNo: 1,
            createTime: 1,
            settlementTime: 1,
            amount: 1,
            validAmount: 1,
            bonusAmount: 1,
            playerId: 1,
            platformId: 1,
            providerId: 1,
            gameId: 1,
            betType: 1,
            details: 1
          }
        };

        let response = {
          docs: []
        };

        const processQuery = handleBillReportQuery(matchQuery);

        response.docs = await consumptionMethod.aggregatePageRecord(processQuery, options);

        let totalSubAmount = 0;
        let totalSubValidAmount = 0;
        let totalSubBonusAmount = 0;

        if (response?.docs?.length) {
          response.docs = response.docs.map((item) => {
            if (filter?.report === "Balance Record") {
              if (item?.bonusAmount >= 0) {
                item.transactionType = "Payout";
                item.expense = item.amount;
                item.beforeBet = item?.details?.creditAfterBet ? Number(item.details.creditAfterBet).toFixed(2) : '0';
              } else {
                item.transactionType = "Bet";
                item.expense = item.bonusAmount;
                item.beforeBet = item?.details?.initialAmount ? Number(item.details.initialAmount).toFixed(2) : '0';
              }
              item.runningBalance = item?.details?.creditAfterPayout ? Number(item.details.creditAfterPayout).toFixed(2) : '0';
              item.income = item.bonusAmount > 0 ? item.bonusAmount : '';
            }
            let key = String(item?.platformId?._id) + String(item?.providerId?._id);
            item.siteType = branchObj[key]?.siteType || "";
            item.category = branchObj[key]?.category || "";
            totalSubAmount += item.amount || 0;
            totalSubValidAmount += item.validAmount || 0;
            totalSubBonusAmount += item.bonusAmount || 0;

            switch (item?.details?.channel_type) {
              case "LB":
                item.channelType = "Landbase";
                break;
              case "RGP":
              default:
                item.channelType = "RGP";
            }

            return item;
          });
          response.subTotal = {
            amount: totalSubAmount,
            validAmount: totalSubValidAmount,
            bonusAmount: totalSubBonusAmount
          };

          response.limit = paginate?.limit || 10;
          response.page = paginate?.page || 1;
        }
        return responseSuccess(res, response, {
          paginate
        });
      } catch (e) {
        return responseError(res, e);
      }
  }

  async onGetTotal(req, res) {
    try {
      const { filter } = parseQuery(req?.query);

      const TIME_LIMIT_TRANSACTION_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSACTION_REPORT);
      checkFilterDate(filter?.billTime, TIME_LIMIT_TRANSACTION_REPORT);
      _checkFilter(filter);

      const matchQuery = await _generateMatchQuery(filter);

      const requestId = req?.requestId;

      operationLogMethod
        .insertOperationLog({
          req,
          title: "search",
          operation: constOperationLogOperation.read,
          fnc: "billReportController.onGetTotal",
          changed: filter,
          requestId: requestId,
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });

      const { billTime } = filter;

      let startTime = new Date(billTime?.startTime);
      let endTime = new Date(billTime?.endTime);

      let proms = [];
      let result = {
        totalAmount: 0,
        totalValidAmount: 0,
        totalCount: 0,
        totalBonusAmount: 0,
      };
      let count = 0;

      const INTERVAL = await configMethod.getValue(constConfig.INTERVAL);
      const INSTANCE_SETTLEMENT = await configMethod.getValue(constConfig.INSTANCE_SETTLEMENT);

      while (startTime < endTime) {
        for (let i = 0; i < INSTANCE_SETTLEMENT; i++) {
          if (startTime >= endTime) {
            break;
          }
          const newStart = new Date(startTime);
          startTime = new Date(
            startTime.setTime(startTime.getTime() + INTERVAL),
          );
          let newEnd = new Date(endTime);

          if (startTime < endTime) {
            newEnd = new Date(startTime);
          }

          const matchQueryBatch = {
            ...matchQuery,
            startTime: newStart,
            endTime: newEnd,
          };

          count++;
          logger.info({"onGetTotal CHECK COUNT": count});
          proms.push(
            settlement.settlementConsumptionAggregate(matchQueryBatch),
          );
        }
        
        let docs = await Promise.all(proms);

        for (const doc of docs) {
          if (doc?.[0]) {
            result.totalAmount += doc[0]?.totalAmount || 0;
            result.totalValidAmount += doc[0]?.totalValidAmount || 0;
            result.totalBonusAmount += doc[0]?.totalBonusAmount || 0;
            result.totalCount += doc[0]?.totalCount || 0;
          }
        }
        proms = [];
      }

      return responseSuccess(res, result);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onExport(req, res) {
    try {
      const { filter } = parseQuery(req.query);
      checkFilterDate(filter?.billTime);
      const branchObj = await _generateBranchObj(filter);

      const convertedStreamFileStatus = {};
      for (const status in constStreamFileStatus) {
        convertedStreamFileStatus[constStreamFileStatus[status]] = status;
      }
      let dateArr = [];

      let startTime = filter?.billTime?.startTime;
      let endTime = filter?.billTime?.endTime;
      endTime.setSeconds(endTime.getSeconds() - 1);
      const intervalExport = 24 * 60 * 60 * 1000;
      while (startTime <= endTime) {
        const dateString = startTime.toLocaleDateString("en-CA");
        dateArr.push(dateString);
        startTime = new Date(startTime.setTime(startTime.getTime() + intervalExport));
      }
      const dateString = endTime.toLocaleDateString("en-CA");
      dateArr = [...dateArr, dateString];
      dateArr = [...new Set(dateArr)];

      let result = [];
      const objLink = {};
      const promsDB = [];
      const promsAWS = [];
      for (const key in branchObj) {
        const branch = branchObj[key]?.branch;
        const supplier = branchObj[key]?.supplier;

        for (const dateString of dateArr) {
          let fileName;
          if (filter?.report === "Balance Record") {
            fileName = "balance" + "-" + branch + "-" + supplier + "-" + dateString + "-" + key;
          } else {
            fileName = branch + "-" + supplier + "-" + dateString + "-" + key;
          }
          const query = {
            prefix: fileName
          };
          promsAWS.push(getBucket(fileName));
          promsDB.push(streamFileMethod.find(query));
        }
      }

      try {
        const [dbData, awsData] = await Promise.all([Promise.all(promsDB), Promise.all(promsAWS)]);

        // 在这里可以使用 dbData 和 awsData，它们分别是两个 Promise.all 返回的数组

        for (const items of dbData) {
          for (const item of items) {
            if (item?.fileName) {
              const startTime = new Date(item?.query?.startTime).toLocaleString("en-GB").slice(12, 17);
              const endTime = new Date(item?.query?.endTime).toLocaleString("en-GB").slice(12, 17);
              const periodTime = startTime + "-" + endTime;
              objLink[item?.fileName] = {
                time: periodTime,
                status: item?.status,
                percentage: item?.percentage
              };
            }
          }
        }

        for (const items of awsData) {
          for (const item of items) {
            if (item?.Key) {
              if (!objLink[item?.Key]) {
                objLink[item?.Key] = {};
              }
              objLink[item?.Key].awsUpdateTime = getDateTzISOString(item?.LastModified);
            }
          }
        }

        for (const property in objLink) {
          let status = objLink[property]?.status
            ? convertedStreamFileStatus[objLink[property]?.status]
            : convertedStreamFileStatus[constStreamFileStatus.ABNORMAL];
          const noNeedPercentage = [
            convertedStreamFileStatus[constStreamFileStatus.ABNORMAL],
            convertedStreamFileStatus[constStreamFileStatus.PROCESSING],
            convertedStreamFileStatus[constStreamFileStatus.SUCCESS]
          ];
          if (!noNeedPercentage.includes(status)) {
            status = status + "_" + objLink[property]?.percentage + "%";
          }
          result.push({
            link: property,
            bucketUrl: vaultData.getData()["AWS_S3_BUCKET_URL"],
            time: objLink[property].time || "-",
            status: status,
            awsUpdateTime: objLink[property].awsUpdateTime || "-"
          });
        }
      } catch (error) {
        // 处理错误
        logger.error({"error occurred": error});
      }

      return responseSuccess(res, result);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGenerate(req, res) {
    try {
      const { filter } = parseQuery(req.query);
      
      const TIME_LIMIT_TRANSACTION_REPORT = await configMethod.getValue(constConfig.TIME_LIMIT_TRANSACTION_REPORT);

      checkFilterDate(filter?.billTime, TIME_LIMIT_TRANSACTION_REPORT)
      _checkFilter(filter);

      const branchObj = await _generateBranchObj(filter);

      operationLogMethod
        .insertOperationLog({
          req,
          title: "re-generate",
          operation: constOperationLogOperation.update,
          fnc: "billReportController.onGenerate",
          changed: filter
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });

      let systemStatus = await systemStatusMethod.getStatus();

      if (!systemStatus) {
        throw (constCommonError.FUNCTION.NOT_AVAILABLE);
      }

      systemStatusMethod.updateStatus(true).catch();

      let dateArr = [];

      let startTime = filter?.billTime?.startTime;
      let endTime = filter?.billTime?.endTime;
      endTime.setSeconds(endTime.getSeconds() - 1);
      const intervalExport = 24 * 60 * 60 * 1000;

      while (startTime <= endTime) {
        const dateString = startTime.toLocaleDateString("en-CA");
        dateArr.push(dateString);
        startTime = new Date(startTime.setTime(startTime.getTime() + intervalExport));
      }
      const dateString = endTime.toLocaleDateString("en-CA");
      dateArr = [...dateArr, dateString];
      dateArr = [...new Set(dateArr)];

      let result = [];
      for (const key in branchObj) {
        const branch = branchObj[key]?.branch;
        const supplier = branchObj[key]?.supplier;
        const branchObjId = branchObj[key]?.branchObjId;
        const supplierObjId = branchObj[key]?.supplierObjId;

        for (const dateString of dateArr) {
          let fileName;
          if (filter?.report === "Balance Record") {
            fileName = "balance" + "-" + branch + "-" + supplier + "-" + dateString + "-" + key;
          } else {
            fileName = branch + "-" + supplier + "-" + dateString + "-" + key;
          }
          const startTime = new Date(getDateTzISOString(dateString));
          const endTime = new Date(startTime);
          endTime.setDate(endTime.getDate() + 1);

          const query = {
            platformId: ObjectId(branchObjId),
            providerId: ObjectId(supplierObjId),
            startTime: startTime,
            endTime: endTime
          };

          await consumptionMethod.generateBillReportData(query, fileName, branchObj[key], filter).catch((err) => {
            logger.error({"onGenerate generateBillReportData ERR": err});
          });
        }
      }

      return responseSuccess(res, result);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onRegenerateSpecifyFile(req, res) {
    const { rowSelected, filter } = req.query;
    const rows = JSON.parse(rowSelected);
    operationLogMethod
      .insertOperationLog({
        req,
        title: "specify-generate",
        operation: constOperationLogOperation.update,
        fnc: "billReportController.onRegenerateSpecifyFile",
        changed: rows
      })
      .catch((err) => {
        logger.error({"operation Log Err": err});
      });
    let systemStatus = await systemStatusMethod.getStatus();

    if (!systemStatus) {
      throw (constCommonError.FUNCTION.NOT_AVAILABLE);
    }

    const EXPORT_LIMIT_TRANSACTION_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_TRANSACTION_REPORT);
    const BATCH_EXPORT = await configMethod.getValue(constConfig.BATCH_EXPORT);

    for (const row of rows) {
      try {
        const streamFile = await streamFileMethod.findOneAndUpdate(
          { fileName: row?.link },
          {
            $set: {
              status: constStreamFileStatus.PROCESSING,
              percentage: 0
            }
          },
          { new: true }
        );
        const { branchObj, fileName, skipLimit, query } = streamFile;
        // 移除 '.zip' 扩展名
        const fileNameWithoutZip = fileName.replace(".zip", "");
        const parseData = {
          branchObj,
          EXPORT_LIMIT_TRANSACTION_REPORT,
          BATCH_EXPORT,
          fileName: fileNameWithoutZip,
          skipLimit,
          query,
          filter
        };
        settlement.settlementGenerateBillExport(parseData).catch((err) => {
          logger.error({"ERR settlementGenerateBillExport": err});
        });
        logger.info({"CHECK STREAM FILE": streamFile});
      } catch (err) {
        logger.error({"ERR streamFile": err});
      }
    }
    return responseSuccess(res, { status: 200 });
  }

  async onDeleteExport(req, res) {
    const { rowSelected } = req.query;
    const rows = JSON.parse(rowSelected);
    operationLogMethod
      .insertOperationLog({
        req,
        title: "delete excel",
        operation: constOperationLogOperation.delete,
        fnc: "billReportController.onDeleteExport",
        changed: rows,
      })
      .catch((err) => {
        logger.error({"Operation Log Err": err});
      });
    await deleteBucket(rows);
    const deleteArrLink = rows.map((item) => item.link);
    const query = {
      fileName: { $in: deleteArrLink },
    };
    await streamFileMethod.deleteMany(query);
    return responseSuccess(res, { status: 200 });
  }
}

const _checkFilter = (filter) => {
  // Branch is required
  if (!(filter?.branch)) {
    throw (constCommonError.COMMON("Outlet ID").NOT_SELECT);
  }

  // Supplier is required
  if (!(filter?.supplier)) {
    throw (constCommonError.COMMON("Game Brand").NOT_SELECT);
  }
}

const _generateMatchQuery = async (filter) => {
  const {
    account,
    gameCode,
    game
  } = filter;

  const [gameIds, playerIds, gameCodeIds] = await Promise.all([
    gameMethod.getGameIds(game),
    playerMethod.getPlayerIds(account),
    gameMethod.getGameCodeIds(gameCode)
  ]);

  if (Array.isArray(gameIds)) {
    filter.game = gameIds;
  }

  if (Array.isArray(playerIds)) {
    filter.account = playerIds;
  }

  if (gameCode && !gameCodeIds?.length) {
    throw (constCommonError.COMMON("Game Code").NOT_FOUND);
  }

  if (Array.isArray(gameCodeIds)) {
    filter.gameCode = gameCodeIds;
  }

  return filter;
}

const _generateBranchObj = async (filter) => {
  const {
    branch,
    siteType = [],
    category = [],
    supplier
  } = filter;
  
  let branchQuery = {};

  if (Array.isArray(branch)) {
    branchQuery.platform = { $in: toObjectIdArray(branch) };
  }

  const siteTypeMatch = siteType?.length
      ? { _id: { $in: toObjectIdArray(siteType) } }
      : {};
  const categoryMatch = category?.length
      ? { _id: { $in: toObjectIdArray(category) } }
      : {};
  const supplierMatch = supplier?.length
      ? { _id: { $in: toObjectIdArray(supplier) } }
      : {};

  const branches = await _getBranches(
      branchQuery,
      siteTypeMatch,
      categoryMatch,
      supplierMatch,
  );

  return _generateBranchObjects(branches);
}

const _getBranches = async (branchQuery, siteTypeMatch, categoryMatch, supplierMatch) => {
  const projection = {};
  const populateField = "siteType";
  const populateOptions = {
    path: "siteType",
    match: siteTypeMatch,
    select: { name: 1 },
    populate: {
      model: dbModel.category,
      path: "category",
      match: categoryMatch,
      select: { name: 1 },
      populate: {
        model: dbModel.supplier,
        path: "supplier",
        match: supplierMatch,
        select: { name: 1 },
      },
    },
  };

  return branchMethod.find(
    branchQuery,
    projection,
    populateField,
    populateOptions,
  );
};

const _generateBranchObjects = (branches) => {
  const branchObj = {};

  for (const branch of branches) {
    for (const siteType of branch.siteType) {
      for (const category of siteType.category) {
        for (const suppliers of category.supplier) {
          let key = String(branch.platform) + String(suppliers._id);
          branchObj[key] = {
            branch: branch.name,
            siteType: siteType.name,
            category: category.name,
            supplier: suppliers.name,
            branchObjId: branch.platform,
            supplierObjId: suppliers._id
          };
        }
      }
    }
  }

  return branchObj;
}

const billReportController = new BillReportController();
module.exports = billReportController;
