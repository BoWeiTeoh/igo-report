const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const providerGamesMinuteSummarySchema = new Schema({
    platformObjId: {type: Schema.ObjectId, ref: 'platform'},
    providerObjId: {type: Schema.ObjectId},
    tableName: {type: String},//VID or Machine
    gameType: {type: String},
    totalBetAmount: {type: Number},
    totalValidAmount: {type: Number},
    totalWinLoss: {type: Number}, // for daily report win lose
    totalExpense: {type: Number}, // for balance record
    totalExpenseCount: {type: Number}, // for balance record
    totalIncome: {type: Number}, // for balance record
    totalIncomeCount: {type: Number}, // for balance record
    totalBonusAmount: {type: Number},
    playerHeadCount: {type: Number},
    totalBetRecordCount: {type: Number},
    jackpotContribution: {type: Number},
    jackpotClaim: {type: Number},
    commissionFee: {type: Number},
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now}, // to keep track last updated time
    summaryTime: {type: Date, required: true}, //  minutes of the record
    studioId: {type: Number},
    initialJackpotAmount: {type: Number},
    roundNoArray: {type: Array, default: []},
    jackpotRoundNoArray: {type: Array, default: []} // for jackpot result
});

providerGamesMinuteSummarySchema.plugin(mongoosePaginate);
module.exports = providerGamesMinuteSummarySchema;