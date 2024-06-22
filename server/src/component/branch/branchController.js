const { responseError, responseSuccess } = require("../../helper/utilController.js");
const operationLogMethod = require("../operationLog/operationLogMethod");
const branchMethod = require("../branch/branchMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilsCustom = require("../../helper/utilCustom");
const adminMethod = require("../admin/adminMethod");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const {logger} = require("../../helper/utilPinoLogger");

class BranchController {
  async onGetTable(req, res) {
    try {
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const platforms = await adminMethod.getBranches(query);
        const branchPromises = platforms.map(branchMethod.getBranchWithPlatform);
        const branches = await Promise.all(branchPromises);
        const siteTypes = await adminMethod.getSiteType(query);
        const siteTypeObjArr = siteTypes.map(item => String(item._id));
        // todo refactor , 用match 而不是拿出来后filter
        const filteredBranches = branches.map(branch => {
          if (branch?.siteType?.length) {
            const filteredSiteType = branch.siteType.filter(item => {
              return !!(item && siteTypeObjArr.includes(String(item._id)));
            });
            return { ...branch, siteType: filteredSiteType };
          }
          return branch;
        });
        return responseSuccess(res, filteredBranches);
      } else {
        return responseSuccess(res, []);
      }

    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { platform, siteType } = req.body;
      const query = { platform };

      // 这个branch 原本的 siteType
      let branch = await branchMethod.findOne(query);
      let siteTypeOri = branch.siteType.map(item => String(item));

      // 这个role 有权限的 siteType
      let siteTypeRole = await adminMethod.getSiteType({_id: req?.authClaims?.id});
      siteTypeRole = siteTypeRole.map(item => String(item._id))

      let siteTypeUpdate = siteTypeOri.filter(item => !siteTypeRole.includes(item));

      siteType.forEach(item => {
        if (!siteTypeUpdate.includes(item)) {
          siteTypeUpdate.push(item);
        }
      });

      const updateData = { $set: {siteType: siteTypeUpdate} };
      const options = { upsert: true, new: true };
      const response = await branchMethod.findOneAndUpdate(query, updateData, options);
      operationLogMethod.insertOperationLog({
        req,
        title: "update branch",
        operation: constOperationLogOperation.update,
        fnc: "branchController.onUpdate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetSiteType(req, res) {
    try {
      let { _id } = req.query;

      // Parse the supplier query parameter if it's provided
      if (_id) {
        _id = JSON.parse(_id);
      }

      // Build the query based on the supplier array
      const query = Array.isArray(_id)
        ? { platform: { $in: _id.map(item => utilsCustom.toObjectId(item)) } }
        : {};

      const filter = {};
      const populateField = "siteType";
      const populateOptions = { path: "siteType" };

      // Fetch the siteType documents based on the query
      const branches = await branchMethod.find(query, filter, populateField, populateOptions);
      // Extract unique categories from the siteTypes
      const uniqueSiteTypes = [...new Set(branches.flatMap(branch => branch.siteType))];
      const roleSiteType = await adminMethod.getSiteType({_id: req?.authClaims?.id})
      let roleSiteTypeList = roleSiteType.map(item => String(item?._id));

      let filterSiteType = uniqueSiteTypes.filter(item =>
          roleSiteTypeList.includes(String(item._id))
      );

      return responseSuccess(res, filterSiteType);
    } catch (error) {
      return responseError(res, error);
    }
  }

  async onGetSiteTypeWithId(req, res) {
    try {
      let { _id } = req.query;

      // Parse the supplier query parameter if it's provided
      if (_id) {
        _id = JSON.parse(_id);
      }

      // Build the query based on the supplier array
      const query = Array.isArray(_id)
        ? { platform: { $in: _id.map(item => utilsCustom.toObjectId(item)) } }
        : {};

      const filter = {};
      const populateField = "siteType";
      const populateOptions = { path: "siteType" };

      // Fetch the siteType documents based on the query
      const branches = await branchMethod.find(query, filter, populateField, populateOptions);
      // Extract unique categories from the siteTypes
      const categoriesWithId = branches.flatMap(branch => {
        const branchId = branch.platform;
        const siteTypes = [...new Set (branch.siteType)] || [];

        // todo very ugly , need redo , actually no need a new function for this feature
        return siteTypes.map(category => ({ _id: branchId, categoryId: {
          _id: category._id,
          name: category.name,
          category: category.category,
          // createdAt: category.createdAt,
          // updatedAt: category.updatedAt,
          // __v: category.__v,
        }}));
      });
      const roleSiteType = await adminMethod.getSiteType({_id: req?.authClaims?.id});
      let roleSiteTypeList = roleSiteType.map(item => String(item?._id));

      let filterSiteType = categoriesWithId.filter(item =>
          roleSiteTypeList.includes(String(item.categoryId._id))
      );
      return responseSuccess(res, filterSiteType);
    } catch (error) {
      return responseError(res, error);
    }
  }
}

const branchController = new BranchController();
module.exports = branchController;