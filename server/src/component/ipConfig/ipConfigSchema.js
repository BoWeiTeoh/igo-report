const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const ipConfigSchema = new Schema(
  {
    ipAddress: { type: String },
    detail: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    updater: { type: Schema.Types.ObjectId, ref: "User" },
    isDelete: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

ipConfigSchema.plugin(mongoosePaginate);
module.exports = ipConfigSchema;
