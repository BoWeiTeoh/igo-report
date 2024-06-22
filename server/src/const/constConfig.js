const constResourceConfig = {
    INTERVAL: "INTERVAL",
    INSTANCE_SETTLEMENT: "INSTANCE_SETTLEMENT",
    BATCH_EXPORT: "BATCH_EXPORT",
    BATCH_SCHEDULER: "BATCH_SCHEDULER"
};

const constTimeLimitConfig = {
    TIME_LIMIT_TRANSACTION_REPORT: "TIME_LIMIT_TRANSACTION_REPORT",
    TIME_LIMIT_PLAYER_REPORT: "TIME_LIMIT_PLAYER_REPORT",
    TIME_LIMIT_DEPOSIT_REPORT: "TIME_LIMIT_DEPOSIT_REPORT",
    TIME_LIMIT_WITHDRAW_REPORT: "TIME_LIMIT_WITHDRAW_REPORT",
    TIME_LIMIT_TRANSFER_REPORT: "TIME_LIMIT_TRANSFER_REPORT"
};

const constExportConfig = {
    EXPORT_LIMIT_TRANSACTION_REPORT: "EXPORT_LIMIT_TRANSACTION_REPORT",
    EXPORT_LIMIT_PLAYER_REPORT: "EXPORT_LIMIT_PLAYER_REPORT",
    EXPORT_LIMIT_DEPOSIT_REPORT: "EXPORT_LIMIT_DEPOSIT_REPORT",
    EXPORT_LIMIT_WITHDRAW_REPORT: "EXPORT_LIMIT_WITHDRAW_REPORT",
    EXPORT_LIMIT_TRANSFER_REPORT: "EXPORT_LIMIT_TRANSFER_REPORT"
};

const constConfig = {
    ...constResourceConfig,
    ...constTimeLimitConfig,
    ...constExportConfig
};

const constInitConfig = {
    // Resource
    INTERVAL: 600000,
    INSTANCE_SETTLEMENT: 10,
    BATCH_EXPORT: 10,
    BATCH_SCHEDULER: 60,

    // Timeout
    TIME_LIMIT_TRANSACTION_REPORT: 7 * 24, // 单位是小时
    TIME_LIMIT_PLAYER_REPORT: 24,
    TIME_LIMIT_DEPOSIT_REPORT: 24,
    TIME_LIMIT_WITHDRAW_REPORT: 24,
    TIME_LIMIT_TRANSFER_REPORT: 24,

    // Export
    EXPORT_LIMIT_TRANSACTION_REPORT: 250000,
    EXPORT_LIMIT_PLAYER_REPORT: 250000,
    EXPORT_LIMIT_DEPOSIT_REPORT: 250000,
    EXPORT_LIMIT_WITHDRAW_REPORT: 250000,
    EXPORT_LIMIT_TRANSFER_REPORT: 250000
};

const constMinValue = {
    // Resource
    INTERVAL: 60000,
    INSTANCE_SETTLEMENT: 1,
    BATCH_EXPORT: 1,
    BATCH_SCHEDULER: 60,

    // Timeout
    TIME_LIMIT_TRANSACTION_REPORT: 1, // 单位是小时
    TIME_LIMIT_PLAYER_REPORT: 1,
    TIME_LIMIT_DEPOSIT_REPORT: 1,
    TIME_LIMIT_WITHDRAW_REPORT: 1,
    TIME_LIMIT_TRANSFER_REPORT: 1,

    // Export
    EXPORT_LIMIT_TRANSACTION_REPORT: 10,
    EXPORT_LIMIT_PLAYER_REPORT: 10,
    EXPORT_LIMIT_DEPOSIT_REPORT: 10,
    EXPORT_LIMIT_WITHDRAW_REPORT: 10,
    EXPORT_LIMIT_TRANSFER_REPORT: 10
};

const constMaxValue = {
    // Resource
    INTERVAL: 3600000,
    INSTANCE_SETTLEMENT: 1000,
    BATCH_EXPORT: 100,
    BATCH_SCHEDULER: 1440,

    // Timeout
    TIME_LIMIT_TRANSACTION_REPORT: 365 * 24, // 单位是小时
    TIME_LIMIT_PLAYER_REPORT: 365 * 24,
    TIME_LIMIT_DEPOSIT_REPORT: 365 * 24,
    TIME_LIMIT_WITHDRAW_REPORT: 365 * 24,
    TIME_LIMIT_TRANSFER_REPORT: 365 * 24,

    // Export
    EXPORT_LIMIT_TRANSACTION_REPORT: 1000000,
    EXPORT_LIMIT_PLAYER_REPORT: 1000000,
    EXPORT_LIMIT_DEPOSIT_REPORT: 1000000,
    EXPORT_LIMIT_WITHDRAW_REPORT: 1000000,
    EXPORT_LIMIT_TRANSFER_REPORT: 1000000
};


const constConfigType = {
    RESOURCE: 1,
    TIME_LIMIT: 2,
    EXPORT: 3
};

module.exports = { constConfig, constConfigType, constInitConfig, constResourceConfig, constTimeLimitConfig, constExportConfig, constMinValue, constMaxValue };
