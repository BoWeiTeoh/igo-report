const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const configSchema = new Schema(
  {
    setting: { type: String, unique: true, required: true },
    value: { type: Number },
    type: { type: Number },
  },
  {
    timestamps: true,
  },
);

configSchema.plugin(mongoosePaginate);
module.exports = configSchema;
