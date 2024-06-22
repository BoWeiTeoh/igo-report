const dbModel = require("../../../src/db/dbModel");

const find = async (query = {}, filter = {}) => {
    return dbModel?.proposal?.find(query, filter).lean();
};

const paginate = async (query = {}, options = {}) => {
    return dbModel?.proposal?.paginate(query, options);
};

const aggregate = async (matchQuery, projectQuery, groupQuery, skip, limit, sort) => {
    const pipeline = [
        {
            $match: matchQuery
        }
    ];

    if (projectQuery && Object.keys(projectQuery).length) {
        pipeline.push({
            $project: projectQuery
        });
    }

    if (groupQuery && Object.keys(groupQuery).length) {
        pipeline.push({
            $group: groupQuery
        });
    }

    if (sort) {
        pipeline.push({
            $sort: sort
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
        return dbModel.proposal.aggregate(pipeline).allowDiskUse(true);
    } catch (e) {
        throw e;
    }
};

const count = async (query = {}) => {
    return dbModel?.proposal?.countDocuments(query);
};

const proposalMethod = {
    find,
    paginate,
    aggregate,
    count
};

module.exports = proposalMethod;