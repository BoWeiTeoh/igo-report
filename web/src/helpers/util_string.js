const capitalizeFirstLetter = (str) => str?.charAt(0)?.toUpperCase() + str?.slice(1);
const lowercaseFirstLetter = (str) => str?.charAt(0)?.toLowerCase() + str?.slice(1);

const checkEmptyString = (str) => (typeof str === "string" && str.length === 0);
const checkWhiteSpace = (str) => (typeof str === "string" && str.indexOf(" ") >= 0);

export default {
  capitalizeFirstLetter,
  lowercaseFirstLetter,
  checkEmptyString,
  checkWhiteSpace
};
