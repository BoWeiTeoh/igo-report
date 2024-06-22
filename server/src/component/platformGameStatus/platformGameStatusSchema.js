const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platformGameStatusSchema = new Schema({
  // platform obj id
  platform: {type: Schema.ObjectId, ref: 'platform'},
  // game obj id
  game: {type: Schema.ObjectId, ref: 'game'},
  // platform game name
  name: {type: String, required: true},
  // platform game status
  status: {type: Number},
  // big Game Icon
  bigShow: String,
  // small game icon
  smallShow: String,
  // if game is visible
  visible: {type: Boolean, default: false},
  // game display order for a client
  displayOrder: {type: String},
  // maintenance time, hour(0-23) Minutes(0-59)
  maintenanceHour: {type: Number, min: 0, max: 23, default: null},
  maintenanceMinute: {type: Number, min: 0, max: 59, default: null}
});

module.exports = platformGameStatusSchema;
