const dbModel = require("../db/dbModel");
const utilExport = require("../helper/utilExport");
const { ObjectId } = require("../helper/utilCustom");
const consumptionMethod = require("../component/playerConsumptionRecord/playerConsumptionRecordMethod");
const utilDate = require("../helper/utilDate");
const streamFileMethod = require("../component/streamFile/streamFileMethod");
const { constStreamFileStatus } = require("../const/constStatus");
const systemStatusMethod = require("../component/systemStatus/systemStatusMethod");
const configMethod = require("../component/config/configMethod");
const {constConfig} = require("../const/constConfig");
const {logger} = require("../helper/utilPinoLogger");

class BillReportController {
  async generateBillExport(req, res) {
    try {
      let { fileName, skipLimit, query, branchObj, filter } = req.body;
      try {
        if (filter && typeof filter === "string") {
          filter = JSON.parse(filter);
        }
      } catch (err) {
        console.log("ERR ERR", err);
      }

      const fileNameForUpdateStatus = fileName + ".zip";
      const headerRows = {
        data: {
          "Player ID": "Player ID",
          "Account": "Account",
          "Bill No": "Bill No",
          "Game Code": "Game Code",
          "Bill Time": "Bill Time",
          "Payout Time": "Payout Time",
          "Game": "Game",
          "Bet": "Bet",
          "Turnover": "Turnover",
          "Win/Lose": "Win / Lose",
          "Payout": "Payout",
          "Channel Type": "Channel Type"
        },
        origin: "A8"
      };

      if (filter?.report === "Balance Record") {
        headerRows.data["Before Bet"] = "Before Bet";
        headerRows.data["Transaction Type"] = "Transaction Type";
        headerRows.data["Expense"] = "Expense";
        headerRows.data["Income"] = "Income";
        headerRows.data["Running Balance"] = "Running Balance";
      }
      const headerData = [
        {
          text: (filter?.report === "Balance Record") ? "BALANCE RECORD" : "TRANSACTION REPORT",
          origin: "A1"
        },
        {
          text: "Outlet ID: ",
          origin: "A3"
        },
        {
          text: "Site Type: ",
          origin: "A4"
        },
        {
          text: "Platform Code: ",
          origin: "A5"
        },
        {
          text: "Game Brand: ",
          origin: "A6"
        },
        {
          text: branchObj?.branch,
          origin: "B3"
        },
        {
          text: branchObj?.siteType,
          origin: "B4"
        },
        {
          text: branchObj?.category,
          origin: "B5"
        },
        {
          text: branchObj?.supplier,
          origin: "B6"
        }
      ];
      await utilExport.createExportFile(fileName, headerRows, headerData);

      const consumptionQuery = {
        platformId: ObjectId(query?.platformId),
        providerId: ObjectId(query?.providerId),
        createTime: {
          $gte: new Date(query?.startTime),
          $lt: new Date(query?.endTime)
        }
      };

      const consumptionProject = {
        _id: 0,
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
        "details": 1,
      };

      const EXPORT_LIMIT_TRANSACTION_REPORT = await configMethod.getValue(constConfig.EXPORT_LIMIT_TRANSACTION_REPORT);
      const BATCH_EXPORT = await configMethod.getValue(constConfig.BATCH_EXPORT);

      const batchSize = Number(EXPORT_LIMIT_TRANSACTION_REPORT) / Number(BATCH_EXPORT);
      const percentage = 100 / BATCH_EXPORT;
      for (let i = 0; i < BATCH_EXPORT; i++) {
        const skipLimitByBatch = skipLimit + (i * batchSize);

        streamFileMethod.updateOne({ fileName: fileNameForUpdateStatus }, { status: constStreamFileStatus.SEARCHING }).catch(err => {
          logger.info({"Searching Fail": err});
        });
        const consumptionRecord = await consumptionMethod.aggregate(consumptionQuery, consumptionProject, null, null, null, batchSize, skipLimitByBatch);

        streamFileMethod.updateOne({ fileName: fileNameForUpdateStatus }, { status: constStreamFileStatus.MAPPING }).catch(err => {
          logger.info({"MAPPING Fail": err});
        });

        if (consumptionRecord?.length) {
          const processesData = await billReportController.processExportData(consumptionRecord, filter);

          streamFileMethod.updateOne({ fileName: fileNameForUpdateStatus }, {
            status: constStreamFileStatus.APPENDING,
            $inc: { percentage: percentage }
          }).catch(err => {
            logger.error({"APPENDING Fail": err});
          });
          await utilExport.generateExportData(processesData, fileName);

        }
      }

      streamFileMethod.updateOne({ fileName: fileNameForUpdateStatus }, { status: constStreamFileStatus.UPLOADING }).catch(err => {
        logger.error({"UPLOADING Fail": err});
      });
      await utilExport.exportDataByFile(fileName).catch(e => {
        logger.error({"ExportBillReportByFile": e});
      });

      streamFileMethod.findOneAndUpdate({ fileName: fileNameForUpdateStatus }, { status: constStreamFileStatus.SUCCESS }, { new: true }).then(
        async successFile => {
          if (successFile?.prefix) {
            const fileQuery = {
              prefix: successFile.prefix,
              status: { $gte: constStreamFileStatus.PROCESSING, $lt: constStreamFileStatus.SUCCESS }
            };
            const fileProcessing = await streamFileMethod.findOne(fileQuery);

            if (!fileProcessing) {
              systemStatusMethod.updateStatus(false).catch();
            }
          }
        }
      ).catch(err => {
        logger.error({"SUCCESS Fail": err});
      });
      return res.json({ status: 200 });
    } catch (error) {
      logger.error({"GenerateBillExport ERR": error});
      return res.json({ msg: error });
    }
  }

  async processExportData(consumptionRecord, filter) {
    consumptionRecord = await dbModel.player.populate(consumptionRecord, {
      path: "playerId",
      select: { name: 1, playerId: 1 }
    });

    consumptionRecord = await dbModel.game.populate(consumptionRecord, {
      path: "gameId",
      select: { name: 1, code: 1, regionName: 1 }
    });

    consumptionRecord = consumptionRecord.map(item => {
      switch (item?.details?.channel_type) {
        case "LB":
          item.channelType = "Landbase";
          break;
        case "RGP":
        default:
          item.channelType = "RGP";
      }

      let returnData = {
        "ID": item?.playerId?.playerId,
        "Account": item?.playerId?.name,
        "Bill No": item?.orderNo,
        "Game Code": item?.gameId?.code,
        "Bill Time": utilDate.getDateTzISOString(item?.createTime),
        "Payout Time": item?.settlementTime ? utilDate.getDateTzISOString(item?.settlementTime) : "",
        "Game": item?.gameId?.regionName?.EN || item?.gameId?.name,
        "Bet": item?.amount,
        "Turnover": item?.validAmount,
        "Win/Lose": item?.bonusAmount,
        "Payout": item?.amount + item?.bonusAmount,
        "Channel Type": item?.channelType
      }

      if (filter?.report === "Balance Record") {
        if (item?.bonusAmount >= 0) {
          returnData["Before Bet"] = item?.details?.creditAfterBet ? Number(item.details.creditAfterBet).toFixed(2) : '0';
          returnData["Transaction Type"] = "Payout";
          returnData["Expense"] = item.amount;
        } else {
          returnData["Before Bet"] = item?.details?.initialAmount ? Number(item.details.initialAmount).toFixed(2) : '0';
          returnData["Transaction Type"] = "Bet";
          returnData["Expense"] = item.bonusAmount;
        }
        returnData["Income"] = item.bonusAmount > 0 ? item.bonusAmount : '';
        returnData["Running Balance"] = item?.details?.creditAfterPayout ? Number(item.details.creditAfterPayout).toFixed(2) : '0';
      }

      return returnData;
    });

    return consumptionRecord;
  }
}

const billReportController = new BillReportController();
module.exports = billReportController;