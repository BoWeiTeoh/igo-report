import React from "react";
import clsx from "clsx";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Image from "../../../../components/b2Image/b2Image.jsx";

const SideBarDropdownItem = (props) => {
  const { name, link, onClick, icon, show, permission } = props;

  if (permission) {
    const isPermitted = dataSource.shared.hasPermit(permission);
    if (!isPermitted) {
      return null;
    }
  }

  let className = "";
  if (window.location.pathname.indexOf(link) >= 0) {
    className = "selected-menu";
  }

  let style;
  if (show === "0") {
    style = { display: "none" };
  }

  return (
    <a onClick={() => onClick(link)} className={clsx("_item", className)} style={style}>
      <B2Image src={icon} alt={icon} className="image-icon-sidebar" isIcon={true} />
      <span className="side-bar-nav-name">{name}</span>
    </a>
  );
};

export default SideBarDropdownItem;
