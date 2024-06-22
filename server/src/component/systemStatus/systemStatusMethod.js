const dbModel = require("../../db/dbModel");
const { constStreamFileStatus } = require("../../const/constStatus");
const streamFileMethod = require("../streamFile/streamFileMethod");

const find = (query = {}, filter = {}) => {
  return dbModel?.systemStatus?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.systemStatus?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.systemStatus?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.systemStatus?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.systemStatus?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.systemStatus?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  return dbModel?.systemStatus?.distinct(key, query);
};

const updateStatus = (status) => {
  return systemStatusMethod.findOneAndUpdate({}, { isGenerate: status }, { upsert: true });
};

const getStatus = async () => {
  let currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() - 1);

  const systemStatusQuery = {
    updatedAt: { $gte: currentDate },
    isGenerate: true
  };
  const systemStatusProm = systemStatusMethod.findOne(systemStatusQuery);

  const streamFileQuery = {
    updatedAt: { $gte: currentDate },
    status: { $lt: constStreamFileStatus.SUCCESS }
  };
  // 检查看15分钟内有没有任何文件正在更新中 (只要有任何一个任务的更新时间大于15分钟前与状态不是成功，返回function no available)
  const streamFileProcessProm = streamFileMethod.findOne(streamFileQuery);

  const [systemStatus, streamFileProcess] = await Promise.all([systemStatusProm, streamFileProcessProm]);

  // TRUE = 可以reg
  // FALSE = 不可以reg
  return !(systemStatus || streamFileProcess);
};

const systemStatusMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  updateStatus,
  getStatus
};

module.exports = systemStatusMethod;
