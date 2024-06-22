import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";
import clsx from "clsx";
import dataSource from "../../../../dataSource/dataSource.js";
import ic_dropdown from "../../../../images/icon/ic_dropdown.png";

const SideBarDropdown = (props) => {
  const { name, activeLink, path, onClick, children, permission } = props;

  if (children?.length > 0) {
    const hasPermitted = children.some((c) => dataSource.shared?.hasPermit(c.props?.permission));
    if (!hasPermitted) {
      return null; // hide if no children to dropDown
    }
  } else {
    const isPermitted = dataSource.shared?.hasPermit(permission);
    if (!isPermitted) {
      return null;
    }
  }

  const isNavActive = activeLink?.startsWith(path);

  return (
    <div className={clsx("nav-parent", isNavActive && "_active")}>
      <div className="nav-title-toggle _item" onClick={() => onClick(path)}>
        <div className={"_name"}>
          <span className="side-bar-nav-name">{name}</span>
        </div>
        <img src={ic_dropdown} alt="ic_dropdown" className="dropdown-button" />
      </div>
      <Collapse isOpen={isNavActive}>
        <div className={`nav-group`}>{children}</div>
      </Collapse>
    </div>
  );
};

export default SideBarDropdown;

SideBarDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  activeLink: PropTypes.string,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};
