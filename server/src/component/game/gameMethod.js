const dbModel = require("../../db/dbModel");
const vaultData = require("../../vault/config");

const find = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.game?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.game?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.game?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  query = _processGovQuery(query);
  return dbModel?.game?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.game?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.game?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  query = _processGovQuery(query);
  return dbModel?.game?.distinct(key, query);
};

const getGameIds = async (game) => {
  if (!Array.isArray(game)) return null;

  return distinct({"regionName.EN": {$in: game}});
}

const getGameCodeIds = async (gameCode) => {
  if (!gameCode) return null;

  return distinct({code: gameCode});
}

const _processGovQuery = (query) => {
  if (vaultData?.getData()?.["ENV_DOMAIN"] === "gov") {
    query.certificationStatus = true
  }
  return query;
}

const adminMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  getGameIds,
  getGameCodeIds
};

module.exports = adminMethod;
