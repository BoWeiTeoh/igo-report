const connectToDb = require("./connect");
const userSchema = require("../component/admin/userSchema");
const permissionSchema = require("../component/permission/permissionSchema");
const resourceSchema = require("../component/resource/resourceSchema");
const roleSchema = require("../component/role/roleSchema");
const siteTypeSchema = require("../component/siteType/siteTypeSchema");
const categorySchema = require("../component/category/categorySchema");
const branchSchema = require("../component/branch/branchSchema");
const operationLogSchema = require("../component/operationLog/operationLogSchema");
const consumptionSummaryListSchema = require("../component/consumptionSummaryList/consumptionSummaryListSchema");
const consumptionSummarySchema = require("../component/consumptionSummary/consumptionSummarySchema");
const systemStatusSchema = require("../component/systemStatus/systemStatusSchema");
const streamFileSchema = require("../component/streamFile/streamFileSchema");
const systemConfigSchema = require("../component/systemConfig/systemConfigSchema");
const restartLogSchema = require("../component/restartLog/restartLogSchema");
const departmentSchema = require("../component/department/departmentSchema");
const proposalTypeSchema = require("../component/proposalType/proposalTypeSchema");
const proposalSchema = require("../component/proposal/proposalSchema");
const playerCreditTransferLogSchema = require("../component/playerCreditTransferLog/playerCreditTransferLogSchema");
const configSchema = require("../component/config/configSchema");
const ipConfigSchema = require("../component/ipConfig/ipConfigSchema");
const platformGameGroupSchema = require("../component/platformGameGroup/platformGameGroupSchema");

// FPMS
const platformSchema = require("../component/platform/platformSchema");
const supplierSchema = require("../component/supplier/supplierSchema");
const playerConsumptionRecordSchema = require("../component/playerConsumptionRecord/playerConsumptionRecordSchema");
const gameSchema = require("../component/game/gameSchema");
const playerInfoSchema = require("../component/player/playerInfoSchema");
const gameTypeSchema = require("../component/gameType/gameTypeSchema");
const platformGameStatusSchema = require("../component/platformGameStatus/platformGameStatusSchema");
const providerGamesMinuteSummarySchema = require("../component/jackpot/providerGamesMinuteSummarySchema");

const dbModel = {
  // FPMS DBA
  platform: connectToDb.adminDB?.model("platform", platformSchema, "platform"),
  supplier: connectToDb.adminDB?.model("gameProvider", supplierSchema, "gameProvider"),
  playerConsumptionRecord: connectToDb.consumptionDB?.model(
    "playerConsumptionRecord",
    playerConsumptionRecordSchema,
    "playerConsumptionRecord"
  ),
  game: connectToDb.adminDB?.model("game", gameSchema, "game"),
  gameType: connectToDb.adminDB?.model("gameType", gameTypeSchema, "gameType"),
  player: connectToDb.playerDB?.model("playerInfo", playerInfoSchema, "playerInfo"),
  proposalType: connectToDb.adminDB?.model("proposalType", proposalTypeSchema, "proposalType"),
  proposal: connectToDb.proposalDB?.model("proposal", proposalSchema, "proposal"),
  playerCreditTransferLog: connectToDb.logsDB?.model("playerCreditTransferLog",playerCreditTransferLogSchema,"playerCreditTransferLog"),
  platformGameStatus: connectToDb.adminDB?.model("platformGameStatus", platformGameStatusSchema, "platformGameStatus"),
  providerGamesMinuteSummary: connectToDb.logs2db?.model("providerGamesMinuteSummary", providerGamesMinuteSummarySchema, "providerGamesMinuteSummary"),
  platformGameGroup: connectToDb.adminDB?.model("platformGameGroup", platformGameGroupSchema, "platformGameGroup"),

  // IGO
  user: connectToDb.gameZoneDB.model("User", userSchema, "users"),
  permission: connectToDb.gameZoneDB.model("Permission", permissionSchema, "permissions"),
  resource: connectToDb.gameZoneDB.model("Resource", resourceSchema, "resources"),
  role: connectToDb.gameZoneDB.model("Role", roleSchema, "roles"),
  operationLog: connectToDb.gameZoneDB.model("OperationLog", operationLogSchema, "operationLogs"),
  siteType: connectToDb.gameZoneDB.model("SiteType", siteTypeSchema, "siteTypes"),
  category: connectToDb.gameZoneDB.model("Category", categorySchema, "categories"),
  branch: connectToDb.gameZoneDB.model("Branch", branchSchema, "branches"),
  consumptionSummaryList: connectToDb.gameZoneDB.model(
    "ConsumptionSummaryList",
    consumptionSummaryListSchema,
    "consumptionSummaryList"
  ),
  consumptionSummary: connectToDb.gameZoneDB.model(
    "ConsumptionSummary",
    consumptionSummarySchema,
    "consumptionSummary"
  ),
  systemStatus: connectToDb.gameZoneDB.model("SystemStatus", systemStatusSchema, "systemStatus"),
  streamFile: connectToDb.gameZoneDB.model("StreamFile", streamFileSchema, "streamFile"),
  systemConfig: connectToDb.gameZoneDB.model("SystemConfig", systemConfigSchema, "systemConfig"),
  ipConfig: connectToDb.gameZoneDB.model("IpConfig", ipConfigSchema, "ipConfig"),
  restartLog: connectToDb.gameZoneDB.model("RestartLog", restartLogSchema, "restartLog"),
  department: connectToDb.gameZoneDB.model("Department", departmentSchema, "department"),
  config: connectToDb.gameZoneDB.model("Config", configSchema, "config")
};

module.exports = dbModel;
