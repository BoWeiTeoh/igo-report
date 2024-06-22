import React from "react";

const BasePageHeader = ({ className = "", children, style }) => {
  return (
    <div className={`base-page-header ${className}`} style={style}>
      {children}
    </div>
  );
};
BasePageHeader.displayName = "BasePageHeader";

export default BasePageHeader;
