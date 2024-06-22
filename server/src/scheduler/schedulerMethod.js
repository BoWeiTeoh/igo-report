const { getTimeRange } = require("../helper/utilDate");
const platformMethod = require("../component/platform/platformMethod");
const consumptionSummaryListMethod = require("../component/consumptionSummaryList/consumptionSummaryListMethod");
const consumptionMethod = require("../component/playerConsumptionRecord/playerConsumptionRecordMethod");
const { log } = require("../helper/utils");
const settlement = require("../settlement/settlement");
const constLogType = require("../const/constLogType");
const configMethod = require("../component/config/configMethod");
const {constConfig} = require("../const/constConfig");

const summaryConsumptionByUpdateTime = async (requestId, start, end) => {
  let updateData;
  try {
    // 每10分钟结算20分钟前的 每分钟投注数据
    let { startTime, endTime } = getTimeRange(start, end, "minute");
    startTime = new Date(startTime);
    endTime = new Date(endTime);

    const platform = await platformMethod.find({}, { gameProviders: 1 });

    const projectQuery = {
      createTime: 1
    };

    const groupQuery = {
      _id: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createTime", timezone: "+0800" } }
    };

    const projectQuery2 = {
      _id: { $dateFromString: { dateString: "$_id", format: "%Y-%m-%d %H:%M", timezone: "+0800" } }
    };

    while (startTime <= endTime) {
      const newStart = new Date(startTime);
      startTime = new Date(startTime.setTime(startTime.getTime() + 60 * 1000));
      const newEnd = new Date(startTime);
      const matchQuery = {
        updateTime: { $gte: new Date(newStart), $lt: new Date(newEnd) }
      };
      let platformLength = platform.length;
      for (let i = 0; i < platformLength; i++) {
        let providerLength = platform[i]?.gameProviders?.length;
        // need summary each platform's each provider
        for (let j = 0; j < providerLength; j++) {
          matchQuery.platformId = platform[i]?._id;
          matchQuery.providerId = platform[i]?.gameProviders[j];
          updateData = {
            platform: platform[i]?._id,
            supplier: platform[i]?.gameProviders[j]
          };

          let key = String(updateData.platform) + String(updateData.supplier);

          console.log("START Key : ", key);
          
          const consumptionRecord = await consumptionMethod.aggregate(
            matchQuery,
            projectQuery,
            groupQuery,
            projectQuery2
          );

          console.log("END Key : ", key);

          let consumptionRecordLength = consumptionRecord?.length;
          for (let k = 0; k < consumptionRecordLength; k++) {
            updateData.betTime = consumptionRecord[k]?._id;
            await consumptionSummaryListMethod.updateOne(updateData, { $set: { isSettle: false } }, { upsert: true });
          }
        }
      }
    }

    log(requestId, "Done summaryConsumptionByUpdateTime");
  } catch (err) {
    const errMsg = {
      err: `summaryConsumptionByCreateTime err : ${err}`,
      updateData
    };
    log(requestId, errMsg, constLogType.ERROR);
  }
};

const generateSummary = async () => {
  try {
    let consumptionSummaryList = await consumptionSummaryListMethod.find({ isSettle: false });

    let listLength = consumptionSummaryList.length;

    const BATCH_SCHEDULER = await configMethod.getValue(constConfig.BATCH_SCHEDULER);

    let processListLength = Math.min(BATCH_SCHEDULER, listLength);
    for (let i = 0; i < processListLength; i++) {
      let list = consumptionSummaryList[i];
      let startTime = new Date(list?.betTime);
      let endTime = new Date(list?.betTime);
      endTime.setMinutes(startTime.getMinutes() + 1);

      let matchQuery = {
        platformId: list?.platform,
        providerId: list?.supplier,
        createTime: { $gte: startTime, $lt: endTime }
      };

      let projectQuery = {
        amount: 1,
        validAmount: 1,
        bonusAmount: 1,
        "details.channel_type": 1
      };

      let groupQuery = {
        _id: null,
        amount: { $sum: "$amount" },
        validAmount: { $sum: "$validAmount" },
        bonusAmount: { $sum: "$bonusAmount" },
        count: { $sum: 1 },
        lbAmount: {
          $sum: {
            $cond: [
              { $eq: ["$details.channel_type", "LB"] }, // Condition: if $channelType is true
              "$amount",                        // Then: sum this document's amount
              0                                // Else: add zero
            ]
          }
        },
        lbValidAmount: {
          $sum: {
            $cond: [
              { $eq: ["$details.channel_type", "LB"] }, // Condition: if $channelType is true
              "$validAmount",                        // Then: sum this document's amount
              0                                // Else: add zero
            ]
          }
        },
        lbBonusAmount: {
          $sum: {
            $cond: [
              { $eq: ["$details.channel_type", "LB"] }, // Condition: if $channelType is true
              "$bonusAmount",                        // Then: sum this document's amount
              0                                // Else: add zero
            ]
          }
        },
        lbCount: {
          $sum: {
            $cond: [
              { $eq: ["$details.channel_type", "LB"] }, // Condition: if $channelType is true
              1,                        // Then: sum this document's amount
              0                                // Else: add zero
            ]
          }
        }
      };

      let updateQuery = {
        platform: list?.platform,
        supplier: list?.supplier,
        betTime: list?.betTime
      };

      settlement.generateSummaryAggregate({matchQuery, projectQuery, groupQuery, updateQuery, listId: list?._id}).catch();
    }
  } catch (err) {
    console.log("generateSummary err", err);
  }
};

const schedulerController = {
  summaryConsumptionByUpdateTime,
  generateSummary,
  // generateBillReportExportData
};
module.exports = schedulerController;