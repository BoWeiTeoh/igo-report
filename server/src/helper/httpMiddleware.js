// ref: https://stackoverflow.com/questions/19215042/express-logging-response-body
const utilDate = require("./utilDate");
const crypto = require("crypto");
const constLogType = require("./../const/constLogType");
const { log } = require("../helper/utils");
const { REQUEST_ID } =require("../const/constLogger");
const {logger} = require("./utilPinoLogger");
const SLOW_REQUEST_MS = 60000;
const constIgnoreUrl = require("../const/constIgnoreUrl");
const logHttpRequest = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;
  // const chunks = [];
  const start = process.hrtime();
  req.requestId = crypto.randomUUID().slice(0, 13);

  res.write = (...restArgs) => {
    // chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    // if (restArgs[0]) {
    //   chunks.push(Buffer.from(restArgs[0]));
    // }
    // const body = Buffer.concat(chunks).toString("utf8");

    const timeTaken = _getElapseTime(start);
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const logData = {
      ip: req?.headers["x-forwarded-for"] || req?.connection?.remoteAddress,
      // userAgent: req.headers["user-agent"],
      user: req?.authClaims?.u || null,
      method: req?.method,
      reqUrl: url,
      // origin: req.headers?.origin || null,
      // reqAuth: req.headers?.authorization,
      reqBody: req?.body,
      // resBody: body,
      status: res?.statusCode || "",
      timeUtc: utilDate.getDateString(new Date()),
      timeTZo: utilDate.getDateTzISOString(new Date(), "Asia/Kuala_Lumpur"),
      timeUse: timeTaken + "ms"
    }

    if (!constIgnoreUrl.includes(req.originalUrl)){
      logger.info(logData);
    }

    // log error if slow
    if (timeTaken > SLOW_REQUEST_MS) {
      const errMsg = `slow request: ${req.method}  timeUse:${timeTaken} ms`;
      // log(req?.requestId, errMsg, constLogType.WARN);
      logger.warn(errMsg);
    }

    oldEnd.apply(res, restArgs);
  };
  res.setHeader(REQUEST_ID, req.requestId);
  next();
};

const _getElapseTime = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return Number((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toFixed(3);
};

module.exports = {
  logHttpRequest
};
