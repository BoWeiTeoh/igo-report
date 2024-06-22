const pino = require('pino');
const { clsProxify } = require('cls-proxify');
const constSensitiveWord = require("./../const/constSensitiveWord");
const utilDate = require("./utilDate");

// 配置对象
const config = {
    logger: {
        level: process.env.PINO_LOG_LEVEL || 'info',
        formatters: {
            level: (label) => {
                return {Status: label.toUpperCase()};
            }
        },
        redact: {
            paths: constSensitiveWord,
            remove: true
        },
        base: undefined,
        timestamp: utilDate.getDateTzISOString
    }
};

// 创建默认日志记录器
const defaultLogger = pino(config.logger);
// 创建带有 CLS 功能的日志记录器
const logger = clsProxify(defaultLogger);

module.exports = {
    defaultLogger,
    logger,
};
