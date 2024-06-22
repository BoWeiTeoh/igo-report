import React from "react";
import "./select2.css";
import Input from "../form/b2Input.jsx";
import B2Icon from "../b2Icon/b2Icon.jsx";

const Select2 = ({ options = [], label, id, name, onChange, value = "" }) => {
  if (!id) {
    id = `select${JSON.stringify(options)}`;
  }

  const handleChange = (e) => {
    const { value } = e.target || {};
    if (typeof onChange === "function") {
      onChange(value, name);
    }
  };

  const handleClear = () => {
    if (typeof onChange === "function") {
      onChange("", name);
    }
  };

  const node = (
    <Input id={id} name="select" type="select" onChange={handleChange} value={value}>
      <option value={""} hidden disabled>
        {label || "Please Select"}
      </option>
      {options?.map((d) => {
        return (
          <option value={d?.value} key={d?.value}>
            {d?.label}
          </option>
        );
      })}
    </Input>
  );

  return (
    <div className={"input-select"}>
      {node}
      {value && <B2Icon icon="icon-close" onClick={handleClear} />}
    </div>
  );
};

export default Select2;
