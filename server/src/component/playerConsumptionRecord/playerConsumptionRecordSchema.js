const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const playerConsumptionRecordSchema = new Schema({
  //player id
  playerId: { type: Schema.ObjectId },
  //player's current partnerObjId
  partnerId: { type: Schema.ObjectId },
  // platform Id
  platformId: { type: Schema.ObjectId },
  // provider ID
  providerId: { type: Schema.ObjectId },
  // game ID
  gameId: { type: Schema.ObjectId },
  // game type
  gameType: { type: String },
  // cp game type
  cpGameType: { type: String },
  // bet type
  betType: { type: String },
  // gameRound
  roundNo: { type: String },
  // gameRound
  playNo: { type: String },
  // payment time
  createTime: { type: Date, default: Date.now },
  //total amount for statistics
  amount: { type: Number, required: true, default: 0 },
  //total amount for statistics
  validAmount: { type: Number, required: true, default: 0 },
  //order time
  orderTime: { type: Date },
  //order id
  orderNo: { type: String, unique: true },
  //bonus amount
  bonusAmount: { type: Number, default: 0 },
  //commissionable amount
  commissionAmount: { type: Number, default: 0 },
  //content detail
  content: { type: String },
  //result
  result: { type: String },
  //player detail
  playDetail: { type: String },
  //settlement time
  settlementTime: { type: Date },
  //has been used for which reward type
  usedType: { type: String },
  // had been used for which reward event
  usedEvent: [{ type: Schema.ObjectId }],
  // had been used for which task id
  usedTaskId: { type: Schema.ObjectId },
  // had been used for which proposal
  usedProposal: { type: Schema.ObjectId },
  //check if record has been used for other reward
  bDirty: { type: Boolean, default: false },
  // check if record is duplicate
  isDuplicate: { type: Boolean, default: false },
  // record insert time
  insertTime: { type: Date, default: Date.now },
  // last update time
  updateTime: { type: Date, default: Date.now },
  // source for dba
  source: { type: String },
  // Number of comsumption (compressed records)
  count: { type: Number, default: 1 },
  // win ratio (bonusAmount / validAmount)
  winRatio: { type: Number },
  // seperate bet type and bet amount for EA and EBET
  betDetails: { type: [] },
  // whether is real player or test player
  isTestPlayer: { type: Boolean, default: false },
  // is stress test player
  isStressTestPlayer: { type: Boolean, default: false },
  // constPlayerLoginDevice
  loginDevice: { type: String },
  // Flag of shadow account to use usdt 
  isShadowAccount: { type: Boolean, default: false },
  // USDT To RMB Ratio 1 USDT : x RMB
  USDTToRMBRatio: { type: Number },
  // Flag of consumption record is updated before (for singleWallet usage)
  isUpdated: { type: Boolean, default: false },
  // insert time flag to prevent concurrency
  updateFlagTime: { type: Date },
  // do not touch this field (workaround to add unique index for orderNo only
  uniqueIndex: { type: Boolean, default: true },
  betAmount: {
    RTG: { type: Number, default: 0 },
    validCredit: { type: Number, default: 0 },
    USDTToRMBRatio: { type: Number, default: 1 },
    isFreeProvider: { type: Boolean, default: false }
  },
  details: { type: JSON, default: {} },
  // isFromCertifiedGame: {type: Boolean, default: true}
});

playerConsumptionRecordSchema.plugin(mongoosePaginate);
module.exports = playerConsumptionRecordSchema;
