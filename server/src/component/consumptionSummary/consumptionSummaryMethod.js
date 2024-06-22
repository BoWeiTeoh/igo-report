const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.consumptionSummary?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.consumptionSummary?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.consumptionSummary?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.consumptionSummary?.updateOne(query, updateData, options).lean();
};

const deleteOne = (query = {}) => {
  return dbModel?.consumptionSummary?.deleteOne(query).lean();
}

const deleteMany = (query = {}) => {
  return dbModel?.consumptionSummary?.deleteOne(query).lean();
}

const count = (query = {}) => {
  return dbModel?.consumptionSummary?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.consumptionSummary?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.consumptionSummary?.paginate(query, options);
};

const aggregate = (matchQuery = {}, groupQuery = {}, projectQuery = {}) => {
  const pipeline = [
  ];

  if (matchQuery) {
    pipeline.push({
      $match: matchQuery
    });
  }

  if (projectQuery) {
    pipeline.push({
      $project: projectQuery
    });
  }

  if (groupQuery) {
    pipeline.push({
      $group: groupQuery
    });
  }

  return dbModel.consumptionSummary.aggregate(pipeline).allowDiskUse(true);
};

const consumptionSummaryMethod = {
  find,
  findOne,
  findOneAndUpdate,
  updateOne,
  count,
  create,
  paginate,
  aggregate,
  deleteOne,
  deleteMany
};

module.exports = consumptionSummaryMethod;
