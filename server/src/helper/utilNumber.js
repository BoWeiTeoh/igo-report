const bigDecimal = require("js-big-decimal");
const {logger} = require("./utilPinoLogger");
const {constCommonError} = require("../const/constErrorCode");

const jsDecimal = (number, decimal = 3) => {
  try {
    if (!number) {
      return number;
    }
    return Number(number.toFixed(decimal));
  } catch (e) {
    logger.error({"jsDecimal err": number, e});
    throw e;
  }
};

const jsNumber = (floatNumber) => {
  return floatNumber?.value ? floatNumber : new bigDecimal(floatNumber);
};

const addNumber = (number1, number2) => {
  const n1 = jsNumber(number1);
  const n2 = jsNumber(number2);
  return n1.add(n2);
};

const subtractNumber = (number1, number2) => {
  const n1 = jsNumber(number1);
  const n2 = jsNumber(number2);
  return n1.subtract(n2);
};

const divideNumber = (number1, number2) => {
  const n1 = jsNumber(number1);
  const n2 = jsNumber(number2);
  return n1.divide(n2);
};

const multiplyNumber = (number1, number2) => {
  const n1 = jsNumber(number1);
  const n2 = jsNumber(number2);
  return n1.multiply(n2);
};

const compareNumber = (number1, number2) => {
  const n1 = jsNumber(number1);
  const n2 = jsNumber(number2);
  return n1.compareTo(n2);
};

const stringNumber = (floatNumber, toNumber, digit) => {
  if (floatNumber !== undefined && !floatNumber?.value) {
    floatNumber = jsNumber(floatNumber);
  }
  if (digit !== undefined && floatNumber) {
    floatNumber = floatNumber.round(digit);
  }

  if (toNumber) {
    return Number(floatNumber?.value);
  }

  return floatNumber?.value;
};

const formatDecimal = (num) => {
  if (isNaN(num)) {
    throw constCommonError.COMMON("Number").INVALID;
  }
  return (num).toFixed(3);
};

module.exports = {
  jsNumber,
  addNumber,
  subtractNumber,
  divideNumber,
  multiplyNumber,
  stringNumber,
  formatDecimal
};