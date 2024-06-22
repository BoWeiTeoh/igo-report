import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./b2ButtonGroup.scss";

const B2ButtonGroup = (props) => {
  const { className, size, children, style } = props;
  const classNames = clsx(
    "b2-btn-group",
    className,
    size ? "btn-group-" + size : false
  );
  return (
    <div className={classNames} style={style}>
      {children}
    </div>
  );
};

B2ButtonGroup.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
};

export default B2ButtonGroup;
