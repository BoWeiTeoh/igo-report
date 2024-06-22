import DataSource from "../dataSource/dataSource.js";

const generateSelectYesNoOptions = (isBoolean = true) => {
  return [
    {
      label: "Yes",
      value: isBoolean ? true : 1
    },
    {
      label: "No",
      value: isBoolean ? false : 0
    }
  ];
};


const generateSelectOptions = (array, valueName, labelName, othersOri = null) => {
  if (!array?.length) {
    return [];
  }

  return array.map((item) => {
    const { [valueName]: value, [labelName]: label } = item;
    let others = { ...othersOri };
    return { value, label, ...others };
  });
};

const generateSelectOptionsFromObject = (obj) => {
  return (
    Object.keys(obj)?.map((key) => {
      return { label: obj[key], value: key };
    }) || []
  );
};

const generateSelectOptionsFromObject2 = (obj) => {
  return (
    Object.keys(obj)?.map((key) => {
      return { label: obj[key], value: obj[key] };
    }) || []
  );
};

const findLabel = (options, value) => {
  options = options || [];
  const selected = options.find((option) => String(option.value) === String(value));
  return selected?.label || value;
};

const isAdmin = () => !!DataSource.shared?.isAdmin;

const hasPermit = (target) => {
  const permissionObj = DataSource.instance?.claims?.roles || {};
  if (isAdmin()) {
    return true;
  } else if (permissionObj) {
    return !!permissionObj[target];
  }
};

const appendTableFooter = (tableData, columns, appendRowData = []) => {
  tableData = tableData || [];
  const emptyDataRow = {};
  Array.isArray(columns) &&
  columns?.forEach((col) => {
    const param = col?.id || col?.accessor;

    if (param) {
      emptyDataRow[param] = "-";
    }
  });

  Array.isArray(appendRowData) &&
  appendRowData?.forEach((rowData) => {
    tableData.push({ ...emptyDataRow, ...rowData });
  });
};

const validateInputs = (arrayOfInputsName = [], state = {}) => {
  const invalidInputs = [];
  if (arrayOfInputsName?.length) {
    Object.keys(state).forEach((d) => {
      const toValidate = arrayOfInputsName.includes(d);
      if (toValidate) {
        const value = state[d]?.trim();
        if ([null, undefined, NaN, ""].includes(value)) {
          invalidInputs.push(d);
        }
      }
    });
  }
  if (invalidInputs?.length) {
    throw new Error(`Invalid input: ${invalidInputs.join()}`);
  }
};

const validateInputNoSpace = (str ) => {
  let whitespace = new Set([" ", "\t", "\n"]);
  for (let i = 0; i < str.length; i++) {
    if (whitespace.has(str[i])) {
      return false;
    }
  }
  return true;
};

export default {
  generateSelectYesNoOptions,
  generateSelectOptions,
  generateSelectOptionsFromObject,
  generateSelectOptionsFromObject2,
  findLabel,
  isAdmin,
  hasPermit,
  appendTableFooter,
  validateInputs,
  validateInputNoSpace
};
