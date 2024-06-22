import React, { useState,useEffect } from "react";
import { constFilterType } from "./constFilter";
import { CalendarContainer } from "react-datepicker";
import clsx from "clsx";
import B2DatePicker from "../b2DatePicker/b2DatePicker";
import B2Input from "../form/b2Input.jsx";
import Select from "../b2Select/b2Select";

const ReactTableFilterItem = (props) => {
  let { label, queryKey, type, state, setState, onChange, onClearOtherKey, onSearchClick } = props;
  let node;

  const handleInputChange = (e, queryKey) => {
    if (onChange) {
      onChange(e, queryKey);
    }

    const value = e;
    setState((d) => {
      const newState = { ...d };
      newState[queryKey] = value;
      return newState;
    });
  };

  const handleSelectChange = (selectData, queryKey) => {
    if (onChange) {
      onChange(selectData, queryKey);
    }

    if (Array.isArray(onClearOtherKey)) {
      onClearOtherKey.forEach(key => {
        state[key] = [];
      });
    }

    let value = selectData?.value;
    if (Array.isArray(selectData)) {
      value = selectData;
    }
    setState((d) => {
      return {
        ...d,
        [queryKey]: value
      };
    });
  };

  if (type === constFilterType.time) {
    return <TimeFilterComponent {...props} />;
  }

  switch (type) {
    case constFilterType.date:
      node = <B2DatePicker {...props} />;
      break;
    case constFilterType.time:
      if (props.startTime || props.endTime) {
        const { placeholder } = props.startTime || props.endTime;
        node = <B2DatePicker {...props} placeholder={placeholder} />;
      }
      break;
    case constFilterType.select:
      const selectValue = state?.[queryKey];
      node = (
        <div className={"creatable-input"}>
          <Select
            {...props}
            label={null}
            className={"creatable-select"}
            value={selectValue}
            onChange={(e) => handleSelectChange(e, queryKey)}
          />
        </div>
      );
      break;
    case constFilterType.input:
      node = (
        <div className={"creatable-input"}>
          <span className={"label"}>{label}</span>
          <B2Input
            {...props}
            type={props.inputType}
            label={null}
            placeholder={props.placeholder || props.label}
            name={props.name || props.queryKey}
            value={state?.[queryKey]}
            onChange={(e) => handleInputChange(e, queryKey)}
            onSearchClick={onSearchClick}
          />
        </div>
      );
      break;
    default:
      node = (
        <div className={"creatable-input"}>

        </div>
      );
      break;
  }

  return <div className={"table-filter-item"}>{node}</div>;
};

// Define DaySelector component outside the render method
const DaySelector = ({ handleChange, days, label }) => {
  return <p onClick={() => handleChange(days)}>{label}</p>;
};

const getCustomContainer = (props) => {
  const { setState } = props || {};
  const handleChange = (dayAgo) => {
    const today = new Date();
    today.setHours(today.getHours() - 24 * dayAgo);

    setState({
      ...state,
      [startTimeKey]: today
    });
  };

  // Inside your TimeFilterComponent
  return ({ className, children }) => {
    return (
      <div>
        <CalendarContainer className={clsx(className, "day-select-container")}>
          <div className="days-wrapper">
            <DaySelector handleChange={handleChange} days={0} label={"Today"} />
            <DaySelector handleChange={handleChange} days={3} label={"3 Days"} />
            <DaySelector handleChange={handleChange} days={5} label={"5 Days"} />
            <DaySelector handleChange={handleChange} days={7} label={"7 Days"} />
            <DaySelector handleChange={handleChange} days={15} label={"15 Days"} />
          </div>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };
};

const TimeFilterComponent = (props) => {
  const { queryKey, setState, state } = props || {};
  let startTimeNode;
  let endTimeNode;
  let startTimeRangeProps = {};
  let endTimeRangeProps = {};
  const startTimeKey = props.startTime?.queryKey || "startTime";
  const endTimeKey = props.endTime?.queryKey || "endTime";
  const dateTimeFormat = props?.dateTimeFormat || "yyyy-MM-dd HH:mm";
  if (props.showRange) {
    startTimeRangeProps = {
      selectsStart: true,
      startDate: props?.state?.[startTimeKey],
      endDate: props?.state?.[endTimeKey]
    };

    endTimeRangeProps = {
      selectsEnd: true,
      startDate: props?.state?.[startTimeKey],
      endDate: props?.state?.[endTimeKey],
      minDate: props?.state?.[startTimeKey]
    };
  }

  if (props.day) {
    const handleChange = (date) => {
      const endTime = new Date(date);
      endTime.setHours(endTime.getHours() + 24);

      setState({
        ...state,
        [queryKey]: {
          startTime: date,
          endTime: endTime
        }
      });
    };

    return (
      <div className={"table-filter-item"}>
        <B2DatePicker
          {...props}
          onChange={handleChange}
          timeKey={startTimeKey}
          placeholder={props.day?.placeholder}
          placement={"bottom-start"}
          dateFormat={"dd-MM-yyyy HH:mm"}
        />
      </div>
    );
  }

  if (props.startTime) {
    let MyContainer;
    if (props?.startTime?.dayOptions) {
      MyContainer = getCustomContainer(props);
    }
    startTimeNode = (
      <div className={"table-filter-item"}>
        <B2DatePicker
          {...props}
          timeKey={startTimeKey}
          placeholder={props.startTime?.placeholder}
          placement={"bottom-start"}
          dateFormat={dateTimeFormat}
          calendarContainer={MyContainer}
          {...(props.showRange && startTimeRangeProps)}
        />
      </div>
    );
  }
  if (props.endTime) {
    let MyContainer;
    if (props?.endTime?.dayOptions) {
      MyContainer = getCustomContainer(props);
    }

    endTimeNode = (
      <div className={"table-filter-item"}>
        <B2DatePicker
          {...props}
          timeKey={endTimeKey}
          placeholder={props.endTime?.placeholder}
          placement={"bottom-start"}
          dateFormat={dateTimeFormat}
          calendarContainer={MyContainer}
          {...(props.showRange && endTimeRangeProps)}
        />
      </div>
    );
  }

  return (
    <>
      {startTimeNode}
      {endTimeNode}
    </>
  );
};

export default ReactTableFilterItem;
