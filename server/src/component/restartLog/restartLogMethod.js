const dbModel = require("../../db/dbModel");
const {logger} = require("../../helper/utilPinoLogger");

const find = (query = {}, filter = {}) => {
    return dbModel?.restartLog?.find(query, filter).lean();
};

const findOne = (query = {}, filter = {}) => {
    return dbModel?.restartLog?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
    return dbModel?.restartLog?.findOneAndUpdate(query, updateData, options).lean();
};

const count = (query = {}) => {
    return dbModel?.restartLog?.countDocuments(query);
};

const create = (saveData) => {
    return dbModel?.restartLog?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
    return dbModel?.restartLog?.paginate(query, options);
};

const distinct = (query = {}, key = "_id") => {
    return dbModel?.restartLog?.distinct(key, query);
};

const insertRestartLog = async (service) => {
    try {
        const toInsert = {
            service: service,
            instance: process?.env?.pm_id
        }
        let response;
        response = await create(toInsert);
        return response;
    } catch (e) {
        logger.error({"InsertRestartLog err": e});
    }
};

const restartLogMethod = {
    find,
    findOne,
    findOneAndUpdate,
    count,
    create,
    paginate,
    distinct,
    insertRestartLog,
};

module.exports = restartLogMethod;