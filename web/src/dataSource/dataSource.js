import Cookies from "js-cookie";
import JWTDecode from "jwt-decode";
import { parseResponse, URLForEndpoint } from "./request";
import { constResCode, constResStatus, constServerError } from "../const/constError";
import util from "../helpers/util";
import store from "../redux/store";
import constDispatch from "../redux/constDispatch";

const COOKIES_EXPIRES = 7;
const TOKEN_NAME = "ctk";
const PERMISSION_STORAGE_NAME = "p";

class DataSource {
  constructor() {
    this.token = null;
    this._claims = null;
    this._permissions = null;
  }

  static get shared() {
    if (!DataSource.instance) {
      DataSource.instance = new DataSource();
    }
    let token = Cookies.get(TOKEN_NAME);
    if (token !== undefined && token !== "null") {
      try {
        DataSource.instance._claims = JWTDecode(token);
        DataSource.instance.token = token;
      } catch (err) {
        console.error("Couldn't decrypt token: ", err);
      }
    }
    return DataSource.instance;
  }

  get claims() {
    return this._claims;
  }

  get isAdmin() {
    return this.claims?.sa === 1;
  }

  get userPermissions() {
    if (this._permissions === null) {
      this._permissions = JSON.parse(
        window.localStorage.getItem(PERMISSION_STORAGE_NAME),
      );
    }
    return this._permissions;
  }

  backVersion() {
    return this.callAPI("/version", "GET");
  }

  resetClaims() {
    Cookies.remove(TOKEN_NAME);
    this.token = null;
    this._claims = null;
  }

  hasPermit(target) {
    const permissions = this.userPermissions;
    if (this.isAdmin || !target) {
      return true;
    }
    return permissions?.includes(target);
  }

  async callAPI(endPoint, method, queryObject, requestBody) {
    const url = URLForEndpoint(endPoint, queryObject);
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers.Authorization = "Bearer " + this.token;
    }

    const request = {
      headers,
      method,
    };
    if (method !== "GET" && requestBody) {
      request.body = JSON.stringify(requestBody);
    }

    let response;
    try {
      response = await fetch(url, request);
    } catch (err) {
      throw constServerError.ERROR_SERVER_UNREACHABLE;
    }

    try {
      return await parseResponse(response);
    } catch (err) {
      if (err?.code === constResCode.RE_LOGIN || err?.statusCode === 440) {
        store.dispatch({
          type: constDispatch.setModal,
          payload: { name: "login" },
        });
      }

      const forceLogoutStatusCodes = [
        constResStatus.INVALID_API_USER,
        constResStatus.INVALID_TOKEN,
      ];
      if (
        forceLogoutStatusCodes?.includes(err?.statusCode) &&
        endPoint !== "logout"
      ) {
        this.forceLogout(err?.message);
      } else {
        throw err;
      }
    }
  }

  async login({ username, password }) {
    const reqBody = {
      username,
      password,
    };

    const json = await this.callAPI("/user/login", "POST", null, reqBody);
    const token = json?.data?.token;
    if (!token) {
      throw json?.message || "Invalid Login";
    }
    localStorage?.setItem("username", username);
    Cookies.set(TOKEN_NAME, token, { expires: COOKIES_EXPIRES });
    this.token = token;

    return json;
  }

  forceLogout() {
    this.logout(false);
  }

  logout() {
    Cookies.remove(TOKEN_NAME);
    this.token = null;
    this._claims = null;
    window.location.href = window.location.origin;
  }

  async checkIsLoggedIn() {
    const result = await this.callAPI("/ping-login", "GET");
    window.localStorage.setItem(
      PERMISSION_STORAGE_NAME,
      JSON.stringify(result?.data),
    );
    return result;
  }

  // Admin
  getAdminTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/admin/table", "GET", obj);
  }

  getAdmin(data = {}) {
    return this.callAPI("/admin", "GET", data);
  }

  createAdmin(data = {}) {
    return this.callAPI("/admin", "POST", null, data);
  }

  updateAdmin(data = {}) {
    return this.callAPI("/admin", "PATCH", null, data);
  }

  deleteAdmin(data = {}) {
    return this.callAPI("/admin", "DELETE", null, data);
  }

  resetPassword(data = {}) {
    return this.callAPI("/admin/reset-password", "PATCH", null, data);
  }

  resetPasswordByAdmin(data = {}) {
    return this.callAPI("/admin/reset", "PATCH", null, data);
  }

  // Role
  getRoleManageTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/role/table", "GET", obj);
  }

  createRole(data = {}) {
    return this.callAPI("/role", "POST", null, data);
  }

  getRole(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/role", "GET", obj);
  }

  getRoleList(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/roles", "GET", obj);
  }

  updateRole(data = {}) {
    return this.callAPI("/role", "PATCH", null, data);
  }

  deleteRole(data = {}) {
    return this.callAPI("/role", "DELETE", null, data);
  }

  updateRolePermission({ role, list, addList, removeList }) {
    return this.callAPI("/role/permissions", "POST", null, {
      role,
      list,
      addList,
      removeList,
    });
  }

  getPlatformByRole(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/role/platform", "GET", obj);
  }

  getSuppliersByRole(data = {}) {
    return this.callAPI("/role/supplier", "GET", data);
  }

  getCategoriesByRole(data = {}) {
    return this.callAPI("/role/category", "GET", data);
  }

  getSiteTypeByRole(data = {}) {
    return this.callAPI("/role/siteType", "GET", data);
  }

  updateRoleBranches(query) {
    return this.callAPI("/role/branches", "POST", null, query);
  }

  // Permission
  getAllPermission(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/permissions", "GET", obj);
  }

  generatePermissions() {
    return this.callAPI("/permissions/seed", "POST");
  }

  // Provider
  getSuppliers(data = {}) {
    return this.callAPI("/suppliers", "GET", data);
  }

  // Site Type
  createSiteType(data = {}) {
    return this.callAPI("/site-type", "POST", null, data);
  }

  getSiteTypeTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/site-type/table", "GET", obj);
  }

  getSiteType(data = {}) {
    return this.callAPI("/site-type", "GET", data);
  }

  updateSiteType(data = {}) {
    return this.callAPI("/site-type", "PATCH", null, data);
  }

  getCategoriesBySiteType(data = {}) {
    return this.callAPI("/site-type/category", "GET", data);
  }

  // Category
  getCategoryTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/category/table", "GET", obj);
  }

  getCategories(data = {}) {
    return this.callAPI("/categories", "GET", data);
  }

  createCategory(data = {}) {
    return this.callAPI("/category", "POST", null, data);
  }

  updateCategory(data = {}) {
    return this.callAPI("/category", "PATCH", null, data);
  }

  getSupplierByCategory(data = {}) {
    return this.callAPI("/category/suppliers", "GET", data);
  }

  // Platform
  getPlatform(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/platform", "GET", obj);
  }

  // Branch
  getBranchTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/branch/table", "GET", obj);
  }

  updateBranch(data = {}) {
    return this.callAPI("/branch", "PATCH", null, data);
  }

  getSiteTypeByBranch(data = {}) {
    return this.callAPI("/branch/site-type", "GET", data);
  }

  getSiteTypeByBranchWithId(data = {}) {
    return this.callAPI("/branch/site-type-id", "GET", data);
  }

  // Operation Log
  getOperationLogTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/operation-log/table", "GET", obj);
  }

  // Report
  getSummaryReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/summary", "GET", obj);
  }

  getBranchReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/branch", "GET", obj);
  }

  getBillReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/bill", "GET", obj);
  }

  getDailyReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/daily", "GET", obj);
  }

  getBillTotal(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/bill/total", "GET", obj);
  }

  exportBillReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/bill/export", "GET", obj);
  }

  exportSummaryReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/summary/export", "GET", obj);
  }

  exportBranchReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/branch/export", "GET", obj);
  }

  exportDailyReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/report/daily/export", "GET", obj);
  }
  exportPlayerInfoReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/player-info/export", "GET", obj);
  }
  exportTransferInOutReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/transfer/export", "GET", obj);
  }

  exportPlayerDepositReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/deposit/export", "GET", obj);
  }

  exportPlayerWithdrawReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/withdraw/export", "GET", obj);
  }

  generateBillReportSummary(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/report/bill/export/generate", "POST", obj);
  }

  deleteExportFile(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/report/bill/export", "DELETE", obj);
  }

  generateSpecifyBillFile(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/report/bill/export/specify-generate", "POST", obj);
  }

  getJackpotReportTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/jackpot/table", "GET", obj);
  }

  exportJackpotReport(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/jackpot/export", "GET", obj);
  }

  // Game
  getGames(query = {}) {
    return this.callAPI("/games", "GET", query);
  }

  getGameName(query = {}) {
    return this.callAPI("/games/name", "GET", query);
  }

  // Re-Summary
  manualSummary(query = {}) {
    return this.callAPI("/summary", "PATCH", null, query);
  }

  // System-status
  getSystemStatus(query = {}) {
    return this.callAPI("/system-status", "GET", null, query);
  }

  //System Config
  getSystemConfig(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/system-config", "GET", obj);
  }

  createSystemConfig(query = {}) {
    return this.callAPI("/system-config", "POST", null, query);
  }

  updateSystemConfig(data = {}) {
    return this.callAPI("/system-config", "PATCH", null, data);
  }

  deleteSystemConfig(data = {}) {
    return this.callAPI("/system-config", "DELETE", null, data);
  }

  //Ip Config
  getIpConfig(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/ip-config", "GET", obj);
  }

  createIpConfig(query = {}) {
    return this.callAPI("/ip-config", "POST", null, query);
  }

  updateIpConfig(data = {}) {
    return this.callAPI("/ip-config", "PATCH", null, data);
  }

  deleteIpConfig(data = {}) {
    return this.callAPI("/ip-config", "DELETE", null, data);
  }

  // Restart Log
  getRestartLogTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/restart-log/table", "GET", obj);
  }

  // Department
  getDepartmentTree(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/department-tree", "GET", obj);
  }

  createDepartment(query = {}) {
    return this.callAPI("/department", "POST", null, query);
  }

  getDepartmentList(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/departments", "GET", obj);
  }

  updateDepartment({ name, _id }) {
    return this.callAPI("/department", "PATCH", null, {
      _id,
      name,
    });
  }

  removeDepartment({ _id }) {
    return this.callAPI("/department", "DELETE", null, {
      _id,
    });
  }

  // player info
  getPlayerInfoTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/player-info", "GET", obj);
  }

  getTotalCount(query = {}, paginate = {}, api) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI(api, "GET", obj);
  }

  // deposit
  getPlayerDepositTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/deposit", "GET", obj);
  }

  // withdraw
  getPlayerWithdrawTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/withdraw", "GET", obj);
  }

  // transfer in out
  getTransferInOutTable(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/transfer", "GET", obj);
  }

  getSummaryListCount(query = {}, paginate = {}) {
    const obj = getQueryObj(query, paginate);
    return this.callAPI("/summary-list/count", "GET", obj);
  }

  // Dashboard
  getDashboardGame(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/dashboard/game", "GET", obj);
  }

  getDashboardSupplier(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/dashboard/supplier", "GET", obj);
  }

  // Config
  getConfigResource(query = {}) {
    const obj = getQueryObj(query);
    return this.callAPI("/config/resource", "GET", obj);
  }

  updateConfigResource(query = {}) {
    return this.callAPI("/config/resource", "POST", null, query);
  }

  // CALL FPMS
  getPhoneNumber (query = {}){
    return this.callAPI("/fpms/phoneNumber", "POST", null, query);
  }
}

const getQueryObj = (state = {}, paginate = {}) => {
  if (state === null) {
    state = {};
  }
  delete state?.paginate;
  util?.object?.removeUndefinedInObj(state);
  return {
    ...state,
    page: paginate?.page || 1,
    limit: paginate?.limit || 10
  };
};

export default DataSource;
