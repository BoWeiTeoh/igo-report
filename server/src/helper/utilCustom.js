const mongoose = require("mongoose");

const toObjectId = (v) => (v && new mongoose.Types.ObjectId(v)) || v;

const ObjectId = (v) => (v && new mongoose.Types.ObjectId(v)) || v;

const isObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const toObjectIdArray = (values) => values.map(item => toObjectId(item));

const utilCustom = {
  toObjectId,
  ObjectId,
  isObjectId,
  toObjectIdArray
};

module.exports = utilCustom;
