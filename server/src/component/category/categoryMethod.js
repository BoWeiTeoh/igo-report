const dbModel = require("../../db/dbModel");

const find = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
  let queryBuilder = dbModel?.category?.find(query, filter);

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

const findOne = (query = {}, filter = {}) => {
  return dbModel?.category?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.category?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.category?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.category?.create(saveData);
};

const paginate = (query = {}, paginateOption = {}, supplier = []) => {
  const options = {
    ...paginateOption,
    populate: [{
      model: dbModel.supplier,
      path: "supplier",
      select: "providerId name",
      match: {_id: {$in: supplier}}
    }]
  };
  return dbModel?.category?.paginate(query, options);
};

const distinct = (name = "_id", query = {}) => {
  return dbModel?.category?.distinct(name, query);
};

const getCategorySuppliers = async (category) => {
  const categoryQuery = { _id: { $in: category } };
  const categoryFilter = {};
  const categoryPopulateField = "supplier";
  const categoryPopulateOptions = { path: "supplier", select: "_id" };
  const providers = await find(categoryQuery, categoryFilter, categoryPopulateField, categoryPopulateOptions);

  return providers.reduce((suppliers, provider) => {
    suppliers.push(...provider?.supplier.map(supplier => supplier._id) || []);
    return suppliers;
  }, []);
};

const categoryMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  getCategorySuppliers
};

module.exports = categoryMethod;
