const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const restartLogSchema = new Schema(
    {
        service: {type: String},
        instance: {type: String}
    },
    {
        timestamps: true
    }
);

restartLogSchema.plugin(mongoosePaginate);
module.exports = restartLogSchema;