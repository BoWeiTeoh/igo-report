require("dotenv").config({ path: "../../.env" });
const { initVault } = require("../common/initService");
const dbModel = require("../db/dbModel");

const phoneNumPrefix = "6397777";
const pad = "00000";
const defaultPassword = "7777777";
const guestDeviceId = "fgtesty1234123412341234";

let phoneNumber = "639696186964";
let realName = "FG,TEST";
let defaultPlayerName = "fgtesty";

const platformId = process.argv[2] || "50";
const realNamePrefix = process.argv[3];
let counter = (process.argv[4] && Number(process.argv[4])) || 10000;
// let successCounter = 10000;
let maximumPlayersAmount = (process.argv[5] && Number(process.argv[5])) || 10001;
let runTime = (process.argv[6] && Number(process.argv[6])) || 1;

if (realNamePrefix) {
  realName = realName + realNamePrefix;
  defaultPlayerName = defaultPlayerName + realNamePrefix;
}

initVault("script").then(() => {
  randomInsertData().then();
}).catch(e => {
  console.log("initVault adminService", e);
});

const randomInsertData = async () => {
  const platform = await dbModel.platform.findOne({ platformId: platformId }, { _id: 1, name: 1 }).lean();
  let array = [];
  for (let i = 0; i < maximumPlayersAmount; i++) {
    array = [];
    for (let j = 0; j < runTime; j++) {
      let str = "" + counter;
      let ans = phoneNumPrefix + pad.substring(0, pad.length - str.length) + str;
      phoneNumber = ans;
      let platformObjId = platform._id;
      let playerName = defaultPlayerName + counter;
      let playerData = {
        phoneNumber: ans,
        realName: realName,
        platform: platformObjId,
        name: playerName,
        guestDeviceId: guestDeviceId,
        password: defaultPassword,
        nickName: playerName
      };

      let newPlayer = new dbModel.player(playerData);
      array.push(newPlayer.save());
      counter++;
    }
    await Promise.all(array);
  }
};

