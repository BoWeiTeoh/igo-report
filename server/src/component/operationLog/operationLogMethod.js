const dbModel = require("../../db/dbModel");
const { cloneObj, safeStringify } = require("../../helper/utilObject");
const {logger} = require("../../helper/utilPinoLogger");

const KEY_IGNORES = ["__v", "createdAt", "_id", "updatedAt"];

const find = () => {
  return dbModel?.operationLog?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.operationLog?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.operationLog?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.operationLog?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.operationLog?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.operationLog?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  return dbModel?.operationLog?.distinct(key, query);
};

const makeOperationLogData = ({ ori = {}, changed = {}, keys = [] }) => {
  const array = [];
  const cloned = cloneObj(changed);

  Object.entries(cloned).forEach(([key, value]) => {
    let oriValue = ori?.[key];
    if (oriValue && typeof oriValue !== "string") {
      oriValue = safeStringify(oriValue);
    }
    if (value && typeof value !== "string") {
      value = safeStringify(value);
    }
    const obj = {
      key,
      newValue: value
    };
    if (oriValue) {
      obj.oriValue = oriValue;
    }
    if (keys?.length) {
      if (keys?.includes(key)) {
        array.push(obj);
      }
    } else if (!KEY_IGNORES.includes(key)) {
      array.push(obj);
    }
  });
  return array;
};

const insertOperationLog = async ({
  ori = {},
  changed = {},
  keys = [], // if defined, only save those keys to db, else default saves all
  req,
  title,
  desc,
  operation,
  fnc,
  api,
  user,
  username,
  requestId,
}) => {
  try {
    const toInsert = {
      title,
      desc,
      operation,
      fnc,
      api,
      user: user || req?.authClaims?.id,
      username: username || req?.authClaims?.u,
      requestId: requestId,
      data: makeOperationLogData({ ori, changed, keys }),
    };
    let response;
    response = await create(toInsert);
    return response;
  } catch (e) {
    logger.error({"InsertOperationLog err": e});
  }
};

const operationLogMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  distinct,
  insertOperationLog
};

module.exports = operationLogMethod;
