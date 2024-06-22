const { responseError, responseSuccess } = require("../../helper/utilController.js");
const dbModel = require("../../db/dbModel");
const utilController = require("../../helper/utilController");
const branchMethod = require("../branch/branchMethod");
const consumptionSummaryMethod = require("../consumptionSummary/consumptionSummaryMethod");
const utilsCustom = require("../../helper/utilCustom");
const utilExport = require("../../helper/utilExport");
const utilDate = require("../../helper/utilDate.js");
const categoryMethod = require("../category/categoryMethod");
const playerConsumptionRecordMethod = require("../playerConsumptionRecord/playerConsumptionRecordMethod");
const { ObjectId } = require("../../helper/utilCustom");
const { constCommonError} = require("../../const/constErrorCode");
const utilNumber = require("../../helper/utilNumber");

class DailyReportController {
  async getBranches(query, siteType, category, supplier) {
    const projection = {};
    const populateField = "siteType";
    const populateOptions = {
      path: "siteType",
      match: { _id: { $in: siteType } },
      select: { category: 1, name: 1 },
      populate: {
        model: dbModel.category,
        path: "category",
        match: { _id: { $in: category } },
        select: { supplier: 1, name: 1 },
        populate: {
          model: dbModel.supplier,
          path: "supplier",
          match: { _id: { $in: supplier } },
          select: { name: 1 }
        }
      }
    };

    return await branchMethod.find(query, projection, populateField, populateOptions);
  }

  createObjBranch(branches) {
    const objBranch = {};
    for (const branch of branches) {
      for (const siteType of branch.siteType) {
        for (const category of siteType.category) {
          for (const suppliers of category.supplier) {
            const key = String(branch.platform) + String(suppliers._id);
            objBranch[key] = {
              platformObjId: branch.platform,
              branch: branch.name,
              siteType: siteType.name,
              category: category.name,
              supplierObjId: suppliers._id,
              supplier: suppliers.name
            };
          }
        }
      }
    }
    return objBranch;
  }

  updateSummaryWithLastHour(summary, lastHourConsumption, todayStart) {
    for (const key in lastHourConsumption) {
      const consumptionData = lastHourConsumption[key];
      const supplier = consumptionData?._id?.supplier;
      const platform = consumptionData?._id?.platform;
      let index = summary.findIndex(item => String(item?._id.supplier) === String(supplier) && String(item?._id.platform) === platform && new Date(item?._id?.date) >= todayStart);

      if (index > -1) {
        summary[index].amount += Number(consumptionData?.amount.toFixed(3));
        summary[index].validAmount += Number(consumptionData?.validAmount.toFixed(3));
        summary[index].bonusAmount += Number(consumptionData?.bonusAmount.toFixed(3));
        summary[index].count += consumptionData?.count
      } else {
        summary.push({
          _id: {
            date: todayStart.toLocaleDateString("en-CA"),
            supplier: supplier,
            platform: platform
          },
          amount: Number(consumptionData?.amount.toFixed(3)),
          validAmount: Number(consumptionData?.validAmount.toFixed(3)),
          bonusAmount: Number(consumptionData?.bonusAmount.toFixed(3)),
          count: consumptionData?.count
        });
      }
    }

    return summary;
  }

  calculateSummaryAmounts(result, objBranch, startIndex, isExport) {
    const arr = [];
    let total = { amount: 0, validAmount: 0, bonusAmount: 0, count: 0 };
    let ID = startIndex + 1;

    for (const summaryData of result) {
      const key = String(summaryData?._id?.platform) + String(summaryData?._id?.supplier);
      let obj = {
        branch: objBranch[key]?.branch,
        siteType: objBranch[key]?.siteType,
        category: objBranch[key]?.category,
        supplier: objBranch[key]?.supplier,
        amount: Number(summaryData?.amount.toFixed(3)),
        validAmount: Number(summaryData?.validAmount.toFixed(3)),
        bonusAmount: Number(summaryData?.bonusAmount.toFixed(3)),
        count: summaryData?.count,
        betTime: new Date(summaryData?._id?.date)
      };

      if (!isExport) {
        obj.ID = ID++;
      }

      arr.push(obj);

      total.amount += Number(summaryData?.amount.toFixed(3));
      total.validAmount += Number(summaryData?.validAmount.toFixed(3));
      total.bonusAmount += Number(summaryData?.bonusAmount.toFixed(3));
      total.count += summaryData?.count || 0;
    }

    return { arr, total };
  }

  async combineSummaryAmounts(summaryList) {
    // Create a map to store the sums
    const sumMap = new Map();

    // Iterate over the data array
    summaryList.forEach(item => {
      const key = JSON.stringify(item._id); // Creating a unique key for each combination
      // Check if the key already exists in the map
      if (sumMap.has(key)) {
        // If yes, add the corresponding amounts to the existing sums
        const currentSums = sumMap.get(key);
        currentSums.amount += Number(item.amount.toFixed(3)) || 0;
        currentSums.validAmount += Number(item.validAmount.toFixed(3)) || 0; // Make sure to handle undefined validAmount
        currentSums.bonusAmount += Number(item.bonusAmount.toFixed(3)) || 0; // Make sure to handle undefined bonusAmount
        currentSums.count += item.count || 0; // Make sure to handle undefined bonusAmount

      } else {
        // If no, create a new entry in the map with the amounts
        sumMap.set(key, {
          _id: item._id,
          amount: Number(item.amount.toFixed(3)) || 0,
          validAmount: Number(item.validAmount.toFixed(3)) || 0,
          bonusAmount: Number(item.bonusAmount.toFixed(3)) || 0,
          count: item.count || 0,
        });
      }
    });

    // Convert the map back to an array of objects
    const result = Array.from(sumMap, ([key, sums]) => ({
      _id: JSON.parse(key, (key2, value) => {
        if (key2 === "supplier" || key2 === "platform") {
          // Convert the string representation of ObjectId to ObjectId instance
          return ObjectId(value);
        }
        return value;
      }),
      amount: Number(sums.amount.toFixed(3)),
      validAmount: Number(sums.validAmount.toFixed(3)),
      bonusAmount: Number(sums.bonusAmount.toFixed(3)),
      count: sums.count,
    }));
    return result;

  }

  async onGet(req, res) {
    try {
      const { paginate = {}, filter } = utilController?.parseQuery(req.query);
      let { betTime, category, siteType, branch, supplier,channelType } = filter;
      const { page = 1, limit = 10, isExport } = paginate;
      utilController.checkFilterDate(betTime);
      let matchQuery = {};
      let lastHourConsumption;
      let suppliers = [];
      let startIndex = (page - 1) * limit;
      let endIndex = startIndex + limit;
      if (isExport) {
        startIndex = 0;
        endIndex = 10000;
      }
      let todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (branch) {
        matchQuery.platform = { $in: branch.map(item => utilsCustom.toObjectId(item)) };
      }

      if (category) {
        suppliers = await categoryMethod.getCategorySuppliers(category);
        matchQuery.supplier = { $in: [...new Set(suppliers)] };
      }

      if (supplier) {
        matchQuery.supplier = { $in: supplier.map(item => utilsCustom.toObjectId(item)) };
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
              betTime: 1,
              amount: "$lbAmount",
              validAmount: "$lbValidAmount",
              bonusAmount: "$lbBonusAmount",
              count: "$lbCount"
            }
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
              betTime: 1,
              amount: {
                $subtract: [
                  "$amount",
                  { $ifNull: ["$lbAmount", 0] } // Set lbAmount to 0 if it is null or missing
                ]
              },
              validAmount: {
                $subtract: [
                  "$validAmount",
                  { $ifNull: ["$lbValidAmount", 0] } // Set lbValidAmount to 0 if it is null or missing
                ]
              },
              bonusAmount: {
                $subtract: [
                  "$bonusAmount",
                  { $ifNull: ["$lbBonusAmount", 0] } // Set lbBonusAmount to 0 if it is null or missing
                ]
              },
              count: {
                $subtract: [
                  "$count",
                  { $ifNull: ["$lbCount", 0] } // Set lbCount to 0 if it is null or missing
                ]
              },
            };

            break;
        }
      }

      const groupQuery = {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$betTime",
              timezone: "+0800"
            }
          },
          supplier: "$supplier",
          platform: "$platform"
        },
        amount: { $sum: "$amount" },
        validAmount: { $sum: "$validAmount" },
        bonusAmount: { $sum: "$bonusAmount" },
        count: { $sum: "$count" }
      };

      lastHourConsumption = await playerConsumptionRecordMethod.getLastHourConsumption(matchQuery, betTime);

      // TODO 这里需要优化，赶着应付pagcor
      delete matchQuery["details.channel_type"];
      delete matchQuery.$or;
      let summary = await consumptionSummaryMethod.aggregate(matchQuery, groupQuery, projectQuery);
      let query = {};
      if (branch) {
        query.platform = { $in: branch };
      }
      const branches = await dailyReportController.getBranches(query, siteType, category, supplier);

      const objBranch = dailyReportController.createObjBranch(branches);

      summary = dailyReportController.updateSummaryWithLastHour(summary, lastHourConsumption, todayStart);

      let tempResult = [];
      for (let property in objBranch) {
        const { platformObjId, supplierObjId } = objBranch[property];

        let selectedStartTime = new Date(betTime.startTime);
        let selectedEndTime = new Date(betTime.endTime);

        for (let tempDate = selectedStartTime; tempDate < selectedEndTime; tempDate.setDate(tempDate.getDate() + 1)) {
          let dd = utilDate.getDateTzISOString(tempDate, "Asia/Kuala_Lumpur", "YYYY-MM-DD");
          let filter = summary.filter(item => item?._id?.date === dd && item?._id?.platform.equals(platformObjId) && item?._id?.supplier.equals(supplierObjId));
          if (filter.length > 0) {
            filter.forEach(item => {
              tempResult.push({
                _id: {
                  date: dd,
                  supplier: item?._id?.supplier,
                  platform: item?._id?.platform
                },
                amount: item?.amount,
                validAmount: item?.validAmount,
                bonusAmount: item?.bonusAmount,
                count: item?.count
              });
            });
          } else {
            // If no record in db (summary), will manually add fake 0 0 0 0 record
            tempResult.push({
              _id: {
                date: dd,
                supplier: supplierObjId,
                platform: platformObjId
              },
              amount: 0,
              validAmount: 0,
              bonusAmount: 0,
              count: 0
            });
          }
        }
      }

      summary = tempResult;
      summary.sort((a, b) => {
        if (String(a?._id.supplier) === String(b?._id.supplier)) {
          return new Date(a._id.date) - new Date(b?._id.date);
        }
        return String(a?._id.supplier) > String(b?._id.supplier) ? 1 : -1;
      });
      summary = await dailyReportController.combineSummaryAmounts(summary);
      let result = summary.slice(startIndex, endIndex);

      const { arr, total } = dailyReportController.calculateSummaryAmounts(result, objBranch, startIndex, isExport);
      const response = {
        data: arr,
        total: total,
        totalDocs: summary.length,
        totalPages: Math.ceil(summary.length / limit),
        limit: limit,
        page: page
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
      const response = await dailyReportController.onGet(req, res);
      if (!response?.data?.length){
        throw (constCommonError.COMMON().NO_DATA);
      }
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
          "Outlet ID": item?.branch,
          SiteType: item?.siteType,
          "Platform Code": item?.category,
          "Game Brand": item?.supplier,
          Date: item?.betTime,
          Bet: utilNumber.formatDecimal(item?.amount),
          Turnover: utilNumber.formatDecimal(item?.validAmount),
          Payout: utilNumber.formatDecimal((item?.amount + item?.bonusAmount)),
          "Win/Lose": utilNumber.formatDecimal(item?.bonusAmount),
          Count: item?.count
        };
      });

      const fileName = "dailyReport" + " - " + String(req?.authClaims?.u);

      const exportData = await utilExport.exportData(result, fileName);

      return responseSuccess(res, exportData);

    } catch (e) {
      return responseError(res, e);
    }
  }
}

const dailyReportController = new DailyReportController();
module.exports = dailyReportController;