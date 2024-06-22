const { responseError, responseSuccess } = require("../../helper/utilController.js");
const operationLogMethod = require("../operationLog/operationLogMethod");
const siteTypeMethod = require("../siteType/siteTypeMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilController = require("../../helper/utilController");
const utilsCustom = require("../../helper/utilCustom");
const utilString = require("../../helper/utilString");
const adminMethod = require("../admin/adminMethod");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const branchMethod = require("../branch/branchMethod");
const categoryMethod = require("../category/categoryMethod");
const { constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class SiteTypeController {
  async onCreate(req, res) {
    try {
      const { name } = req.body;

      // Check for name spacing
      utilString.checkWhiteSpace(name, "Site Type Name");
      if (!name) {
        throw (constCommonError.NAME("Site Type Name").EMPTY)
      }
      const exist = await siteTypeMethod.findOne({name});
      if (exist) {
        throw (constCommonError.NAME("Site Type Name").EXIST);
      }
      const response = await siteTypeMethod.create(req.body);
      operationLogMethod.insertOperationLog({
        req,
        title: "create site type",
        operation: constOperationLogOperation.create,
        fnc: "siteTypeController.onCreate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetTable(req, res) {
    try {
      const { paginate, filter, paginateOption } = utilController.parseQuery(req.query);
      let matchQuery = {};
      let category;
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const siteType = await adminMethod.getSiteType(query);
        // todo refactor 应该一个method 可以handle，时间急，会再优化
        category = await adminMethod.getCategory(query);
        const query2 = { _id: { $in: siteType.map(item => item._id) } };
        matchQuery = { ...query2, ...filter };
      }
      let categoryList = category.map(item => item?._id);
      const response = await siteTypeMethod.paginate(matchQuery, paginateOption, categoryList);
      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGet(req, res) {
    try {
      const query = { _id: req?.authClaims?.id };
      const response = await adminMethod.getSiteType(query);
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { _id, name, category } = req.body;

      utilString.checkWhiteSpace(name, "Site Type Name");

      const query = { _id };

      // 原本的category
      let siteType = await siteTypeMethod.findOne(query);
      let categoryOri = siteType.category.map(item => String(item));

      // 这个role 有权限的 category
      let categoryRole = await adminMethod.getCategory({_id: req?.authClaims?.id});
      categoryRole = categoryRole.map(item => String(item._id));

      let categoryUpdate = categoryOri.filter(item => !categoryRole.includes(item));

      category.forEach(item => {
        if (!categoryUpdate.includes(item)) {
          categoryUpdate.push(item);
        }
      });

      const update = {name, $set: {category: categoryUpdate}};
      const option = { new: true };
      let response;

      const exist = await siteTypeMethod.findOne({name: name, _id: {$nin: [_id]}});

      if (exist) {
        throw (constCommonError.NAME("Site Type Name").EXIST);
      }
      
      response = await siteTypeMethod.findOneAndUpdate(query, update, option);

      // Insert operation log
      operationLogMethod.insertOperationLog({
        req,
        title: "update site type",
        operation: constOperationLogOperation.update,
        fnc: "siteTypeController.onUpdate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });
      
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetCategory(req, res) {
    try {
      let { _id } = req.query;

      // Parse the supplier query parameter if it's provided
      if (_id) {
        _id = JSON.parse(_id);
      }

      // Build the query based on the supplier array
      const query = Array.isArray(_id)
        ? { _id: { $in: _id.map(item => utilsCustom.toObjectId(item)) } }
        : {};

      const filter = {};
      const populateField = "category";
      const populateOptions = { path: "category" };

      // Fetch the siteType documents based on the query
      const siteTypes = await siteTypeMethod.find(query, filter, populateField, populateOptions);
      // Extract unique categories from the siteTypes
      const uniqueCategories = [...new Set(siteTypes.flatMap(siteType => siteType.category))];
      const roleCategory = await adminMethod.getCategory({_id: req?.authClaims?.id})
      let roleCategoryList = roleCategory.map(item => String(item?._id));

      let filterCategory = uniqueCategories.filter(item =>
          roleCategoryList.includes(String(item._id))
      );

      return responseSuccess(res, filterCategory);
    } catch (error) {
      return responseError(res, error);
    }
  }

}

const siteTypeController = new SiteTypeController();
module.exports = siteTypeController;
