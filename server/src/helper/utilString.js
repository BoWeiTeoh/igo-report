const {errFormat, constCommonError} = require("../const/constErrorCode");
const maskString = (value, displayCount = 6, hideSymbol = "*") => {
  const inputString = String(value);
  if (displayCount >= value?.length) {
    displayCount = 1;
  }
  let hideSymbolCount = value?.length - displayCount;
  let output = "";

  if (!inputString || inputString.length === 0) {
    return output;
  }

  output = hideSymbol.repeat(hideSymbolCount);

  if (inputString.length > displayCount) {
    output += inputString.slice(-displayCount);
  } else {
    output += inputString.slice(-1);
  }

  return output;
};
const checkWhiteSpace = (value, str) => {
  if (typeof value === "string" && value.length === 0) {
    throw (constCommonError.NAME(str).EMPTY);
  }
  if (typeof value === "string" && value.indexOf(" ") >= 0) {
    throw (constCommonError.NAME(str).SPACE);
  }
};



const utilString = {
  maskString,
  checkWhiteSpace
};

module.exports = utilString;
