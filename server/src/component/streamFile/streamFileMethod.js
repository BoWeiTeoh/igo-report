const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.streamFile?.find(query, filter).lean();
};

const findOne = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.streamFile?.findOne(query, filter);

  if (populateField && populateOptions?.path) {
    queryBuilder = queryBuilder.populate({
      model: dbModel[populateField],
      path: populateOptions?.path,
      select: populateOptions?.select
    });
  }
  let document;
  document = await queryBuilder.lean();

  return document;
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.streamFile?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.streamFile?.findOneAndUpdate(query, updateData, options);
};

const count = (query = {}) => {
  return dbModel?.streamFile?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.streamFile?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.streamFile?.paginate(query, options);
};

const deleteMany = (query) => {
  if (query?.fileName) {
    return dbModel?.streamFile?.deleteMany(query);
  }
};

const streamFileMethod = {
  find,
  findOne,
  findOneAndUpdate,
  updateOne,
  count,
  create,
  paginate,
  deleteMany
};

module.exports = streamFileMethod;