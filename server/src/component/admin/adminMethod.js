const dbModel = require("../../db/dbModel");
const platformMethod = require("../platform/platformMethod");
const supplierMethod = require("../supplier/supplierMethod");
const categoryMethod = require("../category/categoryMethod");
const branchMethod = require("../branch/branchMethod");
const siteTypeMethod = require("../siteType/siteTypeMethod");
const {logger} = require("../../helper/utilPinoLogger");

const find = async (query = {}, filter = {}, populateOptions = {}) => {
  let queryBuilder = dbModel?.user?.find(query, filter);

  if (populateOptions?.path) {
    queryBuilder = queryBuilder.populate({
      path: populateOptions?.path,
      select: populateOptions?.select,
      populate: populateOptions?.populate
    });
  }

  let document;
  document = await queryBuilder.lean();

  return document;
};

const findOne = async (query = {}, filter = {}, populateOptions = {}) => {
  let queryBuilder = dbModel?.user?.findOne(query, filter);

  if (populateOptions?.path) {
    queryBuilder = queryBuilder.populate({
      path: populateOptions?.path,
      select: populateOptions?.select,
      populate: populateOptions?.populate
    });
  }

  let document;
  document = await queryBuilder.lean();

  return document;
};

const findOneWithPassword = (query = {}) => {
  if (query?.username) {
    return dbModel.user.findOne(query).select("+password").lean()
      .populate({
        model: dbModel.role,
        path: "roles"
      });
  } else {
    return {};
  }
};

const findOneAndUpdate = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.user?.findOneAndUpdate(query, updateData, options).lean();
};

const updateOne = (query = {}, updateData = {}, options = {}) => {
  return dbModel?.user?.updateOne(query, updateData, options);
};

const count = (query = {}) => {
  return dbModel?.user?.countDocuments(query);
};

const create = (saveData) => {
  return dbModel?.user?.create(saveData);
};

const paginate = (query = {}, options = {}) => {
  return dbModel?.user?.paginate(query, options);
};

const getBranches = async (query = {}) => {

  const projection = {
    roles: 1,
    isRoot: 1
  };

  const populateOption = {
    path: "roles",
    select: { branches: 1 },
    populate: {
      model: dbModel.platform,
      path: "branches",
      select: { platformId: 1, name: 1, isActive: 1 }
    }
  };
  let response;
  response = await adminMethod.findOne(query, projection, populateOption);

  if (response?.isRoot) {
    const query = {};
    const filter = { platformId: 1, name: 1, isActive: 1 };
    return platformMethod.find(query, filter);
  } else {
    return (response?.roles?.branches || []);
  }

};

const getSupplier = async (query = {}) => {
  try {
      const projection = {
          roles: 1,
          isRoot: 1
      };

      const populateOption = {
          path: "roles",
          select: { siteTypes: 1 },
          populate: {
              model: dbModel.supplier,
              path: "suppliers",
              select: {name: 1, providerId: 1}
          }
      };
      let response = await adminMethod.findOne(query, projection, populateOption);

      if (response?.isRoot) {
          const query = {};
          const filter = {name: 1, providerId: 1};
          return supplierMethod.find(query, filter);
      } else {
          return (response?.roles?.suppliers || []);
      }
  } catch (error) {
    logger.error(error);
    // handle the error appropriately
  }
};

const getCategory = async (query = {}) => {
  try {
      const projection = {
          roles: 1,
          isRoot: 1
      };

      const populateOption = {
          path: "roles",
          select: { categories: 1 },
          populate: {
              model: dbModel.category,
              path: "categories",
              select: { name: 1 }
          }
      };
      let response = await adminMethod.findOne(query, projection, populateOption);

      if (response?.isRoot) {
          const query = {};
          const filter = { name: 1 };
          return categoryMethod.find(query, filter);
      } else {
          return (response?.roles?.categories || []);
      }
  } catch (error) {
    logger.error(error);
    // handle the error appropriately
  }
};

const getSiteType = async (query = {}) => {
    try {
        const projection = {
            roles: 1,
            isRoot: 1
        };

        const populateOption = {
            path: "roles",
            select: { siteTypes: 1 },
            populate: {
                model: dbModel.siteType,
                path: "siteTypes",
                select: { name: 1 }
            }
        };
        let response = await adminMethod.findOne(query, projection, populateOption);

        if (response?.isRoot) {
            const query = {};
            const filter = { name: 1 };
            return siteTypeMethod.find(query, filter);
        } else {
            return (response?.roles?.siteTypes || []);
        }
    } catch (error) {
        logger.error(error);
        // handle the error appropriately
    }
};

const getDepartment = async (query = {}) => {
    try {
        let admin = await dbModel.user.findOne(query).populate({
            path: "roles",
            model: dbModel.role,
            populate: {
                path: "department",
                model: dbModel.department
            }
        }).lean();

        if (admin.isRoot) {
            let department = await dbModel.department.findOne({isRoot: true}).lean()
            return {
                department: department,
                isRoot: true
            }
        }

        if (!admin?.roles?.department) {
            return Promise.reject("Invalid Department")
        }
        return {department: admin?.roles?.department}
    } catch (e) {
        logger.error(e);
    }
}

const getPermission = async (adminQuery) => {
    try {
        let admin = await dbModel.user.findOne(adminQuery).populate({path: "roles", model: dbModel.role}).lean();
        let permissionQuery = {};
        if (!admin.isRoot) {
            permissionQuery._id = {$in: admin?.roles?.permissions}
        }
        return dbModel.permission.find(permissionQuery).lean()
    } catch (e) {
        logger.error({GetPermission: e});
    }
}

const adminMethod = {
    find,
    findOne,
    findOneWithPassword,
    findOneAndUpdate,
    updateOne,
    count,
    create,
    paginate,
    getBranches,
    getSupplier,
    getCategory,
    getSiteType,
    getDepartment,
    getPermission
};

module.exports = adminMethod;
