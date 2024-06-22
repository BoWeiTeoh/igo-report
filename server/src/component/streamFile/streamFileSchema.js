const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { constStreamFileStatus } = require("../../const/constStatus");

const { Schema } = mongoose;
const streamFileSchema = new Schema(
  {
    query: { type: JSON },
    fileName: { type: String, unique: true },
    skipLimit: { type: Number },
    prefix: { type: String, index: true },
    status: { type: Number, default: constStreamFileStatus.PROCESSING },
    percentage: { type: Number, default: 0 },
    branchObj: { type: JSON }
  },
  {
    timestamps: true
  }
);

streamFileSchema.plugin(mongoosePaginate);
module.exports = streamFileSchema;