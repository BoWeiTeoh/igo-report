const consumptionMethod = require("../component/playerConsumptionRecord/playerConsumptionRecordMethod");
const { ObjectId } = require("../helper/utilCustom");
const consumptionSummaryMethod = require("../component/consumptionSummary/consumptionSummaryMethod");
const consumptionSummaryListMethod = require("../component/consumptionSummaryList/consumptionSummaryListMethod");
const { handleBillReportQuery } = require("../common/commonReport");

class ConsumptionController {
  async searchAggregate(req, res) {
    try {
      const processQuery = handleBillReportQuery(req?.body);

      const projectQuery = {
        amount: 1,
        validAmount: 1,
        bonusAmount: 1
      };

      const groupQuery = {
        _id: null,
        totalAmount: { $sum: "$amount" },
        totalValidAmount: { $sum: "$validAmount" },
        totalBonusAmount: { $sum: "$bonusAmount" },
        totalCount: { $sum: 1 }
      };

      let consumptionRecord = await consumptionMethod.aggregate(
        processQuery,
        projectQuery,
        groupQuery,
      );

      return res.json(consumptionRecord);
    } catch (e) {
      console.log(
        "REQUEST ID : ",
        req?.requestId,
        "BODY : ",
        req?.body,
        "Consumption Settlement ERR",
        e,
      );
    }
  }

  async summaryAggregate(req, res) {
    try {
      // todo 代码太难看了，不应该前面处理好再传过来，应该传过来后处理
      const { matchQuery, projectQuery, groupQuery, updateQuery, listId } = req?.body;

      let processMatchQuery = {};
      let processUpdateQuery = {};
      let processListId = ObjectId(listId);

      if (matchQuery?.platformId) {
        processMatchQuery.platformId = ObjectId(matchQuery?.platformId);
      }

      if (matchQuery?.providerId) {
        processMatchQuery.providerId = ObjectId(matchQuery?.providerId);
      }

      if (matchQuery?.createTime) {
        processMatchQuery.createTime = {
          $gte: new Date(matchQuery?.createTime?.$gte),
          $lt: new Date(matchQuery?.createTime?.$lt),
        };
      }

      if (updateQuery?.platform) {
        processUpdateQuery.platform = ObjectId(updateQuery?.platform);
      }

      if (updateQuery?.supplier) {
        processUpdateQuery.supplier = ObjectId(updateQuery?.supplier);
      }

      if (updateQuery?.betTime) {
        processUpdateQuery.betTime = new Date(updateQuery?.betTime);
      }

      let consumptionRecord = await consumptionMethod.aggregate(
        processMatchQuery,
        projectQuery,
        groupQuery,
      );

      let updateData = {
        $set: {
          amount: consumptionRecord?.[0]?.amount || 0,
          validAmount: consumptionRecord?.[0]?.validAmount || 0,
          bonusAmount: consumptionRecord?.[0]?.bonusAmount || 0,
          count: consumptionRecord?.[0]?.count || 0,
          lbAmount: consumptionRecord?.[0]?.lbAmount || 0,
          lbValidAmount: consumptionRecord?.[0]?.lbValidAmount || 0,
          lbBonusAmount: consumptionRecord?.[0]?.lbBonusAmount || 0,
          lbCount: consumptionRecord?.[0]?.lbCount || 0,
        }
      };

      console.log("summaryAggregate Request Id : ", req?.requestId);
      console.log(processUpdateQuery?.betTime, "consumptionRecord consumptionRecord", updateData);
      
      let count = await consumptionSummaryMethod.count(processUpdateQuery);
      if (count > 1) {
        await consumptionSummaryMethod.deleteMany(processUpdateQuery);
      }
      await consumptionSummaryMethod.updateOne(processUpdateQuery, updateData, { upsert: true });
      await consumptionSummaryListMethod.updateOne({ _id: processListId }, { isSettle: true });

      console.log("DONE summaryAggregate Request Id : ", req?.requestId);
      return res.json({status: 200});
    } catch (e) {
      console.log("summaryAggregate CHECK E", e);
    }
  }
}

const consumptionController = new ConsumptionController();
module.exports = consumptionController;
