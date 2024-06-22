import { constResStatus, constServerError } from "../const/constError";
import util from "../helpers/util";
import config from "../config/config.js";

export const getApiHost = () => {
  return config.API_HOST;
};

export const parseResponse = async (response) => {
  const responseStatusNumber = Number(response?.status);
  const clientErrors = [constResStatus.NOT_FOUND];
  if (clientErrors.includes(responseStatusNumber)) {
    throw constServerError[responseStatusNumber];
  }

  let json;
  try {
    json = await response.json();
  } catch (err) {
    throw constServerError[constResStatus.INVALID];
  }
  if (json === undefined) {
    throw constServerError[constResStatus.INVALID];
  }

  // If not successful, throw JSON as response
  if (responseStatusNumber >= 400 && responseStatusNumber <= 599) {
    throw json;
  }

  return json;
};

export const URLForEndpoint = (endpoint, params, host) => {
  if (!host) {
    host = getApiHost();
  }
  let url = host + "/v1" + endpoint;
  if (params && typeof params === "object") {
    util.object.removeUndefinedInObj(params);
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === "object") {
        params[key] = JSON.stringify(params[key]);
      }
    });
    //https://nodejs.org/dist/latest-v16.x/docs/api/url.html#class-urlsearchparams
    url += "?" + new URLSearchParams(params);
  }
  return url;
};

export const prepareInfoAndDownload = (data) => {
  const { api } = data;
  const url = URLForEndpoint(api);
  data.Authorization = "Bearer " + (data?.token || "");
  data.operationLogData = { logRequired: false };

  const windowName = "myWindow";
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", url);
  form.setAttribute("target", windowName);

  const formKeys = [
    "Authorization",
    "query",
    "sort",
    "keys",
    "header",
    "options",
    "isCrypto",
    "operationLogData",
    "company"
  ];
  formKeys.forEach((key) => {
    const value = data[key];
    if (value) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = (typeof value === "object" && JSON.stringify(value)) || value;
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  window.open(url, windowName);
  form.target = windowName;
  form.submit();
  document.body.removeChild(form);
};
