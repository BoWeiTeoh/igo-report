const argon2 = require("argon2");
const utilController = require("../../helper/utilController");
const operationLogMethod = require("../operationLog/operationLogMethod");
const adminMethod = require("../admin/adminMethod");
const roleMethod = require("../role/roleMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const { responseError, responseSuccess } = require("../../helper/utilController.js");
const { generateId } = require("../../common/commonFunc");
const { log } = require("../../helper/utils");
const departmentMethod = require("../department/departmentMethod");
const constLogType = require("./../../const/constLogType");
const { constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class AdminController {
  async onGetTable(req, res) {
    try {
      const {paginate, filter, paginateOption} = utilController?.parseQuery2(req.query);
      let {department, isRoot} = await adminMethod.getDepartment({_id: req?.authClaims?.id});
      let childDepartment = await departmentMethod.find({path: department?._id});
      let childDepartmentArr = childDepartment.map(item => item._id);
      let childRole = await roleMethod.find({department: childDepartmentArr});
      let roleArr = childRole.map(item => item._id);
      const options = {
        ...paginateOption,
        populate: [
          {
            path: "creator",
            select: { username: 1 }
          },
          {
            path: "updater",
            select: { username: 1 }
          },
          {
            path: "roles",
            select: { roleName: 1, isDelete: 1 }
          }
        ],
        sort: { userID: 1 }
      };
      let query = {
        ...filter,
        isRoot: false,
        isDelete: false
      };

      if (Array.isArray(roleArr) && !isRoot) {
        query.roles = { $in: roleArr };
      }

      const response = await adminMethod.paginate(query, options);
      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onCreate(req, res) {
    try {
      const { username, password, confirmPassword, roles } = req.body;
      const { authClaims } = req;
      _checkValidatePassword(password);
      if (!username.length) {
        throw (constCommonError.NAME("Username").EMPTY);
      } else if (!roles) {
        throw (constCommonError.COMMON("Role").NOT_SELECT);
      } else if (!(password === confirmPassword)){
        throw (constCommonError.PASSWORD.NOT_MATCH);
      } else if (password?.length < 6) {
        throw (constCommonError.PASSWORD.LENGTH);
      }

      req.body.password = await argon2.hash(password);

      const query = {
        username,
        isDelete: false
      };
      const exist = await adminMethod.findOne(query);
      if (exist) {
        throw (constCommonError.NAME("username").EXIST);
      }

      let ID = await adminMethod.count() + 1
      let userID = generateId(ID, "user");
      let saveData = {
        creator: authClaims.id,
        updater: authClaims.id,
        ID: ID,
        userID: userID,
        ...req.body
      };

      let response = await adminMethod.create(saveData);

      operationLogMethod.insertOperationLog({
        req,
        title: "create admin",
        operation: constOperationLogOperation.create,
        fnc: "adminController.onCreate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { _id, state, remark, username, password, roles } = req.body;
      const updater = req?.authClaims?.id;
      _checkValidatePassword(password);
      if (!username.length) {
        throw constCommonError.NAME("Username").EMPTY;
      } else if (!roles) {
        throw constCommonError.NAME("Role").EMPTY;
      }

      let updateData = {
        state,
        remark,
        updater,
        password,
        roles
      };
      const userExist = await adminMethod.findOne({ _id, isDelete: false });
      if (username !== userExist.username){
        const usernameExist = await adminMethod.findOne({ username, isDelete: false });
        if (usernameExist) {
          throw (constCommonError.NAME("username").EXIST);
        }
        updateData.username = username
      }

      let query = { _id };
      let options = {
        new: true
      };
      const response = await adminMethod.findOneAndUpdate(query, updateData, options);
      operationLogMethod.insertOperationLog({
        req,
        title: "update admin",
        operation: constOperationLogOperation.update,
        fnc: "adminController.onUpdate",
        changed: response
      }).catch(err => {
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
      let query = { _id };
      let updateData = {
        isDelete: true,
        state: false
      };
      let options = {
        new: true
      };
      const response = await adminMethod.findOneAndUpdate(query, updateData, options);
      operationLogMethod.insertOperationLog({
        req,
        title: "delete admin",
        operation: constOperationLogOperation.delete,
        fnc: "adminController.onDelete",
        changed: response
      }).catch(err => {
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
      const field = {};
      const populateOptions = { path: "roles" };


      const users = await adminMethod.find({ userID: { $exists: false }, ID: { $exists: true } });
      try {
        for (let i = 0; i < users.length; i++) {
          let userID = generateId(users[i]?.ID, "user");
          if (!users[i]?.userID) {
            await adminMethod.updateOne({ _id: users[i]?._id }, { $set: { userID: userID } });
          }
        }
      } catch (e) {
        logger.error({err: e});
      }
      let response = await adminMethod.findOne(query, field, populateOptions);
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onResetPassword(req, res) {
    try {
      const { username, oldPassword, newPassword, confirmPassword } = req.body || {};
      _checkValidatePassword(newPassword);
      if (newPassword !== confirmPassword) {
        throw (constCommonError.PASSWORD.NOT_MATCH);
      } else if (newPassword?.length < 6) {
        throw (constCommonError.PASSWORD.LENGTH);
      }

      let user = await adminMethod.findOneWithPassword({ username });
      if (!user) {
        throw (constCommonError.PASSWORD.WRONG);
      }

      const isValidPassword = await argon2.verify(user?.password, oldPassword);

      if (!isValidPassword) {
        throw (constCommonError.PASSWORD.WRONG);
      }

      const newPasswordEncrypt = await argon2.hash(newPassword);
      const query = { _id: user?._id };
      const update = { $set: { password: newPasswordEncrypt } };
      const response = await adminMethod.findOneAndUpdate(query, update);

      operationLogMethod.insertOperationLog({
        req,
        title: "reset Password",
        operation: constOperationLogOperation.update,
        fnc: "adminController.onResetPassword",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onResetPasswordByAdmin(req, res) {
    try {
      const { _id, newPassword, confirmPassword } = req.body || {};
      _checkValidatePassword(newPassword);
      if (newPassword !== confirmPassword) {
        throw (constCommonError.PASSWORD.NOT_MATCH);
      } else if (newPassword?.length < 6) {
        throw (constCommonError.PASSWORD.LENGTH);
      }

      const newPasswordEncrypt = await argon2.hash(newPassword);
      const query = { _id: _id };
      const update = { $set: { password: newPasswordEncrypt } };
      const response = await adminMethod.findOneAndUpdate(query, update);

      operationLogMethod.insertOperationLog({
        req,
        title: "reset Password",
        operation: constOperationLogOperation.update,
        fnc: "adminController.onResetPasswordByAdmin",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

_checkValidatePassword = (password) => {
  let regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  if (!(regex.test(password))) {
    throw (constCommonError.PASSWORD.INVALID);
  }
};

const adminController = new AdminController();
module.exports = adminController;
