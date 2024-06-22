const { responseError, responseSuccess } = require("../../helper/utilController.js");
const operationLogMethod = require("../operationLog/operationLogMethod");
const roleMethod = require("./roleMethod");
const adminMethod = require("../admin/adminMethod");
const departmentMethod = require("../department/departmentMethod");
const dbModel = require("../../db/dbModel");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilController = require("../../helper/utilController");
const utilsCustom = require("../../helper/utilCustom");
const { generateId } = require("../../common/commonFunc");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const { constCommonError} = require("../../const/constErrorCode");
const utilString = require("../../helper/utilString");
const {logger} = require("../../helper/utilPinoLogger");

class RoleController {
  async onCreate(req, res) {
    try {
      req.body.creator = req?.authClaims?.id;
      req.body.updater = req?.authClaims?.id;
      let ID = await roleMethod.count();
      let roleID = generateId(ID + 1, "role");
      req.body.ID = ID + 1;
      req.body.roleID = roleID;
      if (!req.body.roleName) {
        throw (constCommonError.NAME("Role Name").EMPTY)
      }
      const checkRoleName = await roleMethod.find({ roleName: req.body.roleName, isDelete: false });
      if (checkRoleName.length) {
        throw (constCommonError.NAME("Role Name").EXIST);
      }
      let response = await roleMethod.create(req.body);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "create role",
          operation: constOperationLogOperation.create,
          fnc: "roleController.onCreate",
          changed: response
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGet(req, res) {
    try {
      const { _id } = req.query;
      const query = { _id };
      const filter = {};
      const populateField = "permission";
      const populateOption = {
        path: "permissions"
      };
      const docs = await roleMethod.findOne(query, filter, populateField, populateOption);
      return responseSuccess(res, docs);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetMany(req, res) {
    try {
      const {department} = req.query;

      // todo : need refactor
      let objDepartment = await adminMethod.getDepartment({_id: req?.authClaims?.id});
      let childDepartment = await departmentMethod.find({path: objDepartment?.department?._id});
      let childDepartmentArr = childDepartment.map(item => item._id);

      let query = {
          state: true
      };

      if (Array.isArray(childDepartmentArr)) {
        query.department = {$in: childDepartmentArr}
      }

      if (department) {
          query = {
              department,
              isDelete: false
          };
      }
      const docs = await roleMethod.find(query);
      return responseSuccess(res, docs);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const {_id, state, remark, roleName, department} = req.body;
      utilString.checkWhiteSpace(roleName, "Role Name");
      if (!department) {
        throw (constCommonError.NAME("Department").EMPTY);
      }
      const updater = req?.authClaims?.id;
      const existingRole = await roleMethod.findOne({ _id });
      if (!existingRole) {
        throw (constCommonError.COMMON("Role").NOT_FOUND);
      }

      let update = {state, remark, updater, department};
      if (roleName !== existingRole.roleName) {
        const checkRoleName = await roleMethod.find({roleName, isDelete: false});
        if (checkRoleName.length) {
          throw (constCommonError.NAME("Role Name").EXIST);
        }
        update.roleName = roleName;
      }

      const query = {_id};
      const option = { new: true };
      const response = await roleMethod.findOneAndUpdate(query, update, option);
      operationLogMethod
        .insertOperationLog({
          req,
          title: "update role",
          operation: constOperationLogOperation.update,
          fnc: "roleController.onUpdate",
          changed: response
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onDelete(req, res) {
    try {
      const { _id } = req?.body;
      const updater = req?.authClaims?.id;
      const query = { _id };
      const update = {
        isDelete: true,
        state: false,
        updater
      };
      let option = { new: true };
      const response = await roleMethod.findOneAndUpdate(query, update, option);
      await adminMethod.updateOne({ roles: _id }, { state: false });
      operationLogMethod
        .insertOperationLog({
          req,
          title: "delete role",
          operation: constOperationLogOperation.delete,
          fnc: "roleController.onDelete",
          changed: response
        })
        .catch((err) => {
          logger.error({"Operation Delete Log Err": err});
        });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetTable(req, res) {
    try {
      const {paginate, filter, paginateOption} = utilController?.parseQuery(req.query);
      let {department, isRoot} = await adminMethod.getDepartment({_id: req?.authClaims?.id});
      let childDepartment = await departmentMethod.find({path: department?._id});
      let childDepartmentArr = childDepartment.map(item => item._id);
      let query = {
        ...filter,
        isDelete: false
      };

      if (Array.isArray(childDepartmentArr) && !isRoot) {
        query.department = {$in: childDepartmentArr}
      }
      const options = {
        ...paginateOption,
        populate: [
          {
            path: "creator",
            select: {username: 1}
          },
          {
            path: "updater",
            select: {username: 1}
          },
          {
            model: dbModel.platform,
            path: "branches",
            select: {name: 1}
          },
          {
            model: dbModel.siteType,
            path: "siteTypes",
            select: {name: 1}
          },
          {
            model: dbModel.category,
            path: "categories",
            select: {name: 1}
          },
          {
            model: dbModel.supplier,
            path: "suppliers",
            select: {name: 1}
          }
        ],
        sort: { roleID: 1 }
      };
      const roles = await roleMethod.find({roleID: {$exists: false}});
      try {
        for (const role of roles) {
          const roleID = generateId(role?.ID, "role");
          if (!role?.roleID) {
            await roleMethod.updateOne({ _id: role?._id }, { $set: { roleID: roleID } });
          }
        }
      } catch (e) {
        logger.error({"On Get Role": e});
      }

      const response = await roleMethod.paginate(query, options);

      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdatePermissions(req, res) {
    try {
      const { role, list, addList, removeList } = req.body;
      const updater = req?.authClaims?.id;
      let toUpdate = {};
      if (addList?.length) {
        toUpdate = {
          $push: { permissions: addList?.map((d) => utilsCustom.toObjectId(d._id)) },
          updater
        };
      }
      if (removeList?.length) {
        toUpdate = toUpdate || {};
        toUpdate.$pull = { permissions: { $in: removeList?.map((d) => d._id) } };
      }

      if (Array.isArray(list)) {
        toUpdate = {
          permissions: list,
          updater
        };
      }
      if (!toUpdate) {
          throw new Error("Nothing to update");
      }
      const query = {_id: role?._id || role};
      const update = toUpdate;
      const option = {new: true};
      const response = await roleMethod.findOneAndUpdate(query, update, option);
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetRolePlatform(req, res) {
    try {
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const response = await adminMethod.getBranches(query);

        return responseSuccess(res, response);
      } else {
        return responseSuccess(res, []);
      }
    } catch (e) {
    }
  }

  async onUpdateRoleBranches(req, res) {
    try {
      const {_id, branches, siteTypes, categories, suppliers} = req.body;
      const query = {_id: _id};
      const update = {
        $set: {
          branches: branches,
          siteTypes: siteTypes,
          categories: categories,
          suppliers: suppliers
        }
      };

      const response = await roleMethod.findOneAndUpdate(query, update);

      operationLogMethod
        .insertOperationLog({
          req,
          title: "update role branches",
          operation: constOperationLogOperation.update,
          fnc: "roleController.onUpdateRoleBranches",
          changed: { update: update, query: query }
        })
        .catch((err) => {
          logger.error({"Operation Log Err": err});
        });

      return responseSuccess(res, response);
    } catch (e) {
    }
  }

  async onGetRoleSupplier(req, res) {
    try {
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const supplier = await adminMethod.getSupplier(query);

        return responseSuccess(res, supplier);
      } else {
        return responseSuccess(res, []);
      }
    } catch (e) {
    }
  }

  async onGetRoleCategory(req, res) {
    try {
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const category = await adminMethod.getCategory(query);

        return responseSuccess(res, category);
      } else {
        return responseSuccess(res, []);
      }
    } catch (e) {
    }
  }

  async onGetRoleSiteType(req, res) {
    try {
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const siteType = await adminMethod.getSiteType(query);

        return responseSuccess(res, siteType);
      } else {
        return responseSuccess(res, []);
      }
    } catch (e) {
    }
  }
}

const roleController = new RoleController();
module.exports = roleController;
