const dbModel = require("../../db/dbModel");

const find = (query = {}, filter = {},skip , limit) => {
  if (limit) {
    return dbModel?.player?.find(query, filter).skip(skip).limit(limit).lean();
  }
  return dbModel?.player?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
  return dbModel?.player?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.player?.findOneAndUpdate(query, updateData, options).lean();
};

const count = async (query = {}, exportLimit) => {
  return dbModel?.player?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.player?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.player?.paginate(query, options);
};

const populate = (docs, path, select) => {
  return dbModel?.player?.populate(docs, {
    path: path,
    select: select,
  });
};

const getPlayerIds = async (account) => {
  if (!account) return null;

  const players = await find({ name: account }, { _id: 1 });
  return players.map((item) => item._id);
}

const aggregate = (matchQuery = {}, groupQuery = {}, projectQuery = {}, skip, limit) => {
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

  if (skip) {
    pipeline.push({
      $skip: ((skip - 1) * (limit || 0))
    });
  }

  if (limit) {
    pipeline.push({
      $limit: limit
    });
  }

  return dbModel.player.aggregate(pipeline).read("secondaryPreferred").allowDiskUse(true);
};

const adminMethod = {
  find,
  findOne,
  findOneAndUpdate,
  count,
  create,
  paginate,
  populate,
  getPlayerIds,
  aggregate
};

module.exports = adminMethod;
