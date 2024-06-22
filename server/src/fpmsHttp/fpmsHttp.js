const vaultData = require("../vault/config");
const axios = require("axios");
const {logger} = require("../helper/utilPinoLogger");
const host = vaultData?.getData()?.["FPMS_HTTP"];

class FpmsHttp {
    async callAPI(endPoint, method, queryObject, requestBody) {
        const url = this.URLForEndpoint(endPoint, queryObject);
        try {
            const response = await axios({
                method,
                url,
                data: requestBody,
            });
            logger.info(`${endPoint} ${method} request successful:`, response.data);
            return response.data;
        } catch (err) {
            logger.error(`Error in ${method} request to ${endPoint}`, err);
            throw new Error("Failed to process request");
        }
    }

    decryptPhoneNumber(query = {}) {
        return this.callAPI("decrypt", "POST", null, query);
    }

    URLForEndpoint(endpoint, params) {
        let url = host + endpoint;
        if (params && typeof params === "object") {
            Object.keys(params).forEach((key) => {
                if (typeof params[key] === "object") {
                    params[key] = JSON.stringify(params[key]);
                }
            });
            url += "?" + new URLSearchParams(params);
        }
        return url;
    }
}

module.exports = FpmsHttp;