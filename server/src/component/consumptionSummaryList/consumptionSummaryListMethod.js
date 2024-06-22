const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {}) => {
  return dbModel?.consumptionSummaryList?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.consumptionSummaryList?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.consumptionSummaryList?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.consumptionSummaryList?.updateOne(query, updateData, options).lean();
};

const deleteMany = (query = {}) => {
  return dbModel?.consumptionSummaryList?.deleteMany(query);
}

const count = (query = {}) => {
  return dbModel?.consumptionSummaryList?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.consumptionSummaryList?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.consumptionSummaryList?.paginate(query, options);
};

const generateSummaryList = async (data) => {

  const { createTime, branch, supplier } = data;
  let startTime = new Date(createTime.startTime);
  const endTime = new Date(createTime.endTime);
  const interval = 60 * 1000; // 1 minute in milliseconds

  let updateData = {
    platform: branch,
    supplier: supplier
  };
  while (startTime <= endTime) {
    updateData.betTime = startTime;
    await updateOne(updateData, { $set: { isSettle: false } }, { upsert: true });
    startTime = new Date(startTime.setTime(startTime.getTime() + interval));
  }
};

const consumptionSummaryListMethod = {
  find,
  findOne,
  findOneAndUpdate,
  updateOne,
  deleteMany,
  count,
  create,
  paginate,
  generateSummaryList
};

module.exports = consumptionSummaryListMethod;
