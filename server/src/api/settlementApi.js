const express = require("express");
const billReportSettlement = require("../settlement/billReportSettlement");
const consumptionSettlement = require("../settlement/consumptionSettlement");
const router = express.Router();

router.route("/generate/bill/export").post(billReportSettlement.generateBillExport);

router.route("/consumption/aggregate").post(consumptionSettlement.searchAggregate);

router.route("/summary/consumption/aggregate").post(consumptionSettlement.summaryAggregate);

module.exports = router;