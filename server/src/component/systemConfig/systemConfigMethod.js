const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.systemConfig?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.systemConfig?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.systemConfig?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.systemConfig?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.systemConfig?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.systemConfig?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  return dbModel?.systemConfig?.distinct(key, query);
};

const updateConfig = (status) => {
  return systemConfigMethod.findOneAndUpdate({}, { config: status }, { upsert: true });
};

const systemConfigMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  updateConfig
};

module.exports = systemConfigMethod;
