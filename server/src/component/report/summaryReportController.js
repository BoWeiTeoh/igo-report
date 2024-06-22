const { responseError, responseSuccess } = require("../../helper/utilController.js");
const dbModel = require("../../db/dbModel");
const utilController = require("../../helper/utilController");
const siteTypeMethod = require("../siteType/siteTypeMethod");
const branchMethod = require("../branch/branchMethod");
const consumptionSummaryMethod = require("../consumptionSummary/consumptionSummaryMethod");
const utilsCustom = require("../../helper/utilCustom");
const utilExport = require("../../helper/utilExport");
const utilNumber = require("../../helper/utilNumber");
const categoryMethod = require("../category/categoryMethod");
const playerConsumptionRecordMethod = require("../playerConsumptionRecord/playerConsumptionRecordMethod");
const adminMethod = require("../admin/adminMethod");

class SummaryReportController {
  async getSiteTypes(query, siteType, category) {
    const projection = {};
    const populateField = "category";
    const populateOptions = {
      path: "category",
      match: { _id: { $in: category } },
      select: { suppliers: 1, name: 1 },
      populate: {
        model: dbModel.supplier,
        path: "supplier"
      }
    };
    if (siteType) {
      query._id = { $in: siteType };
    }
    return await siteTypeMethod.find(query, projection, populateField, populateOptions);
  }
  async getBranches(query, siteType, category) {
    const projection = {};
    const populateField = "siteType";
    const populateOptions = {
      path: "siteType",
      match: { _id: { $in: siteType } },
      select: { siteType: 1, name: 1 },
      populate: {
        model: dbModel.category,
        path: "category",
        match: { _id: { $in: category } },
        select: { category: 1, name: 1 },
        populate: {
          model: dbModel.supplier,
          path: "supplier",
          select: { name: 1 }
        }
      }
    };

    return branchMethod.find(query, projection, populateField, populateOptions);
  }

  calculateSummaryAmounts(result, objSummary, lastHourConsumption, isExport) {
    const arr = [];
    let total = { amount: 0, validAmount: 0, bonusAmount: 0, count: 0 };
    let ID = 1;

    for (const siteType of result) {
      for (const category of siteType.category) {
        let amount = 0;
        let validAmount = 0;
        let bonusAmount = 0;
        let count = 0;

        for (const suppliers of category.supplier) {
          const supplierId = String(suppliers._id);
          let objAmount = objSummary[supplierId]?.amount || 0;
          let objValidAmount = objSummary[supplierId]?.validAmount || 0;
          let objBonusAmount = objSummary[supplierId]?.bonusAmount || 0;
          let objCount = objSummary[supplierId]?.count || 0;
          let lastHourAmount = lastHourConsumption[supplierId]?.amount || 0;
          let lastHourValidAmount = lastHourConsumption[supplierId]?.validAmount || 0;
          let lastHourBonusAmount = lastHourConsumption[supplierId]?.bonusAmount || 0;
          let lastHourCount = lastHourConsumption[supplierId]?.count || 0;
          amount += objAmount + lastHourAmount;
          validAmount += objValidAmount + lastHourValidAmount;
          bonusAmount += objBonusAmount + lastHourBonusAmount;
          count += objCount + lastHourCount;
        }

        let obj = {
          siteType: siteType?.name,
          category: category?.name,
          amount: Number(amount.toFixed(3)),
          validAmount: Number(validAmount.toFixed(3)),
          bonusAmount: Number(bonusAmount.toFixed(3)),
          count: count,
        };
        if (!isExport) {
          obj.ID = ID++;
        }
        arr.push(obj);

        total.amount += amount;
        total.validAmount += validAmount;
        total.bonusAmount += bonusAmount;
        total.count += count;
      }
    }

    return { arr, total };
  }
  calculateSummaryAmountsWithBranches(branches, objSummary, lastHourConsumption, isExport) {
    const arr = [];
    let total = { amount: 0, validAmount: 0, bonusAmount: 0, count: 0 };
    let ID = 1;

    for (const branch of branches) {
      for (const siteType of branch.siteType) {
        for (const category of siteType.category) {
          const {
            amount,
            validAmount,
            bonusAmount,
            count
          } = summaryReportController.calculateCategoryAmounts(category, branch, objSummary, lastHourConsumption);
          const obj = {
            branch: branch?.name,
            siteType: siteType?.name,
            category: category?.name,
            amount: Number(amount.toFixed(3)),
            validAmount: Number(validAmount.toFixed(3)),
            bonusAmount: Number(bonusAmount.toFixed(3)),
            count: count,
          };

          let index = arr.findIndex(item => item.category === category?.name && item.siteType === siteType?.name);
          if (index < 0) {
            if (!isExport) {
              obj.ID = ID++;
            }
            arr.push(obj);
          } else {
            arr[index].amount += amount;
            arr[index].validAmount += validAmount;
            arr[index].bonusAmount += bonusAmount;
            arr[index].count += count;
          }
          total.amount += amount;
          total.validAmount += validAmount;
          total.bonusAmount += bonusAmount;
          total.count += count;
        }
      }
    }
    return { arr, total };
  }
  calculateCategoryAmounts(category, branch, objSummary, lastHourConsumption) {
    let amount = 0, validAmount = 0, bonusAmount = 0, count = 0;

    for (const supplier of category.supplier) {
      const key = String(branch.platform) + String(supplier._id);
      let objAmount = objSummary[key]?.amount || 0;
      let objValidAmount = objSummary[key]?.validAmount || 0;
      let objBonusAmount = objSummary[key]?.bonusAmount || 0;
      let objCount = objSummary[key]?.count || 0;
      let lastHourAmount = lastHourConsumption[key]?.amount || 0;
      let lastHourValidAmount = lastHourConsumption[key]?.validAmount || 0;
      let lastHourBonusAmount = lastHourConsumption[key]?.bonusAmount || 0;
      let lastHourCount = lastHourConsumption[key]?.count || 0;
      amount += objAmount + lastHourAmount;
      validAmount += objValidAmount + lastHourValidAmount;
      bonusAmount += objBonusAmount + lastHourBonusAmount;
      count += objCount + lastHourCount;
    }
    console.log("amount----->", amount)
    return { amount, validAmount, bonusAmount, count };
  }

  async onGet(req, res) {
    const { paginate = {}, filter } = utilController?.parseQuery(req.query);
    let { betTime, category, siteType, channelType } = filter;
    const { isExport } = paginate;
    try {
      utilController.checkFilterDate(filter?.betTime);
      let matchQuery = {};
      let lastHourConsumption;
      let suppliers = [];

      let adminBranch = await adminMethod.getBranches({_id: req?.authClaims?.id});
      const roleSupplier = await adminMethod.getSupplier({_id: req?.authClaims?.id})

      let roleSuppliers = roleSupplier.map(item => item._id);
      let branch = adminBranch.map(item => item._id);
      if (branch) {
        matchQuery.platform = { $in: branch.map(item => utilsCustom.toObjectId(item)) };
      }

      if (category) {
        matchQuery.supplier = { $in: roleSuppliers.map(item => utilsCustom.toObjectId(item)) };
      }
      let projectQuery = null;

      // IGOR-167 - 170
      if (channelType) {
        switch (channelType) {
          case "LB":
            matchQuery["details.channel_type"] = channelType;
            projectQuery = {
              supplier: 1,
              platform: 1,
              amount: "$lbAmount",
              validAmount: "$lbValidAmount",
              bonusAmount: "$lbBonusAmount",
              count: "$lbCount",
            };
            break;
          case "RGP":
            matchQuery.$or = [
              { details: { $exists: false } },
              {
                "details.channel_type": { $exists: false },
              },
              { "details.channel_type": channelType },
            ];
            projectQuery = {
              supplier: 1,
              platform: 1,
              amount: {
                $subtract: [
                  "$amount",
                  { $ifNull: ["$lbAmount", 0] }, // Set lbAmount to 0 if it is null or missing
                ],
              },
              validAmount: {
                $subtract: [
                  "$validAmount",
                  { $ifNull: ["$lbValidAmount", 0] }, // Set lbValidAmount to 0 if it is null or missing
                ],
              },
              bonusAmount: {
                $subtract: [
                  "$bonusAmount",
                  { $ifNull: ["$lbBonusAmount", 0] }, // Set lbBonusAmount to 0 if it is null or missing
                ],
              },
              count: {
                $subtract: [
                  "$count",
                  { $ifNull: ["$lbCount", 0] }, // Set lbCount to 0 if it is null or missing
                ],
              },
            };
            break;
        }
      }
      lastHourConsumption = await playerConsumptionRecordMethod.getLastHourConsumption(matchQuery, betTime);
      
      const groupQuery = {
        _id: {
          supplier: "$supplier",
          platform: "$platform"
        },
        amount: { $sum: "$amount" },
        validAmount: { $sum: "$validAmount" },
        bonusAmount: { $sum: "$bonusAmount" },
        count: { $sum: "$count" }
      };

      // TODO 这里需要优化，赶着应付pagcor
      delete matchQuery["details.channel_type"];
      delete matchQuery.$or;

      const summary = await consumptionSummaryMethod.aggregate(matchQuery, groupQuery, projectQuery);
      
      let objSummary = {};
      for (const row of summary) {
        objSummary[String(row._id.platform) + String(row._id.supplier)] = row;
      }
      let query = {};
      if (branch) {
        query.platform = { $in: branch };
      }
      console.log(query)
      const branches = await summaryReportController.getBranches(query, siteType, category);
      console.log("branch---->", branches)
      const {
        arr,
        total
      } = summaryReportController.calculateSummaryAmountsWithBranches(branches, objSummary, lastHourConsumption, isExport);

      const response = {
        data: arr,
        total: total
      };
      
      if (isExport) {
        return response;
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
      utilController.checkFilterDate(filter?.betTime);
      req.query.isExport = true;
      const response = await summaryReportController.onGet(req, res);
      const lastRow = {
        category: "TOTAL",
        amount: response?.total.amount,
        validAmount: response?.total.validAmount,
        bonusAmount: response?.total.bonusAmount,
        count: response?.total?.count
      };
      const data = response?.data || [];
      data.push(lastRow);

      const result = data.map(item => {
        return {
          SiteType: item?.siteType,
          "Platform Code": item?.category,
          Bet: utilNumber.formatDecimal(item?.amount),
          Turnover: utilNumber.formatDecimal(item?.validAmount),
          Payout: utilNumber.formatDecimal(item?.amount + item?.bonusAmount),
          "Win/Lose": utilNumber.formatDecimal(item?.bonusAmount),
          Count: item?.count
        };
      });

      const fileName = "summaryReport" + " - " + String(req?.authClaims?.u);

      const exportData = await utilExport.exportData(result, fileName);

      return responseSuccess(res, exportData);

    } catch (e) {
      return responseError(res, e);
    }
  }
}

const summaryReportController = new SummaryReportController();
module.exports = summaryReportController;