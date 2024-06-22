const dbModel = require("../../db/dbModel");
const vaultData = require("../../vault/config");

const find = (query = {}, filter = {}) => {
    return dbModel?.providerGamesMinuteSummary?.find(query, filter).lean();
};

const aggregate = (matchQuery = {}, groupQuery = {}, projectQuery = {}, page, limit) => {
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

    if (page) {
        pipeline.push({
            $skip: ((page - 1) * (limit || 0))
        });
    }

    if (limit) {
        pipeline.push({
            $limit: limit
        });
    }

    return dbModel?.providerGamesMinuteSummary?.aggregate(pipeline).read("secondaryPreferred").allowDiskUse(true);
};

const consumptionAggregate = async (recordPipeline) => {
    let res = await dbModel?.playerConsumptionRecord?.aggregate(recordPipeline).read("secondaryPreferred").allowDiskUse(true);

    res = await dbModel.platform.populate(res, {
        path: "platform",
        select: { name: 1 }
    });
    console.log("res---->", res)
    return res;
};

const providerGamesMinuteSummaryMethod = {
    find,
    aggregate,
    consumptionAggregate
};

module.exports = providerGamesMinuteSummaryMethod;