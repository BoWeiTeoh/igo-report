const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const proposalTypeSchema = new Schema({
  platformId: { type: Schema.Types.ObjectId, required: true /*index: true*/ },
  name: { type: String, required: true /*index: true*/ },
  process: { type: Schema.Types.ObjectId},
  executionType: String,
  rejectionType: String,
  expirationDuration: { type: Number, default: 0 }
});

proposalTypeSchema.plugin(mongoosePaginate);

module.exports = proposalTypeSchema;
