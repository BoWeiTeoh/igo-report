const isEmptyObject = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const uniqueArray = (arr) => {
  return (arr && [...new Set(Array.from(arr))]) || [];
};

const isArrayHasSameElement = (array1, array2) => {
  if (!array1?.length && !array2?.length) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }

  const intersection = array1.filter((element) => array2.includes(element));
  return intersection.length === array1.length;
};

const cloneObject = (obj) => {
  if (typeof obj === "object") {
    return JSON.parse(JSON.stringify(obj));
  }
  return obj;
};

const removeElementFromArray = (array, element) => {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
};

// is not accurate when the order of value is diff.
const isObjectEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

const isArrayEqual = (arr1, arr2) => {
  if (arr1?.length !== arr2?.length) {
    return false;
  }
  const arr2Sorted = arr2.slice().sort();
  const arr1Sorted = arr1.slice().sort();
  return arr1Sorted.every((value, index) => {
    return value === arr2Sorted[index];
  });
};

const isMapEqual = (map1, map2) => {
  const mapToJsonString = (m) => JSON.stringify(Object.fromEntries(m));
  return mapToJsonString(map1) === mapToJsonString(map2);
};

const getAllIndexes = (arr, val) => {
  let indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
  return indexes;
};

const removeUndefinedInObj = (obj, removeNull) => {
  Object.keys(obj).forEach((key) => {
    if (removeNull) {
      [undefined, null].includes(obj[key]) && delete obj[key];
    } else {
      obj[key] === undefined && delete obj[key];
    }
  });
};

const stringToObject = (objStr) => {
  if (typeof objStr !== "string") {
    return objStr;
  }

  try {
    const trim = String(objStr).trim();
    const firstChar = trim.charAt(0);
    const lastChar = trim.charAt(trim.length - 1);
    if (firstChar === "[" && lastChar === "]") {
      return JSON.parse(objStr);
    } else if (firstChar === "{" && lastChar === "}") {
      return JSON.parse(objStr);
    } else {
      return objStr;
    }
  } catch (e) {
    return objStr;
  }
};

const filterObjectByArr = (obj = {}, arrOfKeys = []) => {
  let newObj = {};
  Object.entries(obj).forEach((arr) => {
    const key = arr[0],
      value = arr[1];
    if (arrOfKeys?.includes(key)) {
      newObj[key] = value;
    }
  });

  return newObj;
};

export default {
  isEmptyObject,
  uniqueArray,
  isArrayEqual,
  isArrayHasSameElement,
  cloneObject,
  removeElementFromArray,
  isObjectEqual,
  isMapEqual,
  getAllIndexes,
  removeUndefinedInObj,
  stringToObject,
  filterObjectByArr
};
