const vaultData = require("../vault/config");
const axios = require("axios");
const host = vaultData?.getData()?.["HOST_SETTLEMENT"];

class Settlement {
  async callAPI(endPoint, method, queryObject, requestBody) {
    const url = this.URLForEndpoint(endPoint, queryObject);
    try {
      if (method === "GET") {
        const response = await axios.get(url);
        console.log(endPoint + "GET request successful:", response.data);
        return response.data;
      } else if (method === "POST") {
        const response = await axios.post(url, requestBody);
        console.log(endPoint + "POST request successful:", response.data);
        return response.data;
      } else if (method === "PATCH") {
        const response = await axios.patch(url, requestBody);
        console.log(endPoint + "PATCH request successful:", response.data);
        return response.data;
      }
    } catch (err) {
      console.error("Error callAPI", endPoint, err);
    }
  }

  settlementGenerateBillExport(query = {}) {
    return this.callAPI("/generate/bill/export", "POST", null, query);
  }

  settlementConsumptionAggregate(query = {}) {
    return this.callAPI("/consumption/aggregate", "POST", null, query);
  }

  generateSummaryAggregate(query = {}, projectQuery, groupQuery, updateQuery, _id) {
    return this.callAPI("/summary/consumption/aggregate", "POST", null, query);
  }

  URLForEndpoint(endpoint, params) {
    let url = host + "/v2" + endpoint;
    if (params && typeof params === "object") {
      Object.keys(params).forEach((key) => {
        if (typeof params[key] === "object") {
          params[key] = JSON.stringify(params[key]);
        }
      });
      //https://nodejs.org/dist/latest-v16.x/docs/api/url.html#class-urlsearchparams
      url += "?" + new URLSearchParams(params);
    }
    return url;
  }
}

const settlement = new Settlement();
module.exports = settlement;