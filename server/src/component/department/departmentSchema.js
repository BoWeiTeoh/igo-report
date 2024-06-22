const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema} = mongoose;
const departmentSchema = new Schema(
    {
        label: {type: String},
        isRoot: {type: Boolean, default: false},
        isDelete: {type: Boolean, default: false},
        name: {type: String},
        ID: {type: String},
        company: {type: Schema.Types.ObjectId, ref: "Department"},
        parent: {type: Schema.Types.ObjectId, ref: "Department"},
        path: [{type: Schema.Types.ObjectId, ref: "Department"}],
        // 数字越小，等级越大
        level: {type: Number}
    },
    {
        timestamps: true
    }
);

departmentSchema.plugin(mongoosePaginate);

module.exports = departmentSchema;
