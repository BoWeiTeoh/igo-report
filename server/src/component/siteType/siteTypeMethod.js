const dbModel = require("../../db/dbModel");

const find = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.siteType?.find(query, filter);

  if (populateField && populateOptions?.path) {
    queryBuilder = queryBuilder.populate({
      model: dbModel[populateField],
      path: populateOptions?.path,
      select: populateOptions?.select,
      match: populateOptions?.match,
      populate: populateOptions?.populate
    });
  }
  let document;
  document = await queryBuilder.lean();

  return document;
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.siteType?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.siteType?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.siteType?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.siteType?.create(saveData);
};

const paginate = (query = {}, options = {}, category = []) => {
  const paginateOption = {
    ...options,
    populate: [{
      model: dbModel.category,
      path: "category",
      select: "name",
      match: {_id: {$in: category}}
    }]
  };
  return dbModel?.siteType?.paginate(query, paginateOption);
};

const distinct = (name = "_id", query = {}) => {
  return dbModel?.siteType?.distinct(name, query);
};

const adminMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct
};

module.exports = adminMethod;
