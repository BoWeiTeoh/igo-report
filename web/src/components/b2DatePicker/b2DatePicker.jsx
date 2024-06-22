import React from "react";
import ReactDatePicker from "react-datepicker";
import "./b2DatePicker.scss";
import Check from "../checkIf";
import B2Icon from "../b2Icon/b2Icon.jsx";
import clsx from "clsx";

const B2DatePicker = (props) => {
  const {
    shouldValidate,
    errorLabel = "Mandatory Field",
    state,
    setState,
    onChange,
    queryKey = "date",
    showStatusHint = false,
    showTimeSelect = true,
    showTimeSelectOnly = false,
    placeholder = "Time",
    dateFormat = "MMMM d, yyyy h:mm aa",
    isClearable = false,
    timeKey,
    timeFormat = "HH:mm",
    timeIntervals = 15,
    placement,
    isK2Form = false,
    showRange = false,
    selectsStart = false,
    selectsEnd = false,
    startDate,
    endDate,
    minDate,
    calendarContainer
  } = props;

  let rangeProps = {};
  if (showRange) {
    rangeProps = {
      selectsStart,
      selectsEnd,
      startDate,
      endDate,
      minDate
    };
  }

  const updateState = (prev, key, value) => ({
    ...prev,
    [key]: value
  });

  const deleteKey = (prev, key) => {
    const newPrev = { ...prev };
    delete newPrev[key];
    return newPrev;
  };

  const handleFormUpdate = (prev, queryKey, date, timeKey) => {
    if (timeKey) {
      let value = prev[queryKey] || {};
      if (date) {
        value[timeKey] = date;
      } else {
        delete value[timeKey];
      }
      return Object.keys(value).length ? updateState(prev, queryKey, value) : deleteKey(prev, queryKey);
    } else {
      return updateState(prev, queryKey, date);
    }
  };

  const handleChange = (date) => {
    if (typeof onChange === "function") {
      return onChange(date, queryKey, timeKey);
    } else if (setState) {
      setState((prev) => {
        return isK2Form === true ? updateState(prev, queryKey, date) : handleFormUpdate(prev, queryKey, date, timeKey);
      });
    }
  };

  const handleValid = (value) => {
    if (!shouldValidate) return true;
    return !!value;
  };

  const styling = (value) => {
    if (shouldValidate) {
      let isValid = handleValid(value);
      if (!isValid) {
        return "select-error";
      }
    }
  };

  const selectedObj = state?.[queryKey];
  const selected = timeKey ? selectedObj?.[timeKey] : selectedObj;

  return (
    <div className="b2-form-group">
      <span className={`label ${!!state?.[timeKey] ? "filled" : ""}`}>{placeholder}</span>
      <div className={clsx("_input custom-datepicker form-control", styling(state?.[queryKey]?.[timeKey]))}>
        <div className={"date-picker-icons-wrapper"}>
          <B2Icon className="date-picker-icon" icon="icon-calendar" />
          <label></label>
        </div>
        <ReactDatePicker
          selected={selected}
          popperPlacement={placement}
          placeholderText={placeholder}
          onChange={(date) => handleChange(date)}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          dateFormat={dateFormat}
          showMonthDropdown
          isClearable={selected && isClearable}
          timeFormat={timeFormat}
          timeIntervals={timeIntervals}
          {...(showRange && rangeProps)}
          calendarContainer={calendarContainer}
        />
      </div>
      <Check if={showStatusHint}>
        <div
          className="input-feedback input-invalid"
          style={{ display: `${!handleValid(state?.[timeKey]) ? "block" : "none"}` }}
        >
          {errorLabel}
        </div>
      </Check>
    </div>
  );
};

export default B2DatePicker;
