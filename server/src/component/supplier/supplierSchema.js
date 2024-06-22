const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    //simplified providerId
    providerId: { type: String, unique: true/*index: true*/ },
    name: { type: String, unique: true, required: true },
    nickName: { type: String },
    prefix: { type: String, default: "" },
    code: { type: String, required: true, unique: true/*index: true*/ },
    status: { type: Number, default: 1 },
    //canChangePassword - 1.Yes, 2.No
    canChangePassword: { type: Number },
    //run time status
    runTimeStatus: { type: Number, default: 1 },
    description: String,
    //daily settlement time, hour(0-23) Minutes(0-59)
    dailySettlementHour: { type: Number, min: 0, max: 23, required: false, default: 0 },
    dailySettlementMinute: { type: Number, min: 0, max: 59, required: false, default: 0 },
    //settlement status, daily settlement, weekly settlement or ready
    settlementStatus: { type: String, default: "Ready" },
    //last daily settlement time
    lastDailySettlementTime: { type: Date },
    //store based on platformObjId eg.: {platformObjId: {processedAmount: number, totalAmount: number}}
    batchCreditTransferOutStatus: { type: JSON, default: {} },
    //game types, (CPMS save object to this type, beware)
    gameTypes: [],
    //player types
    playTypes: [{ type: String }],
    // platform specific status - { [platformId] : [status] }
    platformStatusFromCPMS: { type: JSON, default: {} },
    //same line providers id (Differentiate by platformId: Array of same Providers with this supplier)
    sameLineProviders: { type: JSON, default: {} },
    chName: { type: String, default: ""/*index: true*/ },
    needLoginShow: { type: JSON, default: {} }, // filter all games in the supplier for the platform. Usage: getGameGroupInfo, Eg: {4: true}
    creditLostAutoFixEnable: { type: Boolean, default: false }, //额度丢失自动补单开启
    // for 自動補回額度丟失功能 determine if this supplier support transfer status checking
    canCheckTransfer: { type: Number }, // 0: not available, 1: available;
    position: { type: Number }, // arrangement for supplier list priority
    transferLimitAmount: { type: Number }, // for limit the transfer amount ; if large than this amount will prompt err
    platformCreditLostFixEnable: { type: Boolean, default: false },
    singleWalletProviders: { type: JSON, default: {} },
    cantDupTransfer: { type: Number } //0 - can duplicate transfer 1 - can't duplicate 2 - can duplicate, and can check transfer
  }, {
    timestamps: true
  }
);

supplierSchema.plugin(mongoosePaginate);
module.exports = supplierSchema;
