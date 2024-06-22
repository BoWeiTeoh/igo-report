const dbModel = require("../../db/dbModel");
const vaultData = require("../../vault/config");

const find = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.supplier?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  query = _processGovQuery(query);
  return dbModel?.supplier?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.supplier?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  query = _processGovQuery(query);
  return dbModel?.supplier?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.supplier?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  query = _processGovQuery(query);
  return dbModel?.supplier?.paginate(query, options);
};

const _processGovQuery = (query) => {
  if (vaultData?.getData()?.["ENV_DOMAIN"] === "gov") {
    const providerArr = vaultData?.getData()?.["GOV_PROVIDER"];
    if (!query?.providerId) {
      query.providerId = {$in: providerArr}
    }
  }
  return query;
}

const adminMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate
};

module.exports = adminMethod;
