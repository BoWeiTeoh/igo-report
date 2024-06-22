import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "Asia/Kuala_Lumpur";
const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT = "YYYY-MM-DD";

const getCurrentTime = (format, timezone) => {
  const tz = timezone || DEFAULT_TIMEZONE;

  if (!format) {
    return dayjs().tz(tz).toDate();
  }

  return dayjs().tz(tz).format(format);
};

export const getDateString = (date, format = DATE_FORMAT) => {
  return dayjs.utc(date)?.format(format);
};

export const getDateTzISOString = (date, timezone = "Asia/Kuala_Lumpur", format = DATETIME_FORMAT) => {
  if (!date) {
    return null;
  }
  const momentTimezone = timezone || DEFAULT_TIMEZONE;
  return dayjs(date)?.tz(momentTimezone)?.format(format);
};

const compareDate = (date1, date2, unit) => {
  const dateX = dayjs(date1);
  const dateY = dayjs(date2);
  return dateX.diff(dateY, unit); // 20214000000 default milliseconds
};

export const getMonthAndDay = (date) => {
  if (!date) {
    return;
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${month}-${day}`;
};

export const getTime = (date) => {
  if (!date) {
    return;
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  hour = (hour < 10 && `0${hour}`) || hour;
  minute = (minute < 10 && `0${minute}`) || minute;
  second = (second < 10 && `0${second}`) || second;
  return `${hour}:${minute}:${second}`;
};

export default {
  getCurrentTime,
  getDateTzISOString,
  DATETIME_FORMAT,
  compareDate
};
