import React from "react";

// Const File
import constPermissions from "../const/constPermissions2.js";

// System Manage
import AdminManagePage from "../pages/systemManage/adminManagePage/adminManagePage.jsx";
import RoleManagePage from "../pages/systemManage/roleManagePage/roleManagePage.jsx";
import SiteTypeManagePage from "../pages/systemManage/siteTypeManagePage/siteTypeManagePage.jsx";
import CategoryManagePage from "../pages/systemManage/categoryManagePage/categoryManagePage.jsx";
import BranchManagePage from "../pages/systemManage/branchManagePage/branchManagePage.jsx";
import DepartmentPage from "../pages/systemManage/departmentPage/departmentPage.jsx";

// Report Manage
import SummaryReportPage from "../pages/reportManage/summaryReportPage/summaryReportPage.jsx";
import BranchReportPage from "../pages/reportManage/branchReportPage/branchReportPage.jsx";
import BillReportPage from "../pages/reportManage/billReportPage/billReportPage.jsx";
import BalanceRecordPage from "../pages/reportManage/balanceRecord/balanceRecordPage.jsx";
import DailyReportPage from "../pages/reportManage/dailyReportPage/dailyReportPage.jsx";
import PlayerInfoPage from "../pages/reportManage/playerInfoPage/playerInfoPage.jsx";
import PlayerDepositPage from "../pages/reportManage/playerDeposit/playerDeposit.jsx";
import PlayerWithdrawPage from "../pages/reportManage/playerWithdraw/playerWithdraw.jsx";
import TransferInOutPage from "../pages/reportManage/transferInOut/transferInOut.jsx";
import ReSummaryPage from "../pages/reportManage/resummaryPage/resummaryPage.jsx";
import AmlaReportPage from "../pages/reportManage/amlaReport/amlaPage.jsx";
import JackpotReportPage from "../pages/reportManage/jackpotManage/jackpotReportPage.jsx";

// Log Manage
import OperationLogPage from "../pages/logManage/operationLogPage/operationLogPage.jsx";
import RestartLogPage from "../pages/logManage/restartLogPage/restartLogPage.jsx";

// Game Dashboard
import GameDashboardPage from "../pages/gameDashboardPage/gameDashboardPage.jsx";

// Config Manage
import ConfigResourcePage from "../pages/configManage/configResourcePage/configResourcePage.jsx";
import ConfigTimeLimitPage from "../pages/configManage/configTimeLimitPage/configTimeLimitPage.jsx";
import ConfigExportPage from "../pages/configManage/configExportPage/configExportPage.jsx";

// Others
import NotFoundPage from "../pages/Others/notFoundPage.jsx";
import PermissionPage from "../pages/Others/permissionPage/permissionPage";

import images from "../images/images";

const {
  ic_admin,
  ic_role,
  ic_category,
  ic_site,
  ic_branch,
  ic_summary,
  ic_branch_report,
  ic_bill,
  ic_daily,
  ic_report,
  ic_authority
} = images;

const routes = [
  // {
  //   path: "/dashboard/game",
  //   name: "GAME DASHBOARD",
  //   icon: "",
  //   permission: constPermissions.GAME_READ,
  //   component: <GameDashboardPage title={"Game Dashboard"} />,
  // },
  {
    path: "/manage",
    name: "SYSTEM MANAGE",
    icon: "icon-set",
    children: [
      {
        path: "/manage/admin",
        name: "Admin Manage",
        icon: ic_admin,
        permission: constPermissions.ADMIN_READ,
        component: <AdminManagePage title={"Admin Manage"} />,
      },
      {
        path: "/manage/role",
        name: "Role Manage",
        icon: ic_role,
        permission: constPermissions.ROLE_READ,
        component: <RoleManagePage title={"Role Manage"} />,
      },
      {
        path: "/manage/category",
        name: "Category Manage",
        icon: ic_category,
        permission: constPermissions.CATEGORY_READ,
        component: <CategoryManagePage title={"Category Manage"} />,
      },
      {
        path: "/manage/siteType",
        name: "Site Type Manage",
        icon: ic_site,
        permission: constPermissions["SITE-TYPE_READ"],
        component: <SiteTypeManagePage title={"Site Type Manage"} />,
      },
      {
        path: "/manage/branch",
        name: "Branch Manage",
        icon: ic_branch,
        permission: constPermissions.BRANCH_READ,
        component: <BranchManagePage title={"Branch Manage"} />,
      },
      {
        path: "/manage/department",
        name: "Department Manage",
        icon: ic_role,
        permission: constPermissions["DEPARTMENT_READ"],
        component: <DepartmentPage title={"Department Manage"} />,
      },
    ],
  },
  {
    path: "/report",
    name: "REPORT MANAGE",
    icon: "icon-set",
    children: [
      {
        path: "/report/summary",
        name: "Summary Report",
        icon: ic_summary,
        permission: constPermissions["SUMMARY-REPORT_READ"],
        component: <SummaryReportPage title={"Summary Report"} />,
      },
      {
        path: "/report/branch",
        name: "Branch Report",
        icon: ic_branch_report,
        permission: constPermissions["BRANCH-REPORT_READ"],
        component: <BranchReportPage title={"Branch Report"} />,
      },
      {
        path: "/report/transaction",
        name: "Transaction Report",
        icon: ic_bill,
        permission: constPermissions["TRANSACTION-REPORT_READ"],
        component: <BillReportPage title={"Transaction Report"} />,
      },
      {
        path: "/report/balance",
        name: "Balance Record",
        icon: ic_bill,
        permission: constPermissions["BALANCE-RECORD_READ"],
        component: <BalanceRecordPage title={"Balance Record"} />,
      },
      {
        path: "/report/daily",
        name: "Daily Report",
        icon: ic_daily,
        permission: constPermissions["DAILY-REPORT_READ"],
        component: <DailyReportPage title={"Daily Report"} />,
      },
      {
        path: "/report/jackpot",
        name: "Jackpot Report",
        icon: ic_report,
        permission: constPermissions["JACKPOT-REPORT_READ"],
        component: <JackpotReportPage title={"Jackpot Report"}></JackpotReportPage>,
      },
      {
        path: "/report/AMLA-Report",
        name: "AMLA Report",
        icon: ic_report,
        permission: constPermissions["AMLA-REPORT_READ"],
        component: <AmlaReportPage title={"AMLA"}></AmlaReportPage>,
      },
      {
        path: "/report/playerInfo",
        name: "Player Info",
        icon: ic_report,
        permission: constPermissions["PLAYER-INFO_READ"],
        component: <PlayerInfoPage title={"Player Info"}></PlayerInfoPage>,
      },
      {
        path: "/report/deposit",
        name: "Player Deposit",
        icon: ic_report,
        permission: constPermissions["PLAYER-DEPOSIT_READ"],
        component: (
          <PlayerDepositPage title={"Player Deposit"}></PlayerDepositPage>
        ),
      },
      {
        path: "/report/withdraw",
        name: "Player Withdraw",
        icon: ic_report,
        permission: constPermissions["PLAYER-WITHDRAW_READ"],
        component: (
          <PlayerWithdrawPage title={"Player Withdraw"}></PlayerWithdrawPage>
        ),
      },
      {
        path: "/report/transferInOut",
        name: "Transfer In/Out",
        icon: ic_report,
        permission: constPermissions["TRANSFER-IN-OUT_READ"],
        component: (
          <TransferInOutPage title={"Transfer In/Out"}></TransferInOutPage>
        ),
      },
      {
        path: "/report/re-summary",
        name: "RE-Summary",
        icon: ic_authority,
        permission: constPermissions["RE-SUMMARY_READ"],
        component: <ReSummaryPage title={"Generate Summary List"} />,
      },
    ],
  },
  {
    path: "/log",
    name: "LOG MANAGE",
    icon: "icon-set",
    children: [
      {
        path: "/log/operation-log",
        name: "Operation Log",
        icon: ic_summary,
        permission: "root", // only root account can view
        component: <OperationLogPage title={"Operation Log"} />,
      },
      {
        path: "/log/restart-log",
        name: "Restart Log",
        icon: ic_summary,
        permission: "root",
        component: <RestartLogPage title={"Restart Log"} />,
      },
    ],
  },
  {
    path: "/config",
    name: "CONFIG MANAGE",
    icon: "icon-set",
    children: [
      {
        path: "/config/resource",
        name: "Resource Config",
        icon: ic_summary,
        permission: "root",
        component: <ConfigResourcePage title={"Resource Config"} />
      },
      {
        path: "/config/time-limit",
        name: "Time Limit Config",
        icon: ic_summary,
        permission: "root",
        component: <ConfigTimeLimitPage title={"Time Limit Config"} />
      },
      {
        path: "/config/export",
        name: "Export Config",
        icon: ic_summary,
        permission: "root",
        component: <ConfigExportPage title={"Export Config"} />
      }
    ],
  },
  {
    path: "permission",
    name: "PERMISSION LIST",
    icon: "",
    permission: "root", // only root account can view
    component: <PermissionPage title={"System Permissions"} />,
  },
  {
    path: "*",
    name: "notFound",
    component: <NotFoundPage />,
  },
];

export default routes;
