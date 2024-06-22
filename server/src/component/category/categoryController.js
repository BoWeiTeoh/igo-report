const { responseError, responseSuccess } = require("../../helper/utilController.js");
const operationLogMethod = require("../operationLog/operationLogMethod");
const categoryMethod = require("../category/categoryMethod");
const { constOperationLogOperation } = require("../../const/constOperationLog");
const utilController = require("../../helper/utilController");
const utilsCustom = require("../../helper/utilCustom");
const utilString = require("../../helper/utilString.js");
const branchMethod = require("../branch/branchMethod");
const adminMethod = require("../admin/adminMethod");
const siteTypeMethod = require("../siteType/siteTypeMethod");
const { log } = require("../../helper/utils");
const constLogType = require("../../const/constLogType");
const {constCommonError} = require("../../const/constErrorCode");
const {logger} = require("../../helper/utilPinoLogger");

class CategoryController {
  async onCreate(req, res) {
    try {
      const { name } = req.body;

      // Check for name spacing/empty
      utilString.checkWhiteSpace(name, "Platform Code");

      const query = {
        name
      };
      const exist = await categoryMethod.findOne(query);
      if (exist) {
        throw (constCommonError.NAME("Platform Code").EXIST)
      }
      let response = await categoryMethod.create(req.body);
      operationLogMethod.insertOperationLog({
        req,
        title: "create category",
        operation: constOperationLogOperation.create,
        fnc: "categoryController.onCreate",
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
      let supplier;
      if (req?.authClaims?.id) {
        const query = { _id: req?.authClaims?.id };
        const category = await adminMethod.getCategory(query);
        // todo refactor 应该一个method 可以handle，时间急，会再优化
        supplier = await adminMethod.getSupplier(query);
        const query2 = { _id: { $in: category.map(item => item._id) } };
        matchQuery = { ...query2, ...filter };
      }
      let supplierList = supplier.map(item => item?._id);
      let response = await categoryMethod.paginate(matchQuery, paginateOption, supplierList);
      return responseSuccess(res, response, {
        paginate
      });
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetMany(req, res) {
    try {
      const response = await categoryMethod.find();
      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onUpdate(req, res) {
    try {
      const { _id, name, supplier } = req.body;

      utilString.checkWhiteSpace(name, "Platform Code");

      const query = { _id };

      // 原本的supplier
      let category = await categoryMethod.findOne(query);
      let supplierOri = category.supplier.map(item => String(item));

      // 这个role 有权限的 supplier
      let supplierRole = await adminMethod.getSupplier({_id: req?.authClaims?.id});
      supplierRole = supplierRole.map(item => String(item._id));

      let supplierUpdate = supplierOri.filter(item => !supplierRole.includes(item));

      supplier.forEach(item => {
        if (!supplierUpdate.includes(item)) {
          supplierUpdate.push(item);
        }
      });

      const update = { name,  $set: {supplier: supplierUpdate} };
      const option = { new: true };
      let response;

      const exist = await categoryMethod.findOne({name: name, _id: {$nin: [_id]}});
      // condition : name match
      // _id: not match
      if (exist) {
        throw (constCommonError.NAME("Platform Code").EXIST)
      }
      response = await categoryMethod.findOneAndUpdate(query, update, option);

      // Insert operation log
      operationLogMethod.insertOperationLog({
        req,
        title: "update category",
        operation: constOperationLogOperation.update,
        fnc: "categoryController.onUpdate",
        changed: response
      }).catch(err => {
        logger.error({"Operation Log Err": err});
      });

      return responseSuccess(res, response);
    } catch (e) {
      return responseError(res, e);
    }
  }

  async onGetSupplier(req, res) {
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
      const populateField = "supplier";
      const populateOptions = { path: "supplier" };

      // Fetch the siteType documents based on the query
      const categories = await categoryMethod.find(query, filter, populateField, populateOptions);
      // Extract unique categories from the siteTypes
      const uniqueSupplier = [...new Set(categories.flatMap(category => category.supplier))];
      const roleSupplier = await adminMethod.getSupplier({_id: req?.authClaims?.id})
      let roleSupplierList = roleSupplier.map(item => String(item?._id));

      let filterSupplier = uniqueSupplier.filter(item =>
          roleSupplierList.includes(String(item._id))
      );

      return responseSuccess(res, filterSupplier);
    } catch (e) {
      return responseError(res, e);
    }
  }

}

const categoryController = new CategoryController();
module.exports = categoryController;
