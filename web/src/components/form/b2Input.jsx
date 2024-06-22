import React from "react";
import clsx from "clsx";
import { Input } from "reactstrap";
import B2Image from "../b2Image/b2Image";
import ic_search_grey from "../../images/icon/ic_search_grey.png";
import "./b2Input.scss";

export const constInputType = {
  text: "text",
  email: "email",
  number: "number",
  textarea: "textarea"
};

const B2Input = ({
                   type = constInputType.text,
                   value,
                   onChange,
                   onClick,
                   label,
                   id,
                   placeholder,
                   name,
                   disabled = false,
                   withQuantityControl,
                   className = "",
                   search,
                   onSearchClick,
                   style,
    maxlength
                 }) => {
  if (value === null || value === undefined) {
    value = "";
  }

  if (placeholder === undefined && !withQuantityControl) {
    placeholder = label || name || type;
  }

  if (!id) {
    id = `${type}${name}${label || ""}`;
  }

  const handleChange = (e) => {
    if (typeof onChange === "function") {
      const { value, name } = e.target || {};
      onChange(!maxlength && value.length >= maxlength?value.slice(0,maxlength):value , name);
    }
  };

  const handlePaste = (e) => {
    let text = e.clipboardData.getData("Text");
    if (typeof text === "string") {
      e.currentTarget.value = text.trim();
      e.preventDefault();
      if (typeof onChange === "function") {
        onChange(e.currentTarget.value, name);
      }
    }
  };

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  let node = null;
  if (search) {
    node = (
      <div className="search-input" style={{ display: "flex" }}>
        <Input
          type={type}
          value={value}
          name={name}
          className={`_input ${className}`}
          disabled={disabled}
          // onPaste={handlePaste}
          onChange={handleChange}
          onClick={handleClick}
          placeholder={placeholder || name}
          id={id}
          maxLength={maxlength}
          style={{ background: "none", border: "2px solid #C5C6CA", color: "#C5C6CA" }}
        />
        <B2Image src={ic_search_grey} alt="ic_search_grey" onClick={onSearchClick} className="image-icon-search"
                 isIcon={true} />
      </div>
    );
  } else {
    node = (
      <Input
        type={type}
        value={value}
        name={name}
        className={`_input ${className} ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
        // onPaste={handlePaste}
        onChange={handleChange}
        onClick={handleClick}
        maxLength={maxlength}
        placeholder={placeholder || name}
        id={id}
        style={style}
      />
    );
  }

  return (
    <div className={clsx("form-group input-container", withQuantityControl && "with-quantity-control")}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={"input-body"}>
        {node}
        {withQuantityControl && (
          <div className={"input-quantity-control"}>
            <span>+</span>
            <span>-</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2Input;
