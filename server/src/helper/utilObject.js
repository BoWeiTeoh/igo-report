const fastSafeStringify = require("fast-safe-stringify");
const {logger} = require("./utilPinoLogger");

const stringToObject = (objStr) => {
  if (typeof objStr !== "string") {
    return objStr;
  }

  try {
    const trim = String(objStr).trim();
    const firstChar = trim.charAt(0);
    const lastChar = trim.charAt(trim.length - 1);
    if (firstChar === "[" && lastChar === "]") {
      return JSON.parse(objStr);
    } else if (firstChar === "{" && lastChar === "}") {
      return JSON.parse(objStr);
    } else {
      return objStr;
    }
  } catch (e) {
    logger.error({"Failed to convert string to object": objStr});
    logger.error({"err": e});
    return objStr;
  }
};

const safeStringify = (json) => {
  return fastSafeStringify(json);
};

const swapObjectKeyAndValue = (obj) => {
  const newObj = {};
  Object.entries(obj).forEach((d) => {
    const value = d[1];
    newObj[value] = d[0];
  });
  return newObj;
};

const makeRangeArray = (totalLength, isAlphabet, options) => {
  const { startNumber = 1, prefix, suffix } = options || {};
  let arr = [];
  for (let i = 0; i <= totalLength; i++) {
    let value = i + startNumber;
    if (isAlphabet) {
      value = String.fromCharCode(value + 64);
    }
    let text = "";
    if (prefix) {
      text += prefix;
    }
    text += value;
    if (suffix) {
      text += suffix;
    }
    arr.push(text);
  }

  return arr;
};

const removeUndefinedInObj = (obj, removeNull) => {
  Object.keys(obj).forEach((key) => {
    if (removeNull) {
      [undefined, null].includes(obj[key]) && delete obj[key];
    } else {
      obj[key] === undefined && delete obj[key];
    }
  });
};

const cloneObj = (obj) => {
  if (!obj) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
};

const utilObject = {
  stringToObject,
  safeStringify,
  swapObjectKeyAndValue,
  makeRangeArray,
  removeUndefinedInObj,
  cloneObj
};

module.exports = utilObject;
