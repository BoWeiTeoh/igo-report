const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameTypeSchema = new Schema({
  gameTypeId: { type: String },
  code: { type: String },
  name: { type: String },
  description: { type: String }
});

module.exports = gameTypeSchema;