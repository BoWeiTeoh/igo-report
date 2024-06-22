const dbModel = require("../../db/dbModel");
const vaultData = require("../../vault/config");

const find = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.platform?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.platform?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.platform?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  query = _processGovQuery(query);
  return dbModel?.platform?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.platform?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.platform?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  query = _processGovQuery(query);
  return dbModel?.platform?.distinct(key, query);
};

const _processGovQuery = (query) => {
  if (vaultData?.getData()?.["ENV_DOMAIN"] === "gov") {
    const platformArr = vaultData?.getData()?.["GOV_PLATFORM"];
    if (!query?.platformId) {
      query.platformId = {$in: platformArr}
    }
  }
  return query;
}

const platformMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct
};

module.exports = platformMethod;
