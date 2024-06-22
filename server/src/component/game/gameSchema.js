const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  //simplified gameId
  gameId: { type: String, unique: true/*index: true*/ },
  //game name
  name: { type: String, required: true/*index: true*/ },
  //customized game name list by platform
  changedName: { type: JSON },
  //game title
  title: { type: String/*index: true*/ },
  //code
  code: { type: String, required: true/*index: true*/ },
  //aliasCode ["g1","g2","g3"]
  aliasCode: String,
  //big Game Icon
  bigShow: String,
  //small game icon
  smallShow: String,
  //if game is visible
  visible: { type: Boolean, default: false },
  //if this game has trial account
  canTrial: { type: Boolean, default: false },
  //Game Type
  type: { type: String, required: true/*index: true*/ },
  //game description
  description: { type: String, default: null/*index: true*/ },
  //game region name
  regionName: {
    "EN": { type: String/*index: true*/ },
    "CN": { type: String/*index: true*/ },
    "VN": { type: String/*index: true*/ },
    "TH": { type: String/*index: true*/ }
  },
  //game supplier
  provider: { type: Schema.ObjectId, ref: "gameProvider"/*index: true*/ },
  //status
  status: { type: Number, default: 1/*index: true*/ },
  //display order
  showPriority: { type: Number },
  //1: flash, 2: html5
  playGameType: { type: String/*index: true*/ },
  //progressive game code
  progressivegamecode: { type: String },
  //game images
  images: { type: JSON },
  // sourceURL to add in front of images url if CDN not set up
  sourceURL: { type: String },
  // game display : 1.horizontal 2.vertical 3. horizontal/vertical 4. no need setup
  webp: { type: String },
  // webp image format url
  gameDisplay: { type: String },
  //Game Recommended Setting for same game but different platform
  gameRecommendedSetting: [{
    // Platform object ID
    platformObjId: { type: Schema.ObjectId/*index: true*/ },
    //1: 新游戏; 2: 火热; 3: 优惠活动
    recommendContent: { type: Number/*index: true*/, default: 0 },
    // 1： 打开新页面; 2: 活动详情; 3: 跳转站指定优惠页面; 4: 跳转至官网某页面; 5: 启动游戏; 6: 啥都不干
    onClickAction: { type: Number },
    //  ftp url for uploaded pc image
    imageUrl: { type: String },
    // the ftp url for uploaded new page image
    newPageUrl: { type: String },
    // the ftp url for uploaded activity iframe url
    activityUrl: { type: String },
    // reward event Code
    rewardCode: { type: String },
    // the route to official web page
    route: { type: String },
    // the game code
    gameCode: { type: String },
    rtp: { type: Number },
    introduction: { type: String },
    longIntroduction: { type: String }
  }],

  recommendContent: { type: Number/*index: true*/, default: 0 },
  // 1： 打开新页面; 2: 活动详情; 3: 跳转站指定优惠页面; 4: 跳转至官网某页面; 5: 启动游戏; 6: 啥都不干
  onClickAction: { type: Number },
  //  ftp url for uploaded pc image
  imageUrl: { type: String },
  // the ftp url for uploaded new page image
  newPageUrl: { type: String },
  // the ftp url for uploaded activity iframe url
  activityUrl: { type: String },
  // reward event Code
  rewardCode: { type: String },
  // the route to official web page
  route: { type: String },
  // the game code
  gameCode: { type: String },
  // orientation: 1=landscape , 2=Portrait 3=default
  orientation: { type: String },
  orientationSetting: { type: JSON }
});

module.exports = gameSchema;
