const { responseError, responseSuccess } = require("../../helper/utilController.js");
const permissionMethod = require("./permissionMethod");
const resourceMethod = require("../resource/resourceMethod");
const adminMethod = require("../admin/adminMethod");

class PermissionController {

  async onGetMany(req, res) {
    try {
      const adminQuery = {_id: req?.authClaims?.id};
      let permissions = await adminMethod.getPermission(adminQuery);
      let resourceQuery = {
        _id: permissions.map(item => item.resource)
      }
      const resources = await resourceMethod.find(resourceQuery)

      const response = resources?.map((r) => {
        r.resource = r._id;
        r.permissions = permissions?.filter((p) => String(p.resource) === String(r._id));
        return r;
      });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onCreatePermissionsBySeed(req, res) {
    try {
      let response = Promise.resolve();
      await permissionMethod.createPermissions();
      permissionMethod.generatePermissionsConst().catch();
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }
}

const permissionController = new PermissionController();
module.exports = permissionController;
