const express = require("express");
const JwtToken = require("../helper/jwttoken");
const constPermissions = require("../const/constPermissions2");
const dbUpdaterController = require("../component/dbUpdater/dbUpdaterController");
const operationLogController = require("../component/operationLog/operationLogController");
const platformController = require("../component/platform/platformController");
const userController = require("../component/user/userController");
const adminController = require("../component/admin/adminController");
const roleController = require("../component/role/roleController");
const permissionController = require("../component/permission/permissionController");
const supplierController = require("../component/supplier/supplierController");
const siteTypeController = require("../component/siteType/siteTypeController");
const categoryController = require("../component/category/categoryController");
const branchController = require("../component/branch/branchController");
const summaryReportController = require("../component/report/summaryReportController");
const branchReportController = require("../component/report/branchReportController");
const billReportController = require("../component/report/billReportController");
const dailyReportController = require("../component/report/dailyReportController");
const gameController = require("../component/game/gameController");
const summaryController = require("../component/summary/summaryController");
const systemStatusController = require("../component/systemStatus/systemStatusController");
const systemConfigController = require("../component/systemConfig/systemConfigController");
const ipConfigController = require("../component/ipConfig/ipConfigController");
const restartLogController = require("../component/restartLog/restartLogController");
const departmentController = require("../component/department/departmentController");
const playerInfoController = require("../component/player/playerInfoController");
const depositController = require("../component/deposit/depositController");
const withdrawController = require("../component/withdraw/withdrawController");
const transferInOutController = require("../component/transferInOut/transferInOutController");
const dashboardController = require("../component/dashboard/dashboardController");
const configController = require("../component/config/configController");
const jackpotController = require("../component/jackpot/jackpotController");

const router = express.Router();

// Health Check
router.route("/health-check").get(dbUpdaterController.onHealthCheck);
router.route("/version").get(dbUpdaterController.onGetVersion);

// Route
router.route("/user/login").post(userController.onLogin);
router.route("/ping-login").get(JwtToken.isLoggedInAndPopulatePermissions(), userController.onPingLogin);
router.route("/dbupdater/init").post(dbUpdaterController.onInit);

// admin
router.route("/admin/table").get(JwtToken.hasAnyPermission(constPermissions.ADMIN_READ), adminController.onGetTable);
router.route("/admin").get(JwtToken.isLoggedIn(), adminController.onGet);
router.route("/admin").post(JwtToken.isLoggedIn(), adminController.onCreate);
router.route("/admin").patch(JwtToken.isLoggedIn(), adminController.onUpdate);
router.route("/admin").delete(JwtToken.isLoggedIn(), adminController.onDelete);
router.route("/admin/reset-password").patch(JwtToken.isLoggedIn(), adminController.onResetPassword);
router.route("/admin/reset").patch(JwtToken.isLoggedIn(), adminController.onResetPasswordByAdmin);

// role
router.route("/role/table").get(JwtToken.hasAnyPermission(constPermissions.ROLE_READ), roleController.onGetTable);
router.route("/role").post(JwtToken.isLoggedIn(), roleController.onCreate);
router.route("/role").get(JwtToken.isLoggedIn(), roleController.onGet);
router.route("/role").patch(JwtToken.isLoggedIn(), roleController.onUpdate);
router.route("/role").delete(JwtToken.isLoggedIn(), roleController.onDelete);
router.route("/roles").get(JwtToken.isLoggedIn(), roleController.onGetMany);
router.route("/role/permissions").post(JwtToken.isLoggedIn(), roleController.onUpdatePermissions);
router.route("/role/platform").get(JwtToken.isLoggedIn(), roleController.onGetRolePlatform);
router.route("/role/branches").post(JwtToken.isLoggedIn(), roleController.onUpdateRoleBranches);
router.route("/role/supplier").get(JwtToken.isLoggedIn(), roleController.onGetRoleSupplier);
router.route("/role/category").get(JwtToken.isLoggedIn(), roleController.onGetRoleCategory);
router.route("/role/siteType").get(JwtToken.isLoggedIn(), roleController.onGetRoleSiteType);

// permissions
router.route("/permissions").get(JwtToken.isLoggedIn(), permissionController.onGetMany);
router.route("/permissions/seed").post(JwtToken.isLoggedIn(), permissionController.onCreatePermissionsBySeed);

// supplier
router.route("/suppliers").get(JwtToken.isLoggedIn(), supplierController.onGetMany);

// site Type
router.route("/site-type").post(JwtToken.isLoggedIn(), siteTypeController.onCreate);
router.route("/site-type").patch(JwtToken.isLoggedIn(), siteTypeController.onUpdate);
router.route("/site-type").get(JwtToken.isLoggedIn(), siteTypeController.onGet);
router
  .route("/site-type/table")
  .get(JwtToken.hasAnyPermission(constPermissions["SITE-TYPE_READ"]), siteTypeController.onGetTable);
router.route("/site-type/category").get(JwtToken.isLoggedIn(), siteTypeController.onGetCategory);

// category
router.route("/category").post(JwtToken.isLoggedIn(), categoryController.onCreate);
router.route("/category").patch(JwtToken.isLoggedIn(), categoryController.onUpdate);
router
  .route("/category/table")
  .get(JwtToken.hasAnyPermission(constPermissions["CATEGORY_READ"]), categoryController.onGetTable);
router.route("/categories").get(JwtToken.isLoggedIn(), categoryController.onGetMany);
router.route("/category/suppliers").get(JwtToken.isLoggedIn(), categoryController.onGetSupplier);

// platform
router.route("/platform").get(JwtToken.isLoggedIn(), platformController.onGetPlatform);

// branch
router
  .route("/branch/table")
  .get(JwtToken.hasAnyPermission(constPermissions["BRANCH_READ"]), branchController.onGetTable);
router.route("/branch").patch(JwtToken.isLoggedIn(), branchController.onUpdate);
router.route("/branch/site-type").get(JwtToken.isLoggedIn(), branchController.onGetSiteType);
router.route("/branch/site-type-id").get(JwtToken.isLoggedIn(), branchController.onGetSiteTypeWithId);

// operation log
router.route("/operation-log/table").get(JwtToken.isLoggedIn(), operationLogController.onGetTable);

// Summary Report
router
  .route("/report/summary")
  .get(JwtToken.hasAnyPermission(constPermissions["SUMMARY-REPORT_READ"]), summaryReportController.onGet);
router
  .route("/report/summary/export")
  .get(JwtToken.hasAnyPermission(constPermissions["SUMMARY-REPORT_READ"]), summaryReportController.onExport);

// Branch Report
router
  .route("/report/branch")
  .get(JwtToken.hasAnyPermission(constPermissions["BRANCH-REPORT_READ"]), branchReportController.onGet);
router
  .route("/report/branch/export")
  .get(JwtToken.hasAnyPermission(constPermissions["BRANCH-REPORT_READ"]), branchReportController.onExport);

// Daily Report
router
  .route("/report/daily")
  .get(JwtToken.hasAnyPermission(constPermissions["DAILY-REPORT_READ"]), dailyReportController.onGet);
router
  .route("/report/daily/export")
  .get(JwtToken.hasAnyPermission(constPermissions["DAILY-REPORT_READ"]), dailyReportController.onExport);

// Bill Report
router
  .route("/report/bill")
  .get(JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_READ"]), billReportController.onGet);
router
  .route("/report/bill/total")
  .get(JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_READ"]), billReportController.onGetTotal);
router
  .route("/report/bill/export")
  .get(JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_READ"]), billReportController.onExport);
router
  .route("/report/bill/export")
  .delete(
    JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_EXPORT_DELETE"]),
    billReportController.onDeleteExport
  );
router
  .route("/report/bill/export/specify-generate")
  .post(
    JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_REGENERATE"]),
    billReportController.onRegenerateSpecifyFile
  );
router
  .route("/report/bill/export/generate")
  .post(JwtToken.hasAnyPermission(constPermissions["TRANSACTION-REPORT_REGENERATE"]), billReportController.onGenerate);

// Games
router.route("/games").get(JwtToken.isLoggedIn(), gameController.onGetMany);
router.route("/games/name").get(JwtToken.isLoggedIn(), gameController.onGetGameName);

// Summary
router.route("/summary").patch(JwtToken.isLoggedIn(), summaryController.onSummary);
router.route("/summary-list/count").get(JwtToken.isLoggedIn(), summaryController.onCountSummaryList)

// system Status
router.route("/system-status").get(JwtToken.isLoggedIn(), systemStatusController.onGetStatus);

// system Config
router.route("/system-config").get(JwtToken.isLoggedIn(), systemConfigController.onGetConfig);
router.route("/system-config").post(JwtToken.isLoggedIn(), systemConfigController.onCreate);
router.route("/system-config").patch(JwtToken.isLoggedIn(), systemConfigController.onUpdate);
router.route("/system-config").delete(JwtToken.isLoggedIn(), systemConfigController.onDelete);

// ip Config
router.route("/ip-config").get(JwtToken.isLoggedIn(), ipConfigController.onGetConfig);
router.route("/ip-config").post(JwtToken.isLoggedIn(), ipConfigController.onCreate);
router.route("/ip-config").patch(JwtToken.isLoggedIn(), ipConfigController.onUpdate);
router.route("/ip-config").delete(JwtToken.isLoggedIn(), ipConfigController.onDelete);

// Restart Log
router.route("/restart-log/table").get(JwtToken.isLoggedIn(), restartLogController.onGetTable);

// Department
router.route("/department-tree").get(JwtToken.isLoggedIn(), departmentController.onGetDepartmentTree);
router.route("/departments").get(JwtToken.isLoggedIn(), departmentController.onGetMany);
router.route("/department").post(JwtToken.isLoggedIn(), departmentController.onCreate);
router.route("/department").patch(JwtToken.isLoggedIn(), departmentController.onUpdate);
router.route("/department").delete(JwtToken.isLoggedIn(), departmentController.onDelete);

// Player Info
router.route("/player-info").get(JwtToken.isLoggedIn(),playerInfoController.onGet);
router.route("/player-info/export").get(JwtToken.isLoggedIn(),playerInfoController.onExport);
router.route("/player-info/count").get(JwtToken.isLoggedIn(),playerInfoController.getCount);

// Deposit
router.route("/deposit").get(JwtToken.isLoggedIn(), depositController.onGet);
router.route("/deposit/export").get(JwtToken.isLoggedIn(),depositController.onExport);
router.route("/deposit/count").get(JwtToken.isLoggedIn(),depositController.onGetTotal);

// Withdraw
router.route("/withdraw").get(JwtToken.isLoggedIn(), withdrawController.onGet);
router.route("/withdraw/export").get(JwtToken.isLoggedIn(),withdrawController.onExport);
router.route("/withdraw/count").get(JwtToken.isLoggedIn(),withdrawController.onGetTotal);

// Transfer In Out
router.route("/transfer").get(JwtToken.isLoggedIn(), transferInOutController.onGet);
router.route("/transfer/export").get(JwtToken.isLoggedIn(),transferInOutController.onExport);
router.route("/transfer/count").get(JwtToken.isLoggedIn(),transferInOutController.onGetTotal);

// Dashboard
router.route("/dashboard/game").get(JwtToken.isLoggedIn(), dashboardController.onGetGame);
router.route("/dashboard/supplier").get(JwtToken.isLoggedIn(), dashboardController.onGetSupplier);

// Config
router.route("/config/resource").get(JwtToken.isLoggedIn(), configController.onGet);
router.route("/config/resource").post(JwtToken.isLoggedIn(), configController.onUpdate);

// FPMS API
router.route("/fpms/phoneNumber").post(JwtToken.isLoggedIn(),playerInfoController.onGetPhoneNumber);

// JackPot Report
router.route("/jackpot/table").get(JwtToken.hasAnyPermission(constPermissions["JACKPOT-REPORT_READ"]), jackpotController.onGetMany);
router.route("/jackpot/export").get(JwtToken.hasAnyPermission(constPermissions["JACKPOT-REPORT_READ"]), jackpotController.onExport);

module.exports = router;
