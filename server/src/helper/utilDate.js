const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const getCustomDateString = (date) => {
  let dt = date ? new Date(date) : new Date();
  let sec = dt.getSeconds();
  let min = dt.getMinutes();
  let hour = dt.getHours();
  let dd = dt.getDate();
  let mm = dt.getMonth() + 1; //January is 0!
  let yyyy = dt.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (min < 10) {
    min = "0" + min;
  }

  if (sec < 10) {
    sec = "0" + sec;
  }

  return `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;
};

const convertToSqlDate = (date) => {
  let newDate = new Date();
  if (date) {
    newDate = new Date(date);
  }
  return new Date(newDate).toISOString();
};

const DEFAULT_TIMEZONE = "Asia/Kuala_Lumpur";
const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const getDateTzISOString = (date, timezone = DEFAULT_TIMEZONE, format = DATETIME_FORMAT) => {
  return dayjs(date)?.tz(timezone)?.format(format);
};

const getDateString = (date, format = DATETIME_FORMAT) => {
  return dayjs.utc(date)?.format(format);
};

const compareDate = (date1, date2, unit) => {
  const dateX = dayjs(date1);
  const dateY = dayjs(date2);
  return dateX.diff(dateY, unit); // 20214000000 default milliseconds
};

const beforeDate = (howMany = 0, dateUnit = "day") => {
  return dayjs().startOf(dateUnit).subtract(howMany, dateUnit).format(DATETIME_FORMAT);
};

const getTimeRange = (start, end, dateUnit = "day") => {
  const startTime = beforeDate(start, dateUnit);
  const endTime = beforeDate(end, dateUnit);
  return { startTime, endTime };
};

const groupAmountByDate = (
  docs,
  dayCount,
  params
) => {
  const { amountKey, dateKey = "CreatedOnUtc", dateFormat = "MM-DD", groupBy, dateUnit = "day" } = params;
  let count = dayCount || 2;
  let dateGroup = {};
  let currentDate = dayjs().startOf(dateUnit).format(dateFormat);

  for (let i = 0; i < count; i++) {
    const {
      totalAmount,
      totalCount,
      group
    } = processDateGroup(docs, currentDate, amountKey, dateFormat, groupBy, dateKey);

    if (groupBy) {
      dateGroup[currentDate] = group;
    } else {
      dateGroup[currentDate] = { amount: totalAmount || 0, count: totalCount };
    }

    currentDate = dayjs(currentDate).subtract(1, "day").format(dateFormat);
  }

  return dateGroup;
};

const processDateGroup = (docs, currentDate, amountKey, dateFormat, groupBy, dateKey) => {
  let totalAmount = 0, totalCount = 0, group = {};

  docs.forEach((d) => {
    const date = getDateString(d[dateKey], dateFormat);

    if (date === currentDate) {
      if (groupBy) {
        const name = d[groupBy];
        const exist = group[name];
        if (exist) {
          exist.amount += Number(d[amountKey] || 0);
          exist.count += 1;
        } else {
          group[name] = {
            amount: Number(d[amountKey] || 0),
            count: 1
          };
        }
      } else {
        totalAmount += Number(d[amountKey] || 0);
        totalCount++;
      }
    }
  });

  return { totalAmount, totalCount, group };
};

const calculateTimeIntervals = (query) => {
  let startTime;
  let endTime;

  if (query?.startTime && query?.endTime) {
    startTime = new Date(query.startTime);
    endTime = new Date(query.endTime);
  }

  return { startTime, endTime };
};

const removeSSAndMS = (date) => {
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

module.exports = {
  getDateString,
  convertToSqlDate,
  getDateTzISOString,
  compareDate,
  beforeDate,
  groupAmountByDate,
  getTimeRange,
  calculateTimeIntervals,
  removeSSAndMS
};
