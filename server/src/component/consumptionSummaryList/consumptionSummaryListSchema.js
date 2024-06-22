const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const consumptionSummaryListSchema = new Schema(
  {
    platform: { type: Schema.Types.ObjectId, ref: "platform", require: true },
    supplier: { type: Schema.Types.ObjectId, ref: "gameProvider", require: true },
    // 结算的时间 , 结算的是FPMS玩家下注的时间
    betTime: { type: Date, require: true },
    isSettle: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

consumptionSummaryListSchema.index({ betTime: 1, supplier: 1, platform: 1 }, { unique: true });

consumptionSummaryListSchema.plugin(mongoosePaginate);
module.exports = consumptionSummaryListSchema;
