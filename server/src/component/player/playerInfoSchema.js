const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const { Schema } = mongoose;
const playerInfoSchema = new Schema({
    //player id
    playerId: { type: String/*index: true*/ },
    //player display name
    name: { type: String, required: true/*index: true*/ },
    //player nick name
    nickName: { type: String },
    //player email
    email: { type: String, default: "" },
    //gender - true=male, false=female
    gender: { type: Boolean },
    //DOB
    DOB: { type: Date, default: null },
    //sms Setting
    smsSetting: {
      // remain old message type just in case, could remove in future
      manualTopup: { type: Boolean, default: true },
      applyBonus: { type: Boolean, default: true },
      cancelBonus: { type: Boolean, default: true },
      applyReward: { type: Boolean, default: true },
      consumptionReturn: { type: Boolean, default: true },
      updatePaymentInfo: { type: Boolean, default: true },

      // new message type
      PlayerConsumptionReturnSuccess: { type: Boolean, default: true },
      ManualTopupSuccess: { type: Boolean, default: true },
      OnlineTopupSuccess: { type: Boolean, default: true },
      AlipayTopupSuccess: { type: Boolean, default: true },
      WechatTopupSuccess: { type: Boolean, default: true },
      MOMOTopupSuccess: { type: Boolean, default: true },
      GCASHTopupSuccess: { type: Boolean, default: true },
      GCASHLimit: { type: Boolean, default: true },
      GLIFETopupSuccess: { type: Boolean, default: true },
      CryptoTopupSuccess: { type: Boolean, default: true },
      UpdateEWalletInfoSuccess: { type: Boolean, default: true },
      SecondSmsVerificationCode: { type: Boolean, default: true },
      WithdrawSuccess: { type: Boolean, default: true },
      WithdrawCancel: { type: Boolean, default: true },
      PlayerLimitedOfferRewardSuccess: { type: Boolean, default: true },
      UpdateBankInfoSuccess: { type: Boolean, default: true },
      UpdateGCASHInfoSuccess: { type: Boolean, default: true },
      UpdateGCASHInfoFailed: { type: Boolean, default: true },
      NonVerifiedGCASHAccountFailed: { type: Boolean, default: true },
      InvalidGCASHAccountFailed: { type: Boolean, default: true },
      UpdateMAYAInfoSuccess: { type: Boolean, default: true },
      UpdateMAYAInfoFailed: { type: Boolean, default: true },
      NonVerifiedMAYAAccountFailed: { type: Boolean, default: true },
      InvalidMAYAAccountFailed: { type: Boolean, default: true },
      UpdateMomoInfoSuccess: { type: Boolean, default: true },
      UpdateCryptoInfoSuccess: { type: Boolean, default: true },
      UpdatePhoneInfoSuccess: { type: Boolean, default: true },
      updatePassword: { type: Boolean, default: true }, // use back this old message type
      PlayerTopUpReturnGroupSuccess: { type: Boolean, default: true },
      PlayerLoseReturnRewardGroupSuccess: { type: Boolean, default: true },
      PlayerConsecutiveRewardGroupSuccess: { type: Boolean, default: true },
      PlayerFestivalRewardGroupSuccess: { type: Boolean, default: true },
      PlayerConsumptionRewardGroupSuccess: { type: Boolean, default: true },
      PlayerFreeTrialRewardGroupSuccess: { type: Boolean, default: true },
      PlayerRegisterIntentionSuccess: { type: Boolean, default: true },
      PlayerPromoCodeRewardSuccess: { type: Boolean, default: true },
      PlayerLevelUpMigrationSuccess: { type: Boolean, default: true },
      PlayerLevelDownMigrationSuccess: { type: Boolean, default: true },
      PlayerLevelUpSuccess: { type: Boolean, default: true },
      PromoCodeSend: { type: Boolean, default: true },
      AuctionPromoCodeSuccess: { type: Boolean, default: true },
      AuctionOpenPromoCodeSuccess: { type: Boolean, default: true },
      PlayerRetentionRewardGroupSuccess: { type: Boolean, default: true },
      smsVerificationCode: { type: Boolean, default: true },
      PlayerLevelMaintainSuccess: { type: Boolean, default: true },
      AuctionPromoCodeBSuccess: { type: Boolean, default: true },
      AuctionPromoCodeBPending: { type: Boolean, default: true },
      AuctionPromoCodeBReject: { type: Boolean, default: true },
      AuctionPromoCodeCSuccess: { type: Boolean, default: true },
      AuctionPromoCodeCPending: { type: Boolean, default: true },
      AuctionPromoCodeCReject: { type: Boolean, default: true },
      AuctionOpenPromoCodeBSuccess: { type: Boolean, default: true },
      AuctionOpenPromoCodeBPending: { type: Boolean, default: true },
      AuctionOpenPromoCodeBReject: { type: Boolean, default: true },
      AuctionOpenPromoCodeCSuccess: { type: Boolean, default: true },
      AuctionOpenPromoCodeCPending: { type: Boolean, default: true },
      AuctionOpenPromoCodeCReject: { type: Boolean, default: true },
      AuctionRealPrizeSuccess: { type: Boolean, default: true },
      AuctionRealPrizePending: { type: Boolean, default: true },
      AuctionRealPrizeReject: { type: Boolean, default: true },
      AuctionRewardPromotionSuccess: { type: Boolean, default: true },
      AuctionRewardPromotionPending: { type: Boolean, default: true },
      AuctionRewardPromotionReject: { type: Boolean, default: true },
      AuctionRewardPointChangeSuccess: { type: Boolean, default: true },
      AuctionRewardPointChangePending: { type: Boolean, default: true },
      AuctionRewardPointChangeReject: { type: Boolean, default: true },
      RandomRewardPromoCodeBDepositSuccess: { type: Boolean, default: true },
      RandomRewardPromoCodeBNoDepositSuccess: { type: Boolean, default: true },
      RandomRewardPromoCodeCSuccess: { type: Boolean, default: true },
      PlayerRandomRewardGroupSuccess: { type: Boolean, default: true },
      RandomRewardRewardPointsSuccess: { type: Boolean, default: true },
      RandomRewardRealPrizeSuccess: { type: Boolean, default: true },
      ResetPasswordUrl: { type: Boolean, default: true },
      UpdatePlayerInfoSuccess: { type: Boolean, default: true },
      LiveDrawRewardSuccess: { type: Boolean, default: true }
    },
    //store player's icon
    icon: { type: String, default: "" },
    //contact number
    phoneNumber: { type: String, minlength: 6/*index: true*/ },
    // 空号检测api 状态
    phoneStatus: { type: Number },
    // 空号次数
    phoneInvalidTime: { type: Number },
    // 检测空号时间
    phoneValidationDate: { type: Date },
    //is test player, convertion rate = total(isTestPlayer && isRealPlayer)/total(isTestPlayer)
    isTestPlayer: { type: Boolean, default: false },
    //is real player
    isRealPlayer: { type: Boolean, default: true },
    // is test player converted to real player (open new account)
    isTestPlayerConverted: { type: Boolean, default: false },
    // is test player already have an account (test player only)
    isTestPlayerOld: { type: Boolean, default: false },
    //device ID - guest login/create (frontend app only)
    // Bind on registration
    guestDeviceId: { type: String/*index: true*/ },
    //IMEI
    IMEI: { type: String },
    //mac address
    macAddress: { type: String },
    //last feedback time
    lastFeedbackTime: { type: Date, default: "" },
    //last feedback topic
    lastFeedbackTopic: { type: String },
    //feedback times
    feedbackTimes: { type: Number, min: 0, default: 0 },
    //no more feedback
    noMoreFeedback: { type: Boolean },
    //player password
    password: { type: String, required: true },
    //whether player want to receive SMS
    receiveSMS: { type: Boolean, default: true },
    //player real name
    realName: { type: String, default: ""/*index: true*/ },
    //platform
    platform: { type: Schema.ObjectId, ref: "platform"/*index: true*/ },
    //Registration data
    registrationTime: { type: Date, default: Date.now/*index: true*/ },
    //last access time
    lastAccessTime: { type: Date, default: Date.now/*index: true*/ }, //logout and login
    // 最近一次充值时间 ，20221010
    lastTopUpTime: { type: Date },
    //if player has login
    isLogin: { type: Boolean, default: false },
    // Last Login Ip
    lastLoginIp: { type: String, default: "" }, //login
    //login ip records
    loginIps: [],
    //blacklist ip that match with player login ips
    blacklistIp: [],
    // player trust level (trust or untrust, cheated player)
    trustLevel: { type: String, default: "2" },
    // player trust level (trust or untrust, cheated player)
    badRecords: [{ type: Schema.ObjectId, ref: "playerBadRecord" }],
    // player status normal or forbid game or forbid
    status: { type: Number, default: 1 },
    //last played game provider id
    lastPlayedProvider: { type: Schema.ObjectId, ref: "gameProvider" },
    //forbid game providers
    forbidProviders: [{ type: Schema.ObjectId, ref: "gameProvider" }],
    //forbid rewardPoint Events
    forbidRewardPointsEvent: [{ type: Schema.ObjectId, ref: "rewardPointsEvent" }],
    //forbid promo code list
    forbidPromoCodeList: [{ type: Schema.ObjectId }],
    //player level (vip, regular etc)
    playerLevel: { type: Schema.ObjectId, ref: "playerLevel" },
    //experience???
    exp: { type: Number, min: 0, default: 0 },
    //games
    games: [{ type: Schema.ObjectId, ref: "game" }],
    //partnerId
    partner: { type: Schema.ObjectId, ref: "partner"/*index: true*/ },
    //remark
    remark: { type: String },
    //photo url
    photoUrl: { type: String },
    //registration domain
    domain: { type: String/*index: true*/ },
    //external registration domain
    sourceUrl: { type: String },
    //country code
    countryCode: { type: String },
    //User agent containing 3 sub fields: browser, os, device
    userAgent: [{
      _id: false,
      browser: { type: String },
      os: { type: String },
      device: { type: String }
    }],
    // User permission
    permission: {
      _id: false,
      applyBonus: { type: Boolean, default: true },
      // advanceConsumptionReward: {type: Boolean, default: true},
      transactionReward: { type: Boolean, default: true },
      allTopUp: { type: Boolean, default: true },
      topupOnline: { type: Boolean, default: true },
      topupManual: { type: Boolean, default: true },
      topUpCard: { type: Boolean, default: true },
      topUpMOMO: { type: Boolean, default: true },
      topUpGCASH: { type: Boolean, default: true },
      topUpGLife: { type: Boolean, default: true },
      phoneCallFeedback: { type: Boolean, default: true },
      SMSFeedBack: { type: Boolean, default: true },
      alipayTransaction: { type: Boolean, default: true },
      quickpayTransaction: { type: Boolean, default: true },
      banReward: { type: Boolean, default: false },
      rewardPointsTask: { type: Boolean, default: true },
      disableWechatPay: { type: Boolean, default: false },
      forbidPlayerConsumptionReturn: { type: Boolean, default: false },
      allowPromoCode: { type: Boolean, default: true },
      forbidPlayerConsumptionIncentive: { type: Boolean, default: false },
      PlayerTopUpReturn: { type: Boolean, default: true },
      PlayerDoubleTopUpReturn: { type: Boolean, default: true },
      forbidPlayerFromLogin: { type: Boolean, default: false },
      forbidPlayerFromEnteringGame: { type: Boolean, default: false },
      playerConsecutiveConsumptionReward: { type: Boolean, default: true },
      PlayerPacketRainReward: { type: Boolean, default: true },
      PlayerLimitedOfferReward: { type: Boolean, default: true },
      levelChange: { type: Boolean, default: true },
      cryptoTopUp: { type: Boolean, default: true },
      getSMSCode: { type: Boolean, default: true },
      ExchangeCurrencyBonus: { type: Boolean, default: true },
      forbidEmailFeedBack: { type: Boolean, default: false },
      unsubscribedEmail: { type: Boolean, default: false },
      topupNormal: { type: Boolean, default: true },
      topupSpikeGift: { type: Boolean, default: true }
    },

    //country
    country: String,
    //province
    province: String,
    //city
    city: String,
    //longitude
    longitude: String,
    //latitude
    latitude: String,

    //PhoneNumber-based Geo location Info
    //province
    phoneProvince: String,
    //city
    phoneCity: String,
    //type
    phoneType: String,

    /*Player Credit*/
    //current credit balance
    creditBalance: { type: Number, min: 0, default: 0 },
    //valid credit
    validCredit: { type: Number, min: 0, default: 0/*index: true*/ },
    //locked credit
    lockedCredit: { type: Number, min: 0, default: 0 },
    //daily top up sum for level up check
    dailyTopUpSum: { type: Number, min: 0, default: 0 },
    //daily top up incentive amount
    dailyTopUpIncentiveAmount: { type: Number, min: 0, default: 0 },
    //weekly top up sum for level up check
    weeklyTopUpSum: { type: Number, min: 0, default: 0 },
    //past one month topup sum recording
    pastMonthTopUpSum: { type: Number, min: 0, default: 0 },
    //total top up
    topUpSum: { type: Number, min: 0, default: 0 },
    //top up times
    topUpTimes: { type: Number, min: 0, default: 0/*index: true*/ },
    // withdrawal times
    withdrawTimes: { type: Number, min: 0, default: 0/*index: true*/ },
    //daily withdraw sum
    dailyWithdrawSum: { type: Number, min: 0, default: 0 },
    //weekly withdraw
    weeklyWithdrawSum: { type: Number, min: 0, default: 0 },
    //past one month Withdraw recording.
    pastMonthWithdrawSum: { type: Number, min: 0, default: 0 },
    //total Withdraw
    withdrawSum: { type: Number, min: 0, default: 0 },
    //daily month bonus amount sum
    dailyBonusAmountSum: { type: Number, default: 0 },
    //weekly month bonus amount sum
    weeklyBonusAmountSum: { type: Number, default: 0 },
    //past one month bonus amount recording.
    pastMonthBonusAmountSum: { type: Number, default: 0 },
    // total profit / losses of player
    bonusAmountSum: { type: Number, default: 0 },
    //daily consumption sum for level up check
    dailyConsumptionSum: { type: Number, min: 0, default: 0 },
    //weekly consumption sum for level up check
    weeklyConsumptionSum: { type: Number, min: 0, default: 0 },
    //past one month consumption recording.
    pastMonthConsumptionSum: { type: Number, min: 0, default: 0 },
    //total consumption
    consumptionSum: { type: Number, min: 0, default: 0 },
    //consumption sum for each game type
    consumptionDetail: { type: JSON, default: {} },
    //consumption up times
    consumptionTimes: { type: Number, min: 0, default: 0 },
    // Credit Wallet (For Provider Group Lock)
    creditWallet: [{
      _id: false,
      providerGroupId: { type: Schema.ObjectId, ref: "gameProviderGroup" },
      walletCredit: { type: Number, min: 0, default: 0 },
      walletCurrentConsumption: { type: Number, min: 0, default: 0 },
      walletTargetConsumption: { type: Number, min: 0, default: 0 }
    }],

    /*Player payment*/
    //bank name， bankTypeId
    bankName: { type: String },
    //bank account
    bankAccount: { type: String/*index: true*/ },
    //bank account name
    bankAccountName: { type: String },
    //bank account type
    bankAccountType: { type: String },
    //bank account province
    bankAccountProvince: { type: String },
    //bank account city
    bankAccountCity: { type: String },
    //bank account district
    bankAccountDistrict: { type: String },
    //full bank address
    bankAddress: { type: String },
    //bank branch
    bankBranch: { type: String },
    //multiple bank detail info
    multipleBankDetailInfo: { type: Schema.ObjectId, ref: "playerMultipleBankDetailInfo" },
    //internet banking
    internetBanking: { type: String },
    //bank card group
    bankCardGroup: { type: Schema.ObjectId, ref: "platformBankCardGroup" },
    //merchant group
    merchantGroup: { type: Schema.ObjectId, ref: "platformMerchantGroup" },
    //ali pay group
    alipayGroup: { type: Schema.ObjectId, ref: "platformAlipayGroup" },
    //wechat pay group
    wechatPayGroup: { type: Schema.ObjectId, ref: "platformWechatPayGroup" },
    //quickPay group
    quickPayGroup: { type: Schema.ObjectId, ref: "platformQuickPayGroup" },
    //forbid top up types
    forbidTopUpType: [{ type: String }],
    // forbid reward events by player
    forbidRewardEvents: [{ type: String }],
    // disable generate/apply promo code
    forbidPromoCode: { type: Boolean, default: false },
    // disable player level up reward
    forbidLevelUpReward: { type: Boolean, default: false },
    // disable player level maintain reward
    forbidLevelMaintainReward: { type: Boolean, default: false },
    //reward info
    //if this player has been rewarded for first time top up event
    bFirstTopUpReward: { type: Boolean, default: false },

    //favorite games
    favoriteGames: [{ type: Schema.ObjectId, ref: "game" }],

    //social media info
    qq: { type: String },
    wechat: { type: String },

    //similar players
    similarPlayers: [{
      _id: false,
      playerObjId: { type: Schema.ObjectId },
      field: { type: String },
      content: { type: String }
    }],
    //referral player
    referral: { type: Schema.ObjectId/*index: true*/ },
    //has been used for referral reward
    isReferralReward: { type: Boolean, default: false },
    //if this player is from online registration
    isOnline: { type: Boolean },
    //if player has applied consumption return
    isConsumptionReturn: { type: Boolean },
    //is new system user
    isNewSystem: { type: Boolean },
    //adding easter egg
    applyingEasterEgg: { type: Boolean, default: false },
    // credibility remarks
    credibilityRemarks: [{ type: Schema.ObjectId, ref: "playerCredibilityRemark"/*index: true*/ }],
    // the game providers' name that player had played their games
    gameProviderPlayed: [{ type: Schema.ObjectId, ref: "gameProvider" }],
    // player value score
    valueScore: { type: Number, default: 0 },
    // interface that used to register this account
    registrationInterface: { type: Number, default: 0 },
    // the number of times where player login
    loginTimes: { type: Number, default: 0 },
    //for reporo conversion
    reporoId: { type: String },
    // UI Help Info View
    viewInfo: {
      limitedOfferInfo: { type: Number, default: 1 },
      // add in a state to control the showing of the limitedOfferInfo
      showInfoState: { type: Boolean, default: 1 }
    },
    // admin name who opened this account from backstage
    accAdmin: { type: String },
    csOfficer: { type: Schema.ObjectId, ref: "admin"/*index: true*/ },
    promoteWay: { type: String/*index: true*/ },
    // reward point object
    rewardPointsObjId: { type: Schema.ObjectId, ref: "rewardPoints" },
    // is tracked for deposit tracking report
    isDepositTracked: { type: Boolean },
    // deposit tracking group object
    depositTrackingGroup: { type: Schema.ObjectId, ref: "depositTrackingGroup" },
    // xima withdrawal check bypass
    ximaWithdraw: { type: Number, default: 0 },
    // dian xiao mission related player
    dxMission: { type: Schema.ObjectId, ref: "dxMission" },
    //client data
    clientData: { type: String },
    //device id
    // Update every time when login
    deviceId: { type: String },
    // tsPhoneObjId
    tsPhone: { type: Schema.ObjectId, ref: "tsPhone" },
    // tsPhoneListObjId
    tsPhoneList: { type: Schema.Types.ObjectId, ref: "tsPhoneList"/*index: true*/ },
    //adminObjId
    tsAssignee: { type: Schema.Types.ObjectId, ref: "adminInfo" },
    // relevant tsPhoneList
    relTsPhoneList: [{ type: Schema.Types.ObjectId, ref: "tsPhoneList" }],
    // QnA security question total wrong count - reset when success
    qnaWrongCount: {
      forgotPassword: { type: Number, default: 0 },
      updatePhoneNumber: { type: Number, default: 0 },
      editBankCard: { type: Number, default: 0 },
      editName: { type: Number, default: 0 },
      verifyInfo: { type: Number, default: 0 }
    },
    //if a player answer qna question wrongly, add to this counter
    //reset when success
    qnaWrongAnswerSum: { type: Number, default: 0 },
    //if a player answer qna question wrongly >= 3 times, update this date field
    //if qnaWrongAnswerExceededCountDate is within same day as today, don't allow for Q&A
    //if date fields is null, meant system had reset the all qna counter to 0
    qnaWrongAnswerExceededCountDate: { type: Date, default: null },
    //QnA - verifyInfo date
    verifyInfoWrongAnswerExceededCountDate: { type: Date, default: null },
    // verify if this is generate by app, and is been change the password before
    hasPassword: { type: Boolean, default: false },
    // short url to referral purpose
    shortUrl: { type: JSON },
    //os for native app
    osType: { type: String },
    // avatar
    avatar: { type: String },
    // avatar frame
    avatarFrame: { type: String },
    // constDevice
    loginDevice: { type: String },
    // constDevice
    registrationDevice: { type: String/*index: true*/, default: "0" },
    // registration osType
    registrationOsType: { type: String, default: "" },
    // latest token generate time
    lastTokenTime: { type: Date },
    //isTagByGameTypeSettlement
    isTagByGameTypeSettlement: { type: Boolean, default: false },

    // Shadow account related
    // Flag of shadow account to use usdt
    isShadowAccount: { type: Boolean, default: false },
    // Main account ID
    mainAccount: { type: Schema.ObjectId },
    // Credit
    currency: { type: String, default: "RMB" },
    // reset password not yet update new password
    resetPassword: { type: Boolean, default: false },
    // only for cstest (can transfer in and out to provider)
    cstestTransfer: { type: Boolean, default: false },
    // card reward only
    isSharedReward: [{ type: Schema.Types.ObjectId, ref: "rewardEvent" }],
    // shadow account created time
    shadowCreatedTime: { type: Date },
    // check is register by email default is phone
    registerType: { type: String, default: "PHONE" },
    // check received one time partner open promo code
    partnerOpenPromoCode: { type: Number },
    //for single wallet service
    bet: { type: JSON, default: {} },
    //photo verification (selfie) --image name
    verifyPhoto: { type: String },
    //profile picture -- in game photo -- image name
    playerAvatar: { type: String },
    //ID card 1 photo -- image name
    photoId1: {
      _id: false,
      imageName: { type: String },
      type: { type: Number }
    },
    //ID card 2 photo --image name
    photoId2: {
      _id: false,
      imageName: { type: String },
      type: { type: Number }
    },
    // ID card number
    IDCardNumber: { type: String },
    //address
    address: { type: String },
    //postcode
    postcode: { type: String },
    //player province (not ip)
    playerProvince: { type: String },
    //player city (not ip)
    playerCity: { type: String },
    //player barangay (not ip)
    Barangay: { type: String },
    //nationality
    nationality: { type: String },
    //source of funds
    sourceOfFunds: { type: String },
    //player have security deposit
    isSecurityDeposit: { type: Boolean, default: false },
    //player nickName already update with latest logic
    isNickNameUpdated: { type: Boolean, default: false },
    //FG report flag - to hide new player from getPlayerReport and getPlayerInfoList if player without realName, player without this flag meant need to show the player even player without realName
    isNewFGPlayerReport: { type: Boolean, default: true },
    //flag to check whether is create from FG SMS Url
    isCreatedFromFgUrl: { type: Boolean, default: false },
    // Save this promoCode when register from specific FG Url, for front end use
    registerRewardCode: { type: String },
    //live draw reward time key value pair (key = rewardEvent id)
    liveDrawRewardTime: { type: JSON, default: {} },
    //live draw reward count key value pair (key = rewardEvent id)
    liveDrawRewardCount: { type: JSON, default: {} },
    //live draw reward unreachable time key value pair (key = rewardEvent id)
    liveDrawUnreachableTime: { type: JSON, default: {} },
    //player completed information flag
    isCompleteInfo: { type: Boolean, default: false },
    //invalid player sourceURL
    isInvalidSourceURL: { type: Boolean, default: false },
    // Date of player completed information flag
    completeInfoDate: { type: Date },
    // invalid ID (身份证） -- for FE use (deprecated)
    // isInvalidID: {type: Boolean, default: false},
    // ID Status (身份证状态） -- for FE use
    IDStatus: { type: Number, default: 0 },
    // shadow account object id
    shadowAcc: { type: Schema.Types.ObjectId, ref: "player" },
    // is sports player only can login on sport website, likewise
    isSportsPlayer: { type: Boolean },
    // GLife Player
    isGLife: { type: Boolean, default: false },
    // is stress test player
    isStressTestPlayer: { type: Boolean, default: false },
    //random field for activate findOneAndUpdate feature
    nullField: { type: Boolean, default: false },
    placeOfBirth: { type: String },
    natureOfWork: { type: String }
  }
);

// playerInfoSchema.post('find', function (result) {
//     if (result && result.length > 0) {
//         for (let i = 0; i < result.length; i++) {
//             playerPostFindUpdate(result[i]);
//         }
//         return result;
//     }
// });

playerInfoSchema.plugin(mongoosePaginate);
module.exports = playerInfoSchema;
