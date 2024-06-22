const dbModel = require("../../../src/db/dbModel");

const find = (query = {}) => {
    return dbModel?.proposalType?.find(query).lean();
};

const proposalTypeMethod = {
    find
};

module.exports = proposalTypeMethod;