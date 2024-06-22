import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dataSource from "../../../../dataSource/dataSource.js";
import B2Image from "../../../../components/b2Image/b2Image.jsx";

const SideBarNavItem = (props) => {
  const { name, onClick, link, icon, isActive, permission } = props || {};
  if (permission) {
    const isPermitted = dataSource.shared?.hasPermit(permission);
    if (!isPermitted) {
      return null;
    }
  }

  return (
    <a className={clsx("_item", isActive && "_active")} onClick={() => onClick(link)}>
      {icon ? <B2Image src={icon} alt={icon} className="image-icon-sidebar" /> :
        <span style={{ width: "30px", height: "30px" }}></span>}
      <span className="side-bar-nav-name">{name}</span>
    </a>
  );
};

export default SideBarNavItem;

SideBarNavItem.propTypes = {
  name: PropTypes.string.isRequired,
  permitted: PropTypes.bool,
  activeLink: PropTypes.string,
  link: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
