const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const systemStatusSchema = new Schema(
  {
    isGenerate: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

systemStatusSchema.plugin(mongoosePaginate);
module.exports = systemStatusSchema;
