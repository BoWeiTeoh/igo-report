import React from "react";

const BasePageContent = ({ className = "", children }) => {
  return <div className={`base-page-content ${className}`}>{children}</div>;
};

export default BasePageContent;
