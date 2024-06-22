require("dotenv").config();
const Mongoose = require("mongoose");
const vaultData = require("../vault/config");
const constSystemParam = require("../const/constSystemParam")
const {logger, defaultLogger} = require("../helper/utilPinoLogger");

const createConnection = (dbURL, dbName) => {
  // Database connect options
  let connectionUrl = dbURL;
  if (connectionUrl) {
    logger.info({ConnectionUrl: connectionUrl});
    // console.log(`${dbName} connectionUrl ${connectionUrl}`);
  } else {
    logger.warn({dbName: `${dbName} connectionUrl not set`});
    return null;
  }

  const options = {
    connectTimeoutMS: 45000,
    socketTimeoutMS: 60000,
    retryWrites: true,
    autoIndex: false,
    maxPoolSize: 5,
    heartbeatFrequencyMS: 10000, //define how long to retry connect
    serverSelectionTimeoutMS: 120000 //define how long to wait when initiate connection first time
  };

  Mongoose.set("maxTimeMS", constSystemParam.COUNT_MAX_TIME_MS_TIMEOUT);
  try {
    // let db = Mongoose?.createConnection("mongodb://".concat(connectionUrl), options);
    let db = Mongoose?.createConnection(connectionUrl, options);

    db.on("error", function(err) {
      // console.error(new Date(), `Mongoose connect error ${String(err)}`);
      logger.error({"Mongoose connect error": String(err)});
    });

    db.once("open", function() {
      defaultLogger.info({"Mongoose connected to": dbName});
      // console.log(new Date(), `Mongoose connected to ${dbName}.`);
    });

    db.once("reconnected", function() {
      defaultLogger.info({DB: `${dbName} RECONNECTED`});
      // console.log(new Date(), `DB ${dbName} RECONNECTED `);
    });

    return db;
  } catch (err) {
    defaultLogger.warn({"Could not connect to": `${dbName}. Url : \`, dbURL`});
    // console.warn(`Could not connect to ${dbName}. Url : `, dbURL);
    return null;
  }
};

const gameZoneDB = createConnection(vaultData?.getData()["DB_GAMEZONE"] || process.env.DB_GAMEZONE, "gameZoneDB");
const logsDB = createConnection(vaultData?.getData()["DB_LOGSDB"] || process.env.DB_LOGSDB, "logsDB");
const adminDB = createConnection(vaultData?.getData()["DB_ADMINDB"] || process.env.DB_ADMINDB, "adminDB");
const playerDB = createConnection(vaultData?.getData()["DB_PLAYER"] || process.env.DB_PLAYER, "playerDB");
const proposalDB = createConnection(vaultData?.getData()["DB_PROPOSAL"] || process.env.DB_LOGSDB, "proposalDB");
const consumptionDB = createConnection(vaultData?.getData()["DB_CONSUMPTION"] || process.env.DB_CONSUMPTION, "consumptionDB");
const logs2db = createConnection(vaultData?.getData()["DB_LOGS2"] || process.env.DB_LOGS2, "logs2db");

const dbConnections = {
  gameZoneDB,
  logsDB,
  adminDB,
  playerDB,
  proposalDB,
  consumptionDB,
  logs2db
};

module.exports = dbConnections;
