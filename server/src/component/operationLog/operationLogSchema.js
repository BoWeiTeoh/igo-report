const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { constOperationLogOperation } = require("../../const/constOperationLog");

const { Schema } = mongoose;
const operationLogSchema = new Schema(
  {
    title: {
      type: String,
      index: true,
    },
    desc: {
      type: String,
    },
    operation: {
      type: String,
      enum: Object.values(constOperationLogOperation),
    },
    fnc: {
      type: String,
    },
    api: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      index: true,
    },
    data: {
      type: [
        {
          key: String,
          oriValue: String,
          newValue: String,
        },
      ],
      index: true,
    },
    requestId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
operationLogSchema.index({ createdAt: 1 });

operationLogSchema.plugin(mongoosePaginate);
module.exports = operationLogSchema;
