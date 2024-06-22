require("dotenv").config({ path: "../../.env" });
const { initVault } = require("../common/initService");
const {logger} = require("../helper/utilPinoLogger");

initVault("script")
  .then(() => {
    randomInsertData().then();
  })
  .catch((e) => {
    logger.error({"initVault adminService": e});
  });

let runTime = 100;
let gameArr = [];
const roundNumbers = [
  'BPJP1-240416131348', 'CGJP1-240425114803', 'CG01-240502171030', 'ADCG03-240520100939', 'CGJP1-240301173703',
  'CGJP1-240305102553', 'CG01-240409133713', 'E007-240507144818', 'CGBP1-240510145359', 'WF-240517110435',
  'P1WF-240520124950', 'F001-240502165109', 'E002-240502170419', 'CGJP1-240420105907', 'CGJP1-240418151748',
  'CGJP2-240301151233', 'CG01-240416155255', 'CG01-240416155342', 'CGJP2-240305094837', 'CGJP1-240418100125',
  'CGJP1-240425163911', 'CG01-240306095558', 'BPJP1-240416140128', 'BPJP1-240416140100', 'CGJP1-240305150711',
  'ADCG03-240509144319', 'CGJP1-240409140037', 'CG01-240305141543', 'CG01-240425144321', 'CG01-240510111709',
  'ADCG03-240513095636', 'ADCG03-240307113600', 'E001-240418132832', 'CG01-240305125316', 'CGJP2-240307174830',
  'E002-240509145120', 'CG01-240422153435', 'CGJP2-240429164457', 'E01WF-240517180541', 'C9-240424160627',
  'CGJP2-240306135226', 'E002-240426104529', 'ADCG03-240509174921', 'CGJP2-240306135342', 'WF-240515161432',
  'ADCG03-240305113655', 'CGJP1-240305103122', 'F001-240426103727', 'CGJP1-240409140755', 'CGJP1-240418115933',
  'CGJP2-240429163127', 'ADCG03-240307113653', 'ADCG03-240307113719', 'ADCG03-240307113746', 'CGJP2-240401114357',
  'C9-240514162406', 'WF-240515122002', 'ADCG03-240509144749', 'E01WF-240517180434', 'ADCG03-240509161149',
  'CGBP1-240305143529', 'E006-240514152253', 'KA2-240305102239', 'CGMJPV1-240307110616', 'CGJP2-240506155530',
  'CGJP1-240425113440', 'F001-240502165242', 'E001-240508163019', 'ADCG03-240509142353', 'CRO-240424172403',
  'CG01-240514140039', 'WF-240515095328', 'E007-240502162152', 'CGJP1-240429160715', 'CGBP1-240423142431',
  'ADCG03-240305114009', 'CGLU2-240506135706', 'CGLU2-240430175846', 'ADCG03-240509105857', 'CGJP2-240301153811',
  'CGJP2-240429164356', 'CG01-240510134824', 'KA2-240305101753', 'CGJP4-240401113951', 'E001-240509154438',
  'ADCG03-240305113845', 'ADCG03-240305113938', 'P1WF-240520124830', 'KA-240129160758', 'BPJP1-240422145112',
  'ADCG03-240510183210', 'BPJP1-240416130904', 'KA2-240306115339', 'CGJP2-240429164114', 'CGJP2-240429164137',
  'ADCG03-240509155659', 'CGBP1-240510153617', 'CGBP1-240510153647', 'E001-240305144259', 'CGJP2-240301162019',
  'CG01-240305105953', 'LLU-240412104520', 'LLU-240412104543', 'ADCG03-240513091616', 'WF-240515095359',
  'ADCG03-240514154323', 'E001-240409153505', 'CG01-240307143301'
];

const randomInsertData = async () => {
  const dbModel = require("../db/dbModel");
  let array = [];
  let gameTypeObj = {};
  const gameTypes = await dbModel.gameType.find().lean();
  for (const gameType of gameTypes) {
    gameTypeObj[gameType.gameTypeId] = gameType._id;
  }

  const platform = await dbModel.platform.findOne({ platformId: process.argv[2] }, { gameProviders: 1 }).lean();

  const games = await dbModel.game.find({ provider: { $in: platform.gameProviders } }, { type: 1 }).lean();

  for (const gameProvider of platform.gameProviders) {
    for (const game of games) {
      gameArr.push({
        providerId: gameProvider,
        gameId: game._id,
        gameTypeId: gameTypeObj[game.type]
      });
    }
  }

  let count = 500000;

  for (let i = 0; i < count; i++) {
    console.log("START", i);
    array = [];
    for (let j = 0; j < runTime; j++) {
      let playerName = "fgtesty" + String(Math.floor(Math.random() * 10000) + 10001);
      let playerId = await dbModel.player.findOne({ name: playerName }, { _id: 1 }).lean();
      let randGame = Math.floor(Math.random() * gameArr.length);
      let randAmount = Math.floor(Math.random() * 10000) + 1;
      let randValid = Math.floor(Math.random() * 10000) + 1;
      let randBonus = Math.floor(Math.random() * 20000) - 10000;
      let randHours = Math.floor(Math.random() * 23) + 1;
      let randMinutes = Math.floor(Math.random() * 59) + 1;
      let rand = Math.floor(Math.random() * 999999999);
      let date = new Date();
      date = new Date(date.setDate(date.getDate()));
      date = new Date(date.setHours(randHours));
      date = new Date(date.setMinutes(randMinutes));
      let playerGame = gameArr[randGame];

      if(!playerId){
        continue;
      }
      let randRoundNo = roundNumbers[Math.floor(Math.random() * roundNumbers.length)];
      let recordData = {
        playerId: playerId._id,
        platformId: platform._id,
        providerId: playerGame.providerId,
        gameId: playerGame.gameId,
        gameType: playerGame.gameTypeId,
        amount: randAmount,
        validAmount: randValid,
        bonusAmount: randBonus,
        cpGameType: "fgTestFakeData123",
        orderNo: playerName + String(rand),
        createTime: date,
        roundNo: randRoundNo
      };
      if (j === 0) {
        console.log("CHECK recordData", recordData);
      }
      let newRecord = new dbModel.playerConsumptionRecord(recordData);
      array.push(
        newRecord.save().catch((err) => {
          console.log("newPlayer err", err);
        })
      );
    }
    await Promise.all(array);
    console.log("END", i);
  }
  return Promise.resolve(true);
};
