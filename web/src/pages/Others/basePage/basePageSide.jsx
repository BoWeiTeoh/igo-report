import React from "react";
import clsx from "clsx";

const BasePageSide = ({ children, width, className }) => {
  return (
    <div
      className={clsx("base-page-side", className)}
      style={{
        width,
        flex: `0 0 ${width}px`
      }}
    >
      {children}
    </div>
  );
};

export const BasePageSideContainer = ({ children }) => {
  return <div className={"base-page-side-container"}>{children}</div>;
};

export default BasePageSide;
