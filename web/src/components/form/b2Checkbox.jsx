import React, { forwardRef } from "react";
import "./b2Checkbox.scss";
import PropTypes from "prop-types";

const B2Checkbox = forwardRef((props, ref) => {
  const {
    className = "",
    showCheckMark = true,
    checked,
    labelText,
    hoverText,
    onClick,
    value,
    onChange,
    disabled = false,
    name,
    id,
    allowCopy,
    children,
    title,
    nowrap,
    show = true
  } = props;

  return (
    <label
      id={id}
      className={`checkbox-container ${disabled ? "disabled" : ""}
                        ${className} ${children || labelText ? "checkbox-with-label" : ""}
                        ${allowCopy ? "allow-select" : ""} ${nowrap ? "no-wrap" : ""}`}
      title={hoverText}
      style={!show ? { display: "none" } : {}}
    >
      <span className="label-text" title={title}>
        {children || labelText}
      </span>

      <input
        type="checkbox"
        checked={checked}
        value={value}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        name={name}
        onChange={onChange}
      />
      <span className="checkmark" style={!showCheckMark ? { display: "none" } : {}} />
    </label>
  );
});

export default B2Checkbox;

B2Checkbox.propTypes = {
  checked: PropTypes.bool,
  // labelText: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  className: PropTypes.string
};
