const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    ID: { type: Number, unique: true },
    userID: { type: String, unique: true },
    username: { type: String, required: true, index: true },
    password: { type: String, required: true, select: false },
    roles: { type: Schema.Types.ObjectId, ref: "Role", required: false, index: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    updater: { type: Schema.Types.ObjectId, ref: "User" },
    isDelete: { type: Boolean, default: false },
    state: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    isRoot: { type: Boolean, default: false },
    remark: { type: String }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(mongoosePaginate);

module.exports = userSchema;
