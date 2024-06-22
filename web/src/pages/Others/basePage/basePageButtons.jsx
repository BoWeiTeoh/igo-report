import React from "react";
import util from "../../../helpers/util.js";

const BasePageButtons = ({ className, style, alignCenter, children }) => {
  const showChild = React.Children.map(children, (child) => {
    const { permission, permissions } = child?.props || {};

    let isValidPermission = true;
    if (permission && !util.ui.hasPermit(permission)) {
      isValidPermission = false;
    }

    if (permissions && Array.isArray(permissions) && permissions.length) {
      isValidPermission = permissions.some((p) => p && util.ui.hasPermit(p));
    }

    return isValidPermission && child;
  });

  return (
    <div
      className={`base-page-buttons pull-right ${alignCenter ? "align-center" : ""} ${className || ""}`}
      style={style}
    >
      {showChild}
    </div>
  );
};

export default BasePageButtons;
