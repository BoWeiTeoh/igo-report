const dbModel = require("../../db/dbModel");
const { constCommonError} = require("../../const/constErrorCode");

const find = (query = {}, filter = {}) => {
  return dbModel?.role?.find(query, filter).lean();
};

const findOne = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.role?.findOne(query, filter);

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
  return dbModel?.role?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.role?.findOneAndUpdate(query, updateData, options);
};

const count = (query = {}) => {
  return dbModel?.role?.countDocuments(query);
};

const create = (saveData) => {
  if (!saveData?.department) {
    throw (constCommonError.COMMON("Department").NOT_SELECT);
  }
  return dbModel?.role?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.role?.paginate(query, options);
};

const roleMethod = {
  find,
  findOne,
  findOneAndUpdate,
  updateOne,
  count,
  create,
  paginate
};

module.exports = roleMethod;
