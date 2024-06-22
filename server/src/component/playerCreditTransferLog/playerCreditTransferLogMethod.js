const dbModel = require("../../../src/db/dbModel");

const find = (query = {}, filter = {}) => {
    return dbModel?.playerCreditTransferLog?.find(query, filter).lean();
};

const paginate = (query = {}, options = {}, ) => {
    return dbModel?.playerCreditTransferLog?.paginate(query, options);
};

const aggregate = async (query, projection, groupQuery, skip, limit) => {
    const pipeline = [
        {
            $match: query
        }
    ];

    if (projection) {
        pipeline.push({
            $project: projection
        });
    }

    if (groupQuery && Object.keys(groupQuery).length) {
        pipeline.push({
            $group: groupQuery
        });
    }

    if (skip) {
        pipeline.push({
            $skip: skip
        });
    }

    if (limit) {
        pipeline.push({
            $limit: limit
        });
    }

    try {
        return dbModel.playerCreditTransferLog.aggregate(pipeline).allowDiskUse(true);
    } catch (e) {
        throw e;
    }
};

const count = async (query = {}) => {
    return dbModel?.playerCreditTransferLog?.countDocuments(query);
};

const playerCreditTransferLogMethod = {
    find,
    paginate,
    aggregate,
    count
};

module.exports = playerCreditTransferLogMethod;