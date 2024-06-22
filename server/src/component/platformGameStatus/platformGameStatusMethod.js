const dbModel = require("../../db/dbModel");
const vaultData = require("../../vault/config");

const find = async (query = {}, filter = {}) => {
  return dbModel?.platformGameStatus?.find(query, filter).lean();
};

const findOne = async (query = {}, filter = {}) => {
  return dbModel?.platformGameStatus?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.platformGameStatus?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
  return dbModel?.platformGameStatus?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.platformGameStatus?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.platformGameStatus?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
  return dbModel?.platformGameStatus?.distinct(key, query);
};

const populate = (docs) => {
  return dbModel.game.populate(docs, {
    path: "game",
    select: { 
      "regionName.EN": 1, 
      gameId: 1,
      sourceURL: 1,
      images: 1,
      smallShow: 1
    }
  });
};

const platformGameStatusMethod = {
  find,
  findOne,
  // findOneAndUpdate,
  count,
  // create,
  paginate,
  distinct,
  populate
};

module.exports = platformGameStatusMethod;
