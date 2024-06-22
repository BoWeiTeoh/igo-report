const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.ipConfig?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.ipConfig?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.ipConfig?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.ipConfig?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.ipConfig?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.ipConfig?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  return dbModel?.ipConfig?.distinct(key, query);
};

const updateConfig = (status) => {
  return ipConfigMethod.findOneAndUpdate({}, { config: status }, { upsert: true });
};

const ipConfigMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  updateConfig
};

module.exports = ipConfigMethod;