const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const systemConfigSchema = new Schema(
  {
    // branch: { type: Schema.Types.ObjectId, ref: "gameProvider" },
    configType: { type: String },
    config: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    updater: { type: Schema.Types.ObjectId, ref: "User" },
    // branches: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "platform"
    //   }
    // ],
    isDelete: { type: Boolean, default: false },
    detail: { type: String }
  },
  {
    timestamps: true
  }
);

systemConfigSchema.plugin(mongoosePaginate);
module.exports = systemConfigSchema;
