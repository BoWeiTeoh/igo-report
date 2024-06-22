const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const roleSchema = new Schema(
  {
    ID: { type: Number, required: true, unique: true },
    roleID: { type: String, unique: true },
    roleName: { type: String, required: true, index: true },
    remark: { type: String },
    // define show in a user option
    state: { type: Boolean, default: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    updater: { type: Schema.Types.ObjectId, ref: "User" },
    // state define show in role manage page
    isDelete: { type: Boolean, default: false },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    branches: [
      {
        type: Schema.Types.ObjectId,
        ref: "platform",
      },
    ],
    siteTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: "SiteType",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    suppliers: [
      {
        type: Schema.Types.ObjectId,
        ref: "gameProvider",
      },
    ],
    department: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  {
    timestamps: true,
  },
);

roleSchema.plugin(mongoosePaginate);
module.exports = roleSchema;
