const safeStringify = require("fast-safe-stringify");
const { logMaxSize } = require("./../config/appConfig");
const constSensitiveWord = require("./../const/constSensitiveWord");
const constLogType = require("./../const/constLogType");
const {logger} = require("./utilPinoLogger");

const stringify = (json, replacer, space, options) => {
  return safeStringify(json, replacer, space, options);
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const log = (requestId, msg, logType) => {
  requestId = requestId || "";
  msg = msg || "";
  const options = {
    depthLimit: 5
  };

  const stringifyLog = stringify(msg, sensitiveReplacer, null, options);

  const logLength = stringifyLog?.length;
  if (logLength > logMaxSize) {
    logger.warn({"Log Size Too Large": logLength});
    return;
  }

  switch (logType) {
    case constLogType.INFO:
      console.info(requestId, stringifyLog);
      break;
    case constLogType.DEBUG:
      console.debug(requestId, stringifyLog);
      break;
    case constLogType.WARN:
      console.warn(requestId, stringifyLog);
      break;
    case constLogType.ERROR:
      console.error(requestId, stringifyLog);
      break;
    default:
      console.info(requestId, stringifyLog);
  }
};

const sensitiveReplacer = (key, value) => {
  if (constSensitiveWord.includes(key)) return undefined

  return value
}

const utils = {
  stringify,
  sleep,
  log
};
module.exports = utils;
