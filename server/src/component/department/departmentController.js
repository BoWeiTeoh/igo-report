const {responseError, responseSuccess} = require("../../helper/utilController.js");
const utilController = require("../../helper/utilController");
const utilString = require("../../helper/utilString");
const departmentMethod = require("./departmentMethod");
const roleMethod = require("../role/roleMethod");
const adminMethod = require("../admin/adminMethod");
const { constCommonError} = require("../../const/constErrorCode");

class DepartmentController {
    async onGetDepartmentTree(req, res) {
        try {
            let {department} = await adminMethod.getDepartment({_id: req?.authClaims?.id});
            const tree = await departmentMethod.getDepartmentTree(department?._id);
            return responseSuccess(res, tree);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onCreate(req, res) {
        try {
            const { name } = req.body;
            utilString.checkWhiteSpace(name, "Department Name");
            const existName = await departmentMethod.find( { name })
            if (existName.length) {
                throw (constCommonError.NAME("Department Name").EXIST);
            }
            let response = await departmentMethod.createDepartment(req.body);
            return responseSuccess(res, response);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onGetMany(req, res) {
        try {
            let {department, isRoot} = await adminMethod.getDepartment({_id: req?.authClaims?.id});
            let query = {
                isRoot: false,
            };

            if (!isRoot) {
                query.path = department?._id
            }
            const docs = await departmentMethod.find(query);
            return responseSuccess(res, docs);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onUpdate(req, res) {
        try {
            const {_id, name} = req.body;
            utilString.checkWhiteSpace(name, "Department Name");
            const existName = await departmentMethod.find( { name })
            if (existName.length) {
                throw (constCommonError.NAME("Department Name").EXIST);
            }
            const response = await departmentMethod.findOneAndUpdate(
                {_id: _id},
                {
                    name
                },
                {
                    new: true
                }
            );
            return responseSuccess(res, response);
        } catch (e) {
            return responseError(res, e);
        }
    }

    async onDelete(req, res) {
        try {
            const {_id} = req.body;

            const adminQuery = {
                isDelete: false,
                department: _id
            }
            const role = await roleMethod.findOne(adminQuery);
            if (role) {
                throw (constCommonError.COMMON("Department Role").DELETE);
            }

            const childQuery = {
                isDelete: false,
                parent: _id
            }
            const childDepartment = await departmentMethod.findOne(childQuery);
            if (childDepartment) {
                throw (constCommonError.COMMON("Department Child").DELETE);
            }

            const response = await departmentMethod.findOneAndUpdate(
                {_id: _id},
                {
                    isDelete: true
                }
            );
            return responseSuccess(res, response);
        } catch (e) {
            return responseError(res, e);
        }
    }
}

const departmentController = new DepartmentController();
module.exports = departmentController;
