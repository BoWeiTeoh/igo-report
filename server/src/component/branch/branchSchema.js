const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const branchSchema = new Schema(
  {
    platform: { type: Schema.Types.ObjectId, ref: "platform" },
    name: { type: String },
    siteType: [
      {
        type: Schema.Types.ObjectId,
        ref: "SiteType"
      }
    ]
  },
  {
    timestamps: true
  }
);


branchSchema.plugin(mongoosePaginate);
module.exports = branchSchema;
