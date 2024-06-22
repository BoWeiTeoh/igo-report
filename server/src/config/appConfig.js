const paginate = {
  offset: 1, // start from
  limit: 10 // limit, max result
};

const interval = 600000; // 10 minutes
const limit = 250000; // excel file's doc num
const batch = 10; // excel file batch size
const jwtExpire =  60 * 60 * 24 * 3 // sec * min * hour * day
const logMaxSize = 20000;
const instanceSettlement = 10;
const batchScheduler = 60;

const appConfig = Object.freeze({
  paginate,
  interval,
  limit,
  batch,
  jwtExpire,
  logMaxSize,
  instanceSettlement,
  batchScheduler
});

module.exports = appConfig;
