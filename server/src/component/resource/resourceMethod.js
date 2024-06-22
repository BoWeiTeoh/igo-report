const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.resource?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.resource?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.resource?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.resource?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.resource?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.resource?.paginate(query, options);
};

const adminMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate
};

module.exports = adminMethod;
