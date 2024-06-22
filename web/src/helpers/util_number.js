export const toDecimalString = (value, digit, forceShowDecimal, isFormattedNumber) => {
  digit = digit || 3;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (isNaN(value)) {
    return value;
  }
  const decimalDigit = Number(digit) > 0 ? Number(digit) : 0;
  let decimalNumber = value;

  const isDecimalNonZeroValue = !!decimalNumber && !Number.isInteger(decimalNumber);

  if (isDecimalNonZeroValue) {
    decimalNumber = Number(decimalNumber).toFixed(decimalDigit);
  }

  if (isFormattedNumber) {
    decimalNumber = decimalNumber.toString().replace(emailRegex, ",");
  }

  return decimalNumber;
};

export const formatDecimal = (value, digit = 3) => {
  return (value).toFixed(digit);
};

const getRandomInteger = (min = 1, max = 999999) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const toCurrencyFormat = (value) => {
  const valueNumber = Number(value);
  if (!value || isNaN(valueNumber)) {
    return value;
  }
  const valueArr = String(value)?.split(".");
  return Number(valueArr[0]).toLocaleString("en-US") + (valueArr[1] ? "." + valueArr[1] : "");
};

const localeNumber = (number) => {
  if (typeof number === "number") {
    return number.toLocaleString();
  }

  return number;
};

const isEven = (n) => {
  return n % 2 === 0;
};

export default {
  toDecimalString,
  getRandomInteger,
  toCurrencyFormat,
  localeNumber,
  isEven,
  formatDecimal
};
