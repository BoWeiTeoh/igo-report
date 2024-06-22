import "./layoutContainer.scss";
import React from "react";
import clsx from "clsx";

const LayoutContainer = ({ children, className, style }) => {
  return (
    <div className={clsx("layout-container", className)} style={style}>
      {children}
    </div>
  );
};

export default LayoutContainer;
