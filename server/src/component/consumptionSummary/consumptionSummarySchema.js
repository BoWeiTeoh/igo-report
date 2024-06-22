const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const consumptionSummarySchema = new Schema(
  {
    platform: { type: Schema.Types.ObjectId, ref: "platform", require: true },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "gameProvider",
      require: true,
    },
    // 结算的时间 , 结算的是FPMS玩家下注的时间
    betTime: { type: Date, require: true },
    amount: { type: Number, default: 0 },
    validAmount: { type: Number, default: 0 },
    bonusAmount: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    lbAmount: { type: Number, default: 0 },
    lbValidAmount: { type: Number, default: 0 },
    lbBonusAmount: { type: Number, default: 0 },
    lbCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

consumptionSummarySchema.index({ betTime: 1, supplier: 1, platform: 1 }, { unique: true });

consumptionSummarySchema.plugin(mongoosePaginate);
module.exports = consumptionSummarySchema;
