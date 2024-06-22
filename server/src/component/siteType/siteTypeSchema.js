const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const siteTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category"
      }
    ]
  },
  {
    timestamps: true
  }
);


siteTypeSchema.plugin(mongoosePaginate);
module.exports = siteTypeSchema;
