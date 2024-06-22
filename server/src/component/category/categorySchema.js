const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    supplier: [
      {
        type: Schema.Types.ObjectId,
        ref: "provider"
      }
    ]
  },
  {
    timestamps: true
  }
);


categorySchema.plugin(mongoosePaginate);
module.exports = categorySchema;
