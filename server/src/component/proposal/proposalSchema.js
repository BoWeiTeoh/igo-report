const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const proposalSchema = new Schema(
  {
    // unique + sparse id。没有格式，根据情况设置值
    uniqueId: { type: String, unique: true, sparse: true },
    //proposal unique id
    proposalId: { type: String },
    //proposal main type
    mainType: { type: String },
    //proposal type
    type: { type: Schema.Types.ObjectId, ref: "proposalType" },
    //creator {type(system, player or admin), name, id(shortID for player, longId for admin)
    creator: { type: JSON, default: {} },
    // create Time
    createTime: { type: Date, default: Date.now },
    //proposal process info
    process: { type: Schema.Types.ObjectId, ref: "proposalProcess" /*index: true*/ },
    //proposal data
    data: {
      type: JSON,
      default: {
        // proposalPlayerLevel                          Type =>         String
        // playerLevelName                              Type =>         String
        // proposalPlayerLevelValue                     Type =>         Int
        // playerStatus                                 Type =>         Int
        // isAutoApproval                               Type =>         Bool
        // ximaWithdrawUser                             Type =>         Int
        // creditCharge                                 Type =>         Int
        // honoreeDetail                                Type =>         String
        // currAmount                                   Type =>         Int
        // amount                                       Type =>         Int
        // platform                                     Type =>         String
        // platformId                                   Type =>'ObjectId("5a6fe1b3ec0e32dde7cc285d")' => String '0','1'           Type => ObjectId("589437c0071248f6c96d67b8") => String '5733e26ef8c8a9355caf49d8'           mainType =>PlayerBonus => Object "_id" : "7968aa5e5536d13742545382","bonusSystemType" : NumberInt( 6),"country" : "PH","name" : "Casino Plus"'
        // bonusId                                      Type =>         int
        // playerName                                   Type =>         String
        // playerObjId                                  Type =>         ObjectId
        // playerId                                     Type =>         String
        // creator                                      Type =>         Object
        // autoAuditTime                                Type =>         Double
        // autoAuditRemark                              Type =>         String
        // autoAuditRemarkChinese                       Type =>         String
        // autoAuditCheckMsg                            Type =>         String
        // detail                                       Type =>         String
        // detailChinese                                Type =>         String
        // autoAuditRepeatMsg                           Type =>         String
        // autoAuditRepeatMsgChinese                    Type =>         String
        // devCheckMsg                                  Type =>         String
        // cancelBy                                     Type =>         String
        // partnerName                                  Type =>         String
        // partnerObjId                                 Type =>         ObjectId
        // partnerId                                    Type =>         String
        // realName                                     Type =>         String
        // useTopUpAmount                               Type =>         Int
        // isIgnoreAudit                                Type =>         Bool
        // eventCode                                    Type =>         String
        // eventName                                    Type =>         String
        // eventId                                      Type =>         ObjectId
        // spendingAmount                               Type =>         Int
        // rewardAmount                                 Type =>         Int
        // platformObjId                                Type => ObjectId("5a0e8481e493a96b69518da9") => ObjectId                 Type => ObjectId("59f812bf4d45f051e755dd91") => String
        // usedTopUp                                    Type =>         Array of ObjectId
        // applyTargetDate                              Type =>         ISODate
        // consecutiveNumber                            Type =>         Int
        // forbidWithdrawAfterApply                     Type =>         Bool
        // repeatDay                                    Type =>         String
        // limitedOfferApplyTime                        Type =>         ISODate
        // startTime                                    Type =>         ISODate
        // topUpDuration                                Type =>         String
        // limitApplyPerPerson                          Type =>         Int
        // Quantity                                     Type =>         Int
        // originalPrice                                Type =>         String
        // requiredLevel                                Type =>         String
        // expirationTime                               Type =>         ISODate
        // limitedOfferName                             Type =>         String
        // applyAmount                                  Type =>         Int
        // limitedOfferObjId                            Type =>         String
        // topUpProposalId                              Type =>         String
        // topUpProposalObjId                           Type =>         ObjectId
        // rewardProposalId                             Type =>         String
        // rewardProposalObjId                          Type =>         ObjectId
        // isDynamicRewardAmount                        Type =>         Bool
        // forbidWithdrawIfBalanceAfterUnlock           Type =>         Int
        // isGroupReward                                Type =>         Bool
        // useConsumption                               Type =>         Bool
        // remark                                       Type =>         String
        // category                                     Type =>         Int
        // userAgent                                    Type =>         Array
        // playerRewardPointsObjId                      Type =>         ObjectId
        // beforeRewardPoints                           Type =>         Int
        // afterRewardPoints                            Type =>         Int
        // alternatePlayerName                          Type =>         String
        // isShadowAccount                              Type =>         Bool
        // realNameBeforeEdit                           Type =>         String
        // rejectRemark                                 Type =>         Strin
        // validTime                                    Type =>         ISODate
        // qrcodeAddress                                Type =>         String
        // alipayQRCode                                 Type =>         String
        // proposalId                                   Type =>         String
        // requestId                                    Type =>         String
        // userAlipayName                               Type =>         String
        // playerLevel                                  Type => ObjectId("583d20cc784081fd95ac1303") => ObjectId                  Type => ObjectId("57b6c98dacbc10ec92ab993d") => String
        // alipayName                                   Type =>         String
        // alipayAccount                                Type =>         String
        // depositeTime                                 Type =>         ISODate
        // updateData                                   Type =>         Object
        // parternId                                    Type =>         String
        // bankAccount                                  Type =>         String
        // bankAccountDistrict                          Type =>         String
        // bankAccountCity                              Type =>         String
        // bankAccountProvince                          Type =>         String
        // _id                                          Type =>         String
        // bankAddress                                  Type =>         String
        // bankAccountType                              Type => ObjectId("5848d9b13999e8b37bce3e69") => Some in String some in Int
        // bankName                                     Type =>         String
        // showNewAccountNo                             Type =>         Bool
        // bankAccountName                              Type =>         String
        // lastSettleTime                               Type =>         Date
        // isManualUnlock                               Type =>         Bool
        // noSteps                                      Type =>         Bool
        // process
        // status                                       Type =>         String
        // counterPMS                                   Type =>       Int
        // lastRTGRequiredConsumptionAmount
        // lastRTGConsumptionAmount
        // approvedByCs
        // messageId
        // commissionAmountFromChildren                 Type =>         Int
        // alipayerAccount
        // alipayerNickName
        // alipayerRemark
        // alipayer
        // partnerLargeWithdrawalLog                    Type =>         ObjectId
        // cardQuota                                    Type =>         Int
        // cardOwner
        // isPendingRewardUnlocked                      Type =>         Bool
        // applyAmountForPendingReward                  Type =>         Int
        // relatedBonusProposalObjId
        // remarkPMS
        // merchantUseName
        // isRegistered                                 Type =>         Bool
        // isRegisteredTime                             Type =>         Date
        // isApproved                                   Type =>         Bool
        // singleLimit                                  Type =>         Int
        // isViewedByFrontEnd                           Type =>         Bool
        // isIDApproved
        // lockedAdminId
        // lockedAdminName
        // followUpContent
        // isBypassRTGWhenDeposit                       Type =>         Bool
        // spendingTimes
        // isProviderGroup                              Type =>         Bool
        //- isStressTestPlayer  =>  Casino Plus 政府后台测试账号数据需求 20230209 - http://zentao.neweb.me:8080/zentao/task-view-8300.html
        // claimTime                                    Type =>         ISODate
        // isC2C                                        Type =>         Bool
        // c2cProcessTime                               Type =>         ISODate
        // firstC2CReleaseTime                          Type =>         ISODate
        // c2cAdmin                                     Type =>         String
        // c2cRemarkReason                              Type =>         String
      }
    },
    //priority  - {0 - general , 1 - high, 2 - higher, 3 - the highest }
    priority: { type: String },
    // Determine type of entry from which submitted the proposal - 0 - client Side, 1 - admin side
    entryType: { type: String },
    //User type - for whom create the proposal - real player/partners/system users/demoPlayers
    userType: { type: String },
    //if this proposal has any step
    noSteps: { type: Boolean, default: false },
    //status
    status: { type: String /*index: true*/ },
    // remark: [{
    //     addTime: {type: Date, default: Date.now},
    //     admin: {type: Schema.Types.ObjectId, ref: 'admin'},
    //     content: {type: String}
    // }],
    isLocked: { type: Schema.Types.ObjectId, ref: "adminInfo" },
    //expiry date for each proposal
    expirationTime: { type: Date, default: Date.now },
    // create Time
    settleTime: { type: Date, default: Date.now /*index: true*/ },
    // times that the proposal had run
    processedTimes: { type: Number, default: 0 },
    // input device (using User Agent)
    inputDevice: { type: Number, default: 0 },
    // device type triggering this proposal creation
    device: { type: String },
    // approval for FG - admin
    fgApproval: { type: Schema.Types.ObjectId, ref: "adminInfo" },
    // approval for FG - operationTime
    fgApprovalTime: { type: Date },
    // flag to check if proposal is sending
    isSending: { type: Boolean, default: false }
    //For send email issue: audi credit change proposal email won't group as conversation, need message id as email references for gmail to group.
    // messageId: {type: String}
  }
);

proposalSchema.plugin(mongoosePaginate);

module.exports = proposalSchema;
