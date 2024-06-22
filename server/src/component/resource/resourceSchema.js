const mongoose = require("mongoose");
const connectToDb = require("../../db/connect");
const paginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  }
});

resourceSchema.plugin(paginate);
module.exports = resourceSchema;
