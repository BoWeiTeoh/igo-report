const dbModel = require("../../db/dbModel");
const {
    constInitConfig,
    constConfigType,
    constResourceConfig,
    constTimeLimitConfig,
    constExportConfig
} = require("../../const/constConfig");

const find = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
    let queryBuilder = dbModel?.config?.find(query, filter);

    if (populateField && populateOptions?.path) {
        queryBuilder = queryBuilder.populate({
            model: dbModel[populateField],
            path: populateOptions?.path,
            select: populateOptions?.select
        });
    }
    let document;
    document = await queryBuilder.lean();

    return document;
};

const findOne = (query = {}, filter = {}) => {
    return dbModel?.config?.findOne(query, filter).lean();
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
    return dbModel?.config?.findOneAndUpdate(query, updateData, options).lean();
};

const update = (query = {}, updateData = {}, options = {}) => {
    return dbModel?.config?.updateOne(query, updateData, options);
};

const count = (query = {}) => {
    return dbModel?.config?.countDocuments(query);
};

const create = (saveData) => {
    return dbModel?.config?.create(saveData);
};

const paginate = (query = {}, paginateOption = {}, supplier = []) => {
    const options = {
        ...paginateOption,
        populate: [{
            model: dbModel.supplier,
            path: "supplier",
            select: "providerId name",
            match: {_id: {$in: supplier}}
        }]
    };
    return dbModel?.config?.paginate(query, options);
};

const distinct = (name = "_id", query = {}) => {
    return dbModel?.config?.distinct(name, query);
};

const initConfig = async () => {
    // Resource
    for (let property in constResourceConfig) {
        let config = await findOne({setting: property});
        if (!config) {
            const query = {setting: property};
            const update = {value: constInitConfig[property], type: constConfigType.RESOURCE};
            const option = {upsert: true};
            await findOneAndUpdate(query, update, option);
        }
    }

    // Time Out
    for (let property in constTimeLimitConfig) {
        let config = await findOne({setting: property});
        if (!config) {
            const query = {setting: property};
            const update = {value: constInitConfig[property], type: constConfigType.TIME_LIMIT};
            const option = {upsert: true};
            await findOneAndUpdate(query, update, option);
        }
    }

    // Export
    for (let property in constExportConfig) {
        let config = await findOne({ setting: property });
        if (!config) {
            const query = { setting: property };
            const update = { value: constInitConfig[property], type: constConfigType.EXPORT};
            const option = { upsert: true };
            await findOneAndUpdate(query, update, option);
        }
    }
};

const getValue = async (settingName) => {
    let config = await findOne({ setting: settingName });

    if (config?.type === constConfigType.TIME_LIMIT) {
        config.value = config.value * 60 * 60 * 1000; // 单位是小时
    }
    if (config?.value) {
      return config?.value;
    }
    
    return constInitConfig[settingName];
};

const categoryMethod = {
    find,
    findOne,
    findOneAndUpdate,
    update,
    count,
    create,
    paginate,
    distinct,
    initConfig,
    getValue
};

module.exports = categoryMethod;