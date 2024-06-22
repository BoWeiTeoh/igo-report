const dbModel = require("../../db/dbModel");
const {constDepartmentLabel} = require("../../const/constDepartment");
const {generateId} = require("../../common/commonFunc");
const adminMethod = require("../admin/adminMethod");
const { constCommonError} = require("../../const/constErrorCode");

const getDepartmentTree = async (authDepartments) => {
    try {
        let query = {};
        if (authDepartments) {
            query = {
                $or: [{isRoot: true}, {path: authDepartments}]
            };
        }
        const departments = await departmentMethod.find(query);

        // Solve the problem if the root is not the first item in DB, root must be in first item
        if (departments) {
            departments.sort((a, b) => {
                if (a.isRoot) {
                    return -1;
                } else if (b.isRoot) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }
        
        const tree = listToTree(departments);
        return tree?.[0] || {};
    } catch (e) {
        throw e;
    }
};

const listToTree = (list) => {
    let map = {},
        node,
        roots = [],
        i;
    for (i = 0; i < list.length; i += 1) {
        const id = String(list[i]._id);
        map[id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node?.parent) {
            let level = map[String(node.parent)];
            // if you do not have parent access, then attach to the root
            if (level === undefined) {
                level = 0;
            }
            list[level]?.children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
};

const createDepartment = async (reqBody) => {
    try {
        const {parent} = reqBody || {};
        let parentDepartment;
        if (parent) {
            parentDepartment = await dbModel.department.findOne({
                _id: parent
            });

            if (!parentDepartment) {
                throw (constCommonError.COMMON("Parent Department").NOT_FOUND);
            }

            reqBody.level = parentDepartment?.level + 1;

            if (parentDepartment) {
                // reqBody.path = `${parentDepartment.path},${parentDepartment._id}`;
                reqBody.path = [...parentDepartment.path, parentDepartment._id];
                reqBody.company = parentDepartment?.company;
                reqBody.label = constDepartmentLabel.DEPARTMENT;
            }
        }

        let isCreateCompany;
        let root = parentDepartment?.isRoot ? parentDepartment : null;
        if (!parent || parentDepartment?.isRoot) {
            if (!root) {
                root = await dbModel.department.findOneAndUpdate(
                    {
                        name: "root"
                    }, {
                        isRoot: true,
                        level: 0
                    }, {
                        new: true,
                        upsert: true
                    }
                );
            }

            if (!root) {
                throw (constCommonError.COMMON("Company").FAIL);
            }

            reqBody.parent = root?._id;
            reqBody.path = [root?._id];
            reqBody.label = constDepartmentLabel.COMPANY;
            reqBody.level = root?.level + 1;
            isCreateCompany = true;
        }

        let count = await departmentMethod.count() + 1;
        reqBody.ID = generateId(count, "department");
        let response = await departmentMethod.create(reqBody);
        if (isCreateCompany) {
            const thisDepartmentID = response?._id;
            response = await dbModel.department
                .findOneAndUpdate({_id: thisDepartmentID}, {company: thisDepartmentID}, {new: true})
                .lean();
        }

        return response;
    } catch (e) {
        throw e;
    }
};

const find = (query = {}, filter = {}) => {
    query = {
        isDelete: false,
        ...query
    }
    return dbModel?.department?.find(query, filter).lean();
};

const findOne = async (query = {}, filter = {}, populateField = "", populateOptions = {}) => {
    let queryBuilder = dbModel?.department?.findOne(query, filter);

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

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
    return dbModel?.department?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
    return dbModel?.department?.findOneAndUpdate(query, updateData, options);
};

const count = (query = {}) => {
    return dbModel?.department?.countDocuments(query);
};

const create = (saveData) => {
    return dbModel?.department?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
    return dbModel?.department?.paginate(query, options);
};

const departmentMethod = {
    getDepartmentTree,
    createDepartment,
    find,
    findOne,
    findOneAndUpdate,
    updateOne,
    count,
    create,
    paginate
};

module.exports = departmentMethod;
