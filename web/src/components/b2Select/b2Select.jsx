import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import helpers from "../../helpers/util";
import "./select2.css";

const B2Select = (props) => {
  const {
    label,
    value,
    className = "",
    options = [],
    name,
    placeholder,
    onChange,
    disabled = false,
    showFilledLabel = false,
    isClearable = true,
    successLabel = "",
    errorLabel = "Must fill",
    showStatusHint = false,
    preValidate = true,
    isLoading,
    onFocusIn,
    shouldValidate,
    isMulti = false,
    isReturnValue,
    isSearchable = false
  } = props;

  const [state, setState] = useState({
    fieldVisited: preValidate,
    isFocused: false
  });
  const [selected, setSelected] = useState(null);
  const [selectOptions, setSelectOptions] = useState(options);

  // Customize react-select color
  const customStyle = {
    multiValue: (defaultStyles) => {
      return { ...defaultStyles, backgroundColor: "white" };
    },
    control: (defaultStyles) => {
      if (isFocused) {
        return { ...defaultStyles };
      }
      return { ...defaultStyles, height: "10px" };
    },
    valueContainer: (defaultStyles) => {
      return {
        ...defaultStyles,
        flexwrap: "nowrap",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      };
    }
  };

  useEffect(() => {
    if (options) {
      const newOptions = stringifyObjectValues(options);
      setSelectOptions(newOptions);
    }

    if (Array.isArray(value)) {
      const newValue = stringifyObjectValues(value);
      setSelected(newValue);
    } else if (value) {
      const select = options?.find((d) => {
        d.value = handleStringValue(d.value);
        const thisValue = handleStringValue(value);
        return d.value === thisValue;
      });

      if (select) {
        setSelected(select);
      }
    }
  }, [JSON.stringify(options), value]);

  const stringifyObjectValues = (array) => {
    return array.map((d) => {
      if (typeof d.value === "object") {
        d.value = JSON.stringify(d.value);
      }
      return d;
    });
  };

  const handleStringValue = (input) => {
    return typeof input === "object" ? JSON.stringify(input) : input;
  };

  const handleChange = (option) => {
    setSelected(option);
    if (Array.isArray(option)) {
      option = option.map((d) => {
        d.value = helpers.object.stringToObject(d.value || d);
        return d;
      });
      return onChange(option);
    }
    if (isReturnValue) {
      return onChange(option?.value, name);
    } else {
      return onChange(option);
    }
  };

  const handleValid = (value) => {
    if (!shouldValidate) return true;

    if (isMulti) {
      return Boolean(value?.length);
    } else {
      return !!value;
    }
  };

  const handleFocusIn = () => {
    if (typeof onFocusIn === "function") {
      onFocusIn();
    }
    setState((d) => ({
      ...d,
      isFocused: true
    }));
  };

  const handleFocusOut = () => {
    setState((d) => ({
      ...d,
      isFocused: false
    }));
  };

  const { fieldVisited, isFocused } = state || {};
  const inputDisplayLabel = handleValid(value) ? successLabel : errorLabel;

  return (
    <div className="b2-form-group">
      {label && <label>{label}</label>}
      {showFilledLabel && <span className={`prefilled-label ${!!value ? "filled" : ""}`}>{label || placeholder}</span>}
      <Select
        className={`b2select custom-form-select ${className} ${
          !handleValid(value) && fieldVisited && !isFocused ? "select-error" : ""
        }`}
        classNamePrefix={"custom-select"}
        // defaultValue={defaultSelected}
        value={selected}
        name={name}
        id={`${name || label || placeholder}id`}
        options={selectOptions}
        isMulti={isMulti}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
        isLoading={isLoading}
        isDisabled={disabled}
        isOptionDisabled={(option) => option.disabled}
        isClearable={isClearable}
        isSearchable={isSearchable}
        closeMenuOnSelect={!isMulti}
        styles={customStyle}
      />
      {showStatusHint && (
        <div
          className="input-feedback input-invalid"
          style={{ display: `${fieldVisited && !handleValid(value) ? "block" : "none"}` }}
        >
          {inputDisplayLabel}
        </div>
      )}
    </div>
  );
};

const requiredPropsCheck = (props, propName, componentName) => {
  if (!props.label && !props.placeholder) {
    return new Error(`One of 'label' or 'placeholder' is required by '${componentName}' component.`);
  }
};

B2Select.propTypes = {
  label: requiredPropsCheck,
  className: PropTypes.string,
  options: PropTypes.array,
  // value: PropTypes.object,
  placeholder: requiredPropsCheck,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  name: PropTypes.string,
  type: PropTypes.string,
  errorLabel: PropTypes.string,
  successLabel: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  minLength: PropTypes.number,
  shouldValidate: PropTypes.bool,
  showStatusHint: PropTypes.bool,
  showFilledLabel: PropTypes.bool,
  isClearable: PropTypes.bool,
  preValidate: PropTypes.bool,
  isReturnValue: PropTypes.bool
};

export default B2Select;
