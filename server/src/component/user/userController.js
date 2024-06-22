const { responseError, responseSuccess } = require("../../helper/utilController.js");
const argon2 = require("argon2");
const { signToken } = require("../../helper/jwttoken");
const utilString = require("../../helper/utilString");
const adminMethod = require("../admin/adminMethod");
const roleMethod = require("../role/roleMethod");
const { constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class UserController {
  async onLogin(req, res) {
    try {
      const { username, password } = req.body || {};
      let user = await adminMethod.findOneWithPassword({ username, isDelete: false });
      if (!username && !password) {
        responseError(res, constCommonError.PASSWORD.EMPTY);
      } else if (!username.length) {
        throw (constCommonError.PASSWORD.WRONG); // Indicate username is empty
      } else if (!user) {
        throw (constCommonError.PASSWORD.WRONG); // Indicate no user found
      }

      if (!user?.state) {
        throw (constCommonError.COMMON("Account").INACTIVE);
      }

      if (user?.roles && !user?.roles?.state) {
        throw (constCommonError.COMMON("Role").INACTIVE);
      }

      logger.info({loginUser: user?.username});
      const isValidPassword = await argon2.verify(user?.password, password);
      logger.info({isValidPassword: isValidPassword});
      if (!isValidPassword) {
        throw (constCommonError.PASSWORD.WRONG);
      }
      const dateNow = new Date();
      const query = { _id: user?._id };
      const update = { lastLogin: dateNow };
      await adminMethod.updateOne(query, update);
      user.lastLogin = dateNow;
      const response = {
        token: signToken(user)
      };

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onCreate(req, res) {
    try {
      logger.info({"on post": req.body});
      const { role, username, password } = req.body;

      if (password?.length < 6) {
        throw (constCommonError.PASSWORD.LENGTH);
      }

      const reqBody = req.body;
      delete reqBody.role;

      const query = {
        username,
        isDelete: false
      };
      const exist = await adminMethod.findOne(query);
      if (exist) {
        throw (constCommonError.NAME("Username").EXIST);
      }

      logger.info({maskedPS: utilString.maskString(password)});
      reqBody.password = await argon2.hash(password);

      const roleData = await roleMethod.findOne({ _id: role });
      if (roleData) {
        reqBody.roles = [roleData?._id];
        reqBody.company = [roleData?.company];
      }
      const user = await adminMethod.create(reqBody);
      return responseSuccess(res, user);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onPingLogin(req, res) {
    try {
      const { authClaims, authPermissions } = req;
      return responseSuccess(res, authPermissions);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const userController = new UserController();
module.exports = userController;
