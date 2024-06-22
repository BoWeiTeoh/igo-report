const config = require("../config/appConfig");
const { stringToObject, removeUndefinedInObj, cloneObj } = require("./utilObject");
const {constCommonError, constServerError}= require("../const/constErrorCode");
const {logger} = require("./utilPinoLogger");

const responseSuccess = (res, data, options) => {
  const { msg, code } = options || {};

  let json = {
    ok: 1,
    msg,
    code
  };
  json.data = data?.docs ? data.docs : data;
  const {
    hasNextPage,
    hasPrevPage,
    limit,
    nextPage,
    page,
    pagingCounter,
    prevPage,
    totalDocs,
    totalPages,
    subTotal
  } = data;
  json.pagingData = {
    hasNextPage,
    hasPrevPage,
    limit,
    nextPage,
    page,
    pagingCounter,
    prevPage,
    totalDocs,
    totalPages,
    subTotal
  };
  //}
  return res.json(json);
};

const responseError = (res, err, data, status, code) => {
  console.log(res?.statusCode)
  status = status || 400;
  code = err.code || code
  let msg = err;
  // try {
  //   msg = err.toString();
  // } catch (e) {
  // }

  if (constServerError.HTTP[res?.statusCode]) {
    msg = constServerError.HTTP[res?.statusCode].msg;
  } else {
    if (typeof msg === "object") {
      if (err?.original) {
        msg = err.original;
      } else if (err.msg) {
        msg = err.msg;
      }
    }
  }

  const response = {
    ok: 0,
    msg: msg,
    data,
    code
  };
  removeUndefinedInObj(response, true);

  console.error("responseError", status, response);
  // Printing error stack
  return res.status(status).json(response);
};

const makeFilter = (reqQuery) => {
  let filter = cloneObj(reqQuery);
  delete filter?.page;
  delete filter?.limit;
  delete filter?.sort;
  delete filter?.isExport;
  removeUndefinedInObj(filter);
  Object.keys(filter).forEach((key) => {
    let value = filter[key];
    let valueObj;
    if (typeof value === "object") {
      valueObj = value;
    } else if (typeof value === "string") {
      try {
        valueObj = JSON.parse(value);
      } catch (e) {
      }
    }

    if (valueObj?.startTime || valueObj?.endTime) {
      const { startTime, endTime } = valueObj || {};
      if (startTime && endTime) {
        filter[key] = { startTime: new Date(startTime), endTime: new Date(endTime) };
      } else if (startTime) {
        filter[key] = { startTime: new Date(startTime) };
      } else if (endTime) {
        filter[key] = { endTime: new Date(endTime) };
      }
    } else if (typeof valueObj === "object") {
      filter[key] = valueObj;
    }
  });
  return filter;
};

// Normal filter
const parseQuery = (reqQuery) => {
  try {
    let { sort } = reqQuery;
    let paginate, parsedSort;
    const filter = makeFilter(reqQuery);

    if (sort) {
      if (typeof sort === "string") {
        sort = JSON.parse(sort);
      }
      parsedSort = sort;
    }
    if (reqQuery?.limit || reqQuery?.page || reqQuery?.isExport) {
      paginate = paginate || {};
      paginate.limit = Number(reqQuery.limit) || config.paginate.limit;
      paginate.page = Number(reqQuery.page) || config.paginate.page;
      paginate.isExport = reqQuery?.isExport;
    }

    removeUndefinedInObj(filter, true);

    let paginateOption = {};
    if (paginate) {
      paginateOption = paginate;
    }

    if (parsedSort) {
      paginateOption.sort = [parsedSort];
    }
    paginateOption.lean = true;
    return {
      filter: filter,
      paginateOption,
      paginate
    };
  } catch (e) {
    logger.error(e, "parseQuery error");
    throw e;
  }
};

// Provide regex method for filter
const parseQuery2 = (reqQuery) => {
  try {
    let { sort } = reqQuery;
    const parsedObj = {};
    let paginate, parsedSort;
    const filter = makeFilter(reqQuery);

    if (sort) {
      parsedSort = parseSortParameter(sort);
    }

    if (reqQuery?.limit || reqQuery?.page) {
      paginate = parsePaginationParameters(reqQuery);
    }

    removeUndefinedInObj(parsedObj, true);

    if (typeof filter === "object") {
      const and = Object.entries(filter).map(([key, value]) => {
        return createFilterObject(key, value);
      });

      if (and.length) {
        parsedObj.$and = and;
      }
    }

    if (parsedObj?.$and) {
      parsedObj?.$and.map(item => {
        if (item?.createdAt) {
          if (item?.createdAt?.startTime && item?.createdAt?.endTime) {
            item.createdAt = {
              $gte: new Date(item?.createdAt?.startTime),
              $lt: new Date(item?.createdAt?.endTime)
            }
          }
          if (item?.createdAt?.startTime) {
            item.createdAt = {
              $gte: new Date(item?.createdAt?.startTime),
            }
          }
          if (item?.createdAt?.endTime) {
            item.createdAt = {
              $lt: new Date(item?.createdAt?.endTime)
            }
          }
        }
      })
    }

    let paginateOption = {};
    if (paginate) {
      paginateOption = paginate;
    }

    if (parsedSort) {
      paginateOption.sort = [parsedSort];
    }

    return {
      filter: parsedObj,
      paginateOption,
      paginate
    };
  } catch (e) {
    logger.error(e,"parseQuery error");
    throw e;
  }
};

const parseSortParameter = (sort) => {
  if (typeof sort === "string") {
    return JSON.parse(sort);
  }
  return sort;
};

const parsePaginationParameters = (reqQuery) => {
  return {
    limit: Number(reqQuery.limit) || config.paginate.limit,
    page: Number(reqQuery.page) || config.paginate.page
  };
};

const createFilterObject = (key, value) => {
  value = stringToObject(value);

  if (Array.isArray(value)) {
    return createArrayFilterObject(key, value);
  } else if (typeof value === "object") {
    return createObjectFilterObject(key, value);
  } else {
    return { [key]: [value] };
  }
};

const createArrayFilterObject = (key, value) => {
  const query = {};
  value.forEach((d) => {
    const operation = getOperator(d.operation);
    if (d.operation) {
      query[operation] = d.value;
    } else {
      if (Array.isArray(query[operation])) {
        query[operation].push(d);
      } else {
        query[operation] = [d];
      }
    }
  });
  return { [key]: { $or: query } };
};

const createObjectFilterObject = (key, value) => {
  if (value?.operation) {
    const operation = getOperator(value.operation);
    if (Array.isArray(value?.value)) {
      const query = {};
      value?.value.forEach((c) => {
        const operation = getOperator(c.operation);
        query[operation] = c.value;
      });
      return { [key]: query };
    } else {
      // 模糊查询
      if (operation === "regex" && value?.value) {
        value.value = new RegExp("^" + value?.value);
      }
      return { [key]: { [operation]: value.value } };
    }
  } else {
    return { [key]: value };
  }
};

const mongoOperator = {
  and: "$and",
  or: "$or",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  regex: "$regex"
};
const getOperator = (operator) => {
  // not allow frontend self define operator
  if (operator?.startsWith("$")) {
    operator = operator.slice(1);
  }
  if (!mongoOperator[operator]) {
    logger.error(null,`unknown operator => ${operator}`);
  }
  return mongoOperator[operator];
};

const getPagination = (query) => {
  let offset = 0;
  let limit = Number(query?.limit) || config.paginate.limit;
  if (query?.page > 1) {
    offset = (Number(query.page) - 1) * limit;
  }

  return {
    offset,
    limit
  };
};

const getIsAdmin = (req) => {
  return req?.authClaims?.sa === 1;
};

const validateMissingParams = (data = {}, requiredField = []) => {
  const missingFields = [];
  const notAllows = [undefined, "", null];
  requiredField.forEach((key) => {
    if (notAllows.includes(data[key])) {
      missingFields.push(key);
    }
  });

  if (missingFields.length > 0) {
    let errMsg = `Missing fields: ${missingFields.join(", ")}`;
    throw errMsg;
  }
};

const validateAttrs = (data, schemaAttr = {}, excludes = []) => {
  const requiredField = Object.keys(schemaAttr).filter(d => !excludes.includes(d));
  return validateMissingParams(data, requiredField);
};

const prettifyDocs = (docs, options) => {
  const { decimal128Keys } = options || {};
  const array = Array.isArray(docs) ? docs : [docs];
  array.forEach(d => {
    Object.entries(d).forEach(([key, value]) => {
      if (decimal128Keys?.length && decimal128Keys?.includes(key)) {
        d[key] = value.toString();
      }
    });
  });
};

const checkFilterDate = (time, timeLimit) => {
  if (!(time?.startTime && time?.endTime)) {
    throw (constCommonError.TIME.EMPTY);
  }

  if (time?.endTime <= time?.startTime) {
    throw (constCommonError.TIME.INVALID);
  }

  // 搜索间隔 1 天
  const timeRange = time?.endTime - time?.startTime;
  if (timeRange > timeLimit) {
    throw (constCommonError.TIME.LENGTH);
  }
};


const utilController = {
  responseSuccess,
  responseError,
  parseQuery,
  parseQuery2,
  getIsAdmin,
  validateMissingParams,
  validateAttrs,
  prettifyDocs,
  checkFilterDate
};

module.exports = utilController;
