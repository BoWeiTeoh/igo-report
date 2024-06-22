let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let Schema = mongoose.Schema;

let platformSchema = new Schema({
  //simplified platformId
  platformId: { type: String, unique: true/*index: true*/ },
  //platform name
  name: { type: String, unique: true, required: true, dropDups: true/*index: true*/ },
  //platform code
  code: { type: String, unique: true, required: true, dropDups: true },
  //platform player prefix
  prefix: { type: String, default: "" },
  icon: { type: String },
  //platform partner prefix
  partnerPrefix: { type: String, default: "" },
  // partner create player prefix
  partnerCreatePlayerPrefix: { type: String, default: "" },
  //platform description
  description: String,
  //platform url
  url: String,
  //main department for platform [DEPRECATED, DO NOT USE!!]
  department: { type: Schema.ObjectId, ref: "department", default: null },
  //game providers
  gameProviders: [{ type: Schema.ObjectId, ref: "gameProvider" }],
  gameProviderInfo: {}, // Map of providerId => {localNickName, localPrefix} (called gameProviderNickNameData objects)
  //paymentChannels
  paymentChannels: [{ type: Schema.ObjectId, ref: "paymentChannel" }],
  //daily settlement time, hour(0-23) Minutes(0-59)
  dailySettlementHour: { type: Number, min: 0, max: 23, default: null },
  dailySettlementMinute: { type: Number, min: 0, max: 59, default: null },
  //weekly settlement time, day(0-6) hour(0-23) Minutes(0-59)
  weeklySettlementDay: { type: Number, min: 0, max: 6, default: null },
  weeklySettlementHour: { type: Number, min: 0, max: 23, default: null },
  weeklySettlementMinute: { type: Number, min: 0, max: 60, default: null },
  //settlement status, daily settlement, weekly settlement or ready
  settlementStatus: { type: String, default: "Ready" },
  //last daily settlement time
  lastDailySettlementTime: { type: Date },
  //last weekly settlement time
  lastWeeklySettlementTime: { type: Date },
  //last daily payment quota refresh time (bankcard, wechat, alipay)
  lastPaymentQuotaRefreshTime: { type: Date },
  //CUSTOMER SERVICE INFO
  // for player
  csEmailImageUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPhoneList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csQQList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csUrlList: [{
    _id: false,
    csType: { type: Number },
    isImg: { type: Number },
    content: { type: String },
    isOpen: { type: Number }
  }],
  csWeixinList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csSkypeList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csDisplayUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  playerInvitationUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  weixinPhotoUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  backEndImageCdn: [{
    _id: false,
    domainName: { type: String },
    imagePath: { type: String }
  }],
  CSPhoneRoute: { type: JSON },
  DXPhoneRoute: { type: JSON },
  FEPhoneRoute: { type: JSON },
  playerWebLogoUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  // for partner
  csPartnerEmailList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerPhoneList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerQQList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerWeixinList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerSkypeList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  partnerInvitationUrlList: [{
    _id: false,
    isImg: { type: Number },
    type: { type: Number }, // domain type
    content: { type: String }
  }],
  partnerWeixinPhotoUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  partnerWebLogoUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  csPartnerDisplayUrlList: [{
    _id: false,
    isImg: { type: Number },
    content: { type: String }
  }],
  //for frontend-module-setting
  presetModuleSetting: [{
    _id: false,
    functionId: { type: Number },
    displayStatus: { type: Number },
    functionName: { type: String }
  }],
  specialModuleSetting: [{
    content: [{
      _id: false,
      functionId: { type: Number },
      displayStatus: { type: Number },
      functionName: { type: String }
    }],
    domainName: []
  }],

  //email address used when sending emails to players
  csEmail: { type: String },
  csEmailImageUrl: { type: String },
  csPhone: { type: String },
  csUrl: { type: String },
  csQQ: { type: String },
  csWeixin: { type: String },
  weixinPhotoUrl: { type: String },
  csSkype: { type: String },
  csDisplayUrl: { type: String },
  playerWebLogoUrl: { type: String },
  partnerWebLogoUrl: { type: String },
  //OFFICIAL_ACCOUNT_WEIXIN
  oaWeixin: { type: String },
  //CUSTOMER SERVICE PARTNER INFO
  csPartnerEmail: { type: String },
  csPartnerPhone: { type: String },
  csPartnerUrl: { type: String },
  csPartnerQQ: { type: String },
  csPartnerWeixin: { type: String },
  partnerWeixinPhotoUrl: { type: String },
  csPartnerSkype: { type: String },
  csPartnerDisplayUrl: { type: String },
  //auto settlement
  canAutoSettlement: { type: Boolean, default: true },
  //invitation url for player from partner
  playerInvitationUrl: { type: String },
  //invitatio url for partner from partner
  partnerInvitationUrl: { type: String },
  //min top up amount
  minTopUpAmount: { type: Number, default: 0 },
  //percentage charges of apply bonus
  bonusPercentageCharges: { type: Number, default: 0 },
  //numbers of times apply bonus without charges
  bonusCharges: { type: Number },
  //allow same real name to register? for frontEnd only, they still can register via office
  allowSameRealNameToRegister: { type: Boolean, default: true },
  //allow test player to login
  allowTestPlayerToLogin: { type: Boolean, default: false },
  // Platform-wide SMS Verification Setting, for create players and create partners
  requireSMSVerification: { type: Boolean, default: false },
  // SMS Verification Setting For create demo player
  requireSMSVerificationForDemoPlayer: { type: Boolean, default: false },
  // SMS Verification Setting For Password Update
  requireSMSVerificationForPasswordUpdate: { type: Boolean, default: false },
  // SMS Verification Setting For Payment Update
  requireSMSVerificationForPaymentUpdate: { type: Boolean, default: false },
  // SMS Verification Expired Time (in Minute)
  smsVerificationExpireTime: { type: Number, default: 5 },
  // demo player Expired Time (day)
  demoPlayerValidDays: { type: Number, default: 7 },
  // allow same phone number to register
  allowSamePhoneNumberToRegister: { type: Boolean, default: true },
  // same phone number to register count
  samePhoneNumberRegisterCount: { type: Number, default: 1 },
  // deposit count required to allow updating of bank card
  updateBankCardDepositCount: { type: Number, default: 0 },
  // check deposit count required to allow updating of bank card
  updateBankCardDepositCountCheck: { type: Boolean, default: false },
  // total deposit amount required to allow updating of bank card
  updateBankCardDepositAmount: { type: Number, default: 0 },
  // check total deposit amount required to allow updating of bank card
  updateBankCardDepositAmountCheck: { type: Boolean, default: false },
  // deposit count required to allow updating of GCASH
  updateGCASHDepositCount: { type: Number, default: 0 },
  // check deposit count required to allow updating of GCASH
  updateGCASHDepositCountCheck: { type: Boolean, default: false },
  // total deposit amount required to allow updating of GCASH
  updateGCASHDepositAmount: { type: Number, default: 0 },
  // check total deposit amount required to allow updating of GCASH
  updateGCASHDepositAmountCheck: { type: Boolean, default: false },
  // deposit count required to allow updating of Maya
  updateGLIFEDepositCount: { type: Number, default: 0 },
  // check deposit count required to allow updating of GLIFE
  updateGLIFEDepositCountCheck: { type: Boolean, default: false },
  // total deposit amount required to allow updating of GLIFE
  updateGLIFEDepositAmount: { type: Number, default: 0 },
  // check total deposit amount required to allow updating of GLIFE
  updateGLIFEDepositAmountCheck: { type: Boolean, default: false },
  // the limit of the same bank account number used
  sameBankAccountCount: { type: Number, default: 1 },
  // the limit of the same MOMO account number used
  sameMOMOAccountCount: { type: Number, default: 1 },
  // the limit of the same GCASH account number used
  sameGCASHAccountCount: { type: Number, default: 1 },
  // the limit of the same Maya account number used
  sameMAYAAccountCount: { type: Number, default: 1 },
  // the limit of the same e-wallet account number used
  sameEWalletAccountCount: { type: Number, default: 1 },
  // check duplicate bank account name if this is editing bank card for the second time
  checkDuplicateBankAccountNameIfEditBankCardSecondTime: { type: Boolean, default: false },
  // check if require sms code when update bankcard for the first time
  requireSMSCodeForBankRegistrationAtFirstTime: { type: Boolean, default: false },
  // check if require sms code when add e-wallet for the first time
  requireSMSCodeForEWalletRegistrationAtFirstTime: { type: Boolean, default: false },
  // check if require sms code when update e-wallet
  requireSMSCodeForEWalletUpdate: { type: Boolean, default: false },
  // white listing phone number
  whiteListingPhoneNumbers: [{ type: String }],
  // black listing phone number
  blackListingPhoneNumbers: [{ type: String }],
  // Partner auto approve bonus proposal platform switch
  partnerEnableAutoApplyBonus: { type: Boolean, default: false },
  // Partner forbid apply bonus, apply bonus proposal need cs approval
  partnerForbidApplyBonusNeedCsApproval: { type: Boolean, default: false },
  // Partner auto approve single withdrawal limit
  partnerAutoApproveWhenSingleBonusApplyLessThan: { type: Number, default: 0 },
  // Partner auto approve daily total withdrawal limit
  partnerAutoApproveWhenSingleDayTotalBonusApplyLessThan: { type: Number, default: 0 },
  // Partner withdrawal manual approve when changes in x hour
  partnerInfoChangedHours: { type: Number, default: 0 },
  // Partner current withdrawal amount minus total commission from the last withdrawal(include first level partner commission) >= X (transfer to manual approval)
  partnerWithdrawalCommissionDifference: { type: Number, default: 0 },
  // Partner after deposit, without any betting then requesting withdrawal
  withdrawWithoutBet: { type: Number, default: 0 },
  // Auto audit settings
  autoAudit: {
    // First withdraw amount >= X (Manual audit)
    firstWithdrawExceedAmount: { type: Number, default: 0 },
    // First withdraw + current credit - total topup >= X (Manual audit)
    firstWithdrawAndCurrentMinusTopupExceedAmount: { type: Number, default: 0 },
    // Total Bet / Total Topup >= X, and withdraw amount >= Y (Maunual audit)
    firstWithdrawTotalBetOverTotalTopupExceedTimes: { type: Number, default: 0 },
    firstWithdrawCondBExceedAmount: { type: Number, default: 0 },
    // location of registration IP + phone number + bank card are different (Manual audit)
    firstWithdrawDifferentIPCheck: { type: Boolean, default: false }
  },
  // partner FG SMS Register URL
  partnerSmsRegisterUrl: { type: String },
  // partner FG SMS Register Promo Code
  partnerSmsRegisterPromoCode: { type: String },
  // 轮盘推广链接
  roulettePromoUrl: { type: String },
  // Auto approve bonus proposal platform switch
  enableAutoApplyBonus: { type: Boolean, default: false },
  // Auto approve single withdrawal limit
  autoApproveWhenSingleBonusApplyLessThan: { type: Number, default: 0 },
  // Auto approve daily total withdrawal limit
  autoApproveWhenSingleDayTotalBonusApplyLessThan: { type: Number, default: 0 },
  // Auto approve deficit offset
  autoApproveLostThreshold: { type: Number, default: 0 },
  // Auto approve consumption offset
  autoApproveConsumptionOffset: { type: Number, default: 0 },
  // Auto approve profit times (More than this amount will change to manual audit)
  autoApproveProfitTimes: { type: Number, default: 10 },
  // Auto approve minimum withdrawal amount to trigger profit times checking
  autoApproveProfitTimesMinAmount: { type: Number, default: 2000 },
  // Auto approve abnormal bonus check offset
  autoApproveBonusProfitOffset: { type: Number, default: 2000 },
  // Enable check on continuous apply bonus
  checkContinuousApplyBonusTimes: { type: Number },
  // player withdrawal manual approve when changes in x hour
  playerInfoChangedHours: { type: Number, default: 0 },
  // player edit crypto wallet manual approve when changes in x hour
  playerInfoChangedHoursCryptoWallet: { type: Number, default: 0 },
  // player edit crypto wallet manual approve when changes in x hour
  partnerInfoChangedHoursCryptoWallet: { type: Number, default: 0 },
  // Change to manual audit when financial point is low
  manualAuditWhenLowFinancialPoints: { type: Boolean, default: false },
  // Player forbid apply bonus, apply bonus proposal need cs approval
  playerForbidApplyBonusNeedCsApproval: { type: Boolean, default: false },
  //can apply multiple reward
  canMultiReward: { type: Boolean, default: false },
  // Auto check player level up
  autoCheckPlayerLevelUp: { type: Boolean, default: false },
  // manual check player level up (perform by player)
  manualPlayerLevelUp: { type: Boolean, default: false },
  // enable or disable platform manual batch level up
  platformBatchLevelUp: { type: Boolean, default: true },
  // player level up period (default 3 = monthly)
  playerLevelUpPeriod: { type: Number, default: 3 },
  // player level down period (default 3 = monthly)
  playerLevelDownPeriod: { type: Number, default: 3 },
  // user login or register require captcha type
  captchaVerifyType: { type: Number, default: 0 },
  // user login require captcha verfication
  requireLogInCaptcha: { type: Boolean, default: false },
  // Use YiDun captcha for login verification
  requireLogInYDCaptcha: { type: Boolean, default: false },
  // Use YiDun anti-cheat for login verification
  requireLogInYDAntiCheat: { type: Boolean, default: false },
  // user get SMS code with captcha
  requireCaptchaInSMS: { type: Boolean, default: false },
  //only new system user can login
  onlyNewCanLogin: { type: Boolean, default: false },
  //if use locked credit
  useLockedCredit: { type: Boolean, default: false },
  // Use new type of supplier group lock
  useProviderGroup: { type: Boolean, default: true },
  // if use point system
  usePointSystem: { type: Boolean, default: true },
  // if use phone number 2 steps verification
  usePhoneNumberTwoStepsVerification: { type: Boolean, default: false },
  // if use eBet Wallet
  useEbetWallet: { type: Boolean, default: false },
  // maximum length for player name included platform prefix
  playerNameMaxLength: { type: Number, default: 0 },
  // minimum length for player name included platform prefix
  playerNameMinLength: { type: Number, default: 0 },
  // maximum length for player password
  playerPasswordMaxLength: { type: Number, default: 0 },
  // minimum length for player password
  playerPasswordMinLength: { type: Number, default: 0 },
  // maximum length for partner name included platform prefix
  partnerNameMaxLength: { type: Number, default: 0 },
  // minimum length for partner name included platform prefix
  partnerNameMinLength: { type: Number, default: 0 },
  // maximum length for partner password
  partnerPasswordMaxLength: { type: Number, default: 0 },
  // minimum length for partner password
  partnerPasswordMinLength: { type: Number, default: 0 },
  // allow partner same phone number to register
  partnerAllowSamePhoneNumberToRegister: { type: Boolean, default: true },
  // same partner bank account to register count
  partnerSameBankAccountCount: { type: Number, default: 1 },
  // same partner MOMO account to register count
  partnerSameMOMOAccountCount: { type: Number, default: 1 },
  // same partner GCASH account to register count
  partnerSameGCASHAccountCount: { type: Number, default: 1 },
  // same partner Maya account to register count
  partnerSameMAYAAccountCount: { type: Number, default: 1 },
  // same partner e-wallet account to register count
  partnerSameEWalletAccountCount: { type: Number, default: 1 },
  // allow partner same real name to register
  partnerAllowSameRealNameToRegister: { type: Boolean, default: true },
  // same partner phone number to register count
  partnerSamePhoneNumberRegisterCount: { type: Number, default: 1 },
  // partner white listing phone number
  partnerWhiteListingPhoneNumbers: [{ type: String }],
  // partner black listing phone number
  partnerBlackListingPhoneNumbers: [{ type: String }],
  // Platform-wide SMS Verification Setting, for create partners
  partnerRequireSMSVerification: { type: Boolean, default: false },
  // SMS Verification Setting For partner Password Update
  partnerRequireSMSVerificationForPasswordUpdate: { type: Boolean, default: false },
  // SMS Verification Setting For partner Payment Update
  partnerRequireSMSVerificationForPaymentUpdate: { type: Boolean, default: false },
  // SMS Verification Setting For partner Payment Update
  partnerRequireSMSVerificationForEWalletRegister: { type: Boolean, default: false },
  // SMS Verification Setting For partner Payment Update
  partnerRequireSMSVerificationForEWalletUpdate: { type: Boolean, default: false },
  // SMS Verification Setting For partner create downline partner
  partnerRequireSMSVerificationForCreateDownlinePartner: { type: Boolean, default: false },
  // Partner SMS Verification Expired Time (in Minute)
  partnerSmsVerificationExpireTime: { type: Number, default: 5 },
  // partner login require captcha verfication
  partnerRequireLogInCaptcha: { type: Boolean, default: false },
  // partner get SMS code with captcha
  partnerRequireCaptchaInSMS: { type: Boolean, default: false },
  // partner if use phone number 2 steps verification
  partnerUsePhoneNumberTwoStepsVerification: { type: Boolean, default: false },
  // set the maximum duration for the partner's unread mail to be showing up
  partnerUnreadMailMaxDuration: { type: Number, min: 0 },
  // set default partner commission group upon registration
  partnerDefaultCommissionGroup: { type: Number, default: 0 },
  // the count that trigger the failing alert in payment monitor for merchant
  monitorMerchantCount: { type: Number, default: 10 },
  // the count that trigger the failing alert in payment monitor for player
  monitorPlayerCount: { type: Number, default: 4 },
  // check topup amount that trigger the alert in payment monitor for player
  monitorTopUpAmount: { type: Number, default: 1 },
  // whether to use the sound notification on merchant count alert
  monitorMerchantUseSound: { type: Boolean, default: false },
  // whether to use the sound notification on player count alert
  monitorPlayerUseSound: { type: Boolean, default: false },
  // whether to use the sound notification on player topup amount alert
  monitorTopUpAmountUseSound: { type: Boolean, default: false },
  // select the sound notification that use for merchant count alert
  monitorMerchantSoundChoice: { type: String, default: "1.wav" },
  // select the sound notification that use for player count alert
  monitorPlayerSoundChoice: { type: String, default: "1.wav" },
  // select the sound notification that use for player topup amount alert
  monitorTopUpAmountSoundChoice: { type: String, default: "1.wav" },
  // merchant count 充值类型
  monitorMerchantCountTopUpType: [],
  // player count 充值类型
  monitorPlayerCountTopUpType: [],
  // TopUp Amount 充值类型
  monitorTopUpAmountTopUpType: [],
  // merchant count 提交后（X）分钟仍未成功
  monitorMerchantCountTime: { type: Number },
  // player count 提交后（X）分钟仍未成功
  monitorPlayerCountTime: { type: Number },
  // TopUp Amount 提交后（X）分钟仍未成功
  monitorTopUpAmountTime: { type: Number },
  // the count that trigger the error msg when create top up proposal
  monitorTopUpCount: { type: Number, min: 0 },
  // the count that trigger the error msg when create common top up proposal
  monitorCommonTopUpCount: { type: Number, min: 0 },
  // the switch that trigger the error msg when create top up proposal
  monitorTopUpNotify: { type: Boolean, default: false },
  // the switch that trigger the error msg when create common top up proposal
  monitorCommonTopUpCountNotify: { type: Boolean, default: false },
  // Payment monitor - player registration condition config (monitorPlayerRegister)
  monitorPlayerRegister: { type: Boolean, default: false },
  monitorPlayerRegisterCondition: { type: String },
  monitorPlayerRegisterDayCount: { type: Number, min: 0 },
  monitorPlayerRegisterTopUpCount: { type: Number, min: 0 },
  monitorPlayerRegisterTopUpType: [],
  monitorPlayerRegisterUseSound: { type: Boolean, default: false },
  monitorPlayerRegisterSoundChoice: { type: String },
  monitorPlayerRegisterColor: { type: String },

  // player value score relevant settings
  // playerValueConfig: {
  //     // criteria score criteria ratio
  //     criteriaScoreRatio: {
  //         topUpTimes: {type: Number, default: 10},
  //         gameTypeCount: {type: Number, default: 10},
  //         credibilityRemark: {type: Number, default: 60},
  //         playerLevel: {type: Number, default: 10},
  //         winRatio: {type: Number, default: 10},
  //     },
  //     // top up times criteria score configuration
  //     topUpTimesScores: {type: JSON, default: [{name: 0, score: 0}, {name: 1, score: 1}]},
  //     // played game types count criteria score configuration
  //     gameTypeCountScores: {type: JSON, default: [{name: 0, score: 0}, {name: 1, score: 1}]},
  //     // win ratio criteria score configuration
  //     winRatioScores: {
  //         type: JSON, default: [
  //             {"name": -100, "score": 8},
  //             {"name": -20, "score": 2},
  //             {"name": 0, "score": -1},
  //             {"name": 20, "score": -2},
  //             {"name": 100, "score": -10}
  //         ]
  //     },
  //     // default score for credibility remark criteria
  //     credibilityScoreDefault: {type: Number, default: 5}
  // },
  consumptionTimeConfig: [{
    duration: { type: Number },
    color: { type: String }
  }],
  jiguangAppKey: { type: String },
  jiguangMasterKey: { type: String },
  bonusSetting: { type: JSON, default: {} },
  withdrawalFeeNoDecimal: { type: Boolean, default: false },
  // minimum withdraw amount
  withdrawMinimum: { type: Number, min: 0 },
  //minimum withdraw amount (partner)
  withdrawMinimumPartner: { type: Number, min: 0 },
  // maximum withdraw amount
  withdrawMaximum: { type: Number, min: 0 },
  // MAYA minimum withdraw amount
  MAYAwithdrawMinimum: { type: Number, min: 0 },
  // MAYA maximum withdraw amount
  MAYAwithdrawMaximum: { type: Number, min: 0 },
  // MOMO minimum withdraw amount
  MOMOwithdrawMinimum: { type: Number, min: 0 },
  // MOMO maximum withdraw amount
  MOMOwithdrawMaximum: { type: Number, min: 0 },
  // GCASH minimum withdraw amount
  GCASHwithdrawMinimum: { type: Number, min: 0 },
  // GCASH maximum withdraw amount
  GCASHwithdrawMaximum: { type: Number, min: 0 },
  // GLIFE minimum withdraw amount
  GLIFEwithdrawMinimum: { type: Number, min: 0 },
  // GLIFE maximum withdraw amount
  GLIFEwithdrawMaximum: { type: Number, min: 0 },
  // USDT minimum withdraw amount
  USDTwithdrawMinimum: { type: Number, min: 0 },
  // USDT maximum withdraw amount
  USDTwithdrawMaximum: { type: Number, min: 0 },
  // USDT minimum withdraw amount
  USDTExchangeMinimum: { type: Number, min: 0 },
  // USDT maximum withdraw amount
  USDTExchangeMaximum: { type: Number, min: 0 },
  // promocode last config setting set isActive time
  promoCodeStartTime: { type: Date },
  promoCodeEndTime: { type: Date },
  // promocode last config setting
  promoCodeIsActive: { type: Boolean, default: false },
  //the definition for effective conversation
  conversationDefinition: {
    // sec used for an conversation
    totalSec: { type: Number, min: 0, default: 40 },
    // the number of sentences that the player asks
    askingSentence: { type: Number, min: 0, default: 2 },
    // the number of sentences that the admin replies
    replyingSentence: { type: Number, min: 0, default: 2 }
  },
  //the setting for overtime conversation
  overtimeSetting: [{
    conversationInterval: { type: Number, min: 0, default: 0 },
    presetMark: { type: Number },
    color: { type: String }
  }],
  // set this live800companyId to binding with live800 system
  live800CompanyId: [{ type: String }],
  // get the CS Department for display livechat related conversation
  csDepartment: [{ type: Schema.ObjectId, ref: "department", default: null }],
  // get the QI Department for display livechat related conversation
  qiDepartment: [{ type: Schema.ObjectId, ref: "department", default: null }],
  // Demo Player Prefix Code
  demoPlayerPrefix: { type: String },
  // Demo Player Default Credit
  demoPlayerDefaultCredit: { type: Number, min: 0, default: 0 },
  // manual audit for player first time withdrawal
  manualAuditFirstWithdrawal: { type: Boolean, default: true },
  // manual audit once after player change bank detail
  manualAuditAfterBankChanged: { type: Boolean, default: true },
  // manual audit if player's applyBonus permission banned
  manualAuditBanWithdrawal: { type: Boolean, default: true },
  // manual reward below xx amount, skip audit process
  manualRewardSkipAuditAmount: { type: Number, min: 0, default: 0 },
  // checks that if the balance is lower than the winning or losing limit, it will be unlocked immediately (after re-locking)
  autoUnlockWhenInitAmtLessThanLostThreshold: { type: Boolean, default: false },
  // to check consecutive transfer-in/ transfer-out
  consecutiveTransferInOut: { type: Boolean, default: false },
  // set the maximum duration for the unread mail to be showing up
  unreadMailMaxDuration: { type: Number, min: 0 },
  // call out mission max ring times
  maxRingTime: { type: Number },
  // call out mission redial times
  redialTimes: { type: Number },
  // call out mission minimum redial interval,
  minRedialInterval: { type: Number },
  // call out mission number of call in parallel happen per idle agent
  idleAgentMultiple: { type: Number },
  //client type
  clientData: { type: String },
  //call Request URL config
  callRequestUrlConfig: { type: String },
  // call Request limit per hour (IP)
  callRequestLimitPerHour: { type: Number },
  // call Request limit per hour (phone number)
  callRequestLimitPerHourPhone: { type: Number },
  callRequestLineConfig: [{
    lineId: { type: Number },
    lineName: { type: String },
    minLevel: { type: String },
    status: { type: Number, default: 1 }
  }],
  //playerLevel display list- displayId, displayTitle, displayTextContent, and btnOrImageList
  display: [{
    _id: false,
    displayId: { type: String },
    displayTitle: { type: String },
    displayTextContent: { type: String },
    btnOrImageList: [],
    playerLevel: { type: Schema.ObjectId, ref: "playerLevel" }
  }],
  // CDN/FTP route setting
  playerRouteSetting: { type: String },
  partnerRouteSetting: { type: String },
  //partnerActivePlayerSettlementStatus - 1: Ready for Settlement, 2: Processing
  partnerActivePlayerSettlementStatus: { type: Number, default: 1 },
  partnerActivePlayerLastSettlementTime: { type: Date },
  /*partnerActivePlayerLastSettlementStartTime - indicates the time when user click on the settlement button,
                                                - used for reset the settlement status purpose
                                                - all platforms are having the same time because only one platform can be processed at one time,
  */
  partnerActivePlayerLastSettlementStartTime: { type: Date },
  // financial settlement setting
  financialSettlement: {
    //financial settlement switch
    financialSettlementToggle: { type: Boolean, default: false },
    // financial settlement minimum point to show notification
    minFinancialPointsNotification: { type: Number, default: 0 },
    // financial settlement minimum point notification switch
    financialPointsNotification: { type: Boolean, default: false },
    // financial settlement minimum point to disable withdrawal
    minFinancialPointsDisableWithdrawal: { type: Number, default: 0 },
    // financial settlement minimum point to disable withdrawal switch
    financialPointsDisableWithdrawal: { type: Boolean, default: false }
  },
  financialPoints: { type: Number, default: 0 },
  bankCardGroupIsPMS: { type: Boolean, default: false },
  merchantGroupIsPMS: { type: Boolean, default: false },
  aliPayGroupIsPMS: { type: Boolean, default: false },
  wechatPayGroupIsPMS: { type: Boolean, default: false },
  cryptoPayGroupIsPMS: { type: Boolean, default: false },

  // player theme setting
  playerThemeSetting: {
    themeStyleId: { type: Schema.ObjectId, ref: "themeSetting" },
    themeId: { type: String },
    themeIdObjId: { type: Schema.ObjectId }
  },
  // partner theme setting
  partnerThemeSetting: {
    themeStyleId: { type: Schema.ObjectId, ref: "themeSetting" },
    themeId: { type: String },
    themeIdObjId: { type: Schema.ObjectId }
  },
  frontendConfigurationDomainName: { type: String },
  // call out mission max ring times
  teleMarketingMaxRingTime: { type: Number },
  // call out mission redial times
  teleMarketingRedialTimes: { type: Number },
  // call out mission minimum redial interval,
  teleMarketingMinRedialInterval: { type: Number },
  // call out mission number of call in parallel happen per idle agent
  teleMarketingIdleAgentMultiple: { type: Number },
  // Definition of Answered Phone Call
  definitionOfAnsweredPhone: { type: JSON },
  // default feedback result
  defaultFeedback: {
    defaultTsFeedbackResult: { type: String },
    defaultTsFeedbackTopic: { type: String },
    defaultPlayerFeedbackResult: { type: String },
    defaultPlayerFeedbackTopic: { type: String },
    defaultFeedbackResult: { type: String },
    defaultFeedbackTopic: { type: String }
  },
  // Decompose after N days
  decomposeAfterNDays: { type: Number },
  // Phone White List Auto Export/Maximum Number of Transactions at 4AM Everyday
  phoneWhiteListExportMaxNumber: { type: Number },
  // Switch Payment System - topup , 4 - PMS2
  topUpSystemType: { type: Number, default: 4 },
  // Switch Payment System - bonus, 4 - PMS2
  bonusSystemType: { type: Number, default: 4 },
  // to identify current using FPMS payment method
  isFPMSPaymentSystem: { type: Boolean, default: false },
  // Set supplier to maintenance status if consecutively timed out after N times
  disableProviderAfterConsecutiveTimeoutCount: { type: Number },
  // supplier consecutively timed out search time frame (last N minutes)
  providerConsecutiveTimeoutSearchTimeFrame: { type: Number },
  // Using same player's IP cannot over this limit during registration.
  playerIPRegisterLimit: { type: Number },
  // Using same player's IP Region cannot over this limit during registration.
  playerIPRegionLimit: { type: Number },
  // the time-period to checking If the playerIP/ IP Region is fulfil.
  ipCheckPeriod: { type: Number },
  // check is phone number bound to a player before apply bonus
  isPhoneNumberBoundToPlayerBeforeApplyBonus: { type: Boolean, default: false },
  //withdrawal must upload photo and details
  withdrawalRequiredAdditionalInfo: { type: Boolean, default: false },
  // 前端首绑GCASH检查是否绑定手机号
  bindPhoneNumberWithGlife: { type: Boolean, default: false },
  // 前端首绑Maya检查是否绑定手机号
  bindPhoneNumberWithMaya: { type: Boolean, default: false },
  // disable auto player level up reward switch
  disableAutoPlayerLevelUpReward: { type: Boolean, default: false },
  // service charge rate setting
  pmsServiceCharge: { type: Number },
  // service charge rate setting
  fpmsServiceCharge: { type: Number },
  // if is ebet4.0 user, will generate a ebet4.0 user from cpms
  isEbet4: { type: Boolean, default: false },
  // if true mean use http(env.CpmsWebPlatform or env.CpmsMiscApi)
  cpmsUseHttp: { type: Boolean, default: false },
  // native app version number
  appDataVer: { type: String },
  // is use voice code verification
  useVoiceCode: { type: Boolean, default: false },
  // select which voice code supplier to use - constVoiceCodeProvider
  voiceCodeProvider: { type: Number, default: 1 },
  // display front end reward points ranking data
  displayFrontEndRewardPointsRankingData: { type: Boolean, default: true },
  // Use transfer from last supplier to apply reward
  useTransferFromLastProvider: { type: Boolean, default: false },
  // disable platform login, authentication and kick all connection (usage: APP update)
  disablePlatformLogin: { type: Boolean, default: false },
  // disable platform login whitelist (player name)
  disablePlatformLoginWhiteList: [{ type: String }],
  // disable platform login 2 or more account at once
  disableMultipleLogin: { type: Boolean, default: false },
  //额度丢失自动补单开启 allow auto creation of proposal to add credit back to player in the event of credit lost (transfer failure)
  creditLostAutoFixEnable: { type: Boolean, default: false },
  // Use signature verification for client requests
  clientRequestSignature: { type: Boolean, default: false },
  // Enable transfer in cstest
  enableTransferInDev: { type: Boolean, default: false },
  // iMessage Channel
  iMessageChannel: { type: Number },
  //gameTypeConfig tag interval setting - 2: WEEKLY, 4: MONTHLY (constIntervalPeriod)
  gameTypeTagIntervalSetting: { type: String },
  //gameTypeConfig data interval setting - 2: WEEKLY, 4: MONTHLY (constIntervalPeriod)
  gameTypeDataIntervalSetting: { type: String },
  //total top up
  gameTypeTopUpSum: { type: Number, min: 0, default: 0 },
  //top up times
  gameTypeTopUpTimes: { type: Number, min: 0, default: 0 },
  // convert real player promo code
  convertRewardCode: { type: String },
  // to disable platform USDT search
  disablePlatformUSDTSearch: { type: Boolean, default: false },
  // indicate if GLifeAPI is using v2
  isUsingGLifeAPIV2: { type: Boolean, default: false },
  // Crypto Wallet Protocol
  cryptoProtocol: [{ type: Number, default: false }],
  // allow front-end player to submit withdrawal request for crypto wallet (RMB to USDT)
  allowFrontendSubmitCryptoWithdrawal: { type: Boolean, default: false },
  // allow front-end player to submit withdrawal request for crypto wallet (USDT to RMB)
  allowFrontendPlayerOrPartnerSubmitCryptoOrder: { type: Boolean, default: false },
  // allow front-end partner to submit withdrawal request for crypto wallet
  allowPartnerFrontendSubmitCryptoWithdrawal: { type: Boolean, default: false },
  // allow front-end player/partner to submit withdrawal request for GCASH
  allowFrontendPlayerOrPartnerSubmitGCASHWithdrawal: { type: Boolean, default: false },
  // allow front-end player/partner to submit withdrawal request for maya
  allowFrontendPlayerOrPartnerSubmitMAYAWithdrawal: { type: Boolean, default: false },
  // allow front-end player/partner to submit withdrawal request for GLIFE
  allowFrontendPlayerOrPartnerSubmitGLIFEWithdrawal: { type: Boolean, default: false },
  // allow front-end player/partner to bind GCASH account
  allowFrontendPlayerOrPartnerGCASHBinding: { type: Boolean, default: false },
  // allow front-end player/partner to bind maya account
  allowFrontendPlayerOrPartnerMAYABinding: { type: Boolean, default: false },
  // allow front-end player/partner to bind GLIFE account
  allowFrontendPlayerOrPartnerGLIFEBinding: { type: Boolean, default: false },
  // limit daily apply bonus amount for frontend (include USDT and RMB)
  dailyApplyBonusLimit: { type: Number, min: 0, default: 0 },
  // profit table details
  allProfitDetail: { type: JSON },
  // SMS Verification Setting For partner create downline player
  partnerRequireSMSVerificationForCreateDownlinePlayer: { type: Boolean, default: false },
  // true mean when player got bind partner ignore security deposit
  partnerRequireSecurityDeposit: { type: Boolean, default: false },
  // USDT To RMB Ratio 1 USDT : x RMB
  USDTToRMBRatio: { type: Number },
  // is player allow to transfer between account
  isPlayerAllowToTransferBetweenAccount: { type: Boolean, default: false },
  //USDTOnlywithdraw
  USDTOnlywithdrawMinimum: { type: Number, min: 0 },
  USDTOnlywithdrawMaximum: { type: Number, min: 0 },
  //allowFrontendPartnerOrPlayerSubmitUSDTWithdrawal
  allowFrontendPartnerOrPlayerSubmitUSDTWithdrawal: { type: Boolean, default: false },
  // turn off platform withdrawal / bonus
  turnOffWithdrawal: { type: Boolean, default: false },
  // email language
  emailLanguage: { type: Number, default: 1 },
  // player check login record trigger
  playerCheckLoginDetails: { type: Boolean, default: false },
  // partner check login record trigger
  partnerCheckLoginDetails: { type: Boolean, default: false },
  // is duplicate bank info check by platform
  isCheckDuplicateByPlatform: { type: Boolean, default: false },
  //QnA questions allowed number of total wrong answer
  //if player/partner asnwer wrong QnA questions respectively, player/partner will be banned from using QnA for the day
  playerQnAWrongAnswerSum: { type: Number, default: 5 },
  partnerQnAWrongAnswerSum: { type: Number, default: 5 },
  qnaCityFieldNotRequired: { type: Boolean, default: false },
  platformCreditLostFixEnable: { type: Boolean, default: false },
  //platform timeZone
  timeZone: { type: Number, default: 8 },
  //For passing to pms
  country: { type: String, default: "CN"/*index: true*/ },
  // isActive false won't run schedule function
  isActive: { type: Boolean, default: true },
  smsChannelCondition: [{
    _id: false,
    channel: [],
    phoneType: [],
    province: [],
    city: []
  }],
  isUsingGCashAPI: { type: Boolean, default: false },
  //sms content maximum text length
  smsContentMaxLength: { type: Number, default: 100 },
  // "GLOBE" VN supplier replace URL when SMS (dot to space)
  smsReplaceURL: { type: Boolean, default: false },
  // platform email unique
  playerEmailUnique: { type: Boolean, default: false },
  // same email to register count
  sameEmailRegisterCount: { type: Number, default: 1 },
  // Verification Setting For Email Update
  requireVerificationForEmailUpdate: { type: Boolean, default: false },
  // last midnight balance record time
  lastSettleTime: { type: Date, default: Date.now },
  // disable createGuestPlayer API
  disableCreateGuestPlayerAPI: { type: Boolean, default: false },
  // 尝试开户监控配置
  attemptCreateSetting: { type: Boolean, default: false },
  //register must upload photo and details
  registerRequiredAdditionalInfo: { type: Boolean, default: false },
  //flag for deposit bypass rtg
  isBypassRTGWhenDeposit: { type: Boolean, default: false },
  //flag for no source need kyc
  noSourceNeedKYC: { type: Boolean },
  // nick name length
  nickNameMinMax: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  //last manual platform player consumption return settlement time
  lastManualConsumptionReturnSettlementTime: { type: Date },
  monitorSameLineRoute: [],
  monitorSameLineMinute: { type: Number, min: 0 },
  monitorSameLineRecord: { type: Number, min: 0 },
  monitorSameLineUseSound: { type: Boolean, default: false },
  monitorSameLineSoundChoice: { type: String },
  monitorSamePlayerRoute: [],
  monitorSamePlayerRecord: { type: Number, min: 0 },
  monitorSamePlayerUseSound: { type: Boolean, default: false },
  monitorSamePlayerSoundChoice: { type: String },
  KYCAPICallbackURL: { type: String },
  playerDailyRecordLastUpdateTime: { type: Date },
  playerDailyRecordLastProcessingTime: { type: Date },
  playerDailyRecordLastUpdateStatus: { type: String, default: "Ready" },
  MayaRedirectUrl: { type: String },
  hideUsdtData: { type: Boolean, default: true },
  unusualBettingConfig: [{
    value: { type: Number, min: 0, default: 0 },
    gameTitle: { type: String, default: "" },
    providers: [{ type: Schema.ObjectId }]
  }],
  spikeGiftConfig: {
    receiveSpikeGift: { type: Boolean, default: false }, // For Withdraw person permission checking need verifySMS
    claimSpikeGift: { type: Boolean, default: false }, // For Topup person permission checking need verifySMS
    cancellationDuration: { type: Number },
    restrictedProduct: [],
    restrictedIp: { type: Boolean, default: false },
    restrictedIpArea: { type: Boolean, default: false },
    restrictedPhoneArea: { type: Boolean, default: false },
    rewardCode: { type: String }
  }
});

platformSchema.plugin(mongoosePaginate);
module.exports = platformSchema;
