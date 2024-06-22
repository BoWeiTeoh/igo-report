const dbModel = require("../../db/dbModel");

const find = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.branch?.find(query, filter);

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
  return dbModel?.branch?.findOne(query, filter).lean();
};

const findOneAndUpdate = async (query = {}, updateData = {}, options = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.branch?.findOneAndUpdate(query, updateData, options);

  if (populateField && populateOptions?.path) {
    queryBuilder = queryBuilder.populate({
      model: populateField,
      path: populateOptions?.path,
      select: populateOptions?.select,
      match: populateOptions?.match
    });
  }

  let document;
  document = await queryBuilder.lean();

  return document;
};

const count = (query = {}) => {
  return dbModel?.branch?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.branch?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.branch?.paginate(query, options);
};

const getBranchWithPlatform = async (platform) => {
  const query = { platform: platform?._id };
  const updateData = { name: platform?.name };
  const options = { upsert: true, new: true };
  const populateOptions = { path: "siteType", select: "name" };

  const branch = await findOneAndUpdate(query, updateData, options, dbModel.siteType, populateOptions);
  return {
    ...branch,
    name: platform.name
  };
};

const branchMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  getBranchWithPlatform
};

module.exports = branchMethod;
